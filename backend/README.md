# CleanTrack Backend

Backend API for CleanTrack waste management system built with Express.js and MongoDB.

## Features

- **User Management**: Registration, authentication, role-based access control
- **Waste Report Management**: Create, view, update, and assign waste reports
- **Notifications**: Real-time notifications for report updates
- **File Upload**: Image upload for waste reports
- **Security**: JWT authentication, rate limiting, input validation
- **Database**: MongoDB with Mongoose ODM

## User Roles

- **RESIDENT**: Can create and view their own reports
- **BARANGAY_OFFICIAL**: Can view and manage reports in their barangay
- **WASTE_MANAGEMENT**: Can view and manage all waste reports
- **ADMIN**: Full system access

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password

### Waste Reports
- `POST /api/waste-reports` - Create new waste report (with image upload)
- `GET /api/waste-reports` - Get waste reports (filtered by user role)
- `GET /api/waste-reports/:id` - Get specific waste report
- `PATCH /api/waste-reports/:id/status` - Update report status
- `PATCH /api/waste-reports/:id/assign` - Assign report to official
- `GET /api/waste-reports/stats` - Get report statistics

### Notifications
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark notification as read
- `PATCH /api/notifications/mark-all-read` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete notification
- `GET /api/notifications/unread-count` - Get unread notification count

### User Management (Admin/Officials)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get specific user
- `PATCH /api/users/:id/status` - Activate/deactivate user (Admin only)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Ensure MongoDB is running on your system

4. Seed the database (optional):
```bash
npm run seed
```

5. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## Environment Variables

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `JWT_EXPIRE` - JWT expiration time
- `MAX_FILE_SIZE` - Maximum file upload size
- `RATE_LIMIT_WINDOW_MS` - Rate limiting window
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window

## Database Models

### User
- name, email, password, phone, role, barangay
- Roles: RESIDENT, BARANGAY_OFFICIAL, WASTE_MANAGEMENT, ADMIN

### WasteReport
- title, description, category, status, priority
- location (lat/lng, address, barangay, city)
- reportedBy, assignedTo, imageUrl
- Categories: GARBAGE_UNCOLLECTED, ILLEGAL_DUMPING, WASTE_PILE_UP, RECYCLABLE_WASTE, HAZARDOUS_WASTE, OTHER
- Status: PENDING, ASSIGNED, IN_PROGRESS, RESOLVED, REJECTED
- Priority: LOW, MEDIUM, HIGH, URGENT

### Notification
- userId, title, message, type, read
- Types: NEW_REPORT, STATUS_UPDATE, ASSIGNMENT, RESOLUTION, URGENT_ALERT

## Security Features

- JWT authentication with expiration
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- Input validation and sanitization
- CORS configuration
- Helmet.js for security headers
- File upload restrictions

## File Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Database connection
│   ├── controllers/
│   │   ├── wasteReportController.js
│   │   ├── userController.js
│   │   └── notificationController.js
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   └── upload.js            # File upload handling
│   ├── models/
│   │   ├── WasteReport.js
│   │   ├── User.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── wasteReports.js
│   │   ├── users.js
│   │   └── notifications.js
│   ├── scripts/
│   │   └── seed.js              # Database seeding
│   └── server.js                # Main server file
├── uploads/                     # File upload directory
├── package.json
├── .env.example
└── README.md
```

## Sample Users (after seeding)

- **Admin**: admin@cleantrack.com / admin123
- **Barangay Official**: juan@barangay.gov / official123
- **Waste Management**: maria@waste.gov / waste123
- **Resident**: pedro@email.com / resident123

## Testing

```bash
npm test
```

## License

MIT
