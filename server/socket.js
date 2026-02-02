const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Notification = require('./models/Notification');

let io;

const initializeSocket = (server) => {
  try {
    io = socketIo(server, {
      cors: {
        origin: process.env.CORS_ORIGIN ? 
          process.env.CORS_ORIGIN.split(',') : 
          ["http://localhost:3000", "https://skyfalke.com", "https://www.skyfalke.com"],
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling'],
      allowEIO3: true,
      pingTimeout: 60000,
      pingInterval: 25000,
      maxHttpBufferSize: 1e6, // 1MB
      allowEIO3: true
    });

    // Handle socket.io errors
    io.on('error', (err) => {
      console.error('🚨 Socket.io error:', err);
    });

    console.log('✅ Socket.io server initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Socket.io:', error);
    throw error;
  }

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      // Authentication attempt logged
      
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization;
      
      if (!token) {
        console.error('No token provided in socket handshake');
        return next(new Error('Authentication error: No token provided'));
      }

      // Token verification in progress
      const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
      // User lookup in progress
      
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        console.error('User not found for token');
        return next(new Error('Authentication error: User not found'));
      }

      if (user.role !== 'admin' && user.role !== 'super_admin') {
        console.error('User is not admin or super admin:', user.role);
        return next(new Error('Authentication error: Admin access required'));
      }

      // Socket authentication successful
      socket.userId = user._id;
      socket.user = user;
      next();
    } catch (error) {
      console.error('Socket authentication error:', error.message);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    // Admin user connected
    
    // Join admin room
    socket.join('admin');
    socket.join(`admin-${socket.userId}`);

    // Send initial unread count
    sendUnreadCount(socket.userId);

    // Handle notification read
    socket.on('mark-notification-read', async (data) => {
      try {
        const { notificationId } = data;
        await Notification.findByIdAndUpdate(notificationId, { read: true });
        sendUnreadCount(socket.userId);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    });

    // Handle mark all as read
    socket.on('mark-all-read', async () => {
      try {
        await Notification.markAsRead(socket.userId);
        sendUnreadCount(socket.userId);
      } catch (error) {
        console.error('Error marking all notifications as read:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      // Admin user disconnected
    });
  });

  return io;
};

// Function to send notification to specific admin
const sendNotificationToAdmin = async (adminId, notificationData) => {
  try {
    if (!io) {
      console.error('Socket.io not initialized');
      return null;
    }

    const notification = await Notification.createNotification({
      ...notificationData,
      recipient: adminId
    });

    const populatedNotification = await notification.populate('recipient', 'name email');

    io.to(`admin-${adminId}`).emit('new-notification', {
      notification: populatedNotification,
      unreadCount: await Notification.getUnreadCount(adminId)
    });

    return notification;
  } catch (error) {
    console.error('Error sending notification to admin:', error);
    throw error;
  }
};

// Function to send notification to all admins
const sendNotificationToAllAdmins = async (notificationData) => {
  try {
    const admins = await User.find({ role: { $in: ['admin', 'super_admin'] } }).select('_id');
    const notifications = [];
    const isContactNotification = notificationData.category === 'contact' || notificationData.type === 'contact';

    for (const admin of admins) {
      // Always create notification in database, even if socket.io isn't initialized
      const notification = await Notification.createNotification({
        ...notificationData,
        recipient: admin._id,
        read: false // Ensure notifications are always unread by default
      });

      const populatedNotification = await notification.populate('recipient', 'name email');
      notifications.push(populatedNotification);

      // Send via socket if available
      if (io) {
        const unreadCount = await Notification.getUnreadCount(admin._id);
        
        // Emit to specific admin room
        io.to(`admin-${admin._id}`).emit('new-notification', {
          notification: populatedNotification,
          unreadCount: unreadCount
        });
      }
    }

    // Broadcast contact notifications to general admin room once (for real-time updates)
    if (io && isContactNotification && notifications.length > 0) {
      io.to('admin').emit('contact-enquiry', {
        message: notificationData.message,
        title: notificationData.title,
        contactId: notificationData.data?.contactId,
        timestamp: new Date()
      });
    }

    return notifications;
  } catch (error) {
    console.error('Error sending notification to all admins:', error);
    // Don't throw error - log it but allow the request to continue
    // This ensures notifications are created even if there's a socket issue
    return [];
  }
};

// Function to send unread count to specific admin
const sendUnreadCount = async (adminId) => {
  try {
    if (!io) {
      console.error('Socket.io not initialized');
      return;
    }

    const unreadCount = await Notification.getUnreadCount(adminId);
    io.to(`admin-${adminId}`).emit('unread-count', { unreadCount });
  } catch (error) {
    console.error('Error sending unread count:', error);
  }
};

// Function to broadcast system message to all admins
const broadcastSystemMessage = (message, type = 'info') => {
  if (!io) {
    console.error('Socket.io not initialized');
    return;
  }
  io.to('admin').emit('system-message', { message, type });
};

// Function to send notification to project members
const sendNotificationToProjectMembers = async (project, notificationData, excludeUserId = null) => {
  try {
    if (!io) {
      console.error('Socket.io not initialized');
      return [];
    }

    const notifications = [];
    const memberIds = [];

    // Add owner if not excluded
    if (!excludeUserId || project.owner.toString() !== excludeUserId.toString()) {
      memberIds.push(project.owner);
    }

    // Add all members if not excluded
    if (project.members && project.members.length > 0) {
      for (const member of project.members) {
        const memberId = member.user?.toString() || member.user;
        if (!excludeUserId || memberId !== excludeUserId.toString()) {
          memberIds.push(memberId);
        }
      }
    }

    // Remove duplicates
    const uniqueMemberIds = [...new Set(memberIds.map(id => id.toString()))];

    for (const memberId of uniqueMemberIds) {
      try {
        const notification = await Notification.createNotification({
          ...notificationData,
          recipient: memberId
        });

        const populatedNotification = await notification.populate('recipient', 'name email');
        notifications.push(populatedNotification);

        // Send to specific admin/user
        io.to(`admin-${memberId}`).emit('new-notification', {
          notification: populatedNotification,
          unreadCount: await Notification.getUnreadCount(memberId)
        });
      } catch (error) {
        console.error(`Error sending notification to member ${memberId}:`, error);
      }
    }

    return notifications;
  } catch (error) {
    console.error('Error sending notification to project members:', error);
    return [];
  }
};

module.exports = {
  initializeSocket,
  sendNotificationToAdmin,
  sendNotificationToAllAdmins,
  sendNotificationToProjectMembers,
  sendUnreadCount,
  broadcastSystemMessage,
  getIO: () => io // Export getter function to safely access io instance
};
