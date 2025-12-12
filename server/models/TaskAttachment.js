const mongoose = require('mongoose');

const taskAttachmentSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['image', 'document', 'video', 'audio', 'other'],
    default: 'other'
  },
  size: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  thumbnailUrl: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes
taskAttachmentSchema.index({ task: 1, createdAt: -1 });
taskAttachmentSchema.index({ uploadedBy: 1 });

module.exports = mongoose.model('TaskAttachment', taskAttachmentSchema);

