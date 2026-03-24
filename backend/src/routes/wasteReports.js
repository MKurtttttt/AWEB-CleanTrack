const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const {
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
} = require('../controllers/wasteReportController');

const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Validation middleware
const validateWasteReport = [
  body('title').trim().isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('category').isIn(['GARBAGE_UNCOLLECTED', 'ILLEGAL_DUMPING', 'WASTE_PILE_UP', 'RECYCLABLE_WASTE', 'HAZARDOUS_WASTE', 'OTHER']).withMessage('Invalid category'),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).withMessage('Invalid priority')
];

const validateStatusUpdate = [
  body('status').isIn(['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED']).withMessage('Invalid status'),
  body('rejectionReason').optional().trim().isLength({ min: 5 }).withMessage('Rejection reason must be at least 5 characters'),
  body('resolutionNotes').optional().trim().isLength({ min: 5 }).withMessage('Resolution notes must be at least 5 characters'),
  body('estimatedResolution').optional().isISO8601().withMessage('Invalid estimated resolution date')
];

const validateAssignment = [
  body('assignedTo').isMongoId().withMessage('Invalid assigned user ID')
];

// Routes
router.post('/', auth, upload.single('image'), validateWasteReport, createWasteReport);
router.get('/', auth, getWasteReports);
router.get('/stats', auth, getReportStats);
router.get('/admin/dashboard', auth, authorize('ADMIN', 'BARANGAY_OFFICIAL', 'WASTE_MANAGEMENT'), getAdminDashboard);
router.get('/resident/reports', auth, authorize('RESIDENT'), getResidentReports);
router.get('/:id', auth, getWasteReportById);
router.patch('/:id/status', auth, authorize('BARANGAY_OFFICIAL', 'WASTE_MANAGEMENT', 'ADMIN'), validateStatusUpdate, updateReportStatus);
router.patch('/:id/assign', auth, authorize('BARANGAY_OFFICIAL', 'WASTE_MANAGEMENT', 'ADMIN'), validateAssignment, assignReport);
router.patch('/:id/complete', auth, authorize('BARANGAY_OFFICIAL', 'WASTE_MANAGEMENT', 'ADMIN'), markAsCompleted);
router.delete('/:id', auth, authorize('ADMIN'), deleteReport);

module.exports = router;
