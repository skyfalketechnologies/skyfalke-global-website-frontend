const mongoose = require('mongoose');

const itAssetSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  assetType: {
    type: String,
    enum: ['laptop', 'monitor', 'phone', 'accessory', 'software', 'other'],
    default: 'laptop'
  },
  serialNumber: { type: String, trim: true, default: '' },
  assignedEmployee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    index: true
  },
  status: {
    type: String,
    enum: ['assigned', 'in-stock', 'repair', 'retired'],
    default: 'assigned',
    index: true
  },
  notes: { type: String, default: '' },
  warrantyExpires: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('ITAsset', itAssetSchema);
