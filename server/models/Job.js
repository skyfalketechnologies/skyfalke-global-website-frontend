const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Development', 'Design', 'Marketing', 'Sales', 'Operations', 'Management']
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship']
  },
  experience: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: [{
    type: String,
    required: true
  }],
  benefits: [{
    type: String,
    required: true
  }],
  salary: {
    min: {
      type: Number,
      required: false
    },
    max: {
      type: Number,
      required: false
    },
    currency: {
      type: String,
      default: 'USD'
    },
    period: {
      type: String,
      enum: ['hourly', 'monthly', 'yearly'],
      default: 'yearly'
    }
  },
  isRemote: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  postedDate: {
    type: Date,
    default: Date.now
  },
  deadline: {
    type: Date,
    required: false
  },
  department: {
    type: String,
    required: false,
    trim: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  responsibilities: [{
    type: String,
    required: true
  }],
  companyInfo: {
    name: {
      type: String,
      default: 'Skyfalke'
    },
    description: {
      type: String,
      default: 'Leading Digital Marketing & Technology Solutions in Africa'
    }
  },
  contactInfo: {
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: false
    }
  },
  applicationCount: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  slug: {
    type: String,
    unique: true,
    required: false,
    sparse: true
  }
}, {
  timestamps: true
});

// Create slug from title before saving
jobSchema.pre('save', async function(next) {
  // Always generate slug if it doesn't exist (or is empty), if it's a new document, or if title is modified
  if (!this.slug || (typeof this.slug === 'string' && this.slug.trim() === '') || this.isNew || (this.isModified('title') && this.title)) {
    if (!this.title) {
      return next(new Error('Title is required to generate slug'));
    }
    
    let baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
    
    // Ensure slug is unique
    let slug = baseSlug;
    let counter = 1;
    const Job = this.constructor;
    
    while (true) {
      const existingJob = await Job.findOne({ slug });
      if (!existingJob || (this._id && existingJob._id.toString() === this._id.toString())) {
        break;
      }
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = slug;
  }
  
  next();
});

// Index for search functionality
jobSchema.index({
  title: 'text',
  description: 'text',
  requirements: 'text',
  skills: 'text',
  tags: 'text'
});

// Instance methods
jobSchema.methods.incrementViews = function() {
  this.views += 1;
  // Save without validation to avoid issues with required fields
  return this.save({ validateBeforeSave: false });
};

module.exports = mongoose.model('Job', jobSchema);
