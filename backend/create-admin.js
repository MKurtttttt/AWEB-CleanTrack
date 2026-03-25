const mongoose = require('mongoose');
const User = require('./src/models/User');

mongoose.connect('mongodb://localhost:27017/cleantrack').then(async () => {
  console.log('Connected to MongoDB');
  
  // Delete existing admin user
  await User.deleteOne({ email: 'admin@cleantrack.com' });
  
  // Create new admin user with plain text password (model will hash it)
  const admin = new User({
    name: 'Admin User',
    email: 'admin@cleantrack.com',
    password: 'admin123', // Plain text - model will hash it
    role: 'ADMIN',
    barangay: 'Central Barangay',
    phone: '1234567890',
    isActive: true
  });
  
  await admin.save();
  console.log('✅ Admin user created/updated!');
  console.log('📧 Email: admin@cleantrack.com');
  console.log('🔑 Password: admin123');
  console.log('👤 Role: ADMIN');
  
  // Verify the password was saved
  const savedAdmin = await User.findOne({ email: 'admin@cleantrack.com' }).select('+password');
  console.log('Password saved correctly:', !!savedAdmin.password);
  console.log('Password hash length:', savedAdmin.password?.length);
  
  // Test login
  const isMatch = await savedAdmin.comparePassword('admin123');
  console.log('Password test successful:', isMatch);
  
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
