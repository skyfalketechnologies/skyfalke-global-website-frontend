const mongoose = require('mongoose');

const bankReconciliationSchema = new mongoose.Schema({
  bankAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
    index: true
  },
  statementDate: { type: Date, required: true },
  statementEndingBalance: { type: Number, required: true },
  clearedBookBalance: { type: Number, default: 0 },
  difference: { type: Number, default: 0 },
  clearedTransactionIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
  status: {
    type: String,
    enum: ['draft', 'completed'],
    default: 'draft',
    index: true
  },
  notes: { type: String, trim: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  completedAt: { type: Date }
}, {
  timestamps: true
});

bankReconciliationSchema.index({ bankAccount: 1, statementDate: -1 });

module.exports = mongoose.model('BankReconciliation', bankReconciliationSchema);
