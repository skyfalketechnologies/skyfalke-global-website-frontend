const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  accountNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'asset',
      'liability',
      'equity',
      'revenue',
      'expense',
      'bank',
      'cash',
      'accounts-receivable',
      'accounts-payable'
    ]
  },
  category: {
    type: String,
    trim: true
  },
  balance: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    enum: ['USD', 'KES'],
    default: 'KES'
  },
  bankDetails: {
    bankName: String,
    accountName: String,
    accountNumber: String,
    branch: String,
    swiftCode: String,
    iban: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  openingBalance: {
    type: Number,
    default: 0
  },
  openingBalanceDate: {
    type: Date,
    default: Date.now
  },
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Generate account number
accountSchema.pre('save', async function(next) {
  if (this.isNew && !this.accountNumber) {
    const prefix = this.type.toUpperCase().substring(0, 3);
    const count = await mongoose.model('Account').countDocuments({ type: this.type });
    this.accountNumber = `${prefix}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Indexes
// Note: accountNumber index is automatically created by unique: true in schema
accountSchema.index({ type: 1 });
accountSchema.index({ isActive: 1 });
accountSchema.index({ name: 1 });

module.exports = mongoose.model('Account', accountSchema);

