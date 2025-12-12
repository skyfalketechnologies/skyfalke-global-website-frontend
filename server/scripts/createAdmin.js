const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skyfalke');
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@skyfalke.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists. Updating...');
      existingAdmin.password = 'admin123';
      await existingAdmin.save();
              console.log('Admin updated successfully');
    } else {
      // Create new admin user
      const adminUser = new User({
        name: 'Skyfalke Admin',
        email: 'admin@skyfalke.com',
        password: 'admin123',
        role: 'admin',
        isActive: true
      });

      await adminUser.save();
      console.log('Admin user created successfully');
    }

    console.log('\nDemo Admin Credentials:');
    console.log('Email: admin@skyfalke.com');
    console.log('Role: admin');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
createAdminUser();
