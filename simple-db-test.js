// Simple MongoDB connection test
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');

mongoose.connect('mongodb://localhost:27017/cleantrack')
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
    console.log('Database name:', mongoose.connection.name);
    
    // Test basic query
    const User = mongoose.model('User');
    User.findOne({ email: 'pedro@email.com' })
      .then(user => {
        if (user) {
          console.log('✅ Found Pedro:', user.email);
          console.log('User ID:', user._id);
          console.log('User role:', user.role);
        } else {
          console.log('❌ Pedro not found');
        }
      })
      .catch(err => {
        console.error('❌ MongoDB connection error:', err);
      });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err);
  });
