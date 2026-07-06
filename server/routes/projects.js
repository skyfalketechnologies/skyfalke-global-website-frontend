const express = require('express');
const router = express.Router();
const { staffProjectsAuth } = require('../middleware/auth');
const Project = require('../models/Project');
const Task = require('../models/Task');
const TaskComment = require('../models/TaskComment');
const TaskAttachment = require('../models/TaskAttachment');
const User = require('../models/User');
const { sendNotificationToProjectMembers, sendNotificationToAdmin } = require('../socket');

// ========== PROJECT ROUTES ==========

// Get all projects
router.get('/', staffProjectsAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, priority, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const query = {};

    // Filter by user's projects (owner or member)
    query.$or = [
      { owner: req.user._id },
      { 'members.user': req.user._id }
    ];

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.$and = [
        {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { tags: { $in: [new RegExp(search, 'i')] } }
          ]
        }
      ];
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const projects = await Project.find(query)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get task counts for each project
    for (const project of projects) {
      const taskCount = await Task.countDocuments({ project: project._id });
      const completedCount = await Task.countDocuments({ 
        project: project._id, 
        status: 'completed' 
      });
      project.taskCount = taskCount;
      project.completedTaskCount = completedCount;
      project.progress = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;
    }

    const total = await Project.countDocuments(query);

    res.json({
      success: true,
      data: projects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch projects' });
  }
});

// Get single project
router.get('/:id', staffProjectsAuth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id }
      ]
    })
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar')
      .populate('createdBy', 'name email');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Get task statistics
    const taskStats = await Task.aggregate([
      { $match: { project: project._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const stats = {
      total: 0,
      todo: 0,
      'in-progress': 0,
      'in-review': 0,
      completed: 0,
      cancelled: 0
    };

    taskStats.forEach(stat => {
      stats[stat._id] = stat.count;
      stats.total += stat.count;
    });

    project._doc.stats = stats;
    project._doc.progress = stats.total > 0 
      ? Math.round((stats.completed / stats.total) * 100) 
      : 0;

    res.json({ success: true, data: project });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch project' });
  }
});

// Create project
router.post('/', staffProjectsAuth, async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      owner: req.user._id,
      createdBy: req.user._id,
      members: [
        {
          user: req.user._id,
          role: 'owner',
          addedAt: new Date()
        },
        ...(req.body.members || [])
      ]
    });

    await project.save();
    await project.populate('owner', 'name email avatar');
    await project.populate('members.user', 'name email avatar');

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update project
router.put('/:id', staffProjectsAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check permissions
    if (!project.canEdit(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    Object.assign(project, req.body);
    // Store old values to detect changes
    const oldName = project.name;
    const oldStatus = project.status;
    const oldDescription = project.description;
    
    Object.assign(project, req.body);
    await project.save();
    await project.populate('owner', 'name email avatar');
    await project.populate('members.user', 'name email avatar');

    // Send notifications to all project members (except the updater)
    try {
      const changes = [];
      if (oldName !== project.name) changes.push(`name changed to "${project.name}"`);
      if (oldStatus !== project.status) changes.push(`status changed to "${project.status}"`);
      if (oldDescription !== project.description) changes.push('description was updated');
      
      // Check for other significant changes
      if (req.body.priority && req.body.priority !== project.priority) {
        changes.push(`priority changed to "${req.body.priority}"`);
      }
      if (req.body.dueDate) {
        changes.push('due date was updated');
      }

      if (changes.length > 0) {
        await sendNotificationToProjectMembers(
          project,
          {
            title: 'Project Updated',
            message: `${req.user.name} updated the project "${project.name}": ${changes.join(', ')}`,
            type: 'project',
            category: 'project',
            priority: 'medium',
            data: {
              projectId: project._id,
              projectName: project.name,
              updatedBy: req.user._id,
              updatedByName: req.user.name,
              changes: changes
            },
            actionUrl: `/system/dashboard/projects/${project._id}`
          },
          req.user._id
        );
      }
    } catch (notificationError) {
      console.error('Error sending project update notification:', notificationError);
      // Don't fail the request if notification fails
    }

    res.json({ success: true, data: project });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete project
router.delete('/:id', staffProjectsAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Only owner can delete
    if (!project.canDelete(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only project owner can delete' });
    }

    // Delete all related tasks, comments, and attachments
    const tasks = await Task.find({ project: project._id });
    const taskIds = tasks.map(t => t._id);

    await TaskComment.deleteMany({ task: { $in: taskIds } });
    await TaskAttachment.deleteMany({ task: { $in: taskIds } });
    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete project' });
  }
});

// Add member to project
router.post('/:id/members', staffProjectsAuth, async (req, res) => {
  try {
    const { userId, role = 'member' } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (!project.canManageMembers(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    // Check if user is already a member
    const existingMember = project.members.find(m => m.user.toString() === userId);
    if (existingMember) {
      return res.status(400).json({ success: false, message: 'User is already a member' });
    }

    project.members.push({
      user: userId,
      role,
      addedAt: new Date()
    });

    await project.save();
    await project.populate('owner', 'name email avatar');
    await project.populate('members.user', 'name email avatar');

    // Send notification to the newly added member
    try {
      const newMember = project.members.find(m => m.user._id.toString() === userId);
      if (newMember && newMember.user) {
        await sendNotificationToAdmin(
          userId,
          {
            title: 'Added to Project',
            message: `${req.user.name} added you to the project "${project.name}" as ${role}`,
            type: 'project',
            category: 'project',
            priority: 'medium',
            data: {
              projectId: project._id,
              projectName: project.name,
              role: role,
              addedBy: req.user._id,
              addedByName: req.user.name
            },
            actionUrl: `/system/dashboard/projects/${project._id}`
          }
        );
      }
    } catch (notificationError) {
      console.error('Error sending project assignment notification:', notificationError);
      // Don't fail the request if notification fails
    }

    res.json({ success: true, data: project });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Remove member from project
router.delete('/:id/members/:memberId', staffProjectsAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (!project.canManageMembers(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    project.members = project.members.filter(
      m => m.user.toString() !== req.params.memberId
    );

    await project.save();
    res.json({ success: true, data: project });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// ========== TASK ROUTES ==========

// Get all tasks for a project
router.get('/:projectId/tasks', staffProjectsAuth, async (req, res) => {
  try {
    const { status, assignee, priority, section, includeSubtasks = 'true' } = req.query;
    const project = await Project.findById(req.params.projectId);

    if (!project || !project.isMember(req.user._id)) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const query = { project: req.params.projectId };
    
    if (status) query.status = status;
    if (assignee) query.assignees = assignee;
    if (priority) query.priority = priority;
    if (section) query.section = section;

    if (includeSubtasks === 'false') {
      query.parentTask = null;
    }

    const tasks = await Task.find(query)
      .populate('assignees', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('parentTask', 'name')
      .sort({ section: 1, position: 1, createdAt: -1 })
      .lean();

    // Get subtasks for each task
    for (const task of tasks) {
      const subtasks = await Task.find({ parentTask: task._id })
        .populate('assignees', 'name email avatar')
        .sort({ position: 1 })
        .lean();
      task.subtasks = subtasks;

      const commentCount = await TaskComment.countDocuments({ task: task._id });
      const attachmentCount = await TaskAttachment.countDocuments({ task: task._id });
      task.commentCount = commentCount;
      task.attachmentCount = attachmentCount;
    }

    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch tasks' });
  }
});

// Get single task
router.get('/:projectId/tasks/:taskId', staffProjectsAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    
    if (!project || !project.isMember(req.user._id)) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const task = await Task.findOne({
      _id: req.params.taskId,
      project: req.params.projectId
    })
      .populate('assignees', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('parentTask', 'name')
      .populate('dependencies.task', 'name status');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Get subtasks
    const subtasks = await Task.find({ parentTask: task._id })
      .populate('assignees', 'name email avatar')
      .sort({ position: 1 });

    task._doc.subtasks = subtasks;

    res.json({ success: true, data: task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch task' });
  }
});

// Create task
router.post('/:projectId/tasks', staffProjectsAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    
    if (!project || !project.isMember(req.user._id)) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Get max position for the section
    const maxPosition = await Task.findOne({
      project: req.params.projectId,
      section: req.body.section || 'default',
      parentTask: req.body.parentTask || null
    })
      .sort({ position: -1 })
      .select('position')
      .lean();

    const task = new Task({
      ...req.body,
      project: req.params.projectId,
      createdBy: req.user._id,
      position: (maxPosition?.position || 0) + 1
    });

    await task.save();
    await task.populate('assignees', 'name email avatar');
    await task.populate('createdBy', 'name email avatar');

    // Update project progress
    await project.calculateProgress();

    // Send notifications to assigned users
    try {
      if (task.assignees && task.assignees.length > 0) {
        for (const assignee of task.assignees) {
          await sendNotificationToAdmin(
            assignee._id,
            {
              title: 'Task Assigned',
              message: `${req.user.name} assigned you a task "${task.name}" in project "${project.name}"`,
              type: 'project',
              category: 'project',
              priority: task.priority === 'urgent' || task.priority === 'high' ? 'high' : 'medium',
              data: {
                projectId: project._id,
                projectName: project.name,
                taskId: task._id,
                taskName: task.name,
                assignedBy: req.user._id,
                assignedByName: req.user.name,
                priority: task.priority
              },
              actionUrl: `/system/dashboard/projects/${project._id}`
            }
          );
        }
      }
    } catch (notificationError) {
      console.error('Error sending task assignment notification:', notificationError);
      // Don't fail the request if notification fails
    }

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update task
router.put('/:projectId/tasks/:taskId', staffProjectsAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    
    if (!project || !project.isMember(req.user._id)) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const task = await Task.findOne({
      _id: req.params.taskId,
      project: req.params.projectId
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const oldStatus = task.status;
    Object.assign(task, req.body);
    
    if (req.body.status === 'completed') {
      task.completedBy = req.user._id;
    }

    await task.save();
    await task.populate('assignees', 'name email avatar');
    await task.populate('createdBy', 'name email avatar');

    // Update project progress
    await project.calculateProgress();

    // Send notifications for significant task updates
    try {
      const newStatus = task.status;
      if (newStatus && newStatus !== oldStatus) {
        // Notify assignees about status change
        if (task.assignees && task.assignees.length > 0) {
          for (const assignee of task.assignees) {
            // Don't notify the person who made the change
            if (assignee._id.toString() !== req.user._id.toString()) {
              await sendNotificationToAdmin(
                assignee._id,
                {
                  title: 'Task Status Updated',
                  message: `${req.user.name} changed the status of task "${task.name}" to "${newStatus}" in project "${project.name}"`,
                  type: 'project',
                  category: 'project',
                  priority: newStatus === 'completed' ? 'high' : 'medium',
                  data: {
                    projectId: project._id,
                    projectName: project.name,
                    taskId: task._id,
                    taskName: task.name,
                    oldStatus: oldStatus,
                    newStatus: newStatus,
                    updatedBy: req.user._id,
                    updatedByName: req.user.name
                  },
                  actionUrl: `/system/dashboard/projects/${project._id}`
                }
              );
            }
          }
        }
        
        // Also notify project members (except updater and assignees already notified)
        if (newStatus === 'completed') {
          await sendNotificationToProjectMembers(
            project,
            {
              title: 'Task Completed',
              message: `${req.user.name} completed task "${task.name}" in project "${project.name}"`,
              type: 'project',
              category: 'project',
              priority: 'medium',
              data: {
                projectId: project._id,
                projectName: project.name,
                taskId: task._id,
                taskName: task.name,
                completedBy: req.user._id,
                completedByName: req.user.name
              },
              actionUrl: `/system/dashboard/projects/${project._id}`
            },
            req.user._id
          );
        }
      }
    } catch (notificationError) {
      console.error('Error sending task update notification:', notificationError);
      // Don't fail the request if notification fails
    }

    res.json({ success: true, data: task });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete task
router.delete('/:projectId/tasks/:taskId', staffProjectsAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    
    if (!project || !project.isMember(req.user._id)) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const task = await Task.findOne({
      _id: req.params.taskId,
      project: req.params.projectId
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Delete all subtasks, comments, and attachments
    const subtasks = await Task.find({ parentTask: task._id });
    const allTaskIds = [task._id, ...subtasks.map(t => t._id)];

    await TaskComment.deleteMany({ task: { $in: allTaskIds } });
    await TaskAttachment.deleteMany({ task: { $in: allTaskIds } });
    await Task.deleteMany({ _id: { $in: allTaskIds } });

    // Update project progress
    await project.calculateProgress();

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete task' });
  }
});

// Reorder tasks
router.post('/:projectId/tasks/reorder', staffProjectsAuth, async (req, res) => {
  try {
    const { taskIds, section } = req.body;
    const project = await Project.findById(req.params.projectId);
    
    if (!project || !project.isMember(req.user._id)) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Update positions
    for (let i = 0; i < taskIds.length; i++) {
      await Task.updateOne(
        { _id: taskIds[i], project: req.params.projectId },
        { position: i + 1, section: section || 'default' }
      );
    }

    res.json({ success: true, message: 'Tasks reordered successfully' });
  } catch (error) {
    console.error('Reorder tasks error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// ========== TASK COMMENT ROUTES ==========

// Get comments for a task
router.get('/:projectId/tasks/:taskId/comments', staffProjectsAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    
    if (!project || !project.isMember(req.user._id)) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const task = await Task.findOne({
      _id: req.params.taskId,
      project: req.params.projectId
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const comments = await TaskComment.find({ task: req.params.taskId })
      .populate('author', 'name email avatar')
      .populate('mentions', 'name email')
      .populate('parentComment')
      .sort({ createdAt: 1 });

    res.json({ success: true, data: comments });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch comments' });
  }
});

// Create comment
router.post('/:projectId/tasks/:taskId/comments', staffProjectsAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    
    if (!project || !project.isMember(req.user._id)) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const task = await Task.findOne({
      _id: req.params.taskId,
      project: req.params.projectId
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const comment = new TaskComment({
      ...req.body,
      task: req.params.taskId,
      author: req.user._id
    });

    await comment.save();
    await comment.populate('author', 'name email avatar');
    await comment.populate('mentions', 'name email');

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update comment
router.put('/:projectId/tasks/:taskId/comments/:commentId', staffProjectsAuth, async (req, res) => {
  try {
    const comment = await TaskComment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Can only edit your own comments' });
    }

    comment.content = req.body.content;
    comment.isEdited = true;
    comment.editedAt = new Date();

    await comment.save();
    await comment.populate('author', 'name email avatar');

    res.json({ success: true, data: comment });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete comment
router.delete('/:projectId/tasks/:taskId/comments/:commentId', staffProjectsAuth, async (req, res) => {
  try {
    const comment = await TaskComment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Can only delete your own comments' });
    }

    await comment.deleteOne();
    res.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete comment' });
  }
});

// ========== TASK ATTACHMENT ROUTES ==========

// Get attachments for a task
router.get('/:projectId/tasks/:taskId/attachments', staffProjectsAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    
    if (!project || !project.isMember(req.user._id)) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const attachments = await TaskAttachment.find({ task: req.params.taskId })
      .populate('uploadedBy', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: attachments });
  } catch (error) {
    console.error('Get attachments error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch attachments' });
  }
});

// Create attachment (URL should be provided, file upload handled separately)
router.post('/:projectId/tasks/:taskId/attachments', staffProjectsAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    
    if (!project || !project.isMember(req.user._id)) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const task = await Task.findOne({
      _id: req.params.taskId,
      project: req.params.projectId
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const attachment = new TaskAttachment({
      ...req.body,
      task: req.params.taskId,
      uploadedBy: req.user._id
    });

    await attachment.save();
    await attachment.populate('uploadedBy', 'name email avatar');

    res.status(201).json({ success: true, data: attachment });
  } catch (error) {
    console.error('Create attachment error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete attachment
router.delete('/:projectId/tasks/:taskId/attachments/:attachmentId', staffProjectsAuth, async (req, res) => {
  try {
    const attachment = await TaskAttachment.findById(req.params.attachmentId);

    if (!attachment) {
      return res.status(404).json({ success: false, message: 'Attachment not found' });
    }

    // Only uploader or project member can delete
    const project = await Project.findById(req.params.projectId);
    const canDelete = attachment.uploadedBy.toString() === req.user._id.toString() ||
                     (project && project.isMember(req.user._id));

    if (!canDelete) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    await attachment.deleteOne();
    res.json({ success: true, message: 'Attachment deleted successfully' });
  } catch (error) {
    console.error('Delete attachment error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete attachment' });
  }
});

// ========== STATISTICS ROUTES ==========

// Get project statistics
router.get('/:id/stats', staffProjectsAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project || !project.isMember(req.user._id)) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const stats = await Task.aggregate([
      { $match: { project: project._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalHours: { $sum: '$estimatedHours' }
        }
      }
    ]);

    const tasksByPriority = await Task.aggregate([
      { $match: { project: project._id } },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    const overdueTasks = await Task.countDocuments({
      project: project._id,
      dueDate: { $lt: new Date() },
      status: { $ne: 'completed' }
    });

    res.json({
      success: true,
      data: {
        tasksByStatus: stats,
        tasksByPriority,
        overdueTasks,
        totalTasks: await Task.countDocuments({ project: project._id }),
        completedTasks: await Task.countDocuments({ 
          project: project._id, 
          status: 'completed' 
        })
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
  }
});

module.exports = router;

