const mongoose = require('mongoose');
const WasteReport = require('../src/models/WasteReport');
const User = require('../src/models/User');
const Notification = require('../src/models/Notification');

async function generateMissingNotifications() {
  try {
    console.log('=== GENERATING MISSING NOTIFICATIONS ===');
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/cleantrack');
    console.log('✅ Connected to MongoDB');

    // Get all reports
    const allReports = await WasteReport.find().populate('reportedBy', 'name');
    console.log(`Found ${allReports.length} total reports`);

    // Get all admins and officials
    const adminsAndOfficials = await User.find({ 
      role: { $in: ['ADMIN', 'BARANGAY_OFFICIAL', 'WASTE_MANAGEMENT'] }
    });
    console.log(`Found ${adminsAndOfficials.length} admins and officials`);

    if (adminsAndOfficials.length === 0) {
      console.log('❌ No admins or officials found');
      return;
    }

    let notificationsCreated = 0;
    let reportsProcessed = 0;

    // Process each report
    for (const report of allReports) {
      console.log(`\n--- Processing report: ${report.title} ---`);
      console.log(`Report ID: ${report._id}`);
      console.log(`Submitted by: ${report.reportedBy?.name || 'Anonymous'}`);
      console.log(`Status: ${report.status}`);
      console.log(`Created: ${report.createdAt}`);

      // Check if notifications already exist for this report
      const existingNotifications = await Notification.find({ reportId: report._id });
      console.log(`Existing notifications for this report: ${existingNotifications.length}`);

      if (existingNotifications.length > 0) {
        console.log('⏭️  Skipping - notifications already exist');
        reportsProcessed++;
        continue;
      }

      // Create notifications for admins and officials
      const reporterName = report.reportedBy?.name || 'Anonymous';
      const adminNotificationMessage = `New waste report "${report.title}" submitted by ${reporterName} in ${report.location?.barangay || 'your area'}. Please review and take action.`;

      const adminNotifications = adminsAndOfficials.map(admin => ({
        userId: admin._id,
        title: 'New Report Submitted',
        message: adminNotificationMessage,
        type: 'NEW_REPORT',
        reportId: report._id,
        createdAt: report.createdAt // Use original report creation time
      }));

      // Insert notifications
      const result = await Notification.insertMany(adminNotifications);
      console.log(`✅ Created ${result.length} notifications for admins/officials`);
      
      // Create notification for the reporter (if they exist)
      if (report.reportedBy) {
        await Notification.create({
          userId: report.reportedBy._id,
          title: 'Report Submitted Successfully',
          message: `Your waste report "${report.title}" has been submitted successfully.`,
          type: 'NEW_REPORT',
          reportId: report._id,
          createdAt: report.createdAt
        });
        console.log('✅ Created notification for reporter');
      }

      notificationsCreated += result.length;
      if (report.reportedBy) notificationsCreated += 1;
      reportsProcessed++;

      console.log(`📊 Total notifications created so far: ${notificationsCreated}`);
    }

    console.log(`\n=== SUMMARY ===`);
    console.log(`Total reports processed: ${reportsProcessed}`);
    console.log(`Total notifications created: ${notificationsCreated}`);
    console.log(`Admins/Officials notified: ${adminsAndOfficials.length}`);
    console.log('✅ Missing notifications generation complete!');

  } catch (error) {
    console.error('❌ Error generating missing notifications:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run the script
generateMissingNotifications();
