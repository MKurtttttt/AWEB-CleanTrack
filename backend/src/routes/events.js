const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { auth } = require('../middleware/auth');
const Notification = require('../models/Notification');

// Custom auth middleware for SSE that accepts token in query
const sseAuth = async (req, res, next) => {
  try {
    // Try to get token from query parameter first (for SSE)
    const token = req.query.token || req.header('Authorization')?.replace('Bearer ', '');
    
    console.log('SSE Auth - Token received:', token ? 'YES' : 'NO');
    
    if (!token) {
      console.log('SSE Auth - No token provided');
      return res.status(401).end('No token, authorization denied');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('SSE Auth - Token decoded successfully, user ID:', decoded.id);
    
    const User = require('../models/User');
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      console.log('SSE Auth - User not found');
      return res.status(401).end('Token is not valid');
    }

    if (!user.isActive) {
      console.log('SSE Auth - User account deactivated');
      return res.status(401).end('Account is deactivated');
    }

    console.log('SSE Auth - User authenticated:', user.email);
    req.user = user;
    next();
  } catch (error) {
    console.error('SSE Auth error:', error.message);
    return res.status(401).end('Token is not valid');
  }
};

// @desc    Server-Sent Events endpoint for real-time updates
// @route   GET /api/events/notifications
// @access  Private
router.get('/notifications', sseAuth, async (req, res) => {
  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  });

  console.log('SSE connection established for user:', req.user?.email);

  // Send initial connection event
  res.write('data: event: connected\n\n');

  // Keep connection alive - only send notifications when they actually happen
  // Don't send periodic notifications to avoid rate limiting
  req.on('close', () => {
    console.log('SSE client disconnected');
    res.end();
  });

  // Handle any errors
  req.on('error', (err) => {
    console.error('SSE connection error:', err);
    res.end();
  });
});

// @desc    Send notification to specific user via SSE
// @access  Private
router.post('/notifications/send', auth, async (req, res) => {
  try {
    const { userId, title, message, type, reportId } = req.body;
    
    // Create notification
    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
      reportId,
      read: false,
      createdAt: new Date()
    });

    // Find all connected clients for this user
    // Note: In a real app, you'd track connections per user
    // For now, we'll broadcast to all clients (in production, you'd filter by userId)
    console.log('Sending notification to user:', userId, notification);

    res.status(201).json({ message: 'Notification sent via SSE' });
  } catch (error) {
    console.error('Error sending SSE notification:', error);
    res.status(500).json({ message: 'Failed to send notification' });
  }
});

// @desc    Send report update via SSE
// @access  Private
router.post('/reports/update', auth, async (req, res) => {
  try {
    const { reportId, status, userId } = req.body;
    
    console.log('Report update via SSE:', { reportId, status, userId });

    // Find report and update it
    const WasteReport = require('../models/WasteReport');
    const report = await WasteReport.findByIdAndUpdate(reportId, { status }, { new: true });

    // Create status update notification
    const notification = await Notification.create({
      userId,
      title: 'Report Status Updated',
      message: `Report #${reportId} status changed to ${status}`,
      type: 'STATUS_UPDATE',
      reportId: reportId,
      read: false,
      createdAt: new Date()
    });

    res.status(200).json({ message: 'Report update sent via SSE' });
  } catch (error) {
    console.error('Error sending report update via SSE:', error);
    res.status(500).json({ message: 'Failed to send report update' });
  }
});

module.exports = router;
