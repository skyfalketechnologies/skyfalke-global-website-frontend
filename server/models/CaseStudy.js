const mongoose = require('mongoose');

const caseStudySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Case study title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    lowercase: true,
    trim: true
  },
  client: {
    name: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true
    },
    industry: {
      type: String,
      required: [true, 'Client industry is required'],
      trim: true
    },
    logo: {
      url: String,
      imageKitId: String
    },
    website: String
  },
  summary: {
    type: String,
    required: [true, 'Case study summary is required'],
    maxlength: [500, 'Summary cannot exceed 500 characters']
  },
  description: {
    type: String,
    required: [true, 'Case study description is required']
  },
  challenge: {
    type: String,
    required: [true, 'Challenge description is required']
  },
  solution: {
    type: String,
    required: [true, 'Solution description is required']
  },
  results: {
    type: String,
    required: [true, 'Results description is required']
  },
  metrics: [{
    label: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    unit: String,
    description: String
  }],
  services: [{
    type: String,
    enum: [
      'Digital Marketing',
      'Cloud Solutions',
      'Business Tools',
      'Data Analytics',
      'Earned Media',
      'Paid Media',
      'Creative Services',
      'Custom Development',
      'Technology Consulting',
      'AI & Machine Learning',
      'Cybersecurity'
    ]
  }],
  technologies: [{
    type: String,
    trim: true
  }],
  duration: {
    startDate: Date,
    endDate: Date,
    duration: String // e.g., "3 months", "6 weeks"
  },
  budget: {
    type: String,
    enum: ['Under $10,000', '$10,000 - $25,000', '$25,000 - $50,000', '$50,000 - $100,000', 'Over $100,000', 'Not disclosed'],
    default: undefined
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    imageKitId: String,
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  testimonial: {
    content: String,
    author: String,
    position: String,
    company: String,
    avatar: {
      url: String,
      imageKitId: String
    }
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  publishedAt: Date,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
caseStudySchema.index({ slug: 1 }, { unique: true });
caseStudySchema.index({ status: 1 });
caseStudySchema.index({ featured: 1 });
caseStudySchema.index({ 'client.industry': 1 });
caseStudySchema.index({ services: 1 });
caseStudySchema.index({ tags: 1 });
caseStudySchema.index({ createdAt: -1 });

// Virtual for reading time
caseStudySchema.virtual('readingTime').get(function() {
  const wordsPerMinute = 200;
  const wordCount = this.description.split(' ').length;
  return Math.ceil(wordCount / wordsPerMinute);
});

// Pre-save middleware to generate slug if not provided
caseStudySchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  
  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

// Static methods
caseStudySchema.statics.getPublished = function() {
  return this.find({ status: 'published' }).sort({ publishedAt: -1 });
};

caseStudySchema.statics.getFeatured = function(limit = 6) {
  return this.find({ 
    status: 'published', 
    featured: true 
  })
  .sort({ publishedAt: -1 })
  .limit(limit);
};

caseStudySchema.statics.getByIndustry = function(industry) {
  return this.find({ 
    status: 'published', 
    'client.industry': industry 
  }).sort({ publishedAt: -1 });
};

caseStudySchema.statics.getByService = function(service) {
  return this.find({ 
    status: 'published', 
    services: service 
  }).sort({ publishedAt: -1 });
};

caseStudySchema.statics.search = function(query) {
  return this.find({
    status: 'published',
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { summary: { $regex: query, $options: 'i' } },
      { 'client.name': { $regex: query, $options: 'i' } },
      { 'client.industry': { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ]
  }).sort({ publishedAt: -1 });
};

// Pre-save middleware to handle empty strings
caseStudySchema.pre('save', function(next) {
  // Convert empty strings to undefined for optional enum fields
  if (this.budget === '') {
    this.budget = undefined;
  }
  next();
});

// Pre-update middleware to handle empty strings
caseStudySchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function(next) {
  const update = this.getUpdate();
  if (update && update.budget === '') {
    update.budget = undefined;
  }
  next();
});

module.exports = mongoose.model('CaseStudy', caseStudySchema);
