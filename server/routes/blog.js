const express = require('express');
const multer = require('multer');
const Blog = require('../models/Blog');
const BlogComment = require('../models/BlogComment');
const { auth, adminAuth } = require('../middleware/auth');
const ImageKitService = require('../services/imageKitService');

const router = express.Router();

const buildAuthorProfileFromUser = (user) => ({
  name: user?.authorProfile?.name || user?.name || '',
  role: user?.authorProfile?.role || '',
  bio: user?.authorProfile?.bio || '',
  avatar: user?.authorProfile?.avatar || user?.avatar || '',
  linkedin: user?.authorProfile?.linkedin || ''
});

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Get all published blogs
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const category = req.query.category;
    const search = req.query.search;
    const tag = req.query.tag;
    const featured = req.query.featured;

    let query = { status: 'published' };
    
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (tag) {
      query.tags = { $in: [tag] };
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const blogs = await Blog.find(query)
      .populate('author', 'name avatar authorProfile')
      .sort({ publishedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-seo.structuredData');

    const total = await Blog.countDocuments(query);

    res.json({
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single blog by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    console.log('Fetching blog by slug:', req.params.slug);
    
    const blog = await Blog.findOne({ 
      slug: req.params.slug, 
      status: 'published' 
    }).populate('author', 'name avatar authorProfile');

    console.log('Blog found:', blog ? 'Yes' : 'No');

    if (!blog) {
      console.log('Blog not found for slug:', req.params.slug);
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Don't increment views here - let the client handle it with proper tracking
    res.json(blog);
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured blogs
router.get('/featured/latest', async (req, res) => {
  try {
    const blogs = await Blog.findFeatured()
      .populate('author', 'name avatar authorProfile')
      .sort({ views: -1, publishedAt: -1 })
      .limit(3)
      .select('-seo.structuredData');

    res.json(blogs);
  } catch (error) {
    console.error('Get featured blogs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all blogs for admin
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const category = req.query.category;
    const search = req.query.search;

    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    console.log('Admin blogs query:', query);
    console.log('Page:', page, 'Limit:', limit);

    const blogs = await Blog.find(query)
      .populate('author', 'name avatar authorProfile')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Blog.countDocuments(query);

    const blogIds = blogs.map(b => b._id);
    const commentCounts = blogIds.length
      ? await BlogComment.aggregate([
          { $match: { blog: { $in: blogIds } } },
          { $group: { _id: '$blog', count: { $sum: 1 } } }
        ])
      : [];
    const countByBlog = Object.fromEntries(commentCounts.map(c => [String(c._id), c.count]));

    const blogsWithCounts = blogs.map(blog => ({
      ...blog,
      commentCount: countByBlog[String(blog._id)] ?? 0
    }));

    console.log('Found blogs:', blogs.length);
    console.log('Total blogs:', total);

    res.json({
      blogs: blogsWithCounts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get admin blogs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Test ImageKit connectivity
router.get('/test-imagekit', adminAuth, async (req, res) => {
  try {
    console.log('Testing ImageKit connectivity...');
    console.log('ImageKit config:', {
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY ? 'Set' : 'Missing',
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY ? 'Set' : 'Missing',
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT ? 'Set' : 'Missing'
    });
    
    // Test ImageKit connection by getting account info
    const imagekit = require('imagekit');
    const ik = new imagekit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    });
    
    res.json({
      success: true,
      message: 'ImageKit configuration verified',
      config: {
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY ? 'Set' : 'Missing',
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY ? 'Set' : 'Missing',
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT ? 'Set' : 'Missing'
      }
    });
  } catch (error) {
    console.error('ImageKit test error:', error);
    res.status(500).json({ 
      success: false,
      message: 'ImageKit test failed',
      error: error.message 
    });
  }
});

// Upload image for blog
router.post('/upload-image', adminAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Validate file type
    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ message: 'File must be an image' });
    }

    // Validate file size (10MB max)
    if (req.file.size > 10 * 1024 * 1024) {
      return res.status(400).json({ message: 'Image file size must be less than 10MB' });
    }

    console.log('Uploading image to ImageKit:', req.file.originalname);
    const uploadResult = await ImageKitService.uploadImage(req.file);
    console.log('ImageKit upload successful:', uploadResult);
    
    res.json({
      success: true,
      image: uploadResult
    });
  } catch (error) {
    console.error('Image upload error:', error);
    
    if (error.message.includes('ImageKit')) {
      res.status(500).json({ message: 'ImageKit service error. Please try again.' });
    } else {
      res.status(500).json({ message: 'Failed to upload image' });
    }
  }
});

// Create blog (auth required)
router.post('/', adminAuth, async (req, res) => {
  try {
    console.log('Creating blog with data:', req.body);
    console.log('User ID:', req.user._id);
    
    const blogData = {
      ...req.body,
      author: req.user._id, // Use the user's _id from the populated user object
      authorProfile: buildAuthorProfileFromUser(req.user)
    };
    
    console.log('Final blog data:', blogData);
    
    const blog = new Blog(blogData);
    await blog.save();
    
    const populatedBlog = await Blog.findById(blog._id).populate('author', 'name avatar authorProfile');
    res.status(201).json(populatedBlog);
  } catch (error) {
    console.error('Create blog error:', error);
    
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', error.errors);
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Update blog (auth required)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    // Never allow author or authorProfile to be changed after creation
    const { author, authorProfile, ...updateData } = req.body;
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'name avatar authorProfile');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(blog);
  } catch (error) {
    console.error('Update blog error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete blog (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Delete featured image from ImageKit if exists
    if (blog.featuredImage.imageKitId) {
      try {
        await ImageKitService.deleteImage(blog.featuredImage.imageKitId);
      } catch (imageError) {
        console.error('Failed to delete image from ImageKit:', imageError);
      }
    }

    // Delete SEO images if they exist
    if (blog.seo.ogImage?.imageKitId) {
      try {
        await ImageKitService.deleteImage(blog.seo.ogImage.imageKitId);
      } catch (imageError) {
        console.error('Failed to delete OG image from ImageKit:', imageError);
      }
    }

    if (blog.seo.twitterImage?.imageKitId) {
      try {
        await ImageKitService.deleteImage(blog.seo.twitterImage.imageKitId);
      } catch (imageError) {
        console.error('Failed to delete Twitter image from ImageKit:', imageError);
      }
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get blog categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Blog.distinct('category', { status: 'published' });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get blog tags
router.get('/meta/tags', async (req, res) => {
  try {
    const tags = await Blog.distinct('tags', { status: 'published' });
    res.json(tags.filter(tag => tag)); // Filter out empty tags
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get blog statistics
router.get('/admin/stats', adminAuth, async (req, res) => {
  try {
    const stats = await Blog.aggregate([
      {
        $group: {
          _id: null,
          totalBlogs: { $sum: 1 },
          publishedBlogs: { $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] } },
          draftBlogs: { $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] } },
          totalViews: { $sum: '$views' },
          totalLikes: { $sum: '$likes' },
          totalShares: { $sum: '$shares' }
        }
      }
    ]);

    const categoryStats = await Blog.aggregate([
      { $match: { status: 'published' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalViews: { $sum: '$views' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const recentBlogs = await Blog.find()
      .populate('author', 'name avatar authorProfile')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status views createdAt');

    res.json({
      overview: stats[0] || {
        totalBlogs: 0,
        publishedBlogs: 0,
        draftBlogs: 0,
        totalViews: 0,
        totalLikes: 0,
        totalShares: 0
      },
      categoryStats,
      recentBlogs
    });
  } catch (error) {
    console.error('Get blog stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle blog status
router.patch('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('author', 'name avatar authorProfile');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(blog);
  } catch (error) {
    console.error('Toggle blog status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle featured status
router.patch('/:id/featured', adminAuth, async (req, res) => {
  try {
    const { isFeatured } = req.body;
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { isFeatured },
      { new: true, runValidators: true }
    ).populate('author', 'name avatar authorProfile');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(blog);
  } catch (error) {
    console.error('Toggle featured status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single blog for admin (with all data)
router.get('/admin/:id', adminAuth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name avatar authorProfile');
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(blog);
  } catch (error) {
    console.error('Get admin blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get blog comments for admin (all statuses)
router.get('/admin/:id/comments', adminAuth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    const comments = await BlogComment.find({ blog: req.params.id })
      .sort({ createdAt: -1 })
      .select('name email comment status createdAt _id')
      .lean();
    res.json({ comments, total: comments.length });
  } catch (error) {
    console.error('Get admin blog comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Increment blog likes
router.post('/:id/like', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    await blog.incrementLikes();
    res.json({ likes: blog.likes });
  } catch (error) {
    console.error('Like blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Increment blog shares
router.post('/:id/share', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    await blog.incrementShares();
    res.json({ shares: blog.shares });
  } catch (error) {
    console.error('Share blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Track blog view with session checking
router.post('/:id/view', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Get client IP and user agent for basic tracking
    const clientIP = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    const sessionId = req.get('X-Session-ID') || 'anonymous';
    
    // Create a simple hash for this view attempt
    const viewKey = `${blog._id}-${clientIP}-${userAgent}-${sessionId}`;
    
    // Simple in-memory tracking (in production, use Redis or database)
    if (!global.viewTracking) {
      global.viewTracking = new Map();
    }
    
    const now = Date.now();
    const lastViewTime = global.viewTracking.get(viewKey) || 0;
    const timeDiff = now - lastViewTime;
    
    // Only count view if it's been more than 1 hour since last view from this session
    if (timeDiff > 60 * 60 * 1000) { // 1 hour in milliseconds
      await blog.incrementViews();
      
      // Store the view time
      global.viewTracking.set(viewKey, now);
      
      console.log(`View counted for blog ${blog._id} from session ${sessionId}`);
    } else {
      console.log(`View not counted for blog ${blog._id} - too recent (${Math.round(timeDiff / 1000 / 60)} minutes ago)`);
    }

    res.json({ 
      views: blog.views,
      viewCounted: timeDiff > 60 * 60 * 1000
    });
  } catch (error) {
    console.error('Track blog view error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get related blogs
router.get('/:id/related', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Find related blogs based on category and tags
    const relatedBlogs = await Blog.find({
      _id: { $ne: blog._id },
      status: 'published',
      $or: [
        { category: blog.category },
        { tags: { $in: blog.tags } }
      ]
    })
    .populate('author', 'name avatar authorProfile')
    .sort({ publishedAt: -1 })
    .limit(3)
    .select('-seo.structuredData');

    res.json(relatedBlogs);
  } catch (error) {
    console.error('Get related blogs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search blogs with advanced filters
router.get('/search', async (req, res) => {
  try {
    const {
      q,
      category,
      tags,
      author,
      dateFrom,
      dateTo,
      minViews,
      maxViews,
      sortBy = 'publishedAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    let query = { status: 'published' };

    // Text search
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { excerpt: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Tags filter
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(',');
      query.tags = { $in: tagArray };
    }

    // Author filter
    if (author) {
      query.author = author;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      query.publishedAt = {};
      if (dateFrom) {
        query.publishedAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        query.publishedAt.$lte = new Date(dateTo);
      }
    }

    // Views range filter
    if (minViews || maxViews) {
      query.views = {};
      if (minViews) {
        query.views.$gte = parseInt(minViews);
      }
      if (maxViews) {
        query.views.$lte = parseInt(maxViews);
      }
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const blogs = await Blog.find(query)
      .populate('author', 'name avatar authorProfile')
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('-seo.structuredData');

    const total = await Blog.countDocuments(query);

    res.json({
      blogs,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      hasMore: parseInt(page) * parseInt(limit) < total
    });
  } catch (error) {
    console.error('Search blogs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get popular blogs
router.get('/popular', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const timeframe = req.query.timeframe || 'all'; // 'week', 'month', 'year', 'all'

    let dateFilter = {};
    const now = new Date();
    
    switch (timeframe) {
      case 'week':
        dateFilter.publishedAt = { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
        break;
      case 'month':
        dateFilter.publishedAt = { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
        break;
      case 'year':
        dateFilter.publishedAt = { $gte: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000) };
        break;
    }

    const blogs = await Blog.find({
      status: 'published',
      ...dateFilter
    })
    .populate('author', 'name')
    .sort({ views: -1, likes: -1, shares: -1 })
    .limit(limit)
    .select('-seo.structuredData');

    res.json(blogs);
  } catch (error) {
    console.error('Get popular blogs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get blog archive (grouped by year/month)
router.get('/archive', async (req, res) => {
  try {
    const archive = await Blog.aggregate([
      { $match: { status: 'published' } },
      {
        $group: {
          _id: {
            year: { $year: '$publishedAt' },
            month: { $month: '$publishedAt' }
          },
          count: { $sum: 1 },
          blogs: {
            $push: {
              _id: '$_id',
              title: '$title',
              slug: '$slug',
              publishedAt: '$publishedAt'
            }
          }
        }
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1 }
      }
    ]);

    res.json(archive);
  } catch (error) {
    console.error('Get blog archive error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Bulk operations for admin
router.post('/admin/bulk', adminAuth, async (req, res) => {
  try {
    const { action, blogIds } = req.body;

    if (!action || !blogIds || !Array.isArray(blogIds)) {
      return res.status(400).json({ message: 'Action and blogIds are required' });
    }

    let result;

    switch (action) {
      case 'publish':
        result = await Blog.updateMany(
          { _id: { $in: blogIds } },
          { $set: { status: 'published', publishedAt: new Date() } }
        );
        break;
      
      case 'unpublish':
        result = await Blog.updateMany(
          { _id: { $in: blogIds } },
          { $set: { status: 'draft' } }
        );
        break;
      
      case 'archive':
        result = await Blog.updateMany(
          { _id: { $in: blogIds } },
          { $set: { status: 'archived' } }
        );
        break;
      
      case 'delete':
        // Get blogs to delete images
        const blogsToDelete = await Blog.find({ _id: { $in: blogIds } });
        
        // Delete images from ImageKit
        for (const blog of blogsToDelete) {
          if (blog.featuredImage?.imageKitId) {
            try {
              await ImageKitService.deleteImage(blog.featuredImage.imageKitId);
            } catch (error) {
              console.error('Failed to delete image:', error);
            }
          }
        }
        
        result = await Blog.deleteMany({ _id: { $in: blogIds } });
        break;
      
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }

    res.json({
      message: `Successfully ${action}ed ${result.modifiedCount || result.deletedCount} blogs`,
      result
    });
  } catch (error) {
    console.error('Bulk operation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate sitemap data
router.get('/sitemap', async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'published' })
      .select('slug updatedAt')
      .sort({ updatedAt: -1 });

    const sitemapData = blogs.map(blog => ({
      url: `/blog/${blog.slug}`,
      lastModified: blog.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.7
    }));

    res.json(sitemapData);
  } catch (error) {
    console.error('Generate sitemap error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Export blogs data
router.get('/admin/export', adminAuth, async (req, res) => {
  try {
    const format = req.query.format || 'json';
    const status = req.query.status;

    let query = {};
    if (status) {
      query.status = status;
    }

    const blogs = await Blog.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    if (format === 'csv') {
      // Convert to CSV format
      const csv = blogs.map(blog => ({
        id: blog._id,
        title: blog.title,
        slug: blog.slug,
        category: blog.category,
        status: blog.status,
        author: blog.author?.name || 'Unknown',
        views: blog.views,
        likes: blog.likes,
        shares: blog.shares,
        createdAt: blog.createdAt,
        publishedAt: blog.publishedAt
      }));

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=blogs-export.csv');
      
      // Simple CSV conversion (you might want to use a proper CSV library)
      const csvContent = [
        Object.keys(csv[0]).join(','),
        ...csv.map(row => Object.values(row).map(val => `"${val}"`).join(','))
      ].join('\n');
      
      res.send(csvContent);
    } else {
      res.json({
        exportDate: new Date(),
        totalBlogs: blogs.length,
        blogs
      });
    }
  } catch (error) {
    console.error('Export blogs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get blog analytics for admin dashboard
router.get('/admin/analytics', adminAuth, async (req, res) => {
  try {
    const timeframe = req.query.timeframe || '30'; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(timeframe));

    // Blog creation trends
    const creationTrends = await Blog.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Top performing blogs
    const topBlogs = await Blog.find({ status: 'published' })
      .populate('author', 'name')
      .sort({ views: -1, likes: -1 })
      .limit(10)
      .select('title views likes shares publishedAt');

    // Category performance
    const categoryPerformance = await Blog.aggregate([
      { $match: { status: 'published' } },
      {
        $group: {
          _id: '$category',
          totalViews: { $sum: '$views' },
          totalLikes: { $sum: '$likes' },
          totalShares: { $sum: '$shares' },
          blogCount: { $sum: 1 },
          avgViews: { $avg: '$views' }
        }
      },
      { $sort: { totalViews: -1 } }
    ]);

    // Author performance
    const authorPerformance = await Blog.aggregate([
      { $match: { status: 'published' } },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'authorInfo'
        }
      },
      {
        $group: {
          _id: '$author',
          authorName: { $first: '$authorInfo.name' },
          totalViews: { $sum: '$views' },
          totalLikes: { $sum: '$likes' },
          totalShares: { $sum: '$shares' },
          blogCount: { $sum: 1 },
          avgViews: { $avg: '$views' }
        }
      },
      { $sort: { totalViews: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      creationTrends,
      topBlogs,
      categoryPerformance,
      authorPerformance
    });
  } catch (error) {
    console.error('Get blog analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get blog insights and recommendations
router.get('/admin/insights', adminAuth, async (req, res) => {
  try {
    const insights = {};

    // Most popular tags
    const popularTags = await Blog.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 },
          totalViews: { $sum: '$views' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Best performing time slots
    const timeAnalysis = await Blog.aggregate([
      { $match: { status: 'published' } },
      {
        $group: {
          _id: { $hour: '$publishedAt' },
          avgViews: { $avg: '$views' },
          blogCount: { $sum: 1 }
        }
      },
      { $sort: { avgViews: -1 } }
    ]);

    // Content length analysis
    const contentAnalysis = await Blog.aggregate([
      { $match: { status: 'published' } },
      {
        $addFields: {
          contentLength: { $strLenCP: '$content' },
          wordCount: { $size: { $split: ['$content', ' '] } }
        }
      },
      {
        $group: {
          _id: null,
          avgContentLength: { $avg: '$contentLength' },
          avgWordCount: { $avg: '$wordCount' },
          maxViews: { $max: '$views' },
          minViews: { $min: '$views' }
        }
      }
    ]);

    // Engagement rate calculation
    const engagementData = await Blog.aggregate([
      { $match: { status: 'published' } },
      {
        $addFields: {
          engagementRate: {
            $cond: {
              if: { $gt: ['$views', 0] },
              then: {
                $divide: [
                  { $add: ['$likes', '$shares'] },
                  '$views'
                ]
              },
              else: 0
            }
          }
        }
      },
      {
        $group: {
          _id: null,
          avgEngagementRate: { $avg: '$engagementRate' },
          totalEngagement: { $sum: { $add: ['$likes', '$shares'] } }
        }
      }
    ]);

    insights.popularTags = popularTags;
    insights.timeAnalysis = timeAnalysis;
    insights.contentAnalysis = contentAnalysis[0] || {};
    insights.engagementData = engagementData[0] || {};

    res.json(insights);
  } catch (error) {
    console.error('Get blog insights error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Duplicate blog (for creating variations)
router.post('/admin/:id/duplicate', adminAuth, async (req, res) => {
  try {
    const originalBlog = await Blog.findById(req.params.id);
    
    if (!originalBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Create a duplicate with modified title and status
    const duplicatedBlog = new Blog({
      ...originalBlog.toObject(),
      _id: undefined, // Remove the original ID
      title: `${originalBlog.title} (Copy)`,
      slug: `${originalBlog.slug}-copy-${Date.now()}`,
      status: 'draft',
      publishedAt: undefined,
      views: 0,
      likes: 0,
      shares: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await duplicatedBlog.save();
    
  const populatedBlog = await Blog.findById(duplicatedBlog._id).populate('author', 'name avatar authorProfile');
    res.status(201).json(populatedBlog);
  } catch (error) {
    console.error('Duplicate blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Preview blog (for draft preview)
router.get('/admin/:id/preview', adminAuth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name avatar authorProfile');
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Return blog data for preview (regardless of status)
    res.json(blog);
  } catch (error) {
    console.error('Preview blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get blog comments
router.get('/:id/comments', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const comments = await BlogComment.find({
      blog: req.params.id,
      status: 'approved'
    })
      .sort({ createdAt: -1 })
      .select('name comment createdAt')
      .lean();

    res.json({ comments, total: comments.length });
  } catch (error) {
    console.error('Get blog comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add blog comment
router.post('/:id/comments', async (req, res) => {
  try {
    const { name, email, comment } = req.body;
    
    if (!name || !email || !comment) {
      return res.status(400).json({ message: 'Name, email, and comment are required' });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const blogComment = new BlogComment({
      blog: req.params.id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      comment: comment.trim(),
      status: 'approved'
    });

    await blogComment.save();

    const saved = await BlogComment.findById(blogComment._id)
      .select('name comment createdAt _id')
      .lean();

    res.status(201).json({
      message: 'Comment added successfully',
      comment: saved
    });
  } catch (error) {
    console.error('Add blog comment error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation failed',
        errors: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
