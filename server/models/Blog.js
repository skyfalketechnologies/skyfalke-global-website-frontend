const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  slug: {
    type: String,
    required: false, // Make it optional since we'll generate it
    lowercase: true
  },
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
    trim: true,
    minlength: [10, 'Excerpt must be at least 10 characters long'],
    maxlength: [200, 'Excerpt cannot exceed 200 characters'],
    validate: {
      validator: function(v) {
        return v && v.trim().length >= 10;
      },
      message: 'Excerpt must be at least 10 characters long'
    }
  },
  content: {
    type: String,
    required: true
  },
  featuredImage: {
    url: {
      type: String,
      default: ''
    },
    imageKitId: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: ''
    }
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Digital Marketing', 'Cloud Solutions', 'Technology', 'Business', 'Industry Insights', 'Data Analytics', 'Creative Services', 'Earned Media', 'Paid Media']
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  readTime: {
    type: Number,
    default: 5
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  seo: {
    focusKeyword: {
      type: String,
      trim: true,
      default: ''
    },
    metaTitle: {
      type: String,
      maxlength: 60
    },
    metaDescription: {
      type: String,
      maxlength: 160
    },
    keywords: [String],
    canonicalUrl: String,
    ogTitle: String,
    ogDescription: String,
    ogImage: {
      url: String,
      imageKitId: String
    },
    twitterTitle: String,
    twitterDescription: String,
    twitterImage: {
      url: String,
      imageKitId: String
    },
    structuredData: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  socialSharing: {
    enableSharing: {
      type: Boolean,
      default: true
    },
    customMessage: String
  },
  relatedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }],
  status: {
    type: String,
    enum: ['draft', 'review', 'published', 'archived'],
    default: 'draft'
  }
}, {
  timestamps: true
});

const slugify = require('slugify');

// Generate slug from title
blogSchema.pre('save', function(next) {
  // Pre-save middleware executed
  
  // Always generate slug if title exists and slug is missing or title changed
  if (this.title && (!this.slug || this.isModified('title'))) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
    // Slug generated from title
  }
  
  // Fallback: if no slug exists, create one from timestamp
  if (!this.slug) {
    this.slug = `blog-${Date.now()}`;
    // Fallback slug generated
  }
  
  // Ensure excerpt is properly trimmed
  if (this.excerpt) {
    this.excerpt = this.excerpt.trim();
  }
  
  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
    this.isPublished = true;
  }
  
  // Calculate read time based on content length
  if (this.isModified('content')) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / wordsPerMinute);
  }
  
  // Auto-generate SEO fields if not provided
  if (this.isModified('title') || this.isModified('excerpt')) {
    if (!this.seo.metaTitle) {
      this.seo.metaTitle = this.title;
    }
    if (!this.seo.metaDescription) {
      this.seo.metaDescription = this.excerpt;
    }
    if (!this.seo.ogTitle) {
      this.seo.ogTitle = this.title;
    }
    if (!this.seo.ogDescription) {
      this.seo.ogDescription = this.excerpt;
    }
    if (!this.seo.twitterTitle) {
      this.seo.twitterTitle = this.title;
    }
    if (!this.seo.twitterDescription) {
      this.seo.twitterDescription = this.excerpt;
    }
  }
  
  next();
});

// Instance methods
blogSchema.methods.incrementViews = function() {
  this.views += 1;
  // Save without validation to avoid issues with required fields
  return this.save({ validateBeforeSave: false });
};

blogSchema.methods.incrementLikes = function() {
  this.likes += 1;
  return this.save({ validateBeforeSave: false });
};

blogSchema.methods.incrementShares = function() {
  this.shares += 1;
  return this.save({ validateBeforeSave: false });
};

// Static methods
blogSchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug, status: 'published' });
};

blogSchema.statics.findPublished = function() {
  return this.find({ status: 'published' });
};

blogSchema.statics.findFeatured = function() {
  return this.find({ status: 'published', isFeatured: true });
};

blogSchema.statics.findByCategory = function(category) {
  return this.find({ status: 'published', category });
};

blogSchema.statics.findByTag = function(tag) {
  return this.find({ status: 'published', tags: tag });
};

// Indexes for better performance
blogSchema.index({ slug: 1 }, { unique: true });

module.exports = mongoose.model('Blog', blogSchema);
