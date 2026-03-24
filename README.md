# CleanTrack

A comprehensive waste management reporting system with separate frontend and backend applications.

## Project Structure

```
CleanTrack/
├── frontend/          # Angular frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── models/
│   │   │   ├── services/
│   │   │   └── ...
│   │   └── ...
│   ├── package.json
│   ├── angular.json
│   └── ...
├── backend/           # Express.js backend API
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── ...
│   ├── package.json
│   └── ...
└── README.md
```

## Features

- **User Management**: Role-based authentication (Resident, Barangay Official, Waste Management, Admin)
- **Waste Reporting**: Create, track, and manage waste reports with images
- **Admin Dashboard**: Comprehensive analytics and report management
- **Real-time Notifications**: Status updates and assignments
- **Location-based Reporting**: GPS coordinates and address details

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Angular CLI
- MongoDB
- Git

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your MongoDB connection and JWT secret
```

4. Start the backend server:
```bash
npm run dev  # Development mode
# or
npm start    # Production mode
```

The backend API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the Angular development server:
```bash
ng serve
```

The frontend application will be available at `http://localhost:4200`

## API Documentation

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user

### Waste Reports
- `POST /api/waste-reports` - Create new waste report
- `GET /api/waste-reports/admin/dashboard` - Admin dashboard data
- `GET /api/waste-reports/resident/reports` - Resident's reports
- `PATCH /api/waste-reports/:id/complete` - Mark report as completed

### Notifications
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark notification as read

## User Roles

- **RESIDENT**: Can create and view their own reports
- **BARANGAY_OFFICIAL**: Can manage reports in their barangay
- **WASTE_MANAGEMENT**: Can manage all waste reports
- **ADMIN**: Full system access and user management

## Sample Users (after seeding)

- **Admin**: admin@cleantrack.com / admin123
- **Barangay Official**: juan@barangay.gov / official123
- **Waste Management**: maria@waste.gov / waste123
- **Resident**: pedro@email.com / resident123

## Development

### Backend Development
```bash
cd backend
npm run dev  # Starts with nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
ng serve     # Starts Angular dev server with live reload
```

### Database Seeding
```bash
cd backend
npm run seed  # Populates database with sample data
```

## Technologies Used

### Frontend
- Angular 21
- TypeScript
- Angular Material (optional)
- RxJS

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
- bcryptjs for password hashing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License
