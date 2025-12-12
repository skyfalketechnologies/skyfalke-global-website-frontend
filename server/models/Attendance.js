const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  checkIn: {
    time: Date,
    location: {
      latitude: Number,
      longitude: Number,
      address: String
    },
    method: {
      type: String,
      enum: ['manual', 'biometric', 'mobile', 'web'],
      default: 'manual'
    }
  },
  checkOut: {
    time: Date,
    location: {
      latitude: Number,
      longitude: Number,
      address: String
    },
    method: {
      type: String,
      enum: ['manual', 'biometric', 'mobile', 'web'],
      default: 'manual'
    }
  },
  breakTime: {
    start: Date,
    end: Date,
    duration: {
      type: Number,
      default: 0
    }
  },
  totalHours: {
    type: Number,
    default: 0,
    min: 0
  },
  overtimeHours: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'half-day', 'leave', 'holiday'],
    default: 'present'
  },
  leaveType: {
    type: String,
    enum: ['sick', 'annual', 'maternity', 'paternity', 'unpaid', 'other']
  },
  notes: String,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Calculate total hours
attendanceSchema.pre('save', function(next) {
  if (this.checkIn.time && this.checkOut.time) {
    const checkInTime = new Date(this.checkIn.time);
    const checkOutTime = new Date(this.checkOut.time);
    const diffMs = checkOutTime - checkInTime;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    // Subtract break time if exists
    let breakDuration = 0;
    if (this.breakTime.start && this.breakTime.end) {
      const breakStart = new Date(this.breakTime.start);
      const breakEnd = new Date(this.breakTime.end);
      breakDuration = (breakEnd - breakStart) / (1000 * 60 * 60);
      this.breakTime.duration = breakDuration;
    }
    
    this.totalHours = Math.max(0, diffHours - breakDuration);
    
    // Calculate overtime (assuming 8 hours is standard)
    const standardHours = 8;
    this.overtimeHours = Math.max(0, this.totalHours - standardHours);
  }
  next();
});

// Indexes
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });
attendanceSchema.index({ date: -1 });
attendanceSchema.index({ status: 1 });
attendanceSchema.index({ employee: 1, date: -1 });

module.exports = mongoose.model('Attendance', attendanceSchema);

