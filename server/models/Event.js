const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true
  },
  featuredImage: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  eventType: {
    type: String,
    required: true,
    enum: [
      'Webinar',
      'Conference',
      'Workshop',
      'Meetup',
      'Hackathon',
      'Training',
      'Networking',
      'Product Launch',
      'Award Ceremony',
      'Other'
    ]
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Technology',
      'Business',
      'Marketing',
      'Development',
      'Design',
      'AI/ML',
      'Cloud Computing',
      'Cybersecurity',
      'Data Science',
      'Startup',
      'Other'
    ]
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  location: {
    type: {
      type: String,
      enum: ['physical', 'virtual', 'hybrid'],
      required: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    },
    venue: String,
    virtualPlatform: String,
    virtualUrl: String
  },
  capacity: {
    type: Number,
    min: 0
  },
  registeredAttendees: [{
    name: String,
    email: String,
    company: String,
    registrationDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['registered', 'confirmed', 'attended', 'cancelled'],
      default: 'registered'
    }
  }],
  pricing: {
    earlyBird: {
      price: Number,
      validUntil: Date
    },
    regular: {
      price: Number
    },
    vip: {
      price: Number,
      description: String
    },
    isFree: {
      type: Boolean,
      default: false
    }
  },
  speakers: [{
    name: String,
    title: String,
    company: String,
    bio: String,
    image: String,
    socialLinks: {
      linkedin: String,
      twitter: String,
      website: String
    }
  }],
  agenda: [{
    time: String,
    title: String,
    speaker: String,
    description: String,
    duration: Number // in minutes
  }],
  sponsors: [{
    name: String,
    logo: String,
    website: String,
    tier: {
      type: String,
      enum: ['platinum', 'gold', 'silver', 'bronze']
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  registrationEnabled: {
    type: Boolean,
    default: true
  },
  registrationDeadline: Date,
  maxRegistrations: Number,
  waitlistEnabled: {
    type: Boolean,
    default: false
  },
  waitlist: [{
    name: String,
    email: String,
    company: String,
    joinedDate: {
      type: Date,
      default: Date.now
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
eventSchema.index({ slug: 1 }, { unique: true });
eventSchema.index({ status: 1, startDate: 1 });
eventSchema.index({ eventType: 1, status: 1 });
eventSchema.index({ category: 1, status: 1 });
eventSchema.index({ featured: 1, status: 1 });
eventSchema.index({ startDate: 1, endDate: 1 });
eventSchema.index({ tags: 1 });

// Virtual for formatted dates
eventSchema.virtual('formattedStartDate').get(function() {
  return this.startDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

eventSchema.virtual('formattedEndDate').get(function() {
  return this.endDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for event status based on dates
eventSchema.virtual('eventStatus').get(function() {
  const now = new Date();
  if (this.endDate < now) return 'completed';
  if (this.startDate <= now && this.endDate >= now) return 'ongoing';
  if (this.startDate > now) return 'upcoming';
  return 'unknown';
});

// Virtual for registration status
eventSchema.virtual('registrationStatus').get(function() {
  if (!this.registrationEnabled) return 'disabled';
  if (this.registrationDeadline && new Date() > this.registrationDeadline) return 'closed';
  if (this.maxRegistrations && this.registeredAttendees.length >= this.maxRegistrations) return 'full';
  return 'open';
});

// Method to generate slug
eventSchema.methods.generateSlug = function() {
  const baseSlug = this.title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
  
  return `${baseSlug}-${Date.now()}`;
};

// Method to register attendee
eventSchema.methods.registerAttendee = function(attendeeData) {
  if (this.registrationStatus !== 'open') {
    throw new Error('Registration is not open for this event');
  }
  
  if (this.maxRegistrations && this.registeredAttendees.length >= this.maxRegistrations) {
    if (this.waitlistEnabled) {
      this.waitlist.push(attendeeData);
      return { status: 'waitlisted', message: 'You have been added to the waitlist' };
    } else {
      throw new Error('Event is at full capacity');
    }
  }
  
  this.registeredAttendees.push(attendeeData);
  return { status: 'registered', message: 'Registration successful' };
};

// Method to cancel registration
eventSchema.methods.cancelRegistration = function(email) {
  const attendeeIndex = this.registeredAttendees.findIndex(a => a.email === email);
  if (attendeeIndex === -1) {
    throw new Error('Attendee not found');
  }
  
  this.registeredAttendees.splice(attendeeIndex, 1);
  
  // Move someone from waitlist if available
  if (this.waitlist.length > 0) {
    const waitlistedAttendee = this.waitlist.shift();
    this.registeredAttendees.push(waitlistedAttendee);
  }
  
  return { status: 'cancelled', message: 'Registration cancelled successfully' };
};

// Static method to get upcoming events
eventSchema.statics.getUpcoming = function(limit = 10) {
  return this.find({
    status: 'published',
    startDate: { $gt: new Date() }
  })
  .sort({ startDate: 1 })
  .limit(limit);
};

// Static method to get featured events
eventSchema.statics.getFeatured = function() {
  return this.find({
    status: 'published',
    featured: true,
    startDate: { $gt: new Date() }
  })
  .sort({ startDate: 1 });
};

// Static method to get events by category
eventSchema.statics.getByCategory = function(category, limit = 10) {
  return this.find({
    status: 'published',
    category: category
  })
  .sort({ startDate: 1 })
  .limit(limit);
};

// Static method to get events by type
eventSchema.statics.getByType = function(eventType, limit = 10) {
  return this.find({
    status: 'published',
    eventType: eventType
  })
  .sort({ startDate: 1 })
  .limit(limit);
};

// Static method to search events
eventSchema.statics.search = function(query, limit = 10) {
  return this.find({
    status: 'published',
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ]
  })
  .sort({ startDate: 1 })
  .limit(limit);
};

// Pre-save middleware to generate slug if not provided
eventSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.generateSlug();
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema);
