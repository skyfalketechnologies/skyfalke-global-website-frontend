#!/usr/bin/env node

/**
 * Production-safe server startup script
 * Includes comprehensive error handling and monitoring
 */

// Set production environment
process.env.NODE_ENV = 'production';

// Memory monitoring
const startMemory = process.memoryUsage();
console.log('🚀 Starting Skyfalke Backend Server...');
console.log('📊 Initial Memory Usage:', {
  rss: Math.round(startMemory.rss / 1024 / 1024) + ' MB',
  heapUsed: Math.round(startMemory.heapUsed / 1024 / 1024) + ' MB',
  heapTotal: Math.round(startMemory.heapTotal / 1024 / 1024) + ' MB'
});

// Enhanced error handling for production
process.on('uncaughtException', (err) => {
  console.error('🚨 CRITICAL: Uncaught Exception in production:', err);
  console.error('Stack:', err.stack);
  
  // Log to file if possible
  const fs = require('fs');
  const logEntry = `[${new Date().toISOString()}] UNCAUGHT EXCEPTION: ${err.message}\nStack: ${err.stack}\n\n`;
  
  try {
    fs.appendFileSync('error.log', logEntry);
  } catch (logError) {
    console.error('Failed to write to error log:', logError);
  }
  
  // Graceful shutdown
  setTimeout(() => {
    console.error('⚠️ Forcing process exit due to uncaught exception');
    process.exit(1);
  }, 5000);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection in production:', reason);
  console.error('Promise:', promise);
  
  // Log to file
  const fs = require('fs');
  const logEntry = `[${new Date().toISOString()}] UNHANDLED REJECTION: ${reason}\nPromise: ${promise}\n\n`;
  
  try {
    fs.appendFileSync('error.log', logEntry);
  } catch (logError) {
    console.error('Failed to write to error log:', logError);
  }
});

// Memory leak detection
setInterval(() => {
  const memUsage = process.memoryUsage();
  const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
  
  // Alert if memory usage exceeds 500MB
  if (heapUsedMB > 500) {
    console.warn(`⚠️ High memory usage detected: ${heapUsedMB}MB`);
  }
  
  // Alert if memory usage exceeds 1GB
  if (heapUsedMB > 1000) {
    console.error(`🚨 CRITICAL: Memory usage too high: ${heapUsedMB}MB`);
    console.error('Consider restarting the server to prevent crashes');
  }
}, 30000); // Check every 30 seconds

// Graceful shutdown handler
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
  console.log('⏰ Shutdown initiated at:', new Date().toISOString());
  
  // Close server
  if (global.server) {
    global.server.close(() => {
      console.log('✅ HTTP server closed');
      
      // Close database connection
      const mongoose = require('mongoose');
      mongoose.connection.close(false, () => {
        console.log('✅ MongoDB connection closed');
        console.log('✅ Graceful shutdown completed');
        process.exit(0);
      });
    });
  } else {
    console.log('⚠️ No server instance found, exiting immediately');
    process.exit(0);
  }
  
  // Force exit after 15 seconds
  setTimeout(() => {
    console.error('⚠️ Forced shutdown after timeout');
    process.exit(1);
  }, 15000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start the server
try {
  console.log('📦 Loading server modules...');
  require('./index.js');
  console.log('✅ Server startup completed successfully');
} catch (error) {
  console.error('❌ Failed to start server:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
}
