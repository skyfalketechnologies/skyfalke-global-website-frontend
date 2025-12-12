const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  name: {
    type: String,
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  status: {
    type: String,
    enum: ['active', 'unsubscribed', 'pending'],
    default: 'active'
  },
  source: {
    type: String,
    enum: ['footer', 'blog', 'contact_form', 'admin', 'api'],
    default: 'footer'
  },
  preferences: {
    newsletter: {
      type: Boolean,
      default: true
    },
    blogUpdates: {
      type: Boolean,
      default: true
    },
    productUpdates: {
      type: Boolean,
      default: true
    },
    eventNotifications: {
      type: Boolean,
      default: true
    }
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
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  unsubscribedAt: {
    type: Date
  },
  lastEmailSent: {
    type: Date
  },
  emailCount: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
subscriptionSchema.index({ email: 1 }, { unique: true });
subscriptionSchema.index({ status: 1, subscribedAt: -1 });
subscriptionSchema.index({ source: 1, subscribedAt: -1 });

// Instance method to unsubscribe
subscriptionSchema.methods.unsubscribe = function() {
  this.status = 'unsubscribed';
  this.unsubscribedAt = new Date();
  return this.save();
};

// Instance method to resubscribe
subscriptionSchema.methods.resubscribe = function() {
  this.status = 'active';
  this.unsubscribedAt = undefined;
  return this.save();
};

// Static method to check if email is subscribed
subscriptionSchema.statics.isSubscribed = function(email) {
  return this.findOne({ 
    email: email.toLowerCase(), 
    status: 'active' 
  });
};

// Static method to get active subscribers
subscriptionSchema.statics.getActiveSubscribers = function() {
  return this.find({ status: 'active' }).select('email name preferences');
};

// Pre-save middleware to ensure email is lowercase
subscriptionSchema.pre('save', function(next) {
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  next();
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
