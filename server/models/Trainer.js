const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    required: true
  },
  shortBio: {
    type: String,
    required: true,
    maxlength: 200
  },
  avatar: {
    type: String,
    default: ''
  },
  expertise: [{
    type: String,
    required: true
  }],
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  education: [{
    degree: String,
    institution: String,
    year: Number
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: Date,
    expiry: Date
  }],
  workExperience: [{
    company: String,
    position: String,
    duration: String,
    description: String
  }],
  linkedin: {
    type: String,
    default: ''
  },
  twitter: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  languages: [{
    language: String,
    proficiency: {
      type: String,
      enum: ['Basic', 'Intermediate', 'Advanced', 'Native'],
      default: 'Intermediate'
    }
  }],
  hourlyRate: {
    type: Number,
    min: 0
  },
  availability: {
    type: String,
    enum: ['Available', 'Busy', 'Unavailable'],
    default: 'Available'
  },
  timezone: {
    type: String,
    default: 'UTC'
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
  coursesTaught: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  totalStudents: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for search
trainerSchema.index({ name: 'text', bio: 'text', expertise: 'text' });
trainerSchema.index({ isActive: 1, isVerified: 1 });
trainerSchema.index({ expertise: 1 });

module.exports = mongoose.model('Trainer', trainerSchema);
