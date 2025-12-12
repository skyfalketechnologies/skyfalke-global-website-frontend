const mongoose = require('mongoose');

const emailCampaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Campaign name is required'],
    trim: true,
    maxlength: [200, 'Campaign name cannot exceed 200 characters']
  },
  subject: {
    type: String,
    required: [true, 'Email subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Email content is required']
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled'],
    default: 'draft'
  },
  recipientType: {
    type: String,
    enum: ['all_subscribers', 'contacts', 'custom', 'segmented'],
    required: true
  },
  recipients: {
    // For custom recipients - array of email addresses
    customEmails: [{
      type: String,
      trim: true,
      lowercase: true
    }],
    // For segmented campaigns - filter criteria
    segmentCriteria: {
      tags: [String],
      source: String,
      subscribedAfter: Date,
      subscribedBefore: Date
    },
    // For contacts - filter criteria
    contactCriteria: {
      type: String,
      enum: ['all', 'new', 'in_progress', 'responded', 'closed'],
      default: 'all'
    }
  },
  scheduledAt: {
    type: Date
  },
  sentAt: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Tracking statistics
  stats: {
    totalRecipients: {
      type: Number,
      default: 0
    },
    sent: {
      type: Number,
      default: 0
    },
    delivered: {
      type: Number,
      default: 0
    },
    opened: {
      type: Number,
      default: 0
    },
    clicked: {
      type: Number,
      default: 0
    },
    bounced: {
      type: Number,
      default: 0
    },
    failed: {
      type: Number,
      default: 0
    },
    unsubscribed: {
      type: Number,
      default: 0
    }
  },
  // Email settings
  settings: {
    fromName: {
      type: String,
      default: 'Skyfalke Limited'
    },
    fromEmail: {
      type: String,
      default: process.env.EMAIL_USER || 'noreply@skyfalke.com'
    },
    replyTo: {
      type: String,
      default: process.env.EMAIL_USER || 'info@skyfalke.com'
    },
    trackOpens: {
      type: Boolean,
      default: true
    },
    trackClicks: {
      type: Boolean,
      default: true
    }
  },
  // Template settings
  template: {
    type: String,
    enum: ['newsletter', 'announcement', 'promotional', 'transactional', 'custom'],
    default: 'newsletter'
  },
  tags: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
emailCampaignSchema.index({ status: 1, createdAt: -1 });
emailCampaignSchema.index({ createdBy: 1, createdAt: -1 });
emailCampaignSchema.index({ scheduledAt: 1 });
emailCampaignSchema.index({ recipientType: 1 });

// Virtual for open rate
emailCampaignSchema.virtual('openRate').get(function() {
  if (this.stats.delivered === 0) return 0;
  return ((this.stats.opened / this.stats.delivered) * 100).toFixed(2);
});

// Virtual for click rate
emailCampaignSchema.virtual('clickRate').get(function() {
  if (this.stats.delivered === 0) return 0;
  return ((this.stats.clicked / this.stats.delivered) * 100).toFixed(2);
});

// Virtual for delivery rate
emailCampaignSchema.virtual('deliveryRate').get(function() {
  if (this.stats.sent === 0) return 0;
  return ((this.stats.delivered / this.stats.sent) * 100).toFixed(2);
});

// Method to get recipient list
emailCampaignSchema.methods.getRecipientList = async function() {
  const Subscription = mongoose.model('Subscription');
  const Contact = mongoose.model('Contact');
  
  let recipients = [];
  
  switch (this.recipientType) {
    case 'all_subscribers':
      recipients = await Subscription.find({ status: 'active' })
        .select('email name');
      break;
      
    case 'contacts':
      const contactQuery = {};
      if (this.recipients.contactCriteria !== 'all') {
        contactQuery.status = this.recipients.contactCriteria;
      }
      const contacts = await Contact.find(contactQuery)
        .select('email name');
      recipients = contacts.filter(c => c.email);
      break;
      
    case 'custom':
      recipients = this.recipients.customEmails.map(email => ({
        email,
        name: ''
      }));
      break;
      
    case 'segmented':
      const segmentQuery = { status: 'active' };
      
      if (this.recipients.segmentCriteria.tags?.length > 0) {
        segmentQuery.tags = { $in: this.recipients.segmentCriteria.tags };
      }
      
      if (this.recipients.segmentCriteria.source) {
        segmentQuery.source = this.recipients.segmentCriteria.source;
      }
      
      if (this.recipients.segmentCriteria.subscribedAfter) {
        segmentQuery.subscribedAt = { $gte: this.recipients.segmentCriteria.subscribedAfter };
      }
      
      if (this.recipients.segmentCriteria.subscribedBefore) {
        segmentQuery.subscribedAt = { 
          ...segmentQuery.subscribedAt,
          $lte: this.recipients.segmentCriteria.subscribedBefore 
        };
      }
      
      recipients = await Subscription.find(segmentQuery)
        .select('email name');
      break;
  }
  
  // Remove duplicates and invalid emails
  const uniqueRecipients = [];
  const seenEmails = new Set();
  
  for (const recipient of recipients) {
    const email = recipient.email?.toLowerCase().trim();
    if (email && !seenEmails.has(email) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      seenEmails.add(email);
      uniqueRecipients.push({
        email,
        name: recipient.name || ''
      });
    }
  }
  
  return uniqueRecipients;
};

// Static method to get campaign statistics
emailCampaignSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        draft: { $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] } },
        scheduled: { $sum: { $cond: [{ $eq: ['$status', 'scheduled'] }, 1, 0] } },
        sending: { $sum: { $cond: [{ $eq: ['$status', 'sending'] }, 1, 0] } },
        sent: { $sum: { $cond: [{ $eq: ['$status', 'sent'] }, 1, 0] } },
        totalSent: { $sum: '$stats.sent' },
        totalDelivered: { $sum: '$stats.delivered' },
        totalOpened: { $sum: '$stats.opened' },
        totalClicked: { $sum: '$stats.clicked' }
      }
    }
  ]);
  
  return stats[0] || {
    total: 0,
    draft: 0,
    scheduled: 0,
    sending: 0,
    sent: 0,
    totalSent: 0,
    totalDelivered: 0,
    totalOpened: 0,
    totalClicked: 0
  };
};

module.exports = mongoose.model('EmailCampaign', emailCampaignSchema);

