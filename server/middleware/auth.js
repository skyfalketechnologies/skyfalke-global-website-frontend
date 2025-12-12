const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    
    next();
  };
};

const adminAuth = async (req, res, next) => {
  try {
    // Check database connection first
    const connectionState = mongoose.connection.readyState;
    if (connectionState !== 1) {
      const stateMessages = {
        0: 'Database is disconnected',
        2: 'Database is connecting...',
        3: 'Database is disconnecting...'
      };
      const message = stateMessages[connectionState] || 'Database connection not ready';
      
      console.warn(`⚠️  Admin auth: ${message} - Request to ${req.method} ${req.path}`);
      return res.status(503).json({
        success: false,
        message: `${message} Please try again in a moment.`,
        error: 'DATABASE_NOT_READY',
        connectionState: connectionState,
        retryAfter: 2
      });
    }

    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    // Allow both admin and super_admin
    if (user.role !== 'admin' && user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    
    // Check if error is due to database connection
    if (error.name === 'MongoServerError' || error.message?.includes('buffering timed out') || error.message?.includes('connection')) {
      return res.status(503).json({
        success: false,
        message: 'Database connection error. Please try again in a moment.',
        error: 'DATABASE_CONNECTION_ERROR',
        retryAfter: 2
      });
    }
    
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const superAdminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    // Check for super admin role or specific email
    if (user.role !== 'super_admin' && user.email !== 'mronald@skyfalke.com') {
      return res.status(403).json({ 
        message: 'Access denied. Super admin role required.',
        requiredRole: 'super_admin'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Super admin auth error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Helper function to check if user is super admin
const isSuperAdmin = (user) => {
  return user && (user.role === 'super_admin' || user.email === 'mronald@skyfalke.com');
};

module.exports = { auth, adminAuth, superAdminAuth, authenticateToken, requireRole, isSuperAdmin };
