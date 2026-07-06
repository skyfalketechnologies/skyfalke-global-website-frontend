const mongoose = require('mongoose');

const softwareLicenseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  vendor: { type: String, trim: true, default: '' },
  licenseKeyHint: { type: String, trim: true, default: '' },
  totalSeats: { type: Number, default: 1, min: 0 },
  assignedEmployees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
  renewalDate: Date,
  status: {
    type: String,
    enum: ['active', 'expired', 'pending'],
    default: 'active'
  },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('SoftwareLicense', softwareLicenseSchema);
