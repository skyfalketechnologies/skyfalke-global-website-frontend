const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['planning', 'active', 'on-hold', 'completed', 'archived'],
    default: 'planning'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  color: {
    type: String,
    default: '#6366f1' // Default indigo color
  },
  startDate: {
    type: Date
  },
  dueDate: {
    type: Date
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'member', 'viewer'],
      default: 'member'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  customFields: [{
    name: {
      type: String,
      required: true
    },
    value: mongoose.Schema.Types.Mixed
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  archivedAt: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
projectSchema.index({ owner: 1, status: 1 });
projectSchema.index({ 'members.user': 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ priority: 1 });
projectSchema.index({ dueDate: 1 });
projectSchema.index({ createdAt: -1 });

// Virtual for task count (will be populated)
projectSchema.virtual('taskCount', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project',
  count: true
});

// Virtual for completed task count
projectSchema.virtual('completedTaskCount', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project',
  count: true,
  match: { status: 'completed' }
});

// Method to calculate progress
projectSchema.methods.calculateProgress = async function() {
  const Task = mongoose.model('Task');
  const totalTasks = await Task.countDocuments({ project: this._id });
  const completedTasks = await Task.countDocuments({ 
    project: this._id, 
    status: 'completed' 
  });
  
  if (totalTasks === 0) {
    this.progress = 0;
  } else {
    this.progress = Math.round((completedTasks / totalTasks) * 100);
  }
  
  await this.save();
  return this.progress;
};

// Method to check if user is member
projectSchema.methods.isMember = function(userId) {
  return this.members.some(m => m.user.toString() === userId.toString()) ||
         this.owner.toString() === userId.toString();
};

// Method to check if user can edit
projectSchema.methods.canEdit = function(userId) {
  // Owner can always edit
  if (this.owner.toString() === userId.toString()) return true;
  // Any member can edit (collaborative approach like Asana)
  return this.isMember(userId);
};

// Method to check if user can delete (only owner)
projectSchema.methods.canDelete = function(userId) {
  return this.owner.toString() === userId.toString();
};

// Method to check if user can manage members (owner or admin)
projectSchema.methods.canManageMembers = function(userId) {
  if (this.owner.toString() === userId.toString()) return true;
  const member = this.members.find(m => m.user.toString() === userId.toString());
  return member && ['owner', 'admin'].includes(member.role);
};

module.exports = mongoose.model('Project', projectSchema);

