const mongoose = require('mongoose');
const WasteReport = require('../models/WasteReport');
const NotificationService = require('../services/notification.service');
const Notification = require('../models/Notification');

// Store SSE connections for real-time updates
let sseConnections = new Map();

// Function to send real-time notification to all connected clients
const sendRealtimeNotification = (userId, notification) => {
  console.log('Sending real-time notification to user:', userId, notification);
  
  // In a real implementation, you'd track connections per user
  // For now, we'll broadcast to all connected clients
  sseConnections.forEach((connection, connectionId) => {
    if (connection.userId === userId || !connection.userId) {
      connection.res.write(`data: ${JSON.stringify({
        type: 'notification',
        payload: notification
      })}\n\n`);
    }
  });
};

// Function to send real-time report update
const sendRealtimeReportUpdate = (update) => {
  console.log('Sending real-time report update:', update);
  
  // Broadcast to all connected clients
  sseConnections.forEach((connection, connectionId) => {
    connection.res.write(`data: ${JSON.stringify({
      type: 'report_update',
      payload: update
    })}\n\n`);
  });
};

// @desc    Create a new waste report
// @route   POST /api/waste-reports
// @access  Private
const createWasteReport = async (req, res) => {
  try {
    console.log('=== CREATE REPORT REQUEST ===');
    console.log('User:', req.user?.email, 'Role:', req.user?.role);
    console.log('Body keys:', Object.keys(req.body));
    console.log('location object:', req.body.location);
    console.log('location[barangay]:', req.body['location[barangay]']);
    console.log('File uploaded:', !!req.file);
    
    const { title, description, category, location, priority } = req.body;

    const resolvedLocation = location || {
      latitude: parseFloat(req.body['location[latitude]'] || req.body.latitude),
      longitude: parseFloat(req.body['location[longitude]'] || req.body.longitude),
      address: req.body['location[address]'] || req.body.address,
      barangay: req.body['location[barangay]'] || req.body.barangay,
      city: req.body['location[city]'] || req.body.city
    };

    console.log('Resolved location:', resolvedLocation);

    if (
      !resolvedLocation ||
      Number.isNaN(resolvedLocation.latitude) ||
      Number.isNaN(resolvedLocation.longitude) ||
      !resolvedLocation.address ||
      !resolvedLocation.barangay ||
      !resolvedLocation.city
    ) {
      console.log('Location validation failed:', {
        hasLocation: !!resolvedLocation,
        latValid: !Number.isNaN(resolvedLocation?.latitude),
        lngValid: !Number.isNaN(resolvedLocation?.longitude),
        hasAddress: !!resolvedLocation?.address,
        hasBarangay: !!resolvedLocation?.barangay,
        hasCity: !!resolvedLocation?.city
      });
      return res.status(400).json({ message: 'Invalid location payload' });
    }
    
    const wasteReport = new WasteReport({
      title,
      description,
      category,
      location: resolvedLocation,
      priority,
      reportedBy: req.user ? req.user.id : null // Handle anonymous submissions
    });

    // Add image URL if file was uploaded
    if (req.file) {
      wasteReport.imageUrl = `/uploads/${req.file.filename}`;
    }

    const savedReport = await wasteReport.save();
    await savedReport.populate('reportedBy', 'name email phone');

    // Create notification for the reporter (only if logged in)
    if (req.user) {
      await Notification.create({
        userId: req.user.id,
        title: 'Report Submitted Successfully',
        message: `Your waste report "${title}" has been submitted successfully.`,
        type: 'NEW_REPORT',
        reportId: savedReport._id
      });
    }

    // Create notifications for all admins and barangay officials
    console.log('Creating notifications for admins and officials...');
    
    try {
      // Get all admins and officials to notify
      const User = mongoose.model('User');
      const adminsAndOfficials = await User.find({ 
        role: { $in: ['ADMIN', 'BARANGAY_OFFICIAL', 'WASTE_MANAGEMENT'] }
      });
      
      console.log(`Found ${adminsAndOfficials.length} admins and officials to notify`);
      
      if (adminsAndOfficials.length > 0) {
        // Create notification message for admins/officials
        const reporterName = req.user ? req.user.name : 'Anonymous';
        const adminNotificationMessage = `New waste report "${title}" submitted by ${reporterName} in ${savedReport.location?.barangay || 'your area'}. Please review and take action.`;
        
        // Create notifications for all admins and officials
        const adminNotifications = adminsAndOfficials.map(admin => ({
          userId: admin._id,
          title: 'New Report Submitted',
          message: adminNotificationMessage,
          type: 'NEW_REPORT_ADMIN',
          reportId: savedReport._id
        }));
        
        console.log(`Creating ${adminNotifications.length} notifications for admins and officials...`);
        
        // Insert all notifications at once
        const result = await Notification.insertMany(adminNotifications);
        console.log(`✅ Successfully created ${result.length} notifications for admins and officials`);
        
        // Send real-time notifications to all connected admins
        for (const admin of adminsAndOfficials) {
          sendRealtimeNotification(admin._id, {
            id: result.find(n => n.userId.toString() === admin._id.toString())?._id,
            userId: admin._id,
            title: 'New Report Submitted',
            message: adminNotificationMessage,
            type: 'NEW_REPORT_ADMIN',
            reportId: savedReport._id,
            read: false,
            createdAt: new Date()
          });
        }
        
      } else {
        console.log('❌ No admins or officials found to notify');
      }
      
    } catch (notificationError) {
      console.error('❌ Error creating admin notifications:', notificationError);
      console.error('Error details:', notificationError.message);
    }
    
    res.status(201).json({
      success: true,
      message: 'Waste report submitted successfully',
      data: savedReport
    });
  } catch (error) {
    console.error('Error creating waste report:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all waste reports (with filtering and pagination)
// @route   GET /api/waste-reports
// @access  Private
const getWasteReports = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter based on user role and query parameters
    let filter = {};
    
    // Residents can only see their own reports
    if (req.user.role === 'RESIDENT') {
      filter.reportedBy = req.user.id;
    }
    
    // Officials can see reports from their barangay
    if (req.user.role === 'BARANGAY_OFFICIAL') {
      filter['location.barangay'] = {
        $regex: `^${escapeRegex(req.user.barangay || '')}$`,
        $options: 'i'
      };
    }

    // Apply additional filters from query params
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.priority) {
      filter.priority = req.query.priority;
    }

    const reports = await WasteReport.find(filter)
      .populate('reportedBy', 'name email phone')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await WasteReport.countDocuments(filter);

    res.json({
      reports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error getting waste reports:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single waste report by ID
// @route   GET /api/waste-reports/:id
// @access  Private
const getWasteReportById = async (req, res) => {
  try {
    const report = await WasteReport.findById(req.params.id)
      .populate('reportedBy', 'name email phone')
      .populate('assignedTo', 'name email');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check access permissions
    if (req.user.role === 'RESIDENT' && report.reportedBy._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (
      req.user.role === 'BARANGAY_OFFICIAL' &&
      (report.location.barangay || '').toLowerCase() !== (req.user.barangay || '').toLowerCase()
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(report);
  } catch (error) {
    console.error('Error getting waste report:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update report status
// @route   PATCH /api/waste-reports/:id/status
// @access  Private (Officials and Admins only)
const updateReportStatus = async (req, res) => {
  try {
    console.log('=== UPDATE REPORT STATUS REQUEST START ===');
    console.log('User:', req.user);
    console.log('Report ID:', req.params.id);
    console.log('New Status:', req.body.status);
    console.log('Request body:', req.body);
    console.log('Request URL:', req.originalUrl);
    console.log('Request method:', req.method);
    
    const { status, rejectionReason, resolutionNotes, estimatedResolution } = req.body;
    
    // Find the report first
    const report = await WasteReport.findById(req.params.id);
    console.log('Found report:', report);
    
    if (!report) {
      console.log('❌ Report not found');
      return res.status(404).json({ message: 'Report not found' });
    }

    console.log('About to update report status...');
    
    // Update fields
    report.status = status;
    console.log('Updated report status to:', status);
    
    if (status === 'REJECTED' && rejectionReason) {
      report.rejectionReason = rejectionReason;
      console.log('Added rejection reason:', rejectionReason);
    }
    
    if (status === 'RESOLVED' && resolutionNotes) {
      report.resolutionNotes = resolutionNotes;
      console.log('Added resolution notes:', resolutionNotes);
    }
    
    if (estimatedResolution) {
      report.estimatedResolution = estimatedResolution;
      console.log('Set estimated resolution:', estimatedResolution);
    }

    // Check permissions - allow residents to update status of their own reports
    if (req.user.role === 'RESIDENT') {
      // Residents can only update reports they submitted
      if (report.reportedBy && report.reportedBy.toString() !== req.user.id) {
        console.log('❌ Access denied: User trying to update report they did not submit');
        return res.status(403).json({ message: 'Access denied. You can only update reports you submitted.' });
      }
      console.log('✅ Resident allowed to update their own report');
    } else if (req.user.role !== 'ADMIN' && req.user.role !== 'BARANGAY_OFFICIAL' && req.user.role !== 'WASTE_MANAGEMENT') {
      console.log('❌ Access denied: User role not authorized for status updates');
      return res.status(403).json({ message: 'Access denied' });
    }

    console.log('About to save report...');
    
    try {
      const updatedReport = await report.save();
      console.log('✅ Report saved successfully');
      await updatedReport.populate('assignedTo', 'name email');
      await updatedReport.populate('reportedBy', 'name email');
      console.log('✅ Report populated successfully');

      // Create notifications for RESOLVED reports
      if (status === 'RESOLVED') {
        console.log('Status is RESOLVED, creating notifications for all residents...');
        
        try {
          // Get all residents to notify
          const User = mongoose.model('User');
          const allResidents = await User.find({ role: 'RESIDENT' });
          
          console.log(`Found ${allResidents.length} residents to notify`);
          
          if (allResidents.length > 0) {
            // Create community notification message
            const publicNotificationMessage = `Good news! A waste report "${report.title}" in ${report.location?.barangay || 'your area'} has been resolved. Thank you for helping keep our community clean!`;
            
            // Create notifications for all residents
            const residentNotifications = allResidents.map(resident => ({
              userId: resident._id,
              title: 'Community Report Resolved',
              message: publicNotificationMessage,
              type: 'COMMUNITY_UPDATE',
              reportId: report._id
            }));
            
            console.log(`Creating ${residentNotifications.length} notifications for residents...`);
            
            // Insert all notifications at once
            const result = await Notification.insertMany(residentNotifications);
            console.log(`✅ Successfully created ${result.length} notifications for residents`);
            
            // Also create individual notification for the original reporter
            if (report.reportedBy) {
              await Notification.create({
                userId: report.reportedBy,
                title: 'Your Report Resolved',
                message: `Your waste report "${report.title}" has been resolved! Thank you for helping keep your community clean.`,
                type: 'RESOLUTION',
                reportId: report._id
              });
              console.log('✅ Individual notification sent to original reporter');
            }
            
          } else {
            console.log('❌ No residents found to notify');
          }
          
        } catch (notificationError) {
          console.error('❌ Error creating notifications:', notificationError);
          console.error('Error details:', notificationError.message);
        }
      } else {
        console.log('Status is not RESOLVED, skipping notifications');
      }

      res.json(updatedReport);
      console.log('✅ Response sent to client');
      
      // Send real-time notification to reporter
      if (report.reportedBy) {
        const notification = await Notification.create({
          userId: report.reportedBy,
          title: 'Report Status Updated',
          message: `Your report "${report.title}" has been marked as ${status.toLowerCase()}. Thank you for helping keep Malabanias clean!`,
          type: 'STATUS_UPDATE',
          reportId: report._id,
          read: false,
          createdAt: new Date()
        });

        // Send real-time notification
        sendRealtimeNotification(report.reportedBy, notification);
      }

      // Send real-time report update to all connected clients
      sendRealtimeReportUpdate({
        reportId: report._id,
        status: status,
        updatedBy: req.user.id,
        updatedAt: new Date()
      });
      
    } catch (error) {
      console.error('❌ Error updating report status:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  } catch (error) {
    console.error('❌ Fatal error in updateReportStatus:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Assign waste report to official
// @route   PATCH /api/waste-reports/:id/assign
// @access  Private (Officials and Admins only)
const assignReport = async (req, res) => {
  try {
    const { assignedTo } = req.body;
    
    const report = await WasteReport.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check permissions - allow residents to update status of their own reports
    if (req.user.role === 'RESIDENT') {
      // Residents can only update reports they submitted
      if (report.reportedBy && report.reportedBy.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Access denied. You can only update reports you submitted.' });
      }
    } else if (req.user.role !== 'ADMIN' && req.user.role !== 'BARANGAY_OFFICIAL' && req.user.role !== 'WASTE_MANAGEMENT') {
      return res.status(403).json({ message: 'Access denied' });
    }

    report.assignedTo = assignedTo;
    report.status = 'ASSIGNED';
    
    const updatedReport = await report.save();
    await updatedReport.populate('assignedTo', 'name email');

    // Create notification for assigned official
    await Notification.create({
      userId: assignedTo,
      title: 'New Report Assignment',
      message: `You have been assigned to handle the report: "${report.title}".`,
      type: 'ASSIGNMENT',
      reportId: report._id
    });

    res.json(updatedReport);
  } catch (error) {
    console.error('Error assigning report:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get waste report statistics
// @route   GET /api/waste-reports/stats
// @access  Private
const getReportStats = async (req, res) => {
  try {
    let matchStage = {};
    
    // Filter based on user role
    if (req.user.role === 'RESIDENT') {
      matchStage.reportedBy = req.user.id;
    } else if (req.user.role === 'BARANGAY_OFFICIAL') {
      matchStage['location.barangay'] = {
        $regex: `^${escapeRegex(req.user.barangay || '')}$`,
        $options: 'i'
      };
    }

    const stats = await WasteReport.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'PENDING'] }, 1, 0] } },
          assigned: { $sum: { $cond: [{ $eq: ['$status', 'ASSIGNED'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'IN_PROGRESS'] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'RESOLVED'] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ['$status', 'REJECTED'] }, 1, 0] } },
          urgent: { $sum: { $cond: [{ $eq: ['$priority', 'URGENT'] }, 1, 0] } }
        }
      }
    ]);

    const categoryStats = await WasteReport.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      stats: stats[0] || {
        total: 0, pending: 0, assigned: 0, inProgress: 0, resolved: 0, rejected: 0, urgent: 0
      },
      categoryStats
    });
  } catch (error) {
    console.error('Error getting report stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get admin dashboard data
// @route   GET /api/waste-reports/admin/dashboard
// @access  Private (Admin and Officials only)
const getAdminDashboard = async (req, res) => {
  try {
    let matchStage = {};
    
    // Filter based on user role
    if (req.user.role === 'BARANGAY_OFFICIAL') {
      matchStage['location.barangay'] = {
        $regex: `^${escapeRegex(req.user.barangay || '')}$`,
        $options: 'i'
      };
    }

    // Overall statistics
    const stats = await WasteReport.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'PENDING'] }, 1, 0] } },
          assigned: { $sum: { $cond: [{ $eq: ['$status', 'ASSIGNED'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'IN_PROGRESS'] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'RESOLVED'] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ['$status', 'REJECTED'] }, 1, 0] } },
          urgent: { $sum: { $cond: [{ $eq: ['$priority', 'URGENT'] }, 1, 0] } },
          high: { $sum: { $cond: [{ $eq: ['$priority', 'HIGH'] }, 1, 0] } }
        }
      }
    ]);

    console.log('Admin dashboard stats aggregation result:', stats);
    console.log('Match stage for aggregation:', matchStage);

    // Recent reports (last 7 days) - for dashboard display
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentReports = await WasteReport.find({
      ...matchStage,
      createdAt: { $gte: sevenDaysAgo }
    })
    .populate('reportedBy', 'name')
    .populate('assignedTo', 'name')
    .sort({ createdAt: -1 })
    .limit(10);

    // All reports for dashboard (to show complete picture)
    const allReports = await WasteReport.find(matchStage)
      .populate('reportedBy', 'name')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 })
      .limit(20);

    // Category breakdown
    const categoryStats = await WasteReport.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'PENDING'] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'RESOLVED'] }, 1, 0] } }
        }
      }
    ]);

    // Priority breakdown
    const priorityStats = await WasteReport.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    // Reports by barangay (for admin)
    let barangayStats = [];
    if (req.user.role === 'ADMIN') {
      barangayStats = await WasteReport.aggregate([
        {
          $group: {
            _id: '$location.barangay',
            count: { $sum: 1 },
            pending: { $sum: { $cond: [{ $eq: ['$status', 'PENDING'] }, 1, 0] } },
            resolved: { $sum: { $cond: [{ $eq: ['$status', 'RESOLVED'] }, 1, 0] } }
          }
        },
        { $sort: { count: -1 } }
      ]);
    }

    // Resolution time trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const resolutionTrends = await WasteReport.aggregate([
      { $match: { ...matchStage, status: 'RESOLVED', updatedAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const finalStats = stats[0] || {
    total: 0, pending: 0, assigned: 0, inProgress: 0, resolved: 0, rejected: 0, urgent: 0, high: 0
    };
    
    console.log('Final stats being sent:', finalStats);
    console.log('All reports count:', allReports.length);

    res.json({
      stats: finalStats,
      reports: allReports, // All reports for dashboard
      recentReports, // Recent reports for trends
      categoryStats,
      priorityStats,
      barangayStats,
      resolutionTrends
    });
  } catch (error) {
    console.error('Error getting admin dashboard:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get resident's reports
// @route   GET /api/waste-reports/resident/reports
// @access  Private (Residents only)
const getResidentReports = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { reportedBy: req.user.id };

    // Apply additional filters from query params
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const reports = await WasteReport.find(filter)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await WasteReport.countDocuments(filter);

    // Get statistics for resident
    const stats = await WasteReport.aggregate([
      { $match: { reportedBy: req.user.id } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'PENDING'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'IN_PROGRESS'] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'RESOLVED'] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ['$status', 'REJECTED'] }, 1, 0] } }
        }
      }
    ]);

    res.json({
      reports,
      stats: stats[0] || { total: 0, pending: 0, inProgress: 0, resolved: 0, rejected: 0 },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error getting resident reports:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Mark report as completed
// @route   PATCH /api/waste-reports/:id/complete
// @access  Private (Officials and Admins only)
const markAsCompleted = async (req, res) => {
  try {
    const { resolutionNotes, completionPhoto } = req.body;
    
    const report = await WasteReport.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check permissions - allow residents to update status of their own reports
    if (req.user.role === 'RESIDENT') {
      // Residents can only update reports they submitted
      if (report.reportedBy && report.reportedBy.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Access denied. You can only update reports you submitted.' });
      }
    } else if (req.user.role !== 'ADMIN' && req.user.role !== 'BARANGAY_OFFICIAL' && req.user.role !== 'WASTE_MANAGEMENT') {
      return res.status(403).json({ message: 'Access denied' });
    }

    report.status = 'RESOLVED';
    report.resolutionNotes = resolutionNotes || 'Report marked as completed';
    
    if (completionPhoto) {
      report.completionPhoto = completionPhoto;
    }

    // Assign to current user if not already assigned
    if (!report.assignedTo) {
      report.assignedTo = req.user.id;
    }

    const updatedReport = await report.save();
    await updatedReport.populate('reportedBy', 'name email');
    await updatedReport.populate('assignedTo', 'name email');

    // Create notification for the reporter
    await Notification.create({
      userId: report.reportedBy,
      title: 'Report Completed',
      message: `Your report "${report.title}" has been marked as completed.`,
      type: 'RESOLUTION',
      reportId: report._id
    });

    res.json(updatedReport);
  } catch (error) {
    console.error('Error marking report as completed:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete waste report (Admin only)
// @route   DELETE /api/waste-reports/:id
// @access  Private (Admin only)
const deleteReport = async (req, res) => {
  try {
    const report = await WasteReport.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check permissions - only admin can delete
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied. Only admin can delete reports.' });
    }

    await WasteReport.findByIdAndDelete(req.params.id);

    // Delete related notifications
    await Notification.deleteMany({ reportId: req.params.id });

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createWasteReport,
  getWasteReports,
  getWasteReportById,
  updateReportStatus,
  assignReport,
  getReportStats,
  getAdminDashboard,
  getResidentReports,
  markAsCompleted,
  deleteReport
};
