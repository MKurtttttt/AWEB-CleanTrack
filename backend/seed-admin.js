const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./src/models/User');

const seedAdmin = async () => {
  try {
    console.log('🌱 Seeding admin user...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@cleantrack.com' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = new User({
      name: 'Admin User',
      email: 'admin@cleantrack.com',
      password: hashedPassword,
      role: 'ADMIN',
      barangay: 'Malabanias',
      isActive: true
    });
    
    await admin.save();
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Login credentials:');
    console.log('   Email: admin@cleantrack.com');
    console.log('   Password: admin123');
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

// Run the seeder
seedAdmin();
