/**
 * Next.js Standalone Server for cPanel
 * This is the correct way to start Next.js with standalone output
 * 
 * Usage: node .next/standalone/server.js
 * Or set this as startup file in cPanel: .next/standalone/server.js
 */

// This file is a placeholder/wrapper
// The actual server is in .next/standalone/server.js after build
// 
// If you need a custom wrapper, use this:

const path = require('path');
const { spawn } = require('child_process');

// Get the standalone server path
const standalonePath = path.join(__dirname, '.next', 'standalone', 'server.js');

// Check if standalone server exists
const fs = require('fs');
if (!fs.existsSync(standalonePath)) {
  console.error('❌ Standalone server not found. Please run: npm run build');
  console.error(`   Expected path: ${standalonePath}`);
  process.exit(1);
}

// Set environment variables
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT = process.env.PORT || '3000';
process.env.HOSTNAME = process.env.HOSTNAME || '0.0.0.0';

// Start the standalone server
console.log('🚀 Starting Next.js standalone server...');
console.log(`   Port: ${process.env.PORT}`);
console.log(`   Hostname: ${process.env.HOSTNAME}`);
console.log(`   Server: ${standalonePath}`);

// Use the standalone server directly
require(standalonePath);

