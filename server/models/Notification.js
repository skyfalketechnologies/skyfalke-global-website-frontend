const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error', 'contact', 'order', 'blog', 'application', 'project', 'portal'],
    default: 'info'
  },
  category: {
    type: String,
    enum: ['contact', 'order', 'blog', 'application', 'system', 'user', 'project', 'portal'],
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  actionUrl: {
    type: String,
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Index for efficient queries
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });
notificationSchema.index({ category: 1, createdAt: -1 });

// Static method to create notification
notificationSchema.statics.createNotification = async function(notificationData) {
  try {
    const notification = new this(notificationData);
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Static method to get unread notifications count
notificationSchema.statics.getUnreadCount = async function(userId) {
  try {
    return await this.countDocuments({ recipient: userId, read: false });
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
};

// Static method to mark notifications as read
notificationSchema.statics.markAsRead = async function(userId, notificationIds = null) {
  try {
    const query = { recipient: userId };
    if (notificationIds) {
      query._id = { $in: notificationIds };
    }
    
    return await this.updateMany(query, { read: true });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    throw error;
  }
};

// Instance method to mark as read
notificationSchema.methods.markAsRead = async function() {
  this.read = true;
  return await this.save();
};

module.exports = mongoose.model('Notification', notificationSchema);
