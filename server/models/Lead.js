const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [100, 'First name cannot exceed 100 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [100, 'Last name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    // Note: Index is created by schema.index() call below with unique and sparse options
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, 'Phone number cannot exceed 20 characters']
  },
  company: {
    type: String,
    trim: true,
    maxlength: [200, 'Company name cannot exceed 200 characters']
  },
  jobTitle: {
    type: String,
    trim: true,
    maxlength: [100, 'Job title cannot exceed 100 characters']
  },
  website: {
    type: String,
    trim: true
  },
  
  // Address Information
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'Kenya'
    }
  },
  
  // Lead Management Fields
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'nurturing', 'converted', 'lost', 'unqualified'],
    default: 'new',
    index: true
  },
  lifecycleStage: {
    type: String,
    enum: ['subscriber', 'lead', 'marketing_qualified_lead', 'sales_qualified_lead', 'opportunity', 'customer', 'evangelist'],
    default: 'lead',
    index: true
  },
  leadScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
    index: true
  },
  leadRating: {
    type: String,
    enum: ['hot', 'warm', 'cold'],
    default: 'cold'
  },
  
  // Source and Attribution
  source: {
    type: String,
    enum: ['website', 'referral', 'social_media', 'email_campaign', 'paid_ad', 'organic_search', 'direct', 'other', 'api', 'admin'],
    default: 'website',
    index: true
  },
  sourceDetail: {
    type: String,
    trim: true
  },
  campaign: {
    type: String,
    trim: true
  },
  referrer: {
    type: String,
    trim: true
  },
  landingPage: {
    type: String,
    trim: true
  },
  
  // Assignment and Ownership
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  assignedAt: {
    type: Date
  },
  
  // Business Information
  industry: {
    type: String,
    trim: true
  },
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+', 'unknown'],
    default: 'unknown'
  },
  annualRevenue: {
    type: Number,
    min: 0
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
  
  // Interests and Preferences
  interests: [{
    type: String,
    trim: true
  }],
  services: [{
    type: String,
    trim: true
  }],
  
  // Communication Preferences
  preferredContactMethod: {
    type: String,
    enum: ['email', 'phone', 'whatsapp', 'meeting', 'any'],
    default: 'email'
  },
  doNotCall: {
    type: Boolean,
    default: false
  },
  doNotEmail: {
    type: Boolean,
    default: false
  },
  
  // Activity Tracking
  activities: [{
    type: {
      type: String,
      enum: ['email_sent', 'email_opened', 'email_clicked', 'call', 'meeting', 'note', 'task', 'whatsapp', 'form_submission', 'page_view', 'download', 'other'],
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed
    }
  }],
  
  // Notes
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
  
  // Tasks
  tasks: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    dueDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'cancelled'],
      default: 'pending'
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    completedAt: {
      type: Date
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Tags
  tags: [{
    type: String,
    trim: true
  }],
  
  // Conversion Tracking
  converted: {
    type: Boolean,
    default: false,
    index: true
  },
  convertedAt: {
    type: Date
  },
  convertedTo: {
    type: String,
    enum: ['customer', 'contact', 'deal', 'opportunity']
  },
  conversionValue: {
    type: Number,
    min: 0
  },
  
  // Engagement Metrics
  emailOpens: {
    type: Number,
    default: 0
  },
  emailClicks: {
    type: Number,
    default: 0
  },
  lastEmailOpen: {
    type: Date
  },
  lastEmailClick: {
    type: Date
  },
  lastActivityDate: {
    type: Date,
    index: true
  },
  
  // Custom Fields
  customFields: {
    type: mongoose.Schema.Types.Mixed
  },
  
  // Technical Tracking
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
  
  // Duplicate Detection
  duplicateOf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead'
  },
  
  // Internal Notes
  internalNotes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
leadSchema.index({ status: 1, createdAt: -1 });
leadSchema.index({ lifecycleStage: 1, createdAt: -1 });
leadSchema.index({ owner: 1, status: 1 });
leadSchema.index({ source: 1, createdAt: -1 });
leadSchema.index({ leadScore: -1 });
leadSchema.index({ email: 1 }, { unique: true, sparse: true });
leadSchema.index({ company: 1 });
leadSchema.index({ tags: 1 });
leadSchema.index({ lastActivityDate: -1 });

// Virtual for full name
leadSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`.trim();
});

// Virtual for budget display
leadSchema.virtual('budgetDisplay').get(function() {
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

// Method to add activity
leadSchema.methods.addActivity = function(activityData) {
  this.activities.push({
    ...activityData,
    date: new Date()
  });
  this.lastActivityDate = new Date();
  return this.save();
};

// Method to update lead score
leadSchema.methods.updateLeadScore = function(score) {
  this.leadScore = Math.max(0, Math.min(100, score));
  
  // Auto-update rating based on score
  if (this.leadScore >= 70) {
    this.leadRating = 'hot';
  } else if (this.leadScore >= 40) {
    this.leadRating = 'warm';
  } else {
    this.leadRating = 'cold';
  }
  
  return this.save();
};

// Method to convert lead
leadSchema.methods.convert = function(conversionData = {}) {
  this.converted = true;
  this.convertedAt = new Date();
  this.status = 'converted';
  this.lifecycleStage = 'customer';
  
  if (conversionData.convertedTo) {
    this.convertedTo = conversionData.convertedTo;
  }
  if (conversionData.conversionValue) {
    this.conversionValue = conversionData.conversionValue;
  }
  
  return this.save();
};

// Static method to get lead statistics
leadSchema.statics.getStats = async function(ownerId = null) {
  const matchStage = ownerId ? { owner: mongoose.Types.ObjectId(ownerId) } : {};
  
  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        new: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
        contacted: { $sum: { $cond: [{ $eq: ['$status', 'contacted'] }, 1, 0] } },
        qualified: { $sum: { $cond: [{ $eq: ['$status', 'qualified'] }, 1, 0] } },
        nurturing: { $sum: { $cond: [{ $eq: ['$status', 'nurturing'] }, 1, 0] } },
        converted: { $sum: { $cond: [{ $eq: ['$status', 'converted'] }, 1, 0] } },
        lost: { $sum: { $cond: [{ $eq: ['$status', 'lost'] }, 1, 0] } },
        unqualified: { $sum: { $cond: [{ $eq: ['$status', 'unqualified'] }, 1, 0] } },
        hot: { $sum: { $cond: [{ $eq: ['$leadRating', 'hot'] }, 1, 0] } },
        warm: { $sum: { $cond: [{ $eq: ['$leadRating', 'warm'] }, 1, 0] } },
        cold: { $sum: { $cond: [{ $eq: ['$leadRating', 'cold'] }, 1, 0] } },
        avgLeadScore: { $avg: '$leadScore' },
        totalConversionValue: { $sum: '$conversionValue' }
      }
    }
  ]);

  return stats[0] || {
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    nurturing: 0,
    converted: 0,
    lost: 0,
    unqualified: 0,
    hot: 0,
    warm: 0,
    cold: 0,
    avgLeadScore: 0,
    totalConversionValue: 0
  };
};

// Static method to get recent leads
leadSchema.statics.getRecent = async function(limit = 10, ownerId = null) {
  const query = ownerId ? { owner: ownerId } : {};
  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('firstName lastName email company status lifecycleStage leadScore createdAt')
    .populate('owner', 'name email');
};

// Pre-save middleware to update lastActivityDate
leadSchema.pre('save', function(next) {
  if (this.isModified('activities') && this.activities.length > 0) {
    this.lastActivityDate = new Date();
  }
  next();
});

module.exports = mongoose.model('Lead', leadSchema);

