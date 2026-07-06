const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense', 'transfer', 'adjustment']
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  toAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
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
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  reference: {
    type: String,
    trim: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank', 'mpesa', 'card', 'cheque', 'other']
  },
  status: {
    type: String,
    enum: ['pending_approval', 'approved', 'rejected', 'completed', 'cancelled', 'reversed'],
    default: 'pending_approval'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  rejectionReason: {
    type: String,
    trim: true
  },
  balanceUpdated: {
    type: Boolean,
    default: false
  },
  relatedDocument: {
    type: {
      type: String,
      enum: ['invoice', 'expense', 'payroll', 'order', 'other']
    },
    id: mongoose.Schema.Types.ObjectId
  },
  attachments: [{
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  notes: String,
  reconciled: {
    type: Boolean,
    default: false
  },
  reconciledAt: Date,
  reconciledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

/** Prefix map — income/expense both start with "INC"/"EXP"; avoid substring collisions. */
const TX_NUMBER_PREFIX = {
  income: 'INC',
  expense: 'EXP',
  transfer: 'TRF',
  adjustment: 'ADJ'
};

// Generate transaction number before validation (required runs after pre('validate'))
transactionSchema.pre('validate', async function() {
  if (this.isNew && !this.transactionNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Transaction').countDocuments({
      createdAt: {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1)
      }
    });
    const prefix =
      TX_NUMBER_PREFIX[this.type] ||
      String(this.type || 'TX')
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .substring(0, 3) ||
      'TX';
    this.transactionNumber = `${prefix}${year}${String(count + 1).padStart(6, '0')}`;
  }
});

// Update account balance only when transaction is approved
transactionSchema.post('save', async function() {
  // Only update balance if transaction is approved and balance hasn't been updated yet
  if (this.status !== 'approved' || this.balanceUpdated) {
    return;
  }

  const Account = mongoose.model('Account');
  const account = await Account.findById(this.account);
  
  if (account) {
    if (this.type === 'income' || this.type === 'transfer') {
      account.balance += this.amount;
    } else if (this.type === 'expense') {
      account.balance -= this.amount;
    }
    await account.save();
  }
  
  // Handle transfer to account
  if (this.type === 'transfer' && this.toAccount) {
    const toAccount = await Account.findById(this.toAccount);
    if (toAccount) {
      toAccount.balance += this.amount;
      await toAccount.save();
    }
  }

  // Mark balance as updated to prevent double-counting
  this.balanceUpdated = true;
  await this.constructor.findByIdAndUpdate(this._id, { balanceUpdated: true });
});

// Reverse account balance on delete
transactionSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    const Account = mongoose.model('Account');
    const account = await Account.findById(doc.account);
    
    if (account) {
      if (doc.type === 'income' || doc.type === 'transfer') {
        account.balance -= doc.amount;
      } else if (doc.type === 'expense') {
        account.balance += doc.amount;
      }
      await account.save();
    }
  }
});

// Indexes
// Note: transactionNumber index is automatically created by unique: true in schema
transactionSchema.index({ account: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ date: -1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);

