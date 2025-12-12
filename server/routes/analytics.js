const express = require('express');
const Analytics = require('../models/Analytics');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Track page view
router.post('/track', async (req, res) => {
  try {
    const { page, referrer, userAgent } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find or create today's analytics record
    let analytics = await Analytics.findOne({ date: today });
    
    if (!analytics) {
      analytics = new Analytics({
        date: today,
        pageViews: 1,
        visitors: 1,
        uniqueVisitors: 1,
        topPages: [{ path: page, views: 1 }],
        referrers: referrer ? [{ source: referrer, visits: 1 }] : [],
        devices: { desktop: 0, mobile: 0, tablet: 0 },
        browsers: [],
        countries: []
      });
    } else {
      analytics.pageViews += 1;
      
      // Update top pages
      const pageIndex = analytics.topPages.findIndex(p => p.path === page);
      if (pageIndex > -1) {
        analytics.topPages[pageIndex].views += 1;
      } else {
        analytics.topPages.push({ path: page, views: 1 });
      }
      
      // Update referrers
      if (referrer) {
        const refIndex = analytics.referrers.findIndex(r => r.source === referrer);
        if (refIndex > -1) {
          analytics.referrers[refIndex].visits += 1;
        } else {
          analytics.referrers.push({ source: referrer, visits: 1 });
        }
      }
    }

    await analytics.save();
    res.json({ message: 'Analytics tracked successfully' });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get analytics dashboard data
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const { period = '7' } = req.query;
    const days = parseInt(period);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const analytics = await Analytics.find({
      date: { $gte: startDate }
    }).sort({ date: 1 });

    // Calculate totals with null safety
    const totals = analytics.reduce((acc, day) => {
      acc.pageViews += day.pageViews || 0;
      acc.visitors += day.visitors || 0;
      acc.uniqueVisitors += day.uniqueVisitors || 0;
      return acc;
    }, { pageViews: 0, visitors: 0, uniqueVisitors: 0 });

    // Get top pages across all days with null safety
    const allPages = {};
    analytics.forEach(day => {
      if (day.topPages && Array.isArray(day.topPages)) {
        day.topPages.forEach(page => {
          if (page && page.path) {
            if (allPages[page.path]) {
              allPages[page.path] += page.views || 0;
            } else {
              allPages[page.path] = page.views || 0;
            }
          }
        });
      }
    });

    const topPages = Object.entries(allPages)
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    res.json({
      success: true,
      analytics: analytics || [],
      totals,
      topPages,
      period: `${days} days`
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      analytics: [],
      totals: { pageViews: 0, visitors: 0, uniqueVisitors: 0 },
      topPages: [],
      period: `${req.query.period || '7'} days`
    });
  }
});

// Get analytics summary
router.get('/summary', adminAuth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() - 7);

    const thisMonth = new Date(today);
    thisMonth.setDate(thisMonth.getDate() - 30);

    const [todayStats, yesterdayStats, weekStats, monthStats] = await Promise.all([
      Analytics.findOne({ date: today }),
      Analytics.findOne({ date: yesterday }),
      Analytics.find({ date: { $gte: thisWeek } }),
      Analytics.find({ date: { $gte: thisMonth } })
    ]);

    const calculateTotals = (statsArray) => {
      if (!Array.isArray(statsArray) || statsArray.length === 0) {
        return { pageViews: 0, visitors: 0, uniqueVisitors: 0 };
      }
      return statsArray.reduce((acc, stat) => {
        acc.pageViews += stat.pageViews || 0;
        acc.visitors += stat.visitors || 0;
        acc.uniqueVisitors += stat.uniqueVisitors || 0;
        return acc;
      }, { pageViews: 0, visitors: 0, uniqueVisitors: 0 });
    };

    res.json({
      success: true,
      today: todayStats || { pageViews: 0, visitors: 0, uniqueVisitors: 0 },
      yesterday: yesterdayStats || { pageViews: 0, visitors: 0, uniqueVisitors: 0 },
      thisWeek: calculateTotals(weekStats),
      thisMonth: calculateTotals(monthStats)
    });
  } catch (error) {
    console.error('Get analytics summary error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      today: { pageViews: 0, visitors: 0, uniqueVisitors: 0 },
      yesterday: { pageViews: 0, visitors: 0, uniqueVisitors: 0 },
      thisWeek: { pageViews: 0, visitors: 0, uniqueVisitors: 0 },
      thisMonth: { pageViews: 0, visitors: 0, uniqueVisitors: 0 }
    });
  }
});

module.exports = router;
