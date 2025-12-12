const mongoose = require('mongoose');

const reportItemSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  accountName: String,
  amount: {
    type: Number,
    default: 0
  }
});

const financialReportSchema = new mongoose.Schema({
  reportNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'profit-loss',
      'balance-sheet',
      'cash-flow',
      'trial-balance',
      'income-statement',
      'expense-report',
      'custom'
    ]
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  period: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  items: [reportItemSchema],
  summary: {
    totalIncome: {
      type: Number,
      default: 0
    },
    totalExpenses: {
      type: Number,
      default: 0
    },
    netIncome: {
      type: Number,
      default: 0
    },
    totalAssets: {
      type: Number,
      default: 0
    },
    totalLiabilities: {
      type: Number,
      default: 0
    },
    totalEquity: {
      type: Number,
      default: 0
    }
  },
  currency: {
    type: String,
    enum: ['USD', 'KES'],
    default: 'KES'
  },
  status: {
    type: String,
    enum: ['draft', 'final', 'archived'],
    default: 'draft'
  },
  notes: String,
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date
}, {
  timestamps: true
});

// Generate report number
financialReportSchema.pre('save', async function(next) {
  if (this.isNew && !this.reportNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('FinancialReport').countDocuments({
      createdAt: {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1)
      }
    });
    const prefix = this.type.toUpperCase().substring(0, 3).replace('-', '');
    this.reportNumber = `${prefix}${year}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Calculate summary
financialReportSchema.pre('save', function(next) {
  if (this.type === 'profit-loss' || this.type === 'income-statement') {
    const income = this.items
      .filter(item => item.account && item.amount > 0)
      .reduce((sum, item) => sum + item.amount, 0);
    
    const expenses = this.items
      .filter(item => item.account && item.amount < 0)
      .reduce((sum, item) => sum + Math.abs(item.amount), 0);
    
    this.summary.totalIncome = income;
    this.summary.totalExpenses = expenses;
    this.summary.netIncome = income - expenses;
  }
  next();
});

// Indexes
// Note: reportNumber index is automatically created by unique: true in schema
financialReportSchema.index({ type: 1 });
financialReportSchema.index({ 'period.startDate': -1, 'period.endDate': -1 });
financialReportSchema.index({ status: 1 });
financialReportSchema.index({ createdAt: -1 });

module.exports = mongoose.model('FinancialReport', financialReportSchema);

