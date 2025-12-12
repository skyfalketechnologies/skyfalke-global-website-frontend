const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const { adminAuth } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Rate limiting for subscription submissions
const subscriptionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 100 : 10, // More lenient in development
  message: {
    error: 'Too many subscription attempts from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  skipFailedRequests: false, // Count failed requests
  // Skip rate limiting for development
  skip: (req) => {
    return process.env.NODE_ENV === 'development' && req.headers['x-skip-rate-limit'] === 'true';
  }
});

// Public routes (no authentication required)

// Subscribe to newsletter
router.post('/subscribe', subscriptionLimiter, async (req, res) => {
  try {
    const { email, name, source = 'footer', preferences } = req.body;

    // Basic validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }

    // Email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Check if already subscribed
    const existingSubscription = await Subscription.findOne({ email: email.toLowerCase() });
    
    if (existingSubscription) {
      if (existingSubscription.status === 'active') {
        return res.status(400).json({
          success: false,
          message: 'This email is already subscribed to our newsletter'
        });
      } else if (existingSubscription.status === 'unsubscribed') {
        // Resubscribe
        await existingSubscription.resubscribe();
        return res.status(200).json({
          success: true,
          message: 'Welcome back! You have been resubscribed to our newsletter.',
          subscriptionId: existingSubscription._id
        });
      }
    }

    // Create new subscription
    const subscriptionData = {
      email,
      name,
      source,
      preferences: preferences || {
        newsletter: true,
        blogUpdates: true,
        productUpdates: true,
        eventNotifications: true
      },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    };

    const subscription = new Subscription(subscriptionData);
    await subscription.save();

    // TODO: Send welcome email
    // await sendWelcomeEmail(subscription);

    res.status(201).json({
      success: true,
      message: 'Thank you for subscribing! You will now receive our latest updates and insights.',
      subscriptionId: subscription._id
    });

  } catch (error) {
    console.error('Subscription error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This email is already subscribed to our newsletter'
      });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.'
    });
  }
});

// Unsubscribe from newsletter
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email, token } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }

    const subscription = await Subscription.findOne({ email: email.toLowerCase() });
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    if (subscription.status === 'unsubscribed') {
      return res.status(200).json({
        success: true,
        message: 'You are already unsubscribed from our newsletter'
      });
    }

    await subscription.unsubscribe();

    res.json({
      success: true,
      message: 'You have been successfully unsubscribed from our newsletter'
    });

  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.'
    });
  }
});

// Check subscription status
router.get('/status/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const subscription = await Subscription.findOne({ email: email.toLowerCase() });
    
    if (!subscription) {
      return res.json({
        success: true,
        subscribed: false,
        message: 'Email not found in our subscription list'
      });
    }

    res.json({
      success: true,
      subscribed: subscription.status === 'active',
      status: subscription.status,
      subscribedAt: subscription.subscribedAt,
      preferences: subscription.preferences
    });

  } catch (error) {
    console.error('Subscription status check error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.'
    });
  }
});

// Admin routes (require authentication)

// Get all subscriptions with pagination and filtering
router.get('/admin', adminAuth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      source, 
      search,
      sortBy = 'subscribedAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};

    // Filter by status
    if (status && ['active', 'unsubscribed', 'pending'].includes(status)) {
      query.status = status;
    }

    // Filter by source
    if (source && ['footer', 'blog', 'contact_form', 'admin', 'api'].includes(source)) {
      query.source = source;
    }

    // Search by email or name
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const subscriptions = await Subscription.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Subscription.countDocuments(query);

    res.json({
      success: true,
      data: {
        subscriptions,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalSubscriptions: total,
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscriptions'
    });
  }
});

// Get subscription statistics
router.get('/admin/stats', adminAuth, async (req, res) => {
  try {
    const totalSubscriptions = await Subscription.countDocuments();
    const activeSubscriptions = await Subscription.countDocuments({ status: 'active' });
    const unsubscribedCount = await Subscription.countDocuments({ status: 'unsubscribed' });
    
    // Get subscriptions by source
    const sourceStats = await Subscription.aggregate([
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent subscriptions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentSubscriptions = await Subscription.countDocuments({
      subscribedAt: { $gte: thirtyDaysAgo }
    });

    res.json({
      success: true,
      data: {
        total: totalSubscriptions,
        active: activeSubscriptions,
        unsubscribed: unsubscribedCount,
        recent: recentSubscriptions,
        sourceBreakdown: sourceStats
      }
    });

  } catch (error) {
    console.error('Get subscription stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription statistics'
    });
  }
});

// Update subscription (admin only)
router.patch('/admin/:id', adminAuth, async (req, res) => {
  try {
    const { status, preferences, notes, tags } = req.body;
    
    const subscription = await Subscription.findById(req.params.id);
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    // Update fields
    if (status) subscription.status = status;
    if (preferences) subscription.preferences = { ...subscription.preferences, ...preferences };
    if (notes !== undefined) subscription.notes = notes;
    if (tags) subscription.tags = tags;

    await subscription.save();

    res.json({
      success: true,
      message: 'Subscription updated successfully',
      data: subscription
    });

  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update subscription'
    });
  }
});

// Delete subscription (admin only)
router.delete('/admin/:id', adminAuth, async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndDelete(req.params.id);
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    res.json({
      success: true,
      message: 'Subscription deleted successfully'
    });

  } catch (error) {
    console.error('Delete subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete subscription'
    });
  }
});

module.exports = router;
