const mongoose = require('mongoose');

const partnershipSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  contactName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    required: true,
    enum: [
      'Technology',
      'Healthcare',
      'Finance',
      'Education',
      'Manufacturing',
      'Retail',
      'Real Estate',
      'Consulting',
      'Marketing',
      'Creative Services',
      'Other'
    ]
  },
  partnershipType: {
    type: String,
    required: true,
    enum: [
      'Technology Partners',
      'Development Partners',
      'Creative Partners',
      'Marketing Partners',
      'Cloud & Infrastructure',
      'Consulting Partners',
      'Referral Partners'
    ]
  },
  companySize: {
    type: String,
    enum: [
      '1-10 employees',
      '11-50 employees',
      '51-200 employees',
      '201-500 employees',
      '500+ employees'
    ]
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  referralSource: {
    type: String,
    enum: [
      'Existing Partner',
      'Client Referral',
      'Industry Event',
      'Social Media',
      'Website',
      'Search Engine',
      'Other'
    ]
  },
  referralDetails: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'approved', 'rejected', 'contacted'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    trim: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  contactAttempts: [{
    method: {
      type: String,
      enum: ['email', 'phone', 'meeting']
    },
    date: {
      type: Date,
      default: Date.now
    },
    notes: String,
    outcome: {
      type: String,
      enum: ['successful', 'no_response', 'declined', 'scheduled']
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  estimatedValue: {
    type: Number,
    min: 0
  },
  nextFollowUp: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
partnershipSchema.index({ status: 1, createdAt: -1 });
partnershipSchema.index({ partnershipType: 1, status: 1 });
partnershipSchema.index({ industry: 1, status: 1 });
partnershipSchema.index({ email: 1 });
partnershipSchema.index({ companyName: 1 });

// Virtual for formatted creation date
partnershipSchema.virtual('formattedCreatedAt').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for formatted updated date
partnershipSchema.virtual('formattedUpdatedAt').get(function() {
  return this.updatedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Method to update status
partnershipSchema.methods.updateStatus = function(newStatus, userId, notes = '') {
  this.status = newStatus;
  this.reviewedBy = userId;
  this.reviewedAt = new Date();
  if (notes) {
    this.adminNotes = notes;
  }
  return this.save();
};

// Method to add contact attempt
partnershipSchema.methods.addContactAttempt = function(method, notes, outcome) {
  this.contactAttempts.push({
    method,
    notes,
    outcome,
    date: new Date()
  });
  return this.save();
};

// Static method to get statistics
partnershipSchema.statics.getStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

// Static method to get partnerships by type
partnershipSchema.statics.getByType = function(type) {
  return this.find({ partnershipType: type }).sort({ createdAt: -1 });
};

// Static method to get recent partnerships
partnershipSchema.statics.getRecent = function(limit = 10) {
  return this.find().sort({ createdAt: -1 }).limit(limit);
};

module.exports = mongoose.model('Partnership', partnershipSchema);
