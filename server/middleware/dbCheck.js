const mongoose = require('mongoose');

/**
 * Middleware to check if MongoDB is connected before processing requests
 * Returns 503 Service Unavailable if database is not ready
 */
const dbCheck = (req, res, next) => {
  // Check connection state
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const connectionState = mongoose.connection.readyState;
  
  if (connectionState !== 1) {
    const stateMessages = {
      0: 'Database is disconnected',
      2: 'Database is connecting...',
      3: 'Database is disconnecting...'
    };
    
    const message = stateMessages[connectionState] || 'Database connection not ready';
    
    // Log the connection state for debugging
    if (connectionState === 0) {
      console.warn(`⚠️  Database check failed: ${message} - Request to ${req.method} ${req.path}`);
    }
    
    return res.status(503).json({
      success: false,
      message: `${message} Please try again in a moment.`,
      error: 'DATABASE_NOT_READY',
      connectionState: connectionState,
      retryAfter: 2 // Suggest retrying after 2 seconds
    });
  }
  next();
};

module.exports = dbCheck;

