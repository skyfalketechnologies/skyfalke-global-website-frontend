const mongoose = require('mongoose');

const peerFeedbackSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toEmployee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    index: true
  },
  anonymous: { type: Boolean, default: false },
  body: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['peer', 'manager', 'general'],
    default: 'peer'
  }
}, { timestamps: true });

peerFeedbackSchema.index({ toEmployee: 1, createdAt: -1 });

module.exports = mongoose.model('PeerFeedback', peerFeedbackSchema);
