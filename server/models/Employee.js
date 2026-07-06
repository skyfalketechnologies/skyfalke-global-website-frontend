const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  /** Login user linked to this employee record (Employee Portal) */
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true
  },
  employeeId: {
    type: String,
    unique: true,
    trim: true,
    sparse: true // Allows multiple null values but enforces uniqueness for non-null values
  },
  personalInfo: {
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
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    dateOfBirth: {
      type: Date,
      required: true
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: {
        type: String,
        default: 'Kenya'
      }
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String
    }
  },
  employmentInfo: {
    department: {
      type: String,
      required: true,
      trim: true
    },
    position: {
      type: String,
      required: true,
      trim: true
    },
    jobTitle: {
      type: String,
      required: true,
      trim: true
    },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'intern'],
      default: 'full-time'
    },
    hireDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    terminationDate: Date,
    status: {
      type: String,
      enum: ['active', 'on-leave', 'terminated', 'resigned'],
      default: 'active'
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    },
    salary: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      enum: ['USD', 'KES'],
      default: 'KES'
    }
  },
  documents: [{
    type: {
      type: String,
      enum: ['contract', 'id', 'certificate', 'other']
    },
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  skills: [String],
  /** Annual / sick / etc. balances per calendar year */
  leaveBalances: [{
    year: { type: Number, required: true },
    annual: { allocated: { type: Number, default: 0 }, used: { type: Number, default: 0 } },
    sick: { allocated: { type: Number, default: 0 }, used: { type: Number, default: 0 } },
    personal: { allocated: { type: Number, default: 0 }, used: { type: Number, default: 0 } }
  }],
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Generate employee ID
employeeSchema.pre('save', async function(next) {
  if (this.isNew && !this.employeeId) {
    const count = await mongoose.model('Employee').countDocuments();
    this.employeeId = `EMP${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Virtual for full name
employeeSchema.virtual('fullName').get(function() {
  return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
});

// Indexes
// Note: employeeId index is automatically created by unique: true in schema
employeeSchema.index({ 'personalInfo.email': 1 });
employeeSchema.index({ user: 1 });
employeeSchema.index({ 'employmentInfo.department': 1 });
employeeSchema.index({ 'employmentInfo.status': 1 });
employeeSchema.index({ 'employmentInfo.hireDate': -1 });

module.exports = mongoose.model('Employee', employeeSchema);

