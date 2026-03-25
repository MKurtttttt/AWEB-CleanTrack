// Direct MongoDB connection test without require
const { MongoClient } = require('mongodb');

async function testDirectConnection() {
  console.log('=== TESTING DIRECT MONGODB CONNECTION ===');
  
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    console.log('✅ Direct MongoDB connection successful!');
    console.log('Connected to database:', client.db().databaseName);
    
    // Test a simple query
    const db = client.db();
    const collections = await db.collections();
    console.log('Available collections:', Object.keys(collections));
    
    if (collections.users) {
      const userCount = await collections.users.countDocuments();
      console.log(`Users collection count: ${userCount}`);
      
      const pedro = await collections.users.findOne({ email: 'pedro@email.com' });
      if (pedro) {
        console.log('✅ Found Pedro in database');
        console.log('Pedro ID:', pedro._id);
        console.log('Pedro role:', pedro.role);
      } else {
        console.log('❌ Pedro not found in database');
      }
    }
    
    if (collections.notifications) {
      const notificationCount = await collections.notifications.countDocuments();
      console.log(`Notifications collection count: ${notificationCount}`);
      
      // Check for Kurt's notifications
      const kurtNotifications = await collections.notifications.find({ userId: pedro._id }).sort({ createdAt: -1 }).limit(5);
      console.log(`Kurt has ${kurtNotifications.length} notifications`);
      
      if (kurtNotifications.length > 0) {
        console.log('Kurt\'s recent notifications:');
        kurtNotifications.forEach((notif, index) => {
          console.log(`  ${index + 1}. ${notif.title} - ${notif.message}`);
        });
      }
    } else {
        console.log('Kurt has no notifications');
      }
    }
    
    await client.close();
    console.log('✅ Direct MongoDB connection closed');
    
  } catch (error) {
    console.error('❌ Direct MongoDB connection error:', error);
  }
}
}
}

testDirectConnection();
