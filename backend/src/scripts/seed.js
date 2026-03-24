const mongoose = require('mongoose');
const User = require('../models/User');
const WasteReport = require('../models/WasteReport');

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await WasteReport.deleteMany({});

    console.log('Cleared existing data');

    // Create sample users
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@cleantrack.com',
      password: 'admin123',
      phone: '09123456789',
      role: 'ADMIN',
      barangay: 'Central Barangay'
    });

    const barangayOfficial = new User({
      name: 'Juan Santos',
      email: 'juan@barangay.gov',
      password: 'official123',
      phone: '09123456788',
      role: 'BARANGAY_OFFICIAL',
      barangay: 'Central Barangay'
    });

    const wasteManagement = new User({
      name: 'Maria Reyes',
      email: 'maria@waste.gov',
      password: 'waste123',
      phone: '09123456787',
      role: 'WASTE_MANAGEMENT',
      barangay: 'Central Barangay'
    });

    const resident = new User({
      name: 'Pedro Cruz',
      email: 'pedro@email.com',
      password: 'resident123',
      phone: '09123456786',
      role: 'RESIDENT',
      barangay: 'Central Barangay'
    });

    const savedUsers = await Promise.all([
      adminUser.save(),
      barangayOfficial.save(),
      wasteManagement.save(),
      resident.save()
    ]);

    console.log('Created sample users');

    // Create sample waste reports
    const sampleReports = [
      {
        title: 'Pile of uncollected garbage',
        description: 'Large pile of garbage has been sitting on the corner for over a week. This is causing bad odor and attracting pests.',
        category: 'GARBAGE_UNCOLLECTED',
        status: 'PENDING',
        location: {
          latitude: 14.5995,
          longitude: 120.9842,
          address: '123 Main Street',
          barangay: 'Central Barangay',
          city: 'Manila'
        },
        reportedBy: savedUsers[3]._id, // resident
        priority: 'HIGH'
      },
      {
        title: 'Illegal dumping near river',
        description: 'Someone has been dumping construction waste near the riverbank. This could cause environmental damage.',
        category: 'ILLEGAL_DUMPING',
        status: 'ASSIGNED',
        location: {
          latitude: 14.5990,
          longitude: 120.9840,
          address: 'River Road',
          barangay: 'Central Barangay',
          city: 'Manila'
        },
        reportedBy: savedUsers[3]._id, // resident
        assignedTo: savedUsers[2]._id, // waste management
        priority: 'URGENT'
      },
      {
        title: 'Overflowing public trash bin',
        description: 'Public trash bin on Plaza Square is overflowing and trash is spilling onto the sidewalk.',
        category: 'WASTE_PILE_UP',
        status: 'RESOLVED',
        location: {
          latitude: 14.6000,
          longitude: 120.9845,
          address: 'Plaza Square',
          barangay: 'Central Barangay',
          city: 'Manila'
        },
        reportedBy: savedUsers[3]._id, // resident
        assignedTo: savedUsers[2]._id, // waste management
        priority: 'MEDIUM',
        resolutionNotes: 'Trash has been collected and area cleaned.'
      }
    ];

    const savedReports = await WasteReport.insertMany(sampleReports);
    console.log('Created sample waste reports');

    console.log('Database seeded successfully!');
    console.log('\nSample login credentials:');
    console.log('Admin: admin@cleantrack.com / admin123');
    console.log('Official: juan@barangay.gov / official123');
    console.log('Waste Management: maria@waste.gov / waste123');
    console.log('Resident: pedro@email.com / resident123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedData();
