const express = require('express');
const router = express.Router();
const AutomationRule = require('../models/AutomationRule');
const Lead = require('../models/Lead');
const { adminAuth } = require('../middleware/auth');
const LeadAutomationService = require('../services/leadAutomationService');

// Get all automation rules
router.get('/admin', adminAuth, async (req, res) => {
  try {
    const { type, isActive } = req.query;
    
    const filter = {};
    if (type) filter.type = type;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const rules = await AutomationRule.find(filter)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ priority: -1, createdAt: -1 });

    res.json({
      success: true,
      rules
    });
  } catch (error) {
    console.error('Get automation rules error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch automation rules'
    });
  }
});

// Get single automation rule
router.get('/admin/:id', adminAuth, async (req, res) => {
  try {
    const rule = await AutomationRule.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: 'Automation rule not found'
      });
    }

    res.json({
      success: true,
      rule
    });
  } catch (error) {
    console.error('Get automation rule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch automation rule'
    });
  }
});

// Create automation rule
router.post('/admin', adminAuth, async (req, res) => {
  try {
    const ruleData = {
      ...req.body,
      createdBy: req.user._id,
      updatedBy: req.user._id
    };

    const rule = new AutomationRule(ruleData);
    await rule.save();

    const populatedRule = await AutomationRule.findById(rule._id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Automation rule created successfully',
      rule: populatedRule
    });
  } catch (error) {
    console.error('Create automation rule error:', error);
    
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
      message: 'Failed to create automation rule'
    });
  }
});

// Update automation rule
router.patch('/admin/:id', adminAuth, async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updatedBy: req.user._id
    };

    const rule = await AutomationRule.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: 'Automation rule not found'
      });
    }

    res.json({
      success: true,
      message: 'Automation rule updated successfully',
      rule
    });
  } catch (error) {
    console.error('Update automation rule error:', error);
    
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
      message: 'Failed to update automation rule'
    });
  }
});

// Delete automation rule
router.delete('/admin/:id', adminAuth, async (req, res) => {
  try {
    const rule = await AutomationRule.findByIdAndDelete(req.params.id);
    
    if (!rule) {
      return res.status(404).json({
        success: false,
        message: 'Automation rule not found'
      });
    }

    res.json({
      success: true,
      message: 'Automation rule deleted successfully'
    });
  } catch (error) {
    console.error('Delete automation rule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete automation rule'
    });
  }
});

// Toggle automation rule active status
router.patch('/admin/:id/toggle', adminAuth, async (req, res) => {
  try {
    const rule = await AutomationRule.findById(req.params.id);
    
    if (!rule) {
      return res.status(404).json({
        success: false,
        message: 'Automation rule not found'
      });
    }

    rule.isActive = !rule.isActive;
    rule.updatedBy = req.user._id;
    await rule.save();

    res.json({
      success: true,
      message: `Automation rule ${rule.isActive ? 'activated' : 'deactivated'}`,
      rule
    });
  } catch (error) {
    console.error('Toggle automation rule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle automation rule'
    });
  }
});

// Test automation rule on a lead
router.post('/admin/:id/test/:leadId', adminAuth, async (req, res) => {
  try {
    const rule = await AutomationRule.findById(req.params.id);
    const lead = await Lead.findById(req.params.leadId);

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: 'Automation rule not found'
      });
    }

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    // Evaluate conditions
    const conditionsMet = await LeadAutomationService.evaluateConditions(lead, rule.conditions);
    
    // Execute actions if conditions are met
    let actionResult = null;
    if (conditionsMet) {
      actionResult = await LeadAutomationService.executeActions(lead, rule.actions);
    }

    res.json({
      success: true,
      conditionsMet,
      actionResult,
      message: conditionsMet 
        ? 'Conditions met, actions executed' 
        : 'Conditions not met'
    });
  } catch (error) {
    console.error('Test automation rule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to test automation rule'
    });
  }
});

// Get automation statistics
router.get('/admin/stats', adminAuth, async (req, res) => {
  try {
    const stats = await AutomationRule.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: ['$isActive', 1, 0] } },
          inactive: { $sum: { $cond: ['$isActive', 0, 1] } },
          totalExecutions: { $sum: '$executionCount' },
          totalSuccesses: { $sum: '$successCount' },
          totalFailures: { $sum: '$failureCount' }
        }
      }
    ]);

    const typeStats = await AutomationRule.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          active: { $sum: { $cond: ['$isActive', 1, 0] } }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      stats: stats[0] || {
        total: 0,
        active: 0,
        inactive: 0,
        totalExecutions: 0,
        totalSuccesses: 0,
        totalFailures: 0
      },
      typeStats
    });
  } catch (error) {
    console.error('Get automation stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch automation statistics'
    });
  }
});

module.exports = router;

