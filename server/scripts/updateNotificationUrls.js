const mongoose = require('mongoose');
require('dotenv').config();

const updateNotificationUrls = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skyfalke');
    console.log('Connected to MongoDB');

    const Notification = require('../models/Notification');

    // Update contact notification URLs
    const contactResult = await Notification.updateMany(
      { 
        actionUrl: { $regex: '^/admin/contacts/' },
        category: 'contact'
      },
      [
        {
          $set: {
            actionUrl: {
              $replaceAll: {
                input: '$actionUrl',
                find: '/admin/contacts/',
                replacement: '/system/dashboard/contacts/'
              }
            }
          }
        }
      ]
    );
    console.log(`Updated ${contactResult.modifiedCount} contact notification URLs`);

    // Update application notification URLs
    const applicationResult = await Notification.updateMany(
      { 
        actionUrl: { $regex: '^/admin/applications/' },
        category: 'application'
      },
      [
        {
          $set: {
            actionUrl: {
              $replaceAll: {
                input: '$actionUrl',
                find: '/admin/applications/',
                replacement: '/system/dashboard/applications/'
              }
            }
          }
        }
      ]
    );
    console.log(`Updated ${applicationResult.modifiedCount} application notification URLs`);

    // Update order notification URLs
    const orderResult = await Notification.updateMany(
      { 
        actionUrl: { $regex: '^/admin/orders/' },
        category: 'order'
      },
      [
        {
          $set: {
            actionUrl: {
              $replaceAll: {
                input: '$actionUrl',
                find: '/admin/orders/',
                replacement: '/system/dashboard/orders/'
              }
            }
          }
        }
      ]
    );
    console.log(`Updated ${orderResult.modifiedCount} order notification URLs`);

    // Update general admin notification URLs
    const generalResult = await Notification.updateMany(
      { 
        actionUrl: { $regex: '^/admin/notifications' }
      },
      [
        {
          $set: {
            actionUrl: {
              $replaceAll: {
                input: '$actionUrl',
                find: '/admin/notifications',
                replacement: '/system/dashboard/notifications'
              }
            }
          }
        }
      ]
    );
    console.log(`Updated ${generalResult.modifiedCount} general notification URLs`);

    // Show summary
    const totalUpdated = contactResult.modifiedCount + applicationResult.modifiedCount + orderResult.modifiedCount + generalResult.modifiedCount;
    console.log(`\n✅ Successfully updated ${totalUpdated} notification URLs`);
    
    // Show some examples of updated notifications
    const sampleNotifications = await Notification.find({
      actionUrl: { $regex: '^/system/dashboard/' }
    }).limit(5).select('title actionUrl category');
    
    console.log('\n📋 Sample updated notifications:');
    sampleNotifications.forEach(notification => {
      console.log(`- ${notification.title}: ${notification.actionUrl}`);
    });

  } catch (error) {
    console.error('Error updating notification URLs:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
};

// Run the script
updateNotificationUrls();
