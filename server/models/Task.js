const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  parentTask: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    default: null
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'in-review', 'completed', 'cancelled'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  dueDate: {
    type: Date
  },
  startDate: {
    type: Date
  },
  assignees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
  estimatedHours: {
    type: Number,
    min: 0
  },
  actualHours: {
    type: Number,
    min: 0,
    default: 0
  },
  position: {
    type: Number,
    default: 0
  },
  section: {
    type: String,
    default: 'default'
  },
  dependencies: [{
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    },
    type: {
      type: String,
      enum: ['blocks', 'blocked-by', 'related'],
      default: 'blocks'
    }
  }],
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes
taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ project: 1, section: 1, position: 1 });
taskSchema.index({ assignees: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ parentTask: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });

// Virtual for subtasks
taskSchema.virtual('subtasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'parentTask'
});

// Virtual for comments count
taskSchema.virtual('commentCount', {
  ref: 'TaskComment',
  localField: '_id',
  foreignField: 'task',
  count: true
});

// Virtual for attachments count
taskSchema.virtual('attachmentCount', {
  ref: 'TaskAttachment',
  localField: '_id',
  foreignField: 'task',
  count: true
});

// Pre-save hook to update isCompleted
taskSchema.pre('save', function(next) {
  if (this.status === 'completed' && !this.isCompleted) {
    this.isCompleted = true;
    this.completedAt = new Date();
  } else if (this.status !== 'completed' && this.isCompleted) {
    this.isCompleted = false;
    this.completedAt = undefined;
    this.completedBy = undefined;
  }
  next();
});

// Method to get all subtasks recursively
taskSchema.methods.getAllSubtasks = async function() {
  const Task = mongoose.model('Task');
  const subtasks = await Task.find({ parentTask: this._id });
  const allSubtasks = [...subtasks];
  
  for (const subtask of subtasks) {
    const nested = await subtask.getAllSubtasks();
    allSubtasks.push(...nested);
  }
  
  return allSubtasks;
};

module.exports = mongoose.model('Task', taskSchema);

