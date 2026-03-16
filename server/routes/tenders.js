const express = require('express');
const router = express.Router();
const Tender = require('../models/Tender');
const { adminAuth } = require('../middleware/auth');
const dbCheck = require('../middleware/dbCheck');
const Notification = require('../models/Notification');
const { sendNotificationToAdmin } = require('../socket');

// Get all tenders (admin)
router.get('/admin/all', adminAuth, dbCheck, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status,
      assignee,
      search,
      deadlineApproaching
    } = req.query;

    const filter = {};

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Assignee filter
    if (assignee) {
      filter.assignee = assignee;
    }

    // Search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } },
        { referenceNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Deadline approaching filter
    if (deadlineApproaching === 'true') {
      const now = new Date();
      const futureDate = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
      filter.deadline = {
        $gte: now,
        $lte: futureDate
      };
      filter.status = { $in: ['open', 'in_progress'] };
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tenders = await Tender.find(filter)
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email')
      .populate('notes.addedBy', 'name')
      .populate('activities.createdBy', 'name')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Tender.countDocuments(filter);

    res.json({
      success: true,
      tenders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get tenders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tenders'
    });
  }
});

// Get tender statistics
router.get('/admin/stats', adminAuth, dbCheck, async (req, res) => {
  try {
    const { userId } = req.query;
    const stats = await Tender.getStats(userId);
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get tender stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tender statistics'
    });
  }
});

// Bulk update tenders
router.patch('/admin/bulk', adminAuth, dbCheck, async (req, res) => {
  try {
    const { tenderIds, updates } = req.body;

    if (!tenderIds || !Array.isArray(tenderIds) || tenderIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Tender IDs are required'
      });
    }

    const result = await Tender.updateMany(
      { _id: { $in: tenderIds } },
      { $set: updates }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} tender(s) updated successfully`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update tenders'
    });
  }
});

// Get single tender by ID
router.get('/admin/:id', adminAuth, dbCheck, async (req, res) => {
  try {
    const tender = await Tender.findById(req.params.id)
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email')
      .populate('notes.addedBy', 'name email')
      .populate('activities.createdBy', 'name email')
      .populate('documents.uploadedBy', 'name email');

    if (!tender) {
      return res.status(404).json({
        success: false,
        message: 'Tender not found'
      });
    }

    res.json({
      success: true,
      tender
    });
  } catch (error) {
    console.error('Get tender error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tender'
    });
  }
});

// Create new tender
router.post('/admin', adminAuth, dbCheck, async (req, res) => {
  try {
    const tenderData = {
      ...req.body,
      createdBy: req.user._id
    };

    // Add initial activity to the data before creating the tender
    tenderData.activities = [{
      type: 'created',
      title: 'Tender Created',
      description: `Tender "${tenderData.title}" was created`,
      createdBy: req.user._id,
      createdAt: new Date()
    }];

    const tender = new Tender(tenderData);
    await tender.save();

    const populatedTender = await Tender.findById(tender._id)
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Tender created successfully',
      tender: populatedTender
    });
  } catch (error) {
    console.error('Create tender error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create tender'
    });
  }
});

// Update tender
router.patch('/admin/:id', adminAuth, dbCheck, async (req, res) => {
  try {
    const tender = await Tender.findById(req.params.id);
    
    if (!tender) {
      return res.status(404).json({
        success: false,
        message: 'Tender not found'
      });
    }

    const oldAssignee = tender.assignee ? tender.assignee.toString() : null;
    const oldStatus = tender.status;
    const oldDeadline = tender.deadline;

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key !== '_id' && key !== 'createdBy' && key !== 'createdAt' && key !== 'updatedAt') {
        tender[key] = req.body[key];
      }
    });

    // Track changes for activity log
    const changes = [];
    
    if (req.body.status && req.body.status !== oldStatus) {
      changes.push(`Status changed from ${oldStatus} to ${req.body.status}`);
      await tender.addActivity({
        type: 'status_changed',
        title: 'Status Changed',
        description: `Status changed from ${oldStatus} to ${req.body.status}`,
        createdBy: req.user._id,
        metadata: { oldStatus, newStatus: req.body.status }
      });
    }

    if (req.body.deadline && new Date(req.body.deadline).getTime() !== oldDeadline.getTime()) {
      changes.push(`Deadline changed`);
      await tender.addActivity({
        type: 'deadline_changed',
        title: 'Deadline Changed',
        description: `Deadline changed to ${new Date(req.body.deadline).toLocaleDateString()}`,
        createdBy: req.user._id,
        metadata: { oldDeadline, newDeadline: req.body.deadline }
      });
    }

    if (req.body.assignee) {
      const newAssignee = req.body.assignee.toString();
      if (newAssignee !== oldAssignee) {
        tender.assignedAt = new Date();
        changes.push(`Assigned to new user`);
        await tender.addActivity({
          type: 'assigned',
          title: 'Tender Assigned',
          description: `Tender was assigned to a new user`,
          createdBy: req.user._id,
          metadata: { oldAssignee, newAssignee }
        });
      }
    }

    // General update activity
    if (changes.length === 0) {
      await tender.addActivity({
        type: 'updated',
        title: 'Tender Updated',
        description: 'Tender details were updated',
        createdBy: req.user._id
      });
    }

    await tender.save();

    // Notify creator if tender was updated (and updater is not the creator)
    if (tender.createdBy.toString() !== req.user._id.toString()) {
      try {
        await sendNotificationToAdmin(tender.createdBy.toString(), {
          title: 'Tender Updated',
          message: `Tender "${tender.title}" has been updated by ${req.user.name || 'an admin'}`,
          type: 'info',
          category: 'system',
          priority: 'medium',
          actionUrl: `/system/dashboard/tenders/${tender._id}`,
          data: {
            tenderId: tender._id,
            tenderTitle: tender.title,
            updatedBy: req.user._id
          }
        });
      } catch (notifError) {
        console.error('Error sending notification to creator:', notifError);
      }
    }

    // Notify assignee if assigned
    if (tender.assignee && tender.assignee.toString() !== req.user._id.toString()) {
      try {
        await sendNotificationToAdmin(tender.assignee.toString(), {
          title: 'Tender Assigned',
          message: `You have been assigned to tender "${tender.title}"`,
          type: 'info',
          category: 'system',
          priority: 'high',
          actionUrl: `/system/dashboard/tenders/${tender._id}`,
          data: {
            tenderId: tender._id,
            tenderTitle: tender.title
          }
        });
      } catch (notifError) {
        console.error('Error sending notification to assignee:', notifError);
      }
    }

    const populatedTender = await Tender.findById(tender._id)
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email')
      .populate('notes.addedBy', 'name email')
      .populate('activities.createdBy', 'name email');

    res.json({
      success: true,
      message: 'Tender updated successfully',
      tender: populatedTender
    });
  } catch (error) {
    console.error('Update tender error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update tender'
    });
  }
});

// Delete tender
router.delete('/admin/:id', adminAuth, dbCheck, async (req, res) => {
  try {
    const tender = await Tender.findById(req.params.id);
    
    if (!tender) {
      return res.status(404).json({
        success: false,
        message: 'Tender not found'
      });
    }

    await Tender.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Tender deleted successfully'
    });
  } catch (error) {
    console.error('Delete tender error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete tender'
    });
  }
});

// Add note to tender
router.post('/admin/:id/notes', adminAuth, dbCheck, async (req, res) => {
  try {
    const { note } = req.body;
    
    if (!note || !note.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Note is required'
      });
    }

    const tender = await Tender.findById(req.params.id);
    
    if (!tender) {
      return res.status(404).json({
        success: false,
        message: 'Tender not found'
      });
    }

    tender.notes.push({
      note: note.trim(),
      addedBy: req.user._id
    });

    await tender.addActivity({
      type: 'note_added',
      title: 'Note Added',
      description: 'A note was added to this tender',
      createdBy: req.user._id
    });

    await tender.save();

    const populatedTender = await Tender.findById(tender._id)
      .populate('notes.addedBy', 'name email')
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email');

    res.json({
      success: true,
      message: 'Note added successfully',
      tender: populatedTender
    });
  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add note'
    });
  }
});

// Update application status
router.patch('/admin/:id/application', adminAuth, dbCheck, async (req, res) => {
  try {
    const { applicationStatus, applicationNotes } = req.body;
    
    const tender = await Tender.findById(req.params.id);
    
    if (!tender) {
      return res.status(404).json({
        success: false,
        message: 'Tender not found'
      });
    }

    tender.applicationStatus = applicationStatus || tender.applicationStatus;
    tender.applicationNotes = applicationNotes || tender.applicationNotes;
    
    if (applicationStatus === 'applied' && !tender.applicationDate) {
      tender.applicationDate = new Date();
    }

    await tender.addActivity({
      type: 'application_submitted',
      title: 'Application Status Updated',
      description: `Application status changed to ${applicationStatus}`,
      createdBy: req.user._id,
      metadata: { applicationStatus }
    });

    await tender.save();

    const populatedTender = await Tender.findById(tender._id)
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email');

    res.json({
      success: true,
      message: 'Application status updated successfully',
      tender: populatedTender
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application status'
    });
  }
});

module.exports = router;

