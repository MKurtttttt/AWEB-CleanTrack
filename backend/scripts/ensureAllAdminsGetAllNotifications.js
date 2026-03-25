const mongoose = require('mongoose');
const Notification = require('../src/models/Notification');
const User = require('../src/models/User');
const WasteReport = require('../src/models/WasteReport');

async function ensureAllAdminsGetAllNotifications() {
  try {
    console.log('=== ENSURING ALL ADMINS GET ALL NOTIFICATIONS ===');
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/cleantrack');
    console.log('✅ Connected to MongoDB');

    // Get all admins and officials
    const allAdmins = await User.find({ 
      role: { $in: ['ADMIN', 'BARANGAY_OFFICIAL', 'WASTE_MANAGEMENT'] }
    });
    
    console.log(`Found ${allAdmins.length} admins/officials:`);
    allAdmins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.name} (${admin.role}) - ID: ${admin._id}`);
    });

    // Get all reports
    const allReports = await WasteReport.find();
    console.log(`Found ${allReports.length} reports`);

    let notificationsCreated = 0;

    // For each report, ensure all admins have notifications
    for (const report of allReports) {
      console.log(`\n--- Processing report: ${report.title} ---`);
      
      // For each admin, check if they have a notification for this report
      for (const admin of allAdmins) {
        const existingNotification = await Notification.findOne({
          userId: admin._id,
          reportId: report._id
        });

        if (!existingNotification) {
          console.log(`❌ ${admin.name} missing notification for this report - creating...`);
          
          // Create notification for this admin
          const reporterName = report.reportedBy?.name || 'Anonymous';
          const notificationMessage = `New waste report "${report.title}" submitted by ${reporterName} in ${report.location?.barangay || 'your area'}. Please review and take action.`;

          await Notification.create({
            userId: admin._id,
            title: 'New Report Submitted',
            message: notificationMessage,
            type: 'NEW_REPORT',
            reportId: report._id,
            createdAt: report.createdAt
          });

          console.log(`✅ Created notification for ${admin.name}`);
          notificationsCreated++;
        } else {
          console.log(`✅ ${admin.name} already has notification for this report`);
        }
      }
    }

    console.log(`\n=== SUMMARY ===`);
    console.log(`Total notifications created: ${notificationsCreated}`);
    console.log('✅ All admins should now have notifications for all reports!');

  } catch (error) {
    console.error('❌ Error ensuring all admins get notifications:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run the script
ensureAllAdminsGetAllNotifications();
