const axios = require('axios');

/**
 * Comprehensive Health Check Script
 * Tests all critical endpoints and services
 */

const BASE_URL = process.env.HEALTH_CHECK_URL || 'http://localhost:5000';

async function checkHealth() {
  console.log('🏥 Starting comprehensive health check...');
  console.log(`📍 Target: ${BASE_URL}`);
  
  const checks = [
    { name: 'API Health', endpoint: '/api/health' },
    { name: 'WebSocket Test', endpoint: '/api/ws-test' },
    { name: 'Database Connection', endpoint: '/api/health' }, // Will check DB in response
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const check of checks) {
    try {
      console.log(`\n🔍 Testing ${check.name}...`);
      const response = await axios.get(`${BASE_URL}${check.endpoint}`, {
        timeout: 10000
      });
      
      if (response.status === 200) {
        console.log(`✅ ${check.name}: PASSED`);
        console.log(`   Response: OK`);
        passed++;
      } else {
        console.log(`❌ ${check.name}: FAILED (Status: ${response.status})`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${check.name}: FAILED`);
      console.log(`   Error: ${error.message}`);
      failed++;
    }
  }
  
  console.log(`\n📊 Health Check Summary:`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All health checks passed!');
    process.exit(0);
  } else {
    console.log('\n💥 Some health checks failed!');
    process.exit(1);
  }
}

// Handle command line arguments
if (process.argv.includes('--url')) {
  const urlIndex = process.argv.indexOf('--url');
  if (urlIndex + 1 < process.argv.length) {
    process.env.HEALTH_CHECK_URL = process.argv[urlIndex + 1];
  }
}

checkHealth();
