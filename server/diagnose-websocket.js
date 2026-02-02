#!/usr/bin/env node

/**
 * WebSocket Connection Diagnostic Tool
 * 
 * This script helps diagnose 503 and WebSocket connection issues
 * Run: node diagnose-websocket.js
 */

const https = require('https');
const http = require('http');
const mongoose = require('mongoose');
require('dotenv').config();

const API_URL = process.env.API_BASE_URL || 'https://apis.mwangikinyanjuiadvocates.com';
const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔍 WebSocket Connection Diagnostic Tool\n');
console.log('='.repeat(60));

// Test 1: Check server health endpoint
async function testHealthEndpoint() {
  return new Promise((resolve, reject) => {
    console.log('\n1️⃣  Testing Health Endpoint...');
    const url = new URL(`${API_URL}/api/health`);
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: 'GET',
      rejectUnauthorized: false // For testing only
    };

    const protocol = url.protocol === 'https:' ? https : http;
    const req = protocol.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('   ✅ Health endpoint is responding');
          try {
            const health = JSON.parse(data);
            console.log('   📊 Status:', health.status);
            console.log('   ⏰ Uptime:', Math.floor(health.uptime || 0), 'seconds');
            console.log('   🌍 Environment:', health.environment);
            resolve({ success: true, data: health });
          } catch (e) {
            console.log('   ⚠️  Response is not JSON:', data.substring(0, 100));
            resolve({ success: true, data });
          }
        } else {
          console.log(`   ❌ Health endpoint returned ${res.statusCode}`);
          console.log('   📄 Response:', data.substring(0, 200));
          resolve({ success: false, statusCode: res.statusCode, data });
        }
      });
    });

    req.on('error', (error) => {
      console.log('   ❌ Connection error:', error.message);
      resolve({ success: false, error: error.message });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      console.log('   ❌ Request timeout (10s)');
      resolve({ success: false, error: 'Timeout' });
    });

    req.end();
  });
}

// Test 2: Check WebSocket test endpoint
async function testWebSocketEndpoint() {
  return new Promise((resolve, reject) => {
    console.log('\n2️⃣  Testing WebSocket Endpoint...');
    const url = new URL(`${API_URL}/api/ws-test`);
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: 'GET',
      rejectUnauthorized: false
    };

    const protocol = url.protocol === 'https:' ? https : http;
    const req = protocol.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('   ✅ WebSocket endpoint is responding');
          try {
            const wsTest = JSON.parse(data);
            console.log('   📊 Message:', wsTest.message);
            console.log('   🔌 Socket Initialized:', wsTest.socketInitialized ? '✅ Yes' : '❌ No');
            if (wsTest.connectedClients !== undefined) {
              console.log('   👥 Connected Clients:', wsTest.connectedClients);
            }
            resolve({ success: true, socketInitialized: wsTest.socketInitialized });
          } catch (e) {
            console.log('   ⚠️  Response is not JSON:', data.substring(0, 100));
            resolve({ success: true });
          }
        } else {
          console.log(`   ❌ WebSocket endpoint returned ${res.statusCode}`);
          console.log('   📄 Response:', data.substring(0, 200));
          resolve({ success: false, statusCode: res.statusCode });
        }
      });
    });

    req.on('error', (error) => {
      console.log('   ❌ Connection error:', error.message);
      resolve({ success: false, error: error.message });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      console.log('   ❌ Request timeout (10s)');
      resolve({ success: false, error: 'Timeout' });
    });

    req.end();
  });
}

// Test 3: Check MongoDB connection (if URI is available)
async function testMongoDBConnection() {
  return new Promise((resolve) => {
    console.log('\n3️⃣  Testing MongoDB Connection...');
    
    if (!MONGODB_URI) {
      console.log('   ⚠️  MONGODB_URI not set in environment');
      resolve({ success: false, error: 'MONGODB_URI not set' });
      return;
    }

    // Mask password in URI for logging
    const maskedUri = MONGODB_URI.replace(/:([^:@]+)@/, ':****@');
    console.log('   🔗 Connecting to:', maskedUri);

    mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000
    })
    .then(() => {
      console.log('   ✅ MongoDB connection successful');
      console.log('   📊 Database:', mongoose.connection.name);
      console.log('   🖥️  Host:', mongoose.connection.host);
      console.log('   🔌 Ready State:', mongoose.connection.readyState === 1 ? 'Connected' : 'Not Connected');
      mongoose.connection.close();
      resolve({ success: true });
    })
    .catch((error) => {
      console.log('   ❌ MongoDB connection failed');
      console.log('   📄 Error:', error.message);
      if (error.code === 'ETIMEOUT') {
        console.log('   💡 Tip: Check network connectivity and MongoDB server status');
      } else if (error.message.includes('authentication')) {
        console.log('   💡 Tip: Check MongoDB username and password');
      }
      resolve({ success: false, error: error.message });
    });
  });
}

// Test 4: Check Socket.IO handshake
async function testSocketIOHandshake() {
  return new Promise((resolve) => {
    console.log('\n4️⃣  Testing Socket.IO Handshake...');
    const url = new URL(`${API_URL}/socket.io/?EIO=4&transport=polling`);
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'User-Agent': 'Node.js Diagnostic Tool'
      },
      rejectUnauthorized: false
    };

    const protocol = url.protocol === 'https:' ? https : http;
    const req = protocol.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('   ✅ Socket.IO handshake successful');
          console.log('   📊 Response length:', data.length, 'bytes');
          try {
            // Socket.IO handshake returns JSON in format: 0{"sid":"...","upgrades":[...]}
            if (data.startsWith('0')) {
              const json = JSON.parse(data.substring(1));
              console.log('   🔌 Session ID:', json.sid);
              console.log('   ⬆️  Upgrades available:', json.upgrades.join(', '));
              resolve({ success: true, sid: json.sid });
            } else {
              console.log('   ⚠️  Unexpected response format');
              resolve({ success: true });
            }
          } catch (e) {
            console.log('   ⚠️  Could not parse handshake response');
            resolve({ success: true });
          }
        } else if (res.statusCode === 503) {
          console.log('   ❌ Socket.IO returned 503 Service Unavailable');
          console.log('   💡 This usually means the database is not connected');
          resolve({ success: false, statusCode: 503 });
        } else {
          console.log(`   ❌ Socket.IO handshake returned ${res.statusCode}`);
          console.log('   📄 Response:', data.substring(0, 200));
          resolve({ success: false, statusCode: res.statusCode });
        }
      });
    });

    req.on('error', (error) => {
      console.log('   ❌ Connection error:', error.message);
      resolve({ success: false, error: error.message });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      console.log('   ❌ Request timeout (10s)');
      resolve({ success: false, error: 'Timeout' });
    });

    req.end();
  });
}

// Test 5: Check environment variables
function checkEnvironmentVariables() {
  console.log('\n5️⃣  Checking Environment Variables...');
  const required = ['MONGODB_URI', 'JWT_SECRET'];
  const optional = ['CORS_ORIGIN', 'NODE_ENV', 'PORT'];
  
  let allGood = true;
  
  required.forEach(key => {
    if (process.env[key]) {
      console.log(`   ✅ ${key}: Set`);
    } else {
      console.log(`   ❌ ${key}: Not set (REQUIRED)`);
      allGood = false;
    }
  });
  
  optional.forEach(key => {
    if (process.env[key]) {
      console.log(`   ✅ ${key}: ${process.env[key]}`);
    } else {
      console.log(`   ⚠️  ${key}: Not set (optional)`);
    }
  });
  
  return { success: allGood };
}

// Main diagnostic function
async function runDiagnostics() {
  const results = {
    health: null,
    websocket: null,
    mongodb: null,
    socketio: null,
    environment: null
  };

  // Run all tests
  results.health = await testHealthEndpoint();
  results.websocket = await testWebSocketEndpoint();
  results.mongodb = await testMongoDBConnection();
  results.socketio = await testSocketIOHandshake();
  results.environment = checkEnvironmentVariables();

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📋 DIAGNOSTIC SUMMARY');
  console.log('='.repeat(60));

  const tests = [
    { name: 'Health Endpoint', result: results.health },
    { name: 'WebSocket Endpoint', result: results.websocket },
    { name: 'MongoDB Connection', result: results.mongodb },
    { name: 'Socket.IO Handshake', result: results.socketio },
    { name: 'Environment Variables', result: results.environment }
  ];

  tests.forEach(test => {
    const status = test.result?.success ? '✅' : '❌';
    console.log(`${status} ${test.name}`);
  });

  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  
  if (!results.health?.success) {
    console.log('   • Server is not responding - check if server is running');
    console.log('   • Check server logs for errors');
    console.log('   • Verify server is accessible at:', API_URL);
  }
  
  if (!results.mongodb?.success) {
    console.log('   • MongoDB connection failed - this is likely causing 503 errors');
    console.log('   • Check MongoDB service status');
    console.log('   • Verify MONGODB_URI is correct');
    console.log('   • Check network connectivity to MongoDB server');
  }
  
  if (!results.websocket?.success || !results.websocket?.socketInitialized) {
    console.log('   • WebSocket server not initialized');
    console.log('   • This usually happens when MongoDB connection fails');
    console.log('   • Check server logs for Socket.IO initialization errors');
  }
  
  if (results.socketio?.statusCode === 503) {
    console.log('   • Socket.IO returning 503 - database connection issue');
    console.log('   • Fix MongoDB connection first');
  }
  
  if (!results.socketio?.success && results.socketio?.statusCode !== 503) {
    console.log('   • Socket.IO handshake failed');
    console.log('   • Check reverse proxy configuration (nginx/Apache)');
    console.log('   • Ensure WebSocket upgrade headers are configured');
  }

  console.log('\n📚 For detailed solutions, see: WEBSOCKET_503_ERROR_GUIDE.md\n');
}

// Run diagnostics
runDiagnostics().catch(console.error);

