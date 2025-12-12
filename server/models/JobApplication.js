const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicant: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      city: {
        type: String,
        required: true,
        trim: true
      },
      country: {
        type: String,
        required: true,
        trim: true
      }
    },
    linkedin: {
      type: String,
      required: false,
      trim: true
    },
    portfolio: {
      type: String,
      required: false,
      trim: true
    },
    github: {
      type: String,
      required: false,
      trim: true
    }
  },
  experience: {
    yearsOfExperience: {
      type: Number,
      required: true,
      min: 0
    },
    currentCompany: {
      type: String,
      required: false,
      trim: true
    },
    currentPosition: {
      type: String,
      required: false,
      trim: true
    },
    expectedSalary: {
      amount: {
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
    noticePeriod: {
      type: String,
      required: false,
      trim: true
    }
  },
  education: {
    highestDegree: {
      type: String,
      required: true,
      trim: true
    },
    fieldOfStudy: {
      type: String,
      required: true,
      trim: true
    },
    institution: {
      type: String,
      required: true,
      trim: true
    },
    graduationYear: {
      type: Number,
      required: true
    }
  },
  skills: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Intermediate'
    }
  }],
  coverLetter: {
    type: String,
    required: true,
    maxlength: 2000
  },
  resume: {
    filename: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    }
  },
  additionalFiles: [{
    filename: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    }
  }],
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Hired'],
    default: 'Pending'
  },
  notes: [{
    content: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  interviewSchedule: {
    scheduledDate: {
      type: Date,
      required: false
    },
    interviewType: {
      type: String,
      enum: ['Phone', 'Video', 'In-person'],
      required: false
    },
    interviewer: {
      type: String,
      required: false
    },
    notes: {
      type: String,
      required: false
    }
  },
  source: {
    type: String,
    enum: ['Website', 'LinkedIn', 'Indeed', 'Referral', 'Other'],
    default: 'Website'
  },
  isRemote: {
    type: Boolean,
    default: false
  },
  availability: {
    startDate: {
      type: Date,
      required: false
    },
    preferredStartDate: {
      type: Date,
      required: false
    }
  },
  references: [{
    name: {
      type: String,
      required: true
    },
    position: {
      type: String,
      required: true
    },
    company: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: false
    },
    relationship: {
      type: String,
      required: true
    }
  }],
  consent: {
    dataProcessing: {
      type: Boolean,
      required: true,
      default: false
    },
    contactForFuture: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  ipAddress: {
    type: String,
    required: false
  },
  userAgent: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
jobApplicationSchema.index({ jobId: 1, status: 1 });
jobApplicationSchema.index({ 'applicant.email': 1 });
jobApplicationSchema.index({ createdAt: -1 });

// Virtual for full name
jobApplicationSchema.virtual('applicant.fullName').get(function() {
  return `${this.applicant.firstName} ${this.applicant.lastName}`;
});

// Ensure virtuals are serialized
jobApplicationSchema.set('toJSON', { virtuals: true });
jobApplicationSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
