const mongoose = require('mongoose');

const payrollItemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['earning', 'deduction'],
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  description: String
});

const payrollSchema = new mongoose.Schema({
  payrollNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  period: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12
    },
    year: {
      type: Number,
      required: true
    }
  },
  items: [payrollItemSchema],
  grossSalary: {
    type: Number,
    required: true,
    min: 0
  },
  totalDeductions: {
    type: Number,
    default: 0,
    min: 0
  },
  netSalary: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    enum: ['USD', 'KES'],
    default: 'KES'
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'paid', 'cancelled'],
    default: 'draft'
  },
  paymentMethod: {
    type: String,
    enum: ['bank', 'mpesa', 'cash', 'cheque'],
    default: 'bank'
  },
  paymentDate: Date,
  paymentReference: String,
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

// Generate payroll number
payrollSchema.pre('save', async function(next) {
  if (this.isNew && !this.payrollNumber) {
    const year = this.period.year;
    const month = String(this.period.month).padStart(2, '0');
    const count = await mongoose.model('Payroll').countDocuments({
      'period.year': year,
      'period.month': this.period.month
    });
    this.payrollNumber = `PAY${year}${month}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Calculate totals
payrollSchema.pre('save', function(next) {
  const earnings = this.items
    .filter(item => item.type === 'earning')
    .reduce((sum, item) => sum + item.amount, 0);
  
  const deductions = this.items
    .filter(item => item.type === 'deduction')
    .reduce((sum, item) => sum + item.amount, 0);
  
  this.grossSalary = earnings;
  this.totalDeductions = deductions;
  this.netSalary = earnings - deductions;
  
  next();
});

// Indexes
// Note: payrollNumber index is automatically created by unique: true in schema
payrollSchema.index({ employee: 1 });
payrollSchema.index({ 'period.year': 1, 'period.month': 1 });
payrollSchema.index({ status: 1 });
payrollSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Payroll', payrollSchema);

