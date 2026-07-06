const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  expenseNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'office-supplies',
      'travel',
      'utilities',
      'rent',
      'marketing',
      'software',
      'equipment',
      'professional-services',
      'training',
      'maintenance',
      'insurance',
      'taxes',
      'other'
    ]
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    enum: ['USD', 'KES'],
    default: 'KES'
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  vendor: {
    name: String,
    contact: String,
    address: String
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank', 'mpesa', 'card', 'cheque'],
    default: 'bank'
  },
  receipt: {
    url: String,
    number: String
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'paid'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  rejectionReason: String,
  tags: [String],
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Generate expense number before validation (required runs after pre('validate'))
expenseSchema.pre('validate', async function() {
  if (this.isNew && !this.expenseNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Expense').countDocuments({
      createdAt: {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1)
      }
    });
    this.expenseNumber = `EXP${year}${String(count + 1).padStart(5, '0')}`;
  }
});

// Indexes
// Note: expenseNumber index is automatically created by unique: true in schema
expenseSchema.index({ category: 1 });
expenseSchema.index({ date: -1 });
expenseSchema.index({ status: 1 });
expenseSchema.index({ account: 1 });
expenseSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Expense', expenseSchema);

