const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  getUsers,
  getUserById,
  updateUserStatus
} = require('../controllers/userController');

const { auth, authorize } = require('../middleware/auth');

// Validation middleware
const validateRegistration = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phone').trim().isLength({ min: 10 }).withMessage('Phone number is required'),
  body('barangay').trim().isLength({ min: 2 }).withMessage('Barangay is required'),
  body('role').optional().isIn(['RESIDENT', 'BARANGAY_OFFICIAL', 'WASTE_MANAGEMENT', 'ADMIN']).withMessage('Invalid role')
];

const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];

const validateProfileUpdate = [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('phone').optional().trim().isLength({ min: 10 }).withMessage('Phone number must be at least 10 characters'),
  body('barangay').optional().trim().isLength({ min: 2 }).withMessage('Barangay must be at least 2 characters')
];

const validatePasswordChange = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
];

const validateUserStatusUpdate = [
  body('isActive').isBoolean().withMessage('isActive must be a boolean')
];

// Public routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, validateProfileUpdate, updateProfile);
router.put('/change-password', auth, validatePasswordChange, changePassword);

// Admin and Official routes
router.get('/', auth, authorize('BARANGAY_OFFICIAL', 'WASTE_MANAGEMENT', 'ADMIN'), getUsers);
router.get('/:id', auth, authorize('BARANGAY_OFFICIAL', 'WASTE_MANAGEMENT', 'ADMIN'), getUserById);
router.patch('/:id/status', auth, authorize('ADMIN'), validateUserStatusUpdate, updateUserStatus);

module.exports = router;
