const { execSync } = require('child_process');
const path = require('path');

console.log('🏗️  Building Skyfalke for production...');

try {
  // Build the React app
  console.log('📦 Building React app...');
  execSync('cd client && npm run build', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
  console.log('🚀 You can now start the production server with:');
  console.log('   npm run start:prod');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
