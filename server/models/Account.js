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
  parentAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    default: null,
    index: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

/** Unique 3-char prefixes — substring(0,3) collides for accounts-receivable vs accounts-payable (both "ACC"). */
const ACCOUNT_NUMBER_PREFIX = {
  asset: 'AST',
  liability: 'LIA',
  equity: 'EQY',
  revenue: 'REV',
  expense: 'EXP',
  bank: 'BNK',
  cash: 'CSH',
  'accounts-receivable': 'AR',
  'accounts-payable': 'AP'
};

// Generate account number before validation (required + unique run after pre('validate'))
accountSchema.pre('validate', async function() {
  if (this.isNew && !this.accountNumber) {
    const prefix =
      ACCOUNT_NUMBER_PREFIX[this.type] ||
      String(this.type || '')
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .substring(0, 3) ||
      'ACC';
    const count = await mongoose.model('Account').countDocuments({ type: this.type });
    this.accountNumber = `${prefix}${String(count + 1).padStart(4, '0')}`;
  }
});

// Indexes
// Note: accountNumber index is automatically created by unique: true in schema
accountSchema.index({ type: 1 });
accountSchema.index({ isActive: 1 });
accountSchema.index({ name: 1 });

module.exports = mongoose.model('Account', accountSchema);

