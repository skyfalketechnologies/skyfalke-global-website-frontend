const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, 'Phone number cannot exceed 20 characters']
  },
  company: {
    type: String,
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  type: {
    type: String,
    enum: ['contact', 'hire_us', 'quote_request', 'partnership', 'consultation', 'academy'],
    default: 'contact'
  },
  service: {
    type: String,
    trim: true,
    maxlength: [100, 'Service name cannot exceed 100 characters']
  },
  budget: {
    type: String,
    enum: ['under_10k', '10k_25k', '25k_50k', '50k_100k', 'over_100k', 'not_specified'],
    default: 'not_specified'
  },
  timeline: {
    type: String,
    enum: ['immediate', '1_month', '3_months', '6_months', 'flexible', 'not_specified'],
    default: 'not_specified'
  },
  status: {
    type: String,
    enum: ['new', 'in_progress', 'responded', 'closed', 'spam'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: [{
    note: {
      type: String,
      required: true,
      trim: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  source: {
    type: String,
    enum: ['website', 'admin', 'api', 'email'],
    default: 'website'
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  },
  location: {
    country: String,
    city: String,
    region: String
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  respondedAt: {
    type: Date
  },
  responseMethod: {
    type: String,
    enum: ['email', 'phone', 'whatsapp', 'meeting', 'other'],
    default: 'email'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ type: 1, createdAt: -1 });
contactSchema.index({ email: 1 });
contactSchema.index({ assignedTo: 1 });

// Virtual for budget display
contactSchema.virtual('budgetDisplay').get(function() {
  const budgetMap = {
    'under_10k': 'Under $10,000',
    '10k_25k': '$10,000 - $25,000',
    '25k_50k': '$25,000 - $50,000',
    '50k_100k': '$50,000 - $100,000',
    'over_100k': 'Over $100,000',
    'not_specified': 'Not specified'
  };
  return budgetMap[this.budget] || 'Not specified';
});

// Virtual for timeline display
contactSchema.virtual('timelineDisplay').get(function() {
  const timelineMap = {
    'immediate': 'Immediate',
    '1_month': '1 Month',
    '3_months': '3 Months',
    '6_months': '6 Months',
    'flexible': 'Flexible',
    'not_specified': 'Not specified'
  };
  return timelineMap[this.timeline] || 'Not specified';
});

// Method to mark as read
contactSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Method to mark as responded
contactSchema.methods.markAsResponded = function(method = 'email') {
  this.status = 'responded';
  this.respondedAt = new Date();
  this.responseMethod = method;
  return this.save();
};

// Static method to get contact statistics
contactSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        new: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
        inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
        responded: { $sum: { $cond: [{ $eq: ['$status', 'responded'] }, 1, 0] } },
        closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } },
        spam: { $sum: { $cond: [{ $eq: ['$status', 'spam'] }, 1, 0] } },
        contact: { $sum: { $cond: [{ $eq: ['$type', 'contact'] }, 1, 0] } },
        consultation: { $sum: { $cond: [{ $eq: ['$type', 'consultation'] }, 1, 0] } },
        hireUs: { $sum: { $cond: [{ $eq: ['$type', 'hire_us'] }, 1, 0] } },
        quoteRequest: { $sum: { $cond: [{ $eq: ['$type', 'quote_request'] }, 1, 0] } },
        partnership: { $sum: { $cond: [{ $eq: ['$type', 'partnership'] }, 1, 0] } }
      }
    }
  ]);

  return stats[0] || {
    total: 0,
    new: 0,
    inProgress: 0,
    responded: 0,
    closed: 0,
    spam: 0,
    contact: 0,
    consultation: 0,
    hireUs: 0,
    quoteRequest: 0,
    partnership: 0
  };
};

// Static method to get recent contacts
contactSchema.statics.getRecent = async function(limit = 10) {
  return this.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('name email subject type status createdAt');
};

module.exports = mongoose.model('Contact', contactSchema);
