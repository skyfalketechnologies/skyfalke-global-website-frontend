const mongoose = require('mongoose');

const performanceReviewSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    index: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  periodLabel: { type: String, required: true, trim: true },
  ratings: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  summary: { type: String, default: '' },
  strengths: { type: String, default: '' },
  improvements: { type: String, default: '' },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'completed'],
    default: 'draft'
  }
}, { timestamps: true });

performanceReviewSchema.index({ employee: 1, createdAt: -1 });

module.exports = mongoose.model('PerformanceReview', performanceReviewSchema);
