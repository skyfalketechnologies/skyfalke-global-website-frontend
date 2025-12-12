const mongoose = require('mongoose');
const Blog = require('./models/Blog');
require('dotenv').config();

async function testBlogCreation() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create a test blog
    const testBlog = new Blog({
      title: 'Test Blog Post',
      excerpt: 'This is a test blog post to verify the system is working.',
      content: 'This is the content of the test blog post. It should contain enough text to pass validation.',
      category: 'Technology',
      status: 'published',
      tags: ['test', 'technology', 'blog'],
      author: '507f1f77bcf86cd799439011', // This should be a valid ObjectId
      isPublished: true,
      publishedAt: new Date()
    });

    console.log('Test blog data:', testBlog);

    // Save the blog
    const savedBlog = await testBlog.save();
    console.log('Blog saved successfully:', savedBlog);

    // Try to fetch all blogs
    const allBlogs = await Blog.find({});
    console.log('Total blogs in database:', allBlogs.length);
    console.log('All blogs:', allBlogs);

    // Try to fetch published blogs
    const publishedBlogs = await Blog.find({ status: 'published' });
    console.log('Published blogs:', publishedBlogs.length);

    // Try to fetch admin blogs
    const adminBlogs = await Blog.find({});
    console.log('Admin blogs:', adminBlogs.length);

  } catch (error) {
    console.error('Error:', error);
    
    if (error.name === 'ValidationError') {
      console.error('Validation errors:');
      Object.keys(error.errors).forEach(key => {
        console.error(`- ${key}: ${error.errors[key].message}`);
      });
    }
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testBlogCreation();
