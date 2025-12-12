const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { auth, adminAuth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads (if needed for job attachments)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/jobs/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image, PDF and document files are allowed!'));
    }
  }
});

// @route   GET /api/jobs
// @desc    Get all active jobs with filtering and search
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      location,
      type,
      isRemote,
      sortBy = 'postedDate',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (search) {
      filter.$text = { $search: search };
    }
    
    if (category && category !== 'All') {
      filter.category = category;
    }
    
    if (location && location !== 'All') {
      filter.location = location;
    }
    
    if (type) {
      filter.type = type;
    }
    
    if (isRemote !== undefined) {
      filter.isRemote = isRemote === 'true';
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const jobs = await Job.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total count for pagination
    const total = await Job.countDocuments(filter);

    res.json({
      jobs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalJobs: total
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/jobs/:id/view
// @desc    Track job view with session checking
// @access  Public
router.post('/:id/view', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Get client IP and user agent for basic tracking
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    const userAgent = req.get('User-Agent') || 'unknown';
    const sessionId = req.get('X-Session-ID') || 'anonymous';
    
    // Create a simple hash for this view attempt
    const viewKey = `job-${job._id}-${clientIP}-${userAgent}-${sessionId}`;
    
    // Simple in-memory tracking (in production, use Redis or database)
    if (!global.viewTracking) {
      global.viewTracking = new Map();
    }
    
    const now = Date.now();
    const lastViewTime = global.viewTracking.get(viewKey) || 0;
    const timeDiff = now - lastViewTime;
    
    // Only count view if it's been more than 1 hour since last view from this session
    if (timeDiff > 60 * 60 * 1000) { // 1 hour in milliseconds
      await job.incrementViews();
      
      // Store the view time
      global.viewTracking.set(viewKey, now);
      
      console.log(`View counted for job ${job._id} from session ${sessionId}`);
    } else {
      console.log(`View not counted for job ${job._id} - too recent (${Math.round(timeDiff / 1000 / 60)} minutes ago)`);
    }

    res.json({ 
      views: job.views,
      viewCounted: timeDiff > 60 * 60 * 1000
    });
  } catch (error) {
    console.error('Track job view error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get job by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Don't increment views here - use the /:id/view endpoint instead
    res.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/jobs/slug/:slug
// @desc    Get job by slug
// @access  Public
router.get('/slug/:slug', async (req, res) => {
  try {
    const job = await Job.findOne({ slug: req.params.slug });
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Don't increment views here - use the /:id/view endpoint instead
    res.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/jobs
// @desc    Create a new job (Admin only)
// @access  Private
router.post('/', adminAuth, async (req, res) => {
  try {

    const job = new Job(req.body);
    await job.save();

    res.status(201).json(job);
  } catch (error) {
    console.error('Error creating job:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update a job (Admin only)
// @access  Private
router.put('/:id', adminAuth, async (req, res) => {
  try {

    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error('Error updating job:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete a job (Admin only)
// @access  Private
router.delete('/:id', adminAuth, async (req, res) => {
  try {

    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/jobs/:id/status
// @desc    Toggle job active status (Admin only)
// @access  Private
router.patch('/:id/status', adminAuth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    job.isActive = !job.isActive;
    await job.save();

    res.json(job);
  } catch (error) {
    console.error('Error toggling job status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/jobs/stats/overview
// @desc    Get job statistics (Admin only)
// @access  Private
router.get('/stats/overview', adminAuth, async (req, res) => {
  try {

    const stats = await Job.aggregate([
      {
        $group: {
          _id: null,
          totalJobs: { $sum: 1 },
          activeJobs: { $sum: { $cond: ['$isActive', 1, 0] } },
          totalViews: { $sum: '$views' },
          avgViews: { $avg: '$views' }
        }
      }
    ]);

    const categoryStats = await Job.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const locationStats = await Job.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$location',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      overview: {
        ...(stats[0] || {
          totalJobs: 0,
          activeJobs: 0,
          totalViews: 0,
          avgViews: 0
        }),
        topCategories: categoryStats.map(cat => ({
          category: cat._id,
          count: cat.count
        }))
      },
      categoryStats,
      locationStats
    });
  } catch (error) {
    console.error('Error fetching job stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/jobs/categories
// @desc    Get all job categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Job.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/jobs/locations
// @desc    Get all job locations
// @access  Public
router.get('/locations', async (req, res) => {
  try {
    const locations = await Job.distinct('location');
    res.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
