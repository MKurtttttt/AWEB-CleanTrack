const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./src/models/User');
const WasteReport = require('./src/models/WasteReport');
const Notification = require('./src/models/Notification');

const seedAll = async () => {
  try {
    console.log('🌱 Starting comprehensive database seeding...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await User.deleteMany({});
    await WasteReport.deleteMany({});
    await Notification.deleteMany({});
    
    // 1. Seed Users
    console.log('👥 Seeding users...');
    
    // Create users first and get their IDs
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      name: 'Admin User',
      email: 'admin@cleantrack.com',
      password: hashedAdminPassword,
      phone: '+63-912-3456',
      role: 'ADMIN',
      barangay: 'Malabanias',
      isActive: true
    });
    const savedAdmin = await admin.save();
    
    // Barangay official
    const hashedOfficialPassword = await bcrypt.hash('official123', 10);
    const official = new User({
      name: 'Juan Santos',
      email: 'official@cleantrack.com',
      password: hashedOfficialPassword,
      phone: '+63-912-3457',
      role: 'BARANGAY_OFFICIAL',
      barangay: 'Malabanias',
      isActive: true
    });
    const savedOfficial = await official.save();
    
    // Waste management staff
    const hashedStaffPassword = await bcrypt.hash('staff123', 10);
    const staff = new User({
      name: 'Maria Reyes',
      email: 'staff@cleantrack.com',
      password: hashedStaffPassword,
      phone: '+63-912-3458',
      role: 'WASTE_MANAGEMENT',
      barangay: 'Malabanias',
      isActive: true
    });
    const savedStaff = await staff.save();
    
    // Sample residents
    const residents = [
      {
        name: 'Pedro Cruz',
        email: 'pedro@cleantrack.com',
        password: await bcrypt.hash('resident123', 10),
        phone: '+63-912-3459',
        role: 'RESIDENT',
        barangay: 'Malabanias',
        isActive: true
      },
      {
        name: 'Ana Garcia',
        email: 'ana@cleantrack.com',
        password: await bcrypt.hash('resident123', 10),
        phone: '+63-912-3460',
        role: 'RESIDENT',
        barangay: 'Malabanias',
        isActive: true
      },
      {
        name: 'Carlos Rodriguez',
        email: 'carlos@cleantrack.com',
        password: await bcrypt.hash('resident123', 10),
        phone: '+63-912-3461',
        role: 'RESIDENT',
        barangay: 'Malabanias',
        isActive: true
      }
    ];
    
    const savedResidents = [];
    for (const resident of residents) {
      savedResidents.push(await new User(resident).save());
    }
    
    console.log(`✅ Created ${4 + savedResidents.length} users`);
    
    // 2. Seed Waste Reports
    console.log('🗑️ Seeding waste reports...');
    
    const sampleReports = [
      {
        title: 'Pile of garbage near Burgos Street',
        description: 'Large pile of uncollected garbage accumulating near the corner of Burgos Street. Needs immediate attention.',
        category: 'WASTE_PILE_UP',
        status: 'PENDING',
        priority: 'HIGH',
        location: {
          latitude: 15.1474,
          longitude: 120.5957,
          address: '1234 Burgos Street, Malabanias',
          barangay: 'Malabanias',
          city: 'Angeles City'
        },
        reportedBy: savedResidents[0]._id
      },
      {
        title: 'Overflowing trash bin in Central Barangay',
        description: 'Public trash bin overflowing with waste spilling onto the street. Regular collection needed.',
        category: 'GARBAGE_UNCOLLECTED',
        status: 'IN_PROGRESS',
        priority: 'URGENT',
        location: {
          latitude: 15.1485,
          longitude: 120.5942,
          address: '567 Rizal Avenue, Central Barangay',
          barangay: 'Malabanias',
          city: 'Angeles City'
        },
        reportedBy: savedResidents[1]._id,
        assignedTo: savedStaff._id
      },
      {
        title: 'Illegal dumping in vacant lot',
        description: 'Someone dumped construction debris and household waste in a vacant lot. Requires cleanup and investigation.',
        category: 'ILLEGAL_DUMPING',
        status: 'RESOLVED',
        priority: 'MEDIUM',
        location: {
          latitude: 15.1462,
          longitude: 120.5968,
          address: '890 Mabini Street, Malabanias',
          barangay: 'Malabanias',
          city: 'Angeles City'
        },
        reportedBy: savedResidents[2]._id,
        assignedTo: savedOfficial._id,
        resolutionNotes: 'Cleaned up illegal dumping site and posted warning signs.',
        completionPhoto: '/uploads/completed-cleanup.jpg'
      },
      {
        title: 'Recyclable waste not collected',
        description: 'Residents have been separating recyclables for 2 weeks but collection has not been done.',
        category: 'RECYCLABLE_WASTE',
        status: 'PENDING',
        priority: 'LOW',
        location: {
          latitude: 15.1495,
          longitude: 120.5975,
          address: '234 Santo Rosario Street, Malabanias',
          barangay: 'Malabanias',
          city: 'Angeles City'
        },
        reportedBy: savedResidents[0]._id
      }
    ];
    
    for (const report of sampleReports) {
      await new WasteReport(report).save();
    }
    
    console.log(`✅ Created ${sampleReports.length} waste reports`);
    
    // 3. Seed Notifications
    console.log('🔔 Seeding notifications...');
    
    const notifications = [];
    
    // Notifications for admin
    notifications.push({
      userId: savedAdmin._id,
      title: 'New Report Submitted',
      message: 'A new waste report "Pile of garbage near Burgos Street" has been submitted by Pedro Cruz.',
      type: 'NEW_REPORT',
      reportId: sampleReports[0]._id,
      read: false
    });
    
    notifications.push({
      userId: savedAdmin._id,
      title: 'Urgent Report Assigned',
      message: 'An urgent waste report has been assigned to Juan Santos for immediate action.',
      type: 'ASSIGNMENT',
      reportId: sampleReports[1]._id,
      read: false
    });
    
    // Notifications for barangay official
    notifications.push({
      userId: savedOfficial._id,
      title: 'Report Status Update',
      message: 'The illegal dumping report has been marked as resolved. Please follow up with residents.',
      type: 'STATUS_UPDATE',
      reportId: sampleReports[2]._id,
      read: false
    });
    
    // Notifications for residents
    notifications.push({
      userId: savedResidents[0]._id,
      title: 'Report Submitted Successfully',
      message: 'Your waste report "Pile of garbage near Burgos Street" has been submitted successfully. We will review and take action.',
      type: 'NEW_REPORT',
      reportId: sampleReports[0]._id,
      read: false
    });
    
    notifications.push({
      userId: savedResidents[1]._id,
      title: 'Report Resolved',
      message: 'Great news! Your report "Overflowing trash bin in Central Barangay" has been resolved. Thank you for helping keep Malabanias clean.',
      type: 'RESOLUTION',
      reportId: sampleReports[1]._id,
      read: false
    });
    
    notifications.push({
      userId: savedResidents[2]._id,
      title: 'Assignment Update',
      message: 'Your report "Recyclable waste not collected" has been assigned to Maria Reyes for follow-up.',
      type: 'ASSIGNMENT',
      reportId: sampleReports[3]._id,
      read: false
    });
    
    for (const notification of notifications) {
      await new Notification(notification).save();
    }
    
    console.log(`✅ Created ${notifications.length} notifications`);
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('🔑 ADMIN: admin@cleantrack.com / admin123');
    console.log('👥 OFFICIAL: official@cleantrack.com / official123');
    console.log('🧑 STAFF: staff@cleantrack.com / staff123');
    console.log('👤 RESIDENTS: pedro@cleantrack.com / resident123');
    console.log('👤 RESIDENTS: ana@cleantrack.com / resident123');
    console.log('👤 RESIDENTS: carlos@cleantrack.com / resident123');
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
seedAll();
