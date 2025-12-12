require('dotenv').config();
const ImageKitService = require('./services/imageKitService');

async function testImageKit() {
  try {
    console.log('Testing ImageKit configuration...');
    console.log('URL Endpoint:', process.env.IMAGEKIT_URL_ENDPOINT);
    console.log('Public Key:', process.env.IMAGEKIT_PUBLIC_KEY ? 'Configured' : 'Not configured');
console.log('Private Key:', process.env.IMAGEKIT_PRIVATE_KEY ? 'Configured' : 'Not configured');
    
    if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY) {
      console.error('❌ ImageKit credentials not configured!');
      console.log('Please add your ImageKit credentials to your .env file');
      return;
    }
    
    console.log('✅ ImageKit configuration looks good!');
    console.log('You can now upload images to ImageKit.');
    
  } catch (error) {
    console.error('❌ Error testing ImageKit:', error.message);
  }
}

testImageKit();
