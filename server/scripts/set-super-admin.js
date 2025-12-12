const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const setSuperAdmin = async (email, password, name) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skyfalke', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Default values if not provided
    const userEmail = email || 'mronald@skyfalke.com';
    const userPassword = password || 'SuperAdmin123!';
    const userName = name || 'Super Admin';

    // Check if user exists
    let user = await User.findOne({ email: userEmail });

    if (user) {
      // Update existing user to super admin
      user.role = 'super_admin';
      if (password) {
        user.password = userPassword; // Will be hashed by pre-save hook
      }
      if (name) {
        user.name = userName;
      }
      await user.save();
      console.log(`✅ Updated user ${userEmail} to super_admin role`);
    } else {
      // Create new super admin user
      user = new User({
        name: userName,
        email: userEmail,
        password: userPassword,
        role: 'super_admin',
        isActive: true
      });

      await user.save();
      console.log(`✅ Created new super admin user: ${userEmail}`);
    }

    // Verify all super admins
    const superAdmins = await User.find({ role: 'super_admin' });
    console.log('\n📋 Current Super Admins:');
    superAdmins.forEach(admin => {
      console.log(`   - ${admin.email} (${admin.name})`);
    });

    console.log('\n🔑 Super Admin Credentials:');
    console.log(`   Email: ${userEmail}`);
    console.log(`   Password: ${userPassword}`);
    console.log(`   Role: super_admin`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting super admin:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Get command line arguments
const args = process.argv.slice(2);
const email = args[0];
const password = args[1];
const name = args[2];

setSuperAdmin(email, password, name);

