const mongoose = require('mongoose');

const taskCommentSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'file', 'link']
    },
    url: String,
    name: String,
    size: Number
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    emoji: {
      type: String,
      default: '👍'
    }
  }],
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TaskComment',
    default: null
  }
}, {
  timestamps: true
});

// Indexes
taskCommentSchema.index({ task: 1, createdAt: -1 });
taskCommentSchema.index({ author: 1 });
taskCommentSchema.index({ parentComment: 1 });

module.exports = mongoose.model('TaskComment', taskCommentSchema);

