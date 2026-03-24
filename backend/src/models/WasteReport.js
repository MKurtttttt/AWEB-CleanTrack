const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true,
    min: -90,
    max: 90
  },
  longitude: {
    type: Number,
    required: true,
    min: -180,
    max: 180
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  barangay: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  }
});

const wasteReportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['GARBAGE_UNCOLLECTED', 'ILLEGAL_DUMPING', 'WASTE_PILE_UP', 'RECYCLABLE_WASTE', 'HAZARDOUS_WASTE', 'OTHER']
  },
  status: {
    type: String,
    required: true,
    enum: ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'],
    default: 'PENDING'
  },
  location: {
    type: locationSchema,
    required: true
  },
  imageUrl: {
    type: String,
    default: null
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  estimatedResolution: {
    type: Date,
    default: null
  },
  priority: {
    type: String,
    required: true,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
    default: 'MEDIUM'
  },
  rejectionReason: {
    type: String,
    default: null
  },
  resolutionNotes: {
    type: String,
    default: null
  },
  completionPhoto: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient queries
wasteReportSchema.index({ status: 1, priority: 1 });
wasteReportSchema.index({ 'location.barangay': 1, status: 1 });
wasteReportSchema.index({ reportedBy: 1 });
wasteReportSchema.index({ assignedTo: 1 });

module.exports = mongoose.model('WasteReport', wasteReportSchema);
