const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: 1000
  },
  type: {
    type: String,
    required: true,
    enum: ['NEW_REPORT', 'STATUS_UPDATE', 'ASSIGNMENT', 'RESOLUTION', 'URGENT_ALERT']
  },
  read: {
    type: Boolean,
    default: false
  },
  reportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WasteReport',
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient queries
notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ type: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
