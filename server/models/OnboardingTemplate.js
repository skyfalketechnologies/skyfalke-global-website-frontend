const mongoose = require('mongoose');

const onboardingTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  items: [{
    title: { type: String, required: true },
    description: { type: String, default: '' },
    order: { type: Number, default: 0 }
  }],
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('OnboardingTemplate', onboardingTemplateSchema);
