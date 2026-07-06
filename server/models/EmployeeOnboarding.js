const mongoose = require('mongoose');

const employeeOnboardingSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    unique: true,
    index: true
  },
  template: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OnboardingTemplate',
    required: true
  },
  items: [{
    title: { type: String, required: true },
    description: { type: String, default: '' },
    order: { type: Number, default: 0 },
    done: { type: Boolean, default: false },
    doneAt: Date,
    doneBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }]
}, { timestamps: true });

module.exports = mongoose.model('EmployeeOnboarding', employeeOnboardingSchema);
