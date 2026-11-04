const mongoose = require('mongoose');

/**
 * Saved billing customer. Auto-upserted (by email) whenever an invoice is
 * created or updated, so previously billed clients can be reselected.
 */
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  company: String,
  taxId: String,
  lastInvoicedAt: Date
}, {
  timestamps: true
});

customerSchema.index({ name: 1 });

module.exports = mongoose.model('Customer', customerSchema);
