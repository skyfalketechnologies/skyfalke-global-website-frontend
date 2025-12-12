const mongoose = require('mongoose');

const tenderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Tender title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  referenceNumber: {
    type: String,
    trim: true,
    index: true
  },
  organization: {
    type: String,
    required: [true, 'Organization is required'],
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  value: {
    amount: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      default: 'KES'
    }
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required'],
    index: true
  },
  submissionDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['draft', 'open', 'in_progress', 'submitted', 'awarded', 'closed', 'cancelled'],
    default: 'draft',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  // Assignment
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  assignedAt: {
    type: Date
  },
  // Creator
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Application tracking
  applicationStatus: {
    type: String,
    enum: ['not_applied', 'applied', 'shortlisted', 'rejected', 'awarded'],
    default: 'not_applied'
  },
  applicationDate: {
    type: Date
  },
  applicationNotes: {
    type: String,
    trim: true
  },
  // Documents and attachments
  documents: [{
    name: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  // Requirements
  requirements: [{
    type: String,
    trim: true
  }],
  // Tags
  tags: [{
    type: String,
    trim: true
  }],
  // Notes and comments
  notes: [{
    note: {
      type: String,
      required: true,
      trim: true
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Activity log
  activities: [{
    type: {
      type: String,
      enum: ['created', 'updated', 'assigned', 'status_changed', 'deadline_changed', 'application_submitted', 'note_added'],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      trim: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Deadline reminder tracking
  deadlineRemindersSent: [{
    sentAt: {
      type: Date,
      default: Date.now
    },
    daysBefore: {
      type: Number
    }
  }],
  // External links
  externalLink: {
    type: String,
    trim: true
  },
  // Source
  source: {
    type: String,
    enum: ['manual', 'website', 'email', 'api', 'other'],
    default: 'manual'
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
tenderSchema.index({ deadline: 1, status: 1 });
tenderSchema.index({ assignee: 1, status: 1 });
tenderSchema.index({ createdBy: 1 });
tenderSchema.index({ status: 1, deadline: 1 });

// Instance method to add activity
tenderSchema.methods.addActivity = async function(activityData) {
  this.activities.push({
    ...activityData,
    createdAt: new Date()
  });
  return await this.save();
};

// Static method to get tenders approaching deadline
tenderSchema.statics.getTendersApproachingDeadline = async function(daysBefore = 7) {
  const now = new Date();
  const futureDate = new Date(now.getTime() + (daysBefore * 24 * 60 * 60 * 1000));
  
  return await this.find({
    deadline: {
      $gte: now,
      $lte: futureDate
    },
    status: { $in: ['open', 'in_progress'] },
    assignee: { $exists: true, $ne: null }
  }).populate('assignee', 'name email').populate('createdBy', 'name email');
};

// Static method to get statistics
tenderSchema.statics.getStats = async function(userId = null) {
  const filter = userId ? { $or: [{ createdBy: userId }, { assignee: userId }] } : {};
  
  const [
    total,
    open,
    inProgress,
    submitted,
    awarded,
    approachingDeadline
  ] = await Promise.all([
    this.countDocuments(filter),
    this.countDocuments({ ...filter, status: 'open' }),
    this.countDocuments({ ...filter, status: 'in_progress' }),
    this.countDocuments({ ...filter, status: 'submitted' }),
    this.countDocuments({ ...filter, status: 'awarded' }),
    this.countDocuments({
      ...filter,
      deadline: { $gte: new Date(), $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      status: { $in: ['open', 'in_progress'] }
    })
  ]);

  return {
    total,
    open,
    inProgress,
    submitted,
    awarded,
    approachingDeadline
  };
};

// Pre-save middleware to track changes
tenderSchema.pre('save', function(next) {
  if (this.isNew) {
    // This is a new tender
    next();
  } else {
    // Check if assignee changed
    if (this.isModified('assignee')) {
      this.assignedAt = new Date();
    }
    next();
  }
});

module.exports = mongoose.model('Tender', tenderSchema);

