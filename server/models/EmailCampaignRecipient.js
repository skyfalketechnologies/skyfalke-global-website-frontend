const mongoose = require('mongoose');

const emailCampaignRecipientSchema = new mongoose.Schema({
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EmailCampaign',
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed', 'unsubscribed'],
    default: 'pending'
  },
  sentAt: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  openedAt: {
    type: Date
  },
  clickedAt: {
    type: Date
  },
  bounceReason: {
    type: String
  },
  failureReason: {
    type: String
  },
  // Tracking pixel for opens
  trackingToken: {
    type: String,
    unique: true,
    sparse: true
    // Note: Index is automatically created by unique: true
  },
  // Click tracking
  clicks: [{
    url: String,
    clickedAt: {
      type: Date,
      default: Date.now
    },
    ipAddress: String,
    userAgent: String
  }],
  // Unsubscribe tracking
  unsubscribedAt: {
    type: Date
  },
  unsubscribeToken: {
    type: String,
    unique: true,
    sparse: true
    // Note: Index is automatically created by unique: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
// Note: trackingToken and unsubscribeToken indexes are automatically created by unique: true in schema
emailCampaignRecipientSchema.index({ campaign: 1, status: 1 });
emailCampaignRecipientSchema.index({ email: 1, campaign: 1 });

// Generate unique tracking token
emailCampaignRecipientSchema.methods.generateTrackingToken = function() {
  const crypto = require('crypto');
  this.trackingToken = crypto.randomBytes(32).toString('hex');
  return this.trackingToken;
};

// Generate unique unsubscribe token
emailCampaignRecipientSchema.methods.generateUnsubscribeToken = function() {
  const crypto = require('crypto');
  this.unsubscribeToken = crypto.randomBytes(32).toString('hex');
  return this.unsubscribeToken;
};

// Mark as opened
emailCampaignRecipientSchema.methods.markAsOpened = async function() {
  // Only update if not already opened or clicked
  if (this.status !== 'opened' && this.status !== 'clicked') {
    this.status = 'opened';
    this.openedAt = new Date();
    await this.save();
    console.log(`Recipient ${this.email} marked as opened. Status: ${this.status}, openedAt: ${this.openedAt}`);
  }
  return this;
};

// Mark as clicked
emailCampaignRecipientSchema.methods.markAsClicked = function(url, ipAddress, userAgent) {
  this.status = 'clicked';
  if (!this.clickedAt) {
    this.clickedAt = new Date();
  }
  this.clicks.push({
    url,
    clickedAt: new Date(),
    ipAddress,
    userAgent
  });
  return this.save();
};

// Mark as unsubscribed
emailCampaignRecipientSchema.methods.markAsUnsubscribed = async function() {
  this.status = 'unsubscribed';
  this.unsubscribedAt = new Date();
  await this.save();
  
  // Also unsubscribe from main subscription list
  const Subscription = mongoose.model('Subscription');
  await Subscription.updateOne(
    { email: this.email },
    { 
      status: 'unsubscribed',
      unsubscribedAt: new Date()
    }
  );
  
  return this;
};

module.exports = mongoose.model('EmailCampaignRecipient', emailCampaignRecipientSchema);

