const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true,
    maxlength: 200
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['ICT', 'AI', 'Digital Transformation', 'Cloud Innovation', 'Data Analytics', 'Cybersecurity', 'Software Development']
  },
  level: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
  },
  duration: {
    type: String,
    required: true // e.g., "4 weeks", "2 months"
  },
  durationHours: {
    type: Number,
    required: true // total hours
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard', 'Expert']
  },
  syllabus: [{
    week: Number,
    title: String,
    topics: [String],
    duration: String
  }],
  prerequisites: [String],
  learningOutcomes: [String],
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  enrollmentCount: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  tags: [String],
  startDate: Date,
  endDate: Date,
  maxStudents: {
    type: Number,
    default: 50
  },
  currentStudents: {
    type: Number,
    default: 0
  },
  certificate: {
    type: Boolean,
    default: true
  },
  language: {
    type: String,
    default: 'English'
  },
  format: {
    type: String,
    enum: ['Online', 'Hybrid', 'Self-paced'],
    default: 'Online'
  }
}, {
  timestamps: true
});

// Create slug from title
courseSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

// Index for search and filtering
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });
courseSchema.index({ category: 1, level: 1, isActive: 1 });
courseSchema.index({ isFeatured: 1, isActive: 1 });

module.exports = mongoose.model('Course', courseSchema);
