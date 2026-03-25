const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Create notification for resolved report
// @route   POST /api/notifications/create
const createNotificationForResolvedReport = async (req, res) => {
  try {
    console.log('=== NOTIFICATION SYSTEM START ===');
    console.log('Request body:', req.body);
    
    const { reportId, title, message } = req.body;
    
    // Find the report to get details
    const WasteReport = mongoose.model('WasteReport');
    const report = await WasteReport.findById(reportId);
    
    if (!report) {
      console.log('❌ Report not found');
      return res.status(404).json({ message: 'Report not found' });
    }
    
    if (report.status !== 'RESOLVED') {
      console.log('❌ Report is not RESOLVED');
      return res.status(400).json({ message: 'Report must be RESOLVED to create community notifications' });
    }
    
    console.log('Report is RESOLVED, creating community notifications...');
    
    // Get all residents
    const User = mongoose.model('User');
    const allResidents = await User.find({ role: 'RESIDENT' });
    
    console.log('Found residents to notify:', allResidents.length);
    
    if (allResidents.length === 0) {
      console.log('❌ No residents found');
      return res.status(404).json({ message: 'No residents found' });
    }
    
    // Create notifications for all residents
    const publicNotificationMessage = `Good news! A waste report "${report.title}" in ${report.location?.barangay || 'your area'} has been resolved. Thank you for helping keep our community clean!`;
    
    const residentNotifications = allResidents.map(resident => ({
      userId: resident._id,
      title: title || 'Community Report Resolved',
      message: message || publicNotificationMessage,
      type: 'COMMUNITY_UPDATE',
      reportId: reportId
    }));
    
    console.log('Creating notifications for residents...');
    const result = await Notification.insertMany(residentNotifications);
    
    console.log('✅ Successfully notified residents:', result.insertedCount);
    console.log('Notification IDs created:', result.insertedIds);
    
    // Also notify the original reporter
    if (report.reportedBy) {
      await Notification.create({
        userId: report.reportedBy,
        title: 'Report Resolved',
        message: `Your waste report "${report.title}" has been resolved! Thank you for helping keep your community clean.`,
        type: 'RESOLUTION',
        reportId: reportId
      });
      console.log('✅ Individual notification sent to reporter');
    }
    
    res.json({ 
      success: true,
      message: `Successfully notified ${allResidents.length} residents and reporter about resolved report`,
      notifiedResidents: result.insertedCount,
      notificationIds: result.insertedIds
    });
    
  } catch (error) {
    console.error('❌ Error creating notifications:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createNotificationForResolvedReport
};
