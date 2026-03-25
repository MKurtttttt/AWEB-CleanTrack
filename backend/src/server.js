const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/database');
const wasteRoutes = require('./routes/wasteReports');
const userRoutes = require('./routes/users');
const notificationRoutes = require('./routes/notifications');
const eventsRoutes = require('./routes/events');

const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-production-domain.com'] 
    : ['http://localhost:4200', 'http://localhost:4201', 'http://localhost:4202'],
  credentials: true
}));

// Rate limiting - very lenient for development
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 5000, // limit each IP to 5000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for SSE endpoints
  skip: (req) => {
    return req.url && req.url.includes('/events/');
  }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API routes
app.use('/api/waste-reports', wasteRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/events', eventsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: 'Validation Error', errors });
  }
  
  if (err.code === 11000) {
    return res.status(400).json({ message: 'Duplicate field value entered' });
  }
  
  res.status(err.status || 500).json({ 
    message: err.message || 'Internal Server Error' 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;
