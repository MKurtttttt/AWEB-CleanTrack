const WasteReport = require('../models/WasteReport');
const Notification = require('../models/Notification');

const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// @desc    Create a new waste report
// @route   POST /api/waste-reports
// @access  Private
const createWasteReport = async (req, res) => {
  try {
    const { title, description, category, location, priority } = req.body;

    const resolvedLocation = location || {
      latitude: parseFloat(req.body['location[latitude]'] || req.body.latitude),
      longitude: parseFloat(req.body['location[longitude]'] || req.body.longitude),
      address: req.body['location[address]'] || req.body.address,
      barangay: req.body['location[barangay]'] || req.body.barangay,
      city: req.body['location[city]'] || req.body.city
    };

    if (
      !resolvedLocation ||
      Number.isNaN(resolvedLocation.latitude) ||
      Number.isNaN(resolvedLocation.longitude) ||
      !resolvedLocation.address ||
      !resolvedLocation.barangay ||
      !resolvedLocation.city
    ) {
      return res.status(400).json({ message: 'Invalid location payload' });
    }
    
    const wasteReport = new WasteReport({
      title,
      description,
      category,
      location: resolvedLocation,
      priority,
      reportedBy: req.user.id
    });

    // Add image URL if file was uploaded
    if (req.file) {
      wasteReport.imageUrl = `/uploads/${req.file.filename}`;
    }

    const savedReport = await wasteReport.save();
    await savedReport.populate('reportedBy', 'name email phone');

    // Create notification for the reporter
    await Notification.create({
      userId: req.user.id,
      title: 'Report Submitted Successfully',
      message: `Your waste report "${title}" has been submitted successfully.`,
      type: 'NEW_REPORT',
      reportId: savedReport._id
    });

    // Create notifications for all admins and barangay officials
    const User = require('../models/User');
    const adminUsers = await User.find({ 
      role: { $in: ['ADMIN', 'BARANGAY_OFFICIAL'] },
      $or: [
        { barangay: { $exists: false } }, // Admins without specific barangay
        { barangay: resolvedLocation.barangay } // Officials from the same barangay
      ]
    }).select('_id');

    for (const admin of adminUsers) {
      await Notification.create({
        userId: admin._id,
        title: 'New Waste Report Submitted',
        message: `A new waste report "${title}" has been submitted in ${resolvedLocation.barangay}.`,
        type: 'NEW_REPORT',
        reportId: savedReport._id
      });
    }

    res.status(201).json(savedReport);
  } catch (error) {
    console.error('Error creating waste report:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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

// @desc    Update waste report status
// @route   PATCH /api/waste-reports/:id/status
// @access  Private (Officials and Admins only)
const updateReportStatus = async (req, res) => {
  try {
    const { status, rejectionReason, resolutionNotes, estimatedResolution } = req.body;
    
    const report = await WasteReport.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check permissions
    if (req.user.role === 'RESIDENT') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update fields
    report.status = status;
    
    if (status === 'REJECTED' && rejectionReason) {
      report.rejectionReason = rejectionReason;
    }
    
    if (status === 'RESOLVED' && resolutionNotes) {
      report.resolutionNotes = resolutionNotes;
    }
    
    if (estimatedResolution) {
      report.estimatedResolution = estimatedResolution;
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
      title: `Report Status Updated`,
      message: `Your report "${report.title}" status has been updated to ${status}.`,
      type: 'STATUS_UPDATE',
      reportId: report._id
    });

    res.json(updatedReport);
  } catch (error) {
    console.error('Error updating report status:', error);
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

    // Check permissions
    if (req.user.role === 'RESIDENT') {
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

    // Recent reports (last 7 days)
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

    res.json({
      stats: stats[0] || {
        total: 0, pending: 0, assigned: 0, inProgress: 0, resolved: 0, rejected: 0, urgent: 0, high: 0
      },
      recentReports,
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

    // Check permissions
    if (req.user.role === 'RESIDENT') {
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
