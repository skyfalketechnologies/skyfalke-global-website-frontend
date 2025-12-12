#!/usr/bin/env node

/**
 * Production Monitoring Script
 * Monitors server health and automatically restarts if needed
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class ProductionMonitor {
  constructor() {
    this.serverProcess = null;
    this.restartCount = 0;
    this.maxRestarts = 5;
    this.restartDelay = 5000; // 5 seconds
    this.healthCheckInterval = 30000; // 30 seconds
    this.healthCheckTimeout = 10000; // 10 seconds
    this.logFile = path.join(__dirname, 'monitor.log');
    
    this.startTime = new Date();
    this.lastHealthCheck = null;
    this.consecutiveFailures = 0;
    this.maxConsecutiveFailures = 3;
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    
    console.log(logEntry.trim());
    
    try {
      fs.appendFileSync(this.logFile, logEntry);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  async checkServerHealth() {
    return new Promise((resolve) => {
      const http = require('http');
      
      const options = {
        hostname: 'localhost',
        port: process.env.PORT || 5000,
        path: '/api/health',
        method: 'GET',
        timeout: this.healthCheckTimeout
      };

      const req = http.request(options, (res) => {
        if (res.statusCode === 200) {
          resolve(true);
        } else {
          resolve(false);
        }
      });

      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });

      req.end();
    });
  }

  async performHealthCheck() {
    try {
      const isHealthy = await this.checkServerHealth();
      this.lastHealthCheck = new Date();
      
      if (isHealthy) {
        this.consecutiveFailures = 0;
        this.log('✅ Health check passed');
        return true;
      } else {
        this.consecutiveFailures++;
        this.log(`❌ Health check failed (${this.consecutiveFailures}/${this.maxConsecutiveFailures})`);
        
        if (this.consecutiveFailures >= this.maxConsecutiveFailures) {
          this.log('🚨 Too many consecutive health check failures, restarting server...');
          await this.restartServer();
        }
        return false;
      }
    } catch (error) {
      this.log(`🚨 Health check error: ${error.message}`);
      this.consecutiveFailures++;
      return false;
    }
  }

  async startServer() {
    this.log('🚀 Starting server...');
    
    this.serverProcess = spawn('node', ['start-production-safe.js'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, NODE_ENV: 'production' }
    });

    // Handle server output
    this.serverProcess.stdout.on('data', (data) => {
      this.log(`[SERVER] ${data.toString().trim()}`);
    });

    this.serverProcess.stderr.on('data', (data) => {
      this.log(`[SERVER ERROR] ${data.toString().trim()}`);
    });

    // Handle server exit
    this.serverProcess.on('exit', (code, signal) => {
      this.log(`🚨 Server exited with code ${code}, signal ${signal}`);
      
      if (code !== 0 && this.restartCount < this.maxRestarts) {
        this.log(`🔄 Restarting server (${this.restartCount + 1}/${this.maxRestarts})...`);
        setTimeout(() => this.restartServer(), this.restartDelay);
      } else if (this.restartCount >= this.maxRestarts) {
        this.log('💥 Maximum restart attempts reached, stopping monitor');
        process.exit(1);
      }
    });

    this.serverProcess.on('error', (error) => {
      this.log(`🚨 Server process error: ${error.message}`);
    });

    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Initial health check
    const isHealthy = await this.performHealthCheck();
    if (isHealthy) {
      this.log('✅ Server started successfully');
    } else {
      this.log('⚠️ Server started but health check failed');
    }
  }

  async restartServer() {
    this.restartCount++;
    this.log(`🔄 Restarting server (attempt ${this.restartCount})...`);
    
    if (this.serverProcess) {
      this.serverProcess.kill('SIGTERM');
      
      // Wait for graceful shutdown
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Force kill if still running
      if (!this.serverProcess.killed) {
        this.serverProcess.kill('SIGKILL');
      }
    }
    
    await this.startServer();
  }

  startMonitoring() {
    this.log('🔍 Starting production monitoring...');
    this.log(`📊 Monitor started at: ${this.startTime.toISOString()}`);
    this.log(`⚙️ Health check interval: ${this.healthCheckInterval / 1000}s`);
    this.log(`⚙️ Max restarts: ${this.maxRestarts}`);
    
    // Start the server
    this.startServer();
    
    // Start health check monitoring
    setInterval(async () => {
      await this.performHealthCheck();
    }, this.healthCheckInterval);
  }

  // Graceful shutdown
  shutdown() {
    this.log('🛑 Shutting down monitor...');
    
    if (this.serverProcess) {
      this.serverProcess.kill('SIGTERM');
    }
    
    process.exit(0);
  }
}

// Create and start monitor
const monitor = new ProductionMonitor();

// Handle shutdown signals
process.on('SIGTERM', () => monitor.shutdown());
process.on('SIGINT', () => monitor.shutdown());

// Start monitoring
monitor.startMonitoring();

// Keep the process alive
process.on('uncaughtException', (error) => {
  monitor.log(`🚨 Monitor uncaught exception: ${error.message}`);
  monitor.log(`Stack: ${error.stack}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  monitor.log(`🚨 Monitor unhandled rejection: ${reason}`);
  monitor.log(`Promise: ${promise}`);
});
