const mongoose = require('mongoose');

const automationRuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: [
      'auto_assign',
      'auto_score',
      'auto_status',
      'auto_followup',
      'auto_tag',
      'auto_notify',
      'auto_qualify',
      'auto_nurture',
      'auto_convert',
      'auto_deduplicate'
    ],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  // Conditions that must be met for the rule to trigger
  conditions: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  // Actions to perform when conditions are met
  actions: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  // Schedule for recurring automation (cron expression)
  schedule: {
    type: String,
    trim: true
  },
  // Trigger events (e.g., 'lead_created', 'lead_updated', 'activity_added')
  triggers: [{
    type: String,
    enum: [
      'lead_created',
      'lead_updated',
      'activity_added',
      'status_changed',
      'score_changed',
      'email_opened',
      'email_clicked',
      'form_submitted',
      'page_viewed',
      'scheduled'
    ]
  }],
  // Execution statistics
  executionCount: {
    type: Number,
    default: 0
  },
  lastExecutedAt: {
    type: Date
  },
  successCount: {
    type: Number,
    default: 0
  },
  failureCount: {
    type: Number,
    default: 0
  },
  // Created/Updated by
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
automationRuleSchema.index({ type: 1, isActive: 1 });
automationRuleSchema.index({ triggers: 1, isActive: 1 });
automationRuleSchema.index({ schedule: 1, isActive: 1 });

module.exports = mongoose.model('AutomationRule', automationRuleSchema);

