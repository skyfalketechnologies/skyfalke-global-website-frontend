const mongoose = require('mongoose');

const blogCommentSchema = new mongoose.Schema({
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    minlength: [2, 'Comment must be at least 2 characters'],
    maxlength: [2000, 'Comment cannot exceed 2000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  }
}, {
  timestamps: true
});

blogCommentSchema.index({ blog: 1, createdAt: -1 });

module.exports = mongoose.model('BlogComment', blogCommentSchema);
