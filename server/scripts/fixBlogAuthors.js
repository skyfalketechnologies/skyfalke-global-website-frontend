const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const User = require('../models/User');
require('dotenv').config();

const fixBlogAuthors = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find admin user
    const admin = await User.findOne({ email: 'admin@skyfalke.com' });
    
    if (!admin) {
      console.log('Admin user not found. Creating one...');
      const newAdmin = new User({
        name: 'Skyfalke Admin',
        email: 'admin@skyfalke.com',
        password: 'admin123',
        role: 'admin',
        isActive: true
      });
      await newAdmin.save();
      console.log('Admin user created');
    }

    // Update all blogs without proper author
    const result = await Blog.updateMany(
      { $or: [{ author: null }, { author: { $exists: false } }] },
      { author: admin._id }
    );

    console.log(`Updated ${result.modifiedCount} blogs with proper author`);

    // Verify the fix
    const blogs = await Blog.find().populate('author', 'name');
    console.log('Blog authors after fix:');
    blogs.forEach(blog => {
      console.log(`- ${blog.title}: ${blog.author?.name || 'No author'}`);
    });

  } catch (error) {
    console.error('Error fixing blog authors:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
fixBlogAuthors();
