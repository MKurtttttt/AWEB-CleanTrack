const mongoose = require('mongoose');
const WasteReport = require('../models/WasteReport');

class NotificationService {
  static async createNotificationForReport(report, resolvedLocation, reporterId = null) {
    try {
      // Create notification for the reporter (if logged in)
      if (reporterId) {
        await mongoose.model('Notification').create({
          userId: reporterId,
          title: 'Report Submitted Successfully',
          message: `Your waste report "${report.title}" has been submitted in ${resolvedLocation.barangay}.`,
          type: 'NEW_REPORT',
          reportId: report._id
        });
      }

      // Create notifications for all admins
      const User = mongoose.model('User');
      const adminUsers = await User.find({ role: 'ADMIN' });

      // Create notifications for barangay officials in the same barangay
      const barangayOfficials = await User.find({
        role: { $in: ['BARANGAY_OFFICIAL', 'WASTE_MANAGEMENT'] }, 
        barangay: new RegExp(`^${resolvedLocation.barangay}$`, 'i') 
      });

      // Notification for barangay officials
      const officialNotification = {
        userId: official._id,
        title: 'New Waste Report Assigned',
        message: `A new waste report "${report.title}" has been submitted in ${resolvedLocation.barangay}. Please review and assign appropriate action.`,
        type: 'ASSIGNMENT',
        reportId: report._id
      };

      // Create notification for admins
      const adminNotification = {
        userId: admin._id,
        title: 'New Waste Report Submitted',
        message: `A new waste report "${report.title}" has been submitted in ${resolvedLocation.barangay} by ${reporterId || 'Anonymous'}.`,
        type: 'NEW_REPORT',
        reportId: report._id
      };

      // Create notifications in parallel
      const notifications = [];

      // Add official notifications
      for (const official of barangayOfficials) {
        notifications.push({
          ...officialNotification,
          userId: official._id
        });
      }

      // Add admin notifications
      for (const admin of adminUsers) {
        notifications.push({
          ...adminNotification,
          userId: admin._id
        });
      }

      // Save all notifications
      if (notifications.length > 0) {
        await mongoose.model('Notification').insertMany(notifications);
      }

      return { success: true, notifications: notifications.length };
    } catch (error) {
      console.error('Error creating notifications:', error);
      return { success: false, error: error.message };
    }
  }

  static async createStatusUpdateNotification(report, newStatus, assignedToId) {
    try {
      // Create notification for assigned user (if any)
      if (assignedToId) {
        await mongoose.model('Notification').create({
          userId: assignedToId,
          title: 'Report Status Updated',
          message: `Your assigned report "${report.title}" status has been updated to ${newStatus}.`,
          type: 'STATUS_UPDATE',
          reportId: report._id
        });
      }

      // Create notification for reporter (if logged in)
      if (report.reportedBy) {
        await mongoose.model('Notification').create({
          userId: report.reportedBy._id,
          title: 'Report Status Updated',
          message: `Your waste report "${report.title}" status has been updated to ${newStatus}.`,
          type: 'STATUS_UPDATE',
          reportId: report._id
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Error creating status update notification:', error);
      return { success: false, error: error.message };
    }
  }

  static async createCompletionNotification(report, resolvedBy, resolutionNotes) {
    try {
      // Create notification for the user who resolved it
      if (resolvedBy) {
        await mongoose.model('Notification').create({
          userId: resolvedBy._id,
          title: 'Report Resolved',
          message: `Your waste report "${report.title}" has been resolved. ${resolutionNotes ? `Notes: ${resolutionNotes}` : ''}`,
          type: 'RESOLUTION',
          reportId: report._id
        });
      }

      // Create notification for admins
      const User = mongoose.model('User');
      const adminUsers = await User.find({ role: 'ADMIN' });

      const adminNotification = {
        userId: admin._id,
        title: 'Report Resolved',
        message: `Report "${report.title}" has been resolved by ${resolvedBy?.name || 'City Hall Team'}. ${resolutionNotes ? `Notes: ${resolutionNotes}` : ''}`,
        type: 'RESOLUTION',
        reportId: report._id
      };

      const notifications = adminUsers.map(admin => ({
        ...adminNotification,
        userId: admin._id
      }));

      if (notifications.length > 0) {
        await mongoose.model('Notification').insertMany(notifications);
      }

      return { success: true };
    } catch (error) {
      console.error('Error creating completion notification:', error);
      return { success: false, error: error.message };
    }
  }

  static async createUrgentNotification(report) {
    try {
      const User = mongoose.model('User');
      const adminUsers = await User.find({ role: 'ADMIN' });

      const urgentNotification = {
        userId: admin._id,
        title: 'Urgent Waste Report',
        message: `An urgent waste report "${report.title}" has been submitted in ${report.location?.barangay || 'Unknown Location'}. Immediate attention required.`,
        type: 'URGENT_ALERT',
        reportId: report._id
      };

      const notifications = adminUsers.map(admin => ({
        ...urgentNotification,
        userId: admin._id
      }));

      if (notifications.length > 0) {
        await mongoose.model('Notification').insertMany(notifications);
      }

      return { success: true };
    } catch (error) {
      console.error('Error creating urgent notification:', error);
      return { success: false, error: error.message };
    }
  }

  static async getNotifications(userId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const notifications = await mongoose.model('Notification')
        .find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email phone');

      return {
        success: true,
        notifications,
        total: await mongoose.model('Notification').countDocuments({ userId }),
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return { success: false, error: error.message };
    }
  }

  static async markAsRead(notificationId) {
    try {
      await mongoose.model('Notification').findByIdAndUpdate(
        notificationId,
        { read: true }
      );
      
      return { success: true };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = NotificationService;
