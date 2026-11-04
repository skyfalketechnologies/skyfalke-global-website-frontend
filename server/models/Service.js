const mongoose = require('mongoose');

/**
 * Saved billable service/line item. Auto-upserted (by description) whenever
 * an invoice is saved, so recurring services can be reselected with their
 * last-used price.
 */
const serviceSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    enum: ['USD', 'KES'],
    default: 'USD'
  },
  lastUsedAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);
