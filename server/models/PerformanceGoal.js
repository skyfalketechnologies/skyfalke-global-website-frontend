const mongoose = require('mongoose');

const performanceGoalSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    index: true
  },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  quarter: { type: String, trim: true, default: '' },
  year: { type: Number, required: true, index: true },
  keyResults: [{
    text: { type: String, required: true },
    progress: { type: Number, min: 0, max: 100, default: 0 }
  }],
  progress: { type: Number, min: 0, max: 100, default: 0 },
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'cancelled'],
    default: 'active'
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

performanceGoalSchema.index({ employee: 1, year: -1 });

module.exports = mongoose.model('PerformanceGoal', performanceGoalSchema);
