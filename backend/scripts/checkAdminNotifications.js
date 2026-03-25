const mongoose = require('mongoose');
const Notification = require('../src/models/Notification');
const User = require('../src/models/User');
const WasteReport = require('../src/models/WasteReport');

async function checkAdminNotifications() {
  try {
    console.log('=== CHECKING ADMIN NOTIFICATIONS ===');
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/cleantrack');
    console.log('✅ Connected to MongoDB');

    // Get the admin user
    const admin = await User.findOne({ email: 'admin@cleantrack.com' });
    console.log(`Admin found: ${admin ? admin.name : 'Not found'}`);
    console.log(`Admin ID: ${admin ? admin._id : 'N/A'}`);

    if (!admin) {
      console.log('❌ Admin user not found');
      return;
    }

    // Get all notifications for this admin
    const adminNotifications = await Notification.find({ userId: admin._id })
      .populate('reportId', 'title status')
      .sort({ createdAt: -1 });

    console.log(`\n=== NOTIFICATIONS FOR ADMIN (${admin.name}) ===`);
    console.log(`Total notifications found: ${adminNotifications.length}`);

    adminNotifications.forEach((notif, index) => {
      console.log(`\n${index + 1}. ${notif.title}`);
      console.log(`   Message: ${notif.message}`);
      console.log(`   Type: ${notif.type}`);
      console.log(`   Report: ${notif.reportId?.title || 'N/A'} (${notif.reportId?.status || 'N/A'})`);
      console.log(`   Created: ${notif.createdAt}`);
      console.log(`   Read: ${notif.read}`);
    });

    // Check if there are notifications not assigned to this admin
    const allNotifications = await Notification.countDocuments();
    const adminNotificationCount = await Notification.countDocuments({ userId: admin._id });
    
    console.log(`\n=== SUMMARY ===`);
    console.log(`Total notifications in system: ${allNotifications}`);
    console.log(`Notifications for this admin: ${adminNotificationCount}`);
    console.log(`Notifications for other users: ${allNotifications - adminNotificationCount}`);

    // Get all admins and officials
    const allAdmins = await User.find({ 
      role: { $in: ['ADMIN', 'BARANGAY_OFFICIAL', 'WASTE_MANAGEMENT'] }
    });
    
    console.log(`\n=== ALL ADMINS/OFFICIALS ===`);
    allAdmins.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.role}) - ID: ${user._id}`);
    });

  } catch (error) {
    console.error('❌ Error checking admin notifications:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run the check
checkAdminNotifications();
