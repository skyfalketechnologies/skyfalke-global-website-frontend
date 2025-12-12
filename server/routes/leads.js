const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const { adminAuth } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');
const { sendNotificationToAllAdmins } = require('../socket');
const LeadAutomationService = require('../services/leadAutomationService');

// Rate limiting for lead submissions
const leadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    error: 'Too many lead submissions from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes (no authentication required)
// Submit lead form
router.post('/submit', leadLimiter, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      jobTitle,
      website,
      source = 'website',
      sourceDetail,
      campaign,
      landingPage,
      interests,
      services,
      preferredContactMethod,
      customFields
    } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      });
    }

    // Email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Check for duplicate email
    const existingLead = await Lead.findOne({ email: email.toLowerCase() });
    if (existingLead) {
      return res.status(400).json({
        success: false,
        message: 'A lead with this email already exists'
      });
    }

    // Create lead
    const leadData = {
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      company,
      jobTitle,
      website,
      source,
      sourceDetail,
      campaign,
      landingPage,
      interests: interests || [],
      services: services || [],
      preferredContactMethod: preferredContactMethod || 'email',
      customFields: customFields || {},
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    };

    const lead = new Lead(leadData);
    
    // Save the lead first
    await lead.save();
    
    // Add initial activity (this will save again)
    await lead.addActivity({
      type: 'form_submission',
      title: 'Lead Form Submitted',
      description: `Lead submitted via ${source}`,
      metadata: { source, landingPage, campaign }
    });

    // Process automation rules for new lead
    try {
      await LeadAutomationService.processLeadAutomation(lead, 'lead_created', {
        source,
        landingPage,
        campaign
      });
    } catch (automationError) {
      console.error('Error processing lead automation:', automationError);
      // Don't fail the lead creation if automation fails
    }

    // Send notification to all admins
    try {
      await sendNotificationToAllAdmins({
        title: 'New Lead',
        message: `New lead: ${lead.fullName} from ${company || 'Unknown Company'}`,
        type: 'lead',
        category: 'lead',
        priority: 'medium',
        data: {
          leadId: lead._id,
          leadName: lead.fullName,
          company: company || 'N/A',
          source: source
        },
        actionUrl: `/system/dashboard/leads/${lead._id}`
      });
    } catch (notificationError) {
      console.error('Error sending notification:', notificationError);
    }

    res.status(201).json({
      success: true,
      message: 'Thank you! We will contact you soon.',
      leadId: lead._id
    });

  } catch (error) {
    console.error('Lead submission error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.'
    });
  }
});

// Admin routes (require authentication)
// Get all leads with pagination and filtering
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      lifecycleStage,
      source,
      owner,
      search,
      leadRating,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      minScore,
      maxScore
    } = req.query;

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (lifecycleStage) filter.lifecycleStage = lifecycleStage;
    if (source) filter.source = source;
    if (owner) filter.owner = owner;
    if (leadRating) filter.leadRating = leadRating;
    
    if (minScore || maxScore) {
      filter.leadScore = {};
      if (minScore) filter.leadScore.$gte = parseInt(minScore);
      if (maxScore) filter.leadScore.$lte = parseInt(maxScore);
    }
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const leads = await Lead.find(filter)
      .populate('owner', 'name email')
      .populate('activities.createdBy', 'name')
      .populate('notes.createdBy', 'name')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Lead.countDocuments(filter);

    res.json({
      success: true,
      leads,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leads'
    });
  }
});

// Get lead statistics
router.get('/admin/stats', adminAuth, async (req, res) => {
  try {
    const { owner } = req.query;
    const ownerId = owner || null;
    
    const stats = await Lead.getStats(ownerId);
    
    // Get recent leads
    const recentLeads = await Lead.getRecent(5, ownerId);
    
    // Get conversion rate
    const conversionRate = stats.total > 0 
      ? ((stats.converted / stats.total) * 100).toFixed(2)
      : 0;
    
    res.json({
      success: true,
      stats: {
        ...stats,
        conversionRate: parseFloat(conversionRate)
      },
      recentLeads
    });

  } catch (error) {
    console.error('Get lead stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lead statistics'
    });
  }
});

// Get single lead by ID
router.get('/admin/:id', adminAuth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('activities.createdBy', 'name email')
      .populate('notes.createdBy', 'name email')
      .populate('tasks.assignedTo', 'name email')
      .populate('tasks.createdBy', 'name email');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.json({
      success: true,
      lead
    });

  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lead'
    });
  }
});

// Create new lead
router.post('/admin', adminAuth, async (req, res) => {
  try {
    const leadData = req.body;
    
    // Check for duplicate email if provided
    if (leadData.email) {
      const existingLead = await Lead.findOne({ email: leadData.email.toLowerCase() });
      if (existingLead) {
        return res.status(400).json({
          success: false,
          message: 'A lead with this email already exists'
        });
      }
      leadData.email = leadData.email.toLowerCase();
    }

    const lead = new Lead({
      ...leadData,
      source: leadData.source || 'admin'
    });

    // Save the lead first
    await lead.save();

    // Add activity (this will save again, but that's okay since the lead is already persisted)
    await lead.addActivity({
      type: 'other',
      title: 'Lead Created',
      description: 'Lead created manually',
      createdBy: req.user._id
    });

    const populatedLead = await Lead.findById(lead._id)
      .populate('owner', 'name email');

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      lead: populatedLead
    });

  } catch (error) {
    console.error('Create lead error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create lead'
    });
  }
});

// Update lead
router.patch('/admin/:id', adminAuth, async (req, res) => {
  try {
    const updateData = req.body;
    
    // Handle email update
    if (updateData.email) {
      updateData.email = updateData.email.toLowerCase();
      // Check for duplicate
      const existingLead = await Lead.findOne({ 
        email: updateData.email,
        _id: { $ne: req.params.id }
      });
      if (existingLead) {
        return res.status(400).json({
          success: false,
          message: 'A lead with this email already exists'
        });
      }
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('owner', 'name email')
      .populate('activities.createdBy', 'name')
      .populate('notes.createdBy', 'name');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    // Add activity for significant changes
    if (updateData.status || updateData.lifecycleStage || updateData.owner) {
      // Save first, then add activity (addActivity will save again)
      await lead.save();
      await lead.addActivity({
        type: 'other',
        title: 'Lead Updated',
        description: 'Lead information updated',
        createdBy: req.user._id
      });

      // Process automation rules for lead update
      try {
        const trigger = updateData.status ? 'status_changed' : 'lead_updated';
        await LeadAutomationService.processLeadAutomation(lead, trigger, {
          updatedFields: Object.keys(updateData),
          updatedBy: req.user._id
        });
      } catch (automationError) {
        console.error('Error processing lead automation:', automationError);
      }
    }

    res.json({
      success: true,
      message: 'Lead updated successfully',
      lead
    });

  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update lead'
    });
  }
});

// Add activity to lead
router.post('/admin/:id/activities', adminAuth, async (req, res) => {
  try {
    const { type, title, description, metadata } = req.body;

    if (!type || !title) {
      return res.status(400).json({
        success: false,
        message: 'Activity type and title are required'
      });
    }

    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    await lead.addActivity({
      type,
      title,
      description,
      metadata,
      createdBy: req.user._id
    });

    const updatedLead = await Lead.findById(req.params.id)
      .populate('activities.createdBy', 'name email');

    res.json({
      success: true,
      message: 'Activity added successfully',
      lead: updatedLead
    });

  } catch (error) {
    console.error('Add activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add activity'
    });
  }
});

// Add note to lead
router.post('/admin/:id/notes', adminAuth, async (req, res) => {
  try {
    const { note } = req.body;

    if (!note || !note.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Note is required'
      });
    }

    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    lead.notes.push({
      note: note.trim(),
      createdBy: req.user._id
    });

    // Save the note first
    await lead.save();

    // Add activity (addActivity will save again)
    await lead.addActivity({
      type: 'note',
      title: 'Note Added',
      description: 'A note was added to this lead',
      createdBy: req.user._id
    });

    const updatedLead = await Lead.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('notes.createdBy', 'name email');

    res.json({
      success: true,
      message: 'Note added successfully',
      lead: updatedLead
    });

  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add note'
    });
  }
});

// Add task to lead
router.post('/admin/:id/tasks', adminAuth, async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }

    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    lead.tasks.push({
      title: title.trim(),
      description: description?.trim(),
      dueDate: dueDate ? new Date(dueDate) : undefined,
      priority: priority || 'medium',
      assignedTo: assignedTo || req.user._id,
      createdBy: req.user._id
    });

    await lead.save();

    const updatedLead = await Lead.findById(req.params.id)
      .populate('tasks.assignedTo', 'name email')
      .populate('tasks.createdBy', 'name email');

    res.json({
      success: true,
      message: 'Task added successfully',
      lead: updatedLead
    });

  } catch (error) {
    console.error('Add task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add task'
    });
  }
});

// Update task
router.patch('/admin/:id/tasks/:taskId', adminAuth, async (req, res) => {
  try {
    const { status, completedAt } = req.body;

    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    const task = lead.tasks.id(req.params.taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    if (status) task.status = status;
    if (status === 'completed' && !task.completedAt) {
      task.completedAt = new Date();
    }
    if (completedAt) task.completedAt = new Date(completedAt);

    await lead.save();

    const updatedLead = await Lead.findById(req.params.id)
      .populate('tasks.assignedTo', 'name email')
      .populate('tasks.createdBy', 'name email');

    res.json({
      success: true,
      message: 'Task updated successfully',
      lead: updatedLead
    });

  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update task'
    });
  }
});

// Update lead score
router.patch('/admin/:id/score', adminAuth, async (req, res) => {
  try {
    const { score } = req.body;

    if (score === undefined || score < 0 || score > 100) {
      return res.status(400).json({
        success: false,
        message: 'Score must be between 0 and 100'
      });
    }

    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    await lead.updateLeadScore(parseInt(score));

    res.json({
      success: true,
      message: 'Lead score updated successfully',
      lead
    });

  } catch (error) {
    console.error('Update lead score error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update lead score'
    });
  }
});

// Convert lead
router.post('/admin/:id/convert', adminAuth, async (req, res) => {
  try {
    const { convertedTo, conversionValue } = req.body;

    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    await lead.convert({ convertedTo, conversionValue });

    // Add activity
    await lead.addActivity({
      type: 'other',
      title: 'Lead Converted',
      description: `Lead converted to ${convertedTo || 'customer'}`,
      createdBy: req.user._id
    });

    const updatedLead = await Lead.findById(req.params.id)
      .populate('owner', 'name email');

    res.json({
      success: true,
      message: 'Lead converted successfully',
      lead: updatedLead
    });

  } catch (error) {
    console.error('Convert lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to convert lead'
    });
  }
});

// Delete lead
router.delete('/admin/:id', adminAuth, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.json({
      success: true,
      message: 'Lead deleted successfully'
    });

  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete lead'
    });
  }
});

// Bulk update leads
router.patch('/admin/bulk', adminAuth, async (req, res) => {
  try {
    const { leadIds, updates } = req.body;

    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Lead IDs are required'
      });
    }

    const updateData = {};
    if (updates.status) updateData.status = updates.status;
    if (updates.lifecycleStage) updateData.lifecycleStage = updates.lifecycleStage;
    if (updates.owner) updateData.owner = updates.owner;
    if (updates.leadRating) updateData.leadRating = updates.leadRating;
    if (updates.assignedAt) updateData.assignedAt = new Date();

    const result = await Lead.updateMany(
      { _id: { $in: leadIds } },
      updateData
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} leads updated successfully`
    });

  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update leads'
    });
  }
});

module.exports = router;

