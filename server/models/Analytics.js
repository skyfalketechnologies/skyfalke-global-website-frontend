const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  visitors: {
    type: Number,
    default: 0
  },
  pageViews: {
    type: Number,
    default: 0
  },
  uniqueVisitors: {
    type: Number,
    default: 0
  },
  topPages: [{
    path: String,
    views: Number
  }],
  referrers: [{
    source: String,
    visits: Number
  }],
  devices: {
    desktop: { type: Number, default: 0 },
    mobile: { type: Number, default: 0 },
    tablet: { type: Number, default: 0 }
  },
  browsers: [{
    name: String,
    count: Number
  }],
  countries: [{
    name: String,
    count: Number
  }]
}, {
  timestamps: true
});

// Create compound index for efficient date queries
analyticsSchema.index({ date: 1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
