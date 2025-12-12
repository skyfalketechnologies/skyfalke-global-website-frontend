#!/usr/bin/env node

/**
 * Enhanced Health Check Script for Production
 * Comprehensive monitoring of all server components
 */

const http = require('http');
const mongoose = require('mongoose');

const HEALTH_CHECK_CONFIG = {
  timeout: 10000,
  port: process.env.PORT || 5000,
  host: process.env.HEALTH_CHECK_HOST || 'localhost'
};

class HealthChecker {
  constructor() {
    this.checks = [];
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0
    };
  }

  addCheck(name, checkFunction) {
    this.checks.push({ name, checkFunction });
  }

  async runAllChecks() {
    console.log('🏥 Starting Enhanced Health Check...');
    console.log(`📍 Target: ${HEALTH_CHECK_CONFIG.host}:${HEALTH_CHECK_CONFIG.port}`);
    console.log('⏰ Started at:', new Date().toISOString());
    console.log('─'.repeat(60));

    for (const check of this.checks) {
      try {
        console.log(`\n🔍 Testing ${check.name}...`);
        const result = await check.checkFunction();
        
        if (result.status === 'pass') {
          console.log(`✅ ${check.name}: PASSED`);
          if (result.message) console.log(`   ${result.message}`);
          this.results.passed++;
        } else if (result.status === 'warn') {
          console.log(`⚠️ ${check.name}: WARNING`);
          if (result.message) console.log(`   ${result.message}`);
          this.results.warnings++;
        } else {
          console.log(`❌ ${check.name}: FAILED`);
          if (result.message) console.log(`   ${result.message}`);
          this.results.failed++;
        }
      } catch (error) {
        console.log(`❌ ${check.name}: ERROR`);
        console.log(`   Error: ${error.message}`);
        this.results.failed++;
      }
    }

    this.printSummary();
    return this.results.failed === 0;
  }

  printSummary() {
    console.log('\n' + '─'.repeat(60));
    console.log('📊 Health Check Summary:');
    console.log(`   ✅ Passed: ${this.results.passed}`);
    console.log(`   ⚠️ Warnings: ${this.results.warnings}`);
    console.log(`   ❌ Failed: ${this.results.failed}`);
    
    const total = this.results.passed + this.results.warnings + this.results.failed;
    const successRate = total > 0 ? ((this.results.passed / total) * 100).toFixed(1) : 0;
    console.log(`   📈 Success Rate: ${successRate}%`);
    
    if (this.results.failed === 0) {
      console.log('\n🎉 All critical health checks passed!');
    } else {
      console.log('\n💥 Some health checks failed!');
    }
  }
}

// Health check functions
const healthChecks = {
  // HTTP Server Check
  async httpServer() {
    return new Promise((resolve) => {
      const options = {
        hostname: HEALTH_CHECK_CONFIG.host,
        port: HEALTH_CHECK_CONFIG.port,
        path: '/api/health',
        method: 'GET',
        timeout: 5000
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (res.statusCode === 200 && response.status === 'OK') {
              resolve({
                status: 'pass',
                message: `Server responding (${res.statusCode}) - Uptime: ${Math.round(response.uptime)}s`
              });
            } else {
              resolve({
                status: 'fail',
                message: `Unexpected response: ${res.statusCode}`
              });
            }
          } catch (error) {
            resolve({
              status: 'fail',
              message: `Invalid JSON response: ${error.message}`
            });
          }
        });
      });

      req.on('error', (err) => {
        resolve({
          status: 'fail',
          message: `Connection failed: ${err.message}`
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          status: 'fail',
          message: 'Request timeout'
        });
      });

      req.end();
    });
  },

  // WebSocket Check
  async webSocket() {
    return new Promise((resolve) => {
      const options = {
        hostname: HEALTH_CHECK_CONFIG.host,
        port: HEALTH_CHECK_CONFIG.port,
        path: '/api/ws-test',
        method: 'GET',
        timeout: 5000
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (res.statusCode === 200 && response.socketInitialized) {
              resolve({
                status: 'pass',
                message: 'WebSocket server initialized'
              });
            } else {
              resolve({
                status: 'warn',
                message: 'WebSocket not initialized'
              });
            }
          } catch (error) {
            resolve({
              status: 'fail',
              message: `Invalid response: ${error.message}`
            });
          }
        });
      });

      req.on('error', (err) => {
        resolve({
          status: 'fail',
          message: `Connection failed: ${err.message}`
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          status: 'fail',
          message: 'Request timeout'
        });
      });

      req.end();
    });
  },

  // Memory Usage Check
  async memoryUsage() {
    const memUsage = process.memoryUsage();
    const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
    const rssMB = Math.round(memUsage.rss / 1024 / 1024);

    if (heapUsedMB > 1000) {
      return {
        status: 'fail',
        message: `High memory usage: ${heapUsedMB}MB heap, ${rssMB}MB RSS`
      };
    } else if (heapUsedMB > 500) {
      return {
        status: 'warn',
        message: `Moderate memory usage: ${heapUsedMB}MB heap, ${rssMB}MB RSS`
      };
    } else {
      return {
        status: 'pass',
        message: `Memory usage normal: ${heapUsedMB}MB heap, ${rssMB}MB RSS`
      };
    }
  },

  // Database Connection Check
  async databaseConnection() {
    try {
      if (mongoose.connection.readyState === 1) {
        return {
          status: 'pass',
          message: 'Database connected successfully'
        };
      } else if (mongoose.connection.readyState === 2) {
        return {
          status: 'warn',
          message: 'Database connecting...'
        };
      } else {
        return {
          status: 'fail',
          message: `Database disconnected (state: ${mongoose.connection.readyState})`
        };
      }
    } catch (error) {
      return {
        status: 'fail',
        message: `Database error: ${error.message}`
      };
    }
  }
};

// Main execution
async function main() {
  const checker = new HealthChecker();
  
  // Add all health checks
  checker.addCheck('HTTP Server', healthChecks.httpServer);
  checker.addCheck('WebSocket Server', healthChecks.webSocket);
  checker.addCheck('Memory Usage', healthChecks.memoryUsage);
  checker.addCheck('Database Connection', healthChecks.databaseConnection);
  
  // Run all checks
  const success = await checker.runAllChecks();
  
  // Exit with appropriate code
  process.exit(success ? 0 : 1);
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Enhanced Health Check for Skyfalke Backend

Usage: node health-check-enhanced.js [options]

Options:
  --help, -h     Show this help message
  --host HOST    Set hostname (default: localhost)
  --port PORT    Set port (default: 5000)

Environment Variables:
  HEALTH_CHECK_HOST    Override hostname
  PORT                 Override port number
`);
  process.exit(0);
}

// Parse command line arguments
if (process.argv.includes('--host')) {
  const hostIndex = process.argv.indexOf('--host');
  if (hostIndex + 1 < process.argv.length) {
    HEALTH_CHECK_CONFIG.host = process.argv[hostIndex + 1];
  }
}

if (process.argv.includes('--port')) {
  const portIndex = process.argv.indexOf('--port');
  if (portIndex + 1 < process.argv.length) {
    HEALTH_CHECK_CONFIG.port = parseInt(process.argv[portIndex + 1]);
  }
}

// Run the health check
main().catch(error => {
  console.error('🚨 Health check failed:', error);
  process.exit(1);
});
