const mongoose = require('mongoose');

const journalLineSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  debit: { type: Number, default: 0, min: 0 },
  credit: { type: Number, default: 0, min: 0 },
  memo: { type: String, trim: true }
}, { _id: true });

const journalEntrySchema = new mongoose.Schema({
  entryNumber: {
    type: String,
    unique: true,
    trim: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'posted', 'void'],
    default: 'draft',
    index: true
  },
  lines: {
    type: [journalLineSchema],
    validate: [(v) => Array.isArray(v) && v.length >= 2, 'At least two lines required']
  },
  reference: { type: String, trim: true },
  sourceType: {
    type: String,
    enum: ['manual', 'invoice', 'expense', 'bank', 'adjustment', 'document', 'other'],
    default: 'manual'
  },
  sourceId: { type: mongoose.Schema.Types.ObjectId },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  postedAt: { type: Date },
  voidReason: { type: String, trim: true }
}, {
  timestamps: true
});

journalEntrySchema.pre('save', async function(next) {
  if (this.isNew && !this.entryNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('JournalEntry').countDocuments({
      createdAt: {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1)
      }
    });
    this.entryNumber = `JE${year}${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('JournalEntry', journalEntrySchema);
