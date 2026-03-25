const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    console.log('=== GET NOTIFICATIONS REQUEST ===');
    console.log('User ID:', req.user.id);
    console.log('User Email:', req.user.email);
    console.log('User Role:', req.user.role);
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    console.log('Fetching notifications for user:', req.user.id);
    
    const notifications = await Notification.find({ userId: req.user.id })
      .populate('reportId', 'title status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    console.log('Found notifications:', notifications.length);
    notifications.forEach((notif, index) => {
      console.log(`  ${index + 1}. ${notif.title} - ${notif.message} - ${notif.createdAt}`);
    });

    const total = await Notification.countDocuments({ userId: req.user.id });
    const unreadCount = await Notification.countDocuments({ 
      userId: req.user.id, 
      read: false 
    });

    console.log(`Total notifications: ${total}, Unread: ${unreadCount}`);

    res.json({
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      unreadCount
    });
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create test notification for admin
// @route   POST /api/notifications/test
// @access  Private
const createTestNotification = async (req, res) => {
  try {
    console.log('=== CREATE TEST NOTIFICATION ===');
    console.log('User ID:', req.user.id);
    console.log('User Role:', req.user.role);
    
    const testNotification = await Notification.create({
      userId: req.user.id,
      title: 'Test Notification',
      message: 'This is a test notification to verify the system is working.',
      type: 'TEST',
      read: false
    });
    
    console.log('✅ Test notification created:', testNotification);
    
    res.json({
      success: true,
      message: 'Test notification created successfully',
      notification: testNotification
    });
  } catch (error) {
    console.error('Error creating test notification:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Check if notification belongs to user
    if (notification.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    notification.read = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/mark-all-read
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, read: false },
      { read: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Check if notification belongs to user
    if (notification.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ 
      userId: req.user.id, 
      read: false 
    });

    res.json({ unreadCount: count });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getNotifications,
  createTestNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount
};
