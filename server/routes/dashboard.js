const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const Contact = require('../models/Contact');
const Blog = require('../models/Blog');
const Subscription = require('../models/Subscription');
const Analytics = require('../models/Analytics');
const Order = require('../models/Order');
const JobApplication = require('../models/JobApplication');
const Partnership = require('../models/Partnership');

// Get dashboard overview data
router.get('/overview', adminAuth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    // Get counts
    const [
      totalContacts,
      totalBlogs,
      totalSubscriptions,
      totalOrders,
      totalApplications,
      totalPartnerships,
      todayContacts,
      yesterdayContacts,
      lastMonthContacts,
      todayAnalytics,
      yesterdayAnalytics,
      lastMonthAnalytics
    ] = await Promise.all([
      Contact.countDocuments(),
      Blog.countDocuments(),
      Subscription.countDocuments(),
      Order.countDocuments(),
      JobApplication.countDocuments(),
      Partnership.countDocuments(),
      Contact.countDocuments({ createdAt: { $gte: today } }),
      Contact.countDocuments({ createdAt: { $gte: yesterday, $lt: today } }),
      Contact.countDocuments({ createdAt: { $gte: lastMonth } }),
      Analytics.findOne({ date: today }),
      Analytics.findOne({ date: yesterday }),
      Analytics.find({ date: { $gte: lastMonth } })
    ]);

    // Calculate analytics totals
    const lastMonthAnalyticsTotal = lastMonthAnalytics.reduce((acc, day) => {
      acc.pageViews += day.pageViews;
      acc.visitors += day.visitors;
      acc.uniqueVisitors += day.uniqueVisitors;
      return acc;
    }, { pageViews: 0, visitors: 0, uniqueVisitors: 0 });

    // Calculate percentage changes
    const contactChange = yesterdayContacts > 0 
      ? ((todayContacts - yesterdayContacts) / yesterdayContacts * 100).toFixed(1)
      : todayContacts > 0 ? 100 : 0;

    const visitorChange = yesterdayAnalytics?.visitors > 0
      ? ((todayAnalytics?.visitors - yesterdayAnalytics.visitors) / yesterdayAnalytics.visitors * 100).toFixed(1)
      : todayAnalytics?.visitors > 0 ? 100 : 0;

    res.json({
      success: true,
      data: {
        stats: {
          totalContacts,
          totalBlogs,
          totalSubscriptions,
          totalOrders,
          totalApplications,
          totalPartnerships,
          totalVisitors: lastMonthAnalyticsTotal.visitors,
          totalViews: lastMonthAnalyticsTotal.pageViews
        },
        today: {
          contacts: todayContacts,
          visitors: todayAnalytics?.visitors || 0,
          views: todayAnalytics?.pageViews || 0
        },
        changes: {
          contacts: {
            value: contactChange,
            type: contactChange >= 0 ? 'increase' : 'decrease'
          },
          visitors: {
            value: visitorChange,
            type: visitorChange >= 0 ? 'increase' : 'decrease'
          }
        }
      }
    });
  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard overview'
    });
  }
});

// Get recent activity
router.get('/recent-activity', adminAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Get recent contacts
    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('name email subject type status createdAt');

    // Get recent blogs
    const recentBlogs = await Blog.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('title status views createdAt');

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('customerName total status createdAt');

    // Get recent applications
    const recentApplications = await JobApplication.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('applicant.firstName applicant.lastName applicant.email jobId status createdAt')
      .populate('jobId', 'title');

    // Combine and sort all activities
    const activities = [
      ...recentContacts.map(contact => ({
        id: contact._id,
        type: 'contact',
        action: 'New contact inquiry',
        title: `${contact.name} - ${contact.subject}`,
        time: contact.createdAt,
        data: contact
      })),
      ...recentBlogs.map(blog => ({
        id: blog._id,
        type: 'blog',
        action: blog.status === 'published' ? 'Blog post published' : 'Blog post updated',
        title: blog.title,
        time: blog.createdAt,
        data: blog
      })),
      ...recentOrders.map(order => ({
        id: order._id,
        type: 'order',
        action: 'New order received',
        title: `${order.customerName} - $${order.total}`,
        time: order.createdAt,
        data: order
      })),
      ...recentApplications.map(app => {
        const applicantName = app.applicant?.firstName && app.applicant?.lastName
          ? `${app.applicant.firstName} ${app.applicant.lastName}`
          : app.applicant?.email || 'Unknown Applicant';
        const jobTitle = app.jobId?.title || 'Unknown Position';
        return {
          id: app._id,
          type: 'application',
          action: 'New job application',
          title: `${applicantName} - ${jobTitle}`,
          time: app.createdAt,
          data: app
        };
      })
    ].sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, limit);

    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('Recent activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent activity'
    });
  }
});

// Get recent contacts
router.get('/recent-contacts', adminAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('name email subject type status priority createdAt');

    res.json({
      success: true,
      data: contacts
    });
  } catch (error) {
    console.error('Recent contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent contacts'
    });
  }
});

// Get recent blogs
router.get('/recent-blogs', adminAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('title status views createdAt');

    res.json({
      success: true,
      data: blogs
    });
  } catch (error) {
    console.error('Recent blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent blogs'
    });
  }
});

// Get contact statistics
router.get('/contact-stats', adminAuth, async (req, res) => {
  try {
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const typeStats = await Contact.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    const priorityStats = await Contact.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        status: stats,
        type: typeStats,
        priority: priorityStats
      }
    });
  } catch (error) {
    console.error('Contact stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact statistics'
    });
  }
});

// Get analytics data for charts
router.get('/analytics', adminAuth, async (req, res) => {
  try {
    const { period = '7' } = req.query;
    const days = parseInt(period);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const analytics = await Analytics.find({
      date: { $gte: startDate }
    }).sort({ date: 1 });

    // Calculate totals
    const totals = analytics.reduce((acc, day) => {
      acc.pageViews += day.pageViews || 0;
      acc.visitors += day.visitors || 0;
      acc.uniqueVisitors += day.uniqueVisitors || 0;
      return acc;
    }, { pageViews: 0, visitors: 0, uniqueVisitors: 0 });

    // Get top pages across all days
    const allPages = {};
    analytics.forEach(day => {
      if (day.topPages && Array.isArray(day.topPages)) {
        day.topPages.forEach(page => {
          if (allPages[page.path]) {
            allPages[page.path] += page.views || 0;
          } else {
            allPages[page.path] = page.views || 0;
          }
        });
      }
    });

    const topPages = Object.entries(allPages)
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Get contact data for the same period
    const contacts = await Contact.find({
      createdAt: { $gte: startDate }
    }).sort({ createdAt: 1 });

    // Group contacts by date
    const contactData = contacts.reduce((acc, contact) => {
      const date = contact.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        analytics,
        totals,
        topPages,
        contacts: contactData,
        period: `${days} days`
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data'
    });
  }
});

module.exports = router;
