const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
    required: true
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Enrolled', 'In Progress', 'Completed', 'Dropped', 'Suspended'],
    default: 'Enrolled'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completedLessons: [{
    lessonId: String,
    completedAt: Date,
    score: Number
  }],
  assignments: [{
    assignmentId: String,
    submittedAt: Date,
    score: Number,
    feedback: String
  }],
  finalScore: {
    type: Number,
    min: 0,
    max: 100
  },
  certificateIssued: {
    type: Boolean,
    default: false
  },
  certificateUrl: {
    type: String,
    default: ''
  },
  payment: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    paymentMethod: {
      type: String,
      required: true
    },
    transactionId: {
      type: String,
      required: true
    },
    paymentDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
      default: 'Pending'
    }
  },
  discount: {
    code: String,
    amount: Number,
    percentage: Number
  },
  notes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  completionDate: Date,
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    submittedAt: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });
enrollmentSchema.index({ trainer: 1, status: 1 });
enrollmentSchema.index({ status: 1, enrollmentDate: 1 });
enrollmentSchema.index({ 'payment.transactionId': 1 });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
