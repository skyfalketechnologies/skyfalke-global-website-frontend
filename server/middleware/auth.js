const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

/** Roles allowed to sign in to the unified system dashboard (CMS + Employee Portal) */
const STAFF_ROLES = [
  'super_admin',
  'admin',
  'editor',
  'accounts',
  'hr',
  'employee',
  'finance'
];

const HR_MANAGEMENT_ROLES = ['super_admin', 'admin', 'hr'];

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

/** Accounting & Finance module: super_admin or dedicated accounts role only */
const accountingAuth = async (req, res, next) => {
  try {
    const connectionState = mongoose.connection.readyState;
    if (connectionState !== 1) {
      const stateMessages = {
        0: 'Database is disconnected',
        2: 'Database is connecting...',
        3: 'Database is disconnecting...'
      };
      const message = stateMessages[connectionState] || 'Database connection not ready';
      return res.status(503).json({
        success: false,
        message: `${message} Please try again in a moment.`,
        error: 'DATABASE_NOT_READY',
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

    if (
      user.role !== 'super_admin' &&
      user.role !== 'accounts' &&
      user.role !== 'finance' &&
      user.email !== 'mronald@skyfalke.com'
    ) {
      return res.status(403).json({
        message: 'Access denied. Accounting module is restricted to Super Admin, Finance, and Accounts roles.',
        requiredRoles: ['super_admin', 'accounts', 'finance']
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Accounting auth error:', error);
    if (error.name === 'MongoServerError' || error.message?.includes('buffering timed out')) {
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

// Helper function to check if user is super admin
const isSuperAdmin = (user) => {
  return user && (user.role === 'super_admin' || user.email === 'mronald@skyfalke.com');
};

const isAccountingUser = (user) => {
  return (
    user &&
    (user.role === 'super_admin' ||
      user.role === 'accounts' ||
      user.role === 'finance' ||
      user.email === 'mronald@skyfalke.com')
  );
};

const isStaffRole = (user) =>
  user &&
  (STAFF_ROLES.includes(user.role) || user.email === 'mronald@skyfalke.com');

const isHrManager = (user) =>
  user &&
  (HR_MANAGEMENT_ROLES.includes(user.role) || user.email === 'mronald@skyfalke.com');

/**
 * Any authenticated staff user (JWT). Used for /api/portal and dashboard shell.
 */
const systemDashboardAuth = async (req, res, next) => {
  try {
    const connectionState = mongoose.connection.readyState;
    if (connectionState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database not ready.',
        error: 'DATABASE_NOT_READY'
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

    if (!isStaffRole(user)) {
      return res.status(403).json({
        message: 'Access denied. This account is not enabled for the staff portal.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('systemDashboardAuth error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const hrManagementAuth = async (req, res, next) => {
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

    if (!isHrManager(user)) {
      return res.status(403).json({
        message: 'Access denied. HR or Admin role required.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('hrManagementAuth error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

/** Projects & tasks API: all staff roles */
const staffProjectsAuth = async (req, res, next) => {
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

    if (!isStaffRole(user)) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('staffProjectsAuth error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = {
  auth,
  adminAuth,
  superAdminAuth,
  accountingAuth,
  authenticateToken,
  requireRole,
  isSuperAdmin,
  isAccountingUser,
  isStaffRole,
  isHrManager,
  systemDashboardAuth,
  hrManagementAuth,
  staffProjectsAuth,
  STAFF_ROLES,
  HR_MANAGEMENT_ROLES
};
