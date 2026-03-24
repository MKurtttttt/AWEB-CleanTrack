const express = require('express');
const router = express.Router();

const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount
} = require('../controllers/notificationController');

const { auth } = require('../middleware/auth');

// All routes are protected
router.get('/', auth, getNotifications);
router.get('/unread-count', auth, getUnreadCount);
router.patch('/mark-all-read', auth, markAllAsRead);
router.patch('/:id/read', auth, markAsRead);
router.delete('/:id', auth, deleteNotification);

module.exports = router;
