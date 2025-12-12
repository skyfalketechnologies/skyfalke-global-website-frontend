const axios = require('axios');

async function testServer() {
  try {
    console.log('Testing server health...');
    
    const healthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('Server health check passed');
    
    console.log('\nTesting login endpoint...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@skyfalke.com',
      password: 'admin123456'
    });
    console.log('Login test completed');
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('Server is not running. Please start the server first.');
    } else if (error.response) {
      console.error('Server error:', error.response.status, error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testServer();
