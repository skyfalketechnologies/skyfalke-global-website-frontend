const Lead = require('../models/Lead');
const User = require('../models/User');
const AutomationRule = require('../models/AutomationRule');
const { sendNotificationToAllAdmins } = require('../socket');

class LeadAutomationService {
  /**
   * Process automation rules for a lead
   */
  static async processLeadAutomation(lead, trigger, context = {}) {
    try {
      // Get active automation rules that match the trigger
      const rules = await AutomationRule.find({
        isActive: true,
        triggers: trigger
      }).sort({ priority: -1 });

      const results = [];

      for (const rule of rules) {
        try {
          // Check if conditions are met
          if (await this.evaluateConditions(lead, rule.conditions, context)) {
            // Execute actions
            const result = await this.executeActions(lead, rule.actions, context);
            
            // Update rule statistics
            rule.executionCount += 1;
            rule.lastExecutedAt = new Date();
            if (result.success) {
              rule.successCount += 1;
            } else {
              rule.failureCount += 1;
            }
            await rule.save();

            results.push({
              ruleId: rule._id,
              ruleName: rule.name,
              success: result.success,
              message: result.message
            });
          }
        } catch (error) {
          console.error(`Error processing rule ${rule._id}:`, error);
          rule.failureCount += 1;
          await rule.save();
        }
      }

      return results;
    } catch (error) {
      console.error('Error in processLeadAutomation:', error);
      throw error;
    }
  }

  /**
   * Evaluate conditions for an automation rule
   */
  static async evaluateConditions(lead, conditions, context = {}) {
    if (!conditions || Object.keys(conditions).length === 0) {
      return true; // No conditions means always true
    }

    // Status conditions
    if (conditions.status) {
      if (Array.isArray(conditions.status)) {
        if (!conditions.status.includes(lead.status)) return false;
      } else if (lead.status !== conditions.status) {
        return false;
      }
    }

    // Lifecycle stage conditions
    if (conditions.lifecycleStage) {
      if (Array.isArray(conditions.lifecycleStage)) {
        if (!conditions.lifecycleStage.includes(lead.lifecycleStage)) return false;
      } else if (lead.lifecycleStage !== conditions.lifecycleStage) {
        return false;
      }
    }

    // Lead score conditions
    if (conditions.leadScore) {
      if (conditions.leadScore.min !== undefined && lead.leadScore < conditions.leadScore.min) {
        return false;
      }
      if (conditions.leadScore.max !== undefined && lead.leadScore > conditions.leadScore.max) {
        return false;
      }
    }

    // Lead rating conditions
    if (conditions.leadRating) {
      if (Array.isArray(conditions.leadRating)) {
        if (!conditions.leadRating.includes(lead.leadRating)) return false;
      } else if (lead.leadRating !== conditions.leadRating) {
        return false;
      }
    }

    // Source conditions
    if (conditions.source) {
      if (Array.isArray(conditions.source)) {
        if (!conditions.source.includes(lead.source)) return false;
      } else if (lead.source !== conditions.source) {
        return false;
      }
    }

    // Owner conditions
    if (conditions.hasOwner !== undefined) {
      if (conditions.hasOwner && !lead.owner) return false;
      if (!conditions.hasOwner && lead.owner) return false;
    }

    // Time-based conditions
    if (conditions.createdWithinDays) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - conditions.createdWithinDays);
      if (lead.createdAt < daysAgo) return false;
    }

    if (conditions.lastActivityWithinDays) {
      if (!lead.lastActivityDate) return false;
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - conditions.lastActivityWithinDays);
      if (lead.lastActivityDate < daysAgo) return false;
    }

    if (conditions.noActivityForDays) {
      if (lead.lastActivityDate) {
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - conditions.noActivityForDays);
        if (lead.lastActivityDate > daysAgo) return false;
      }
    }

    // Company size conditions
    if (conditions.companySize) {
      if (Array.isArray(conditions.companySize)) {
        if (!conditions.companySize.includes(lead.companySize)) return false;
      } else if (lead.companySize !== conditions.companySize) {
        return false;
      }
    }

    // Budget conditions
    if (conditions.budget) {
      if (Array.isArray(conditions.budget)) {
        if (!conditions.budget.includes(lead.budget)) return false;
      } else if (lead.budget !== conditions.budget) {
        return false;
      }
    }

    // Custom field conditions
    if (conditions.customFields) {
      for (const [key, value] of Object.entries(conditions.customFields)) {
        if (lead.customFields && lead.customFields[key] !== value) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Execute actions for an automation rule
   */
  static async executeActions(lead, actions, context = {}) {
    try {
      const results = [];

      // Auto-assign action
      if (actions.assignTo) {
        const result = await this.autoAssign(lead, actions.assignTo);
        results.push(result);
      }

      // Auto-score action
      if (actions.updateScore !== undefined) {
        const result = await this.autoScore(lead, actions.updateScore);
        results.push(result);
      }

      // Auto-status action
      if (actions.updateStatus) {
        const result = await this.autoStatus(lead, actions.updateStatus);
        results.push(result);
      }

      // Auto-lifecycle stage action
      if (actions.updateLifecycleStage) {
        const result = await this.autoLifecycleStage(lead, actions.updateLifecycleStage);
        results.push(result);
      }

      // Auto-tag action
      if (actions.addTags && Array.isArray(actions.addTags)) {
        const result = await this.autoTag(lead, actions.addTags);
        results.push(result);
      }

      // Auto-followup action
      if (actions.createFollowup) {
        const result = await this.autoFollowup(lead, actions.createFollowup);
        results.push(result);
      }

      // Auto-notify action
      if (actions.notify) {
        const result = await this.autoNotify(lead, actions.notify);
        results.push(result);
      }

      // Auto-qualify action
      if (actions.qualify) {
        const result = await this.autoQualify(lead);
        results.push(result);
      }

      // Auto-convert action
      if (actions.convert) {
        const result = await this.autoConvert(lead, actions.convert);
        results.push(result);
      }

      return {
        success: true,
        message: 'Actions executed successfully',
        results
      };
    } catch (error) {
      console.error('Error executing actions:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Auto-assign lead to a user
   */
  static async autoAssign(lead, assignConfig) {
    try {
      let assignedUser = null;

      if (assignConfig.userId) {
        // Assign to specific user
        assignedUser = await User.findById(assignConfig.userId);
      } else if (assignConfig.roundRobin) {
        // Round-robin assignment
        assignedUser = await this.roundRobinAssign(assignConfig.userIds || []);
      } else if (assignConfig.bySource) {
        // Assign based on source
        assignedUser = await this.assignBySource(lead.source);
      } else if (assignConfig.byLocation) {
        // Assign based on location
        assignedUser = await this.assignByLocation(lead.address?.country);
      }

      if (assignedUser) {
        lead.owner = assignedUser._id;
        lead.assignedAt = new Date();
        await lead.save();

        await lead.addActivity({
          type: 'other',
          title: 'Lead Auto-Assigned',
          description: `Lead automatically assigned to ${assignedUser.name}`,
          metadata: { automation: true, assignedTo: assignedUser._id }
        });

        return { success: true, message: `Assigned to ${assignedUser.name}` };
      }

      return { success: false, message: 'No user available for assignment' };
    } catch (error) {
      console.error('Error in autoAssign:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Round-robin assignment
   */
  static async roundRobinAssign(userIds = []) {
    if (userIds.length === 0) {
      // Get all admins if no specific users provided
      const admins = await User.find({ role: 'admin', isActive: true }).select('_id');
      userIds = admins.map(a => a._id.toString());
    }

    if (userIds.length === 0) return null;

    // Get the lead with the most recent assignment for each user
    const assignments = await Lead.aggregate([
      { $match: { owner: { $in: userIds.map(id => require('mongoose').Types.ObjectId(id)) } } },
      { $group: { _id: '$owner', count: { $sum: 1 }, lastAssigned: { $max: '$assignedAt' } } },
      { $sort: { count: 1, lastAssigned: 1 } }
    ]);

    if (assignments.length === 0) {
      // No assignments yet, assign to first user
      return await User.findById(userIds[0]);
    }

    // Find user with least assignments
    const leastAssigned = assignments[0];
    return await User.findById(leastAssigned._id);
  }

  /**
   * Assign by source
   */
  static async assignBySource(source) {
    // This can be customized based on your business logic
    // For now, just get a random admin
    const admins = await User.find({ role: 'admin', isActive: true });
    if (admins.length === 0) return null;
    return admins[Math.floor(Math.random() * admins.length)];
  }

  /**
   * Assign by location
   */
  static async assignByLocation(country) {
    // This can be customized based on your business logic
    const admins = await User.find({ role: 'admin', isActive: true });
    if (admins.length === 0) return null;
    return admins[Math.floor(Math.random() * admins.length)];
  }

  /**
   * Auto-score lead
   */
  static async autoScore(lead, scoreConfig) {
    try {
      let newScore = lead.leadScore || 0;

      if (typeof scoreConfig === 'number') {
        // Direct score assignment
        newScore = scoreConfig;
      } else if (scoreConfig.add) {
        // Add to current score
        newScore += scoreConfig.add;
      } else if (scoreConfig.calculate) {
        // Calculate score based on lead data
        newScore = this.calculateLeadScore(lead);
      }

      // Ensure score is within bounds
      newScore = Math.max(0, Math.min(100, newScore));

      await lead.updateLeadScore(newScore);

      await lead.addActivity({
        type: 'other',
        title: 'Lead Score Auto-Updated',
        description: `Lead score automatically updated to ${newScore}`,
        metadata: { automation: true, newScore }
      });

      return { success: true, message: `Score updated to ${newScore}` };
    } catch (error) {
      console.error('Error in autoScore:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Calculate lead score based on various factors
   */
  static calculateLeadScore(lead) {
    let score = 0;

    // Base score from rating
    if (lead.leadRating === 'hot') score += 30;
    else if (lead.leadRating === 'warm') score += 15;
    else if (lead.leadRating === 'cold') score += 5;

    // Score from company size
    if (lead.companySize === '1000+') score += 20;
    else if (lead.companySize === '501-1000') score += 15;
    else if (lead.companySize === '201-500') score += 10;
    else if (lead.companySize === '51-200') score += 5;

    // Score from budget
    if (lead.budget === 'over_100k') score += 25;
    else if (lead.budget === '50k_100k') score += 15;
    else if (lead.budget === '25k_50k') score += 10;
    else if (lead.budget === '10k_25k') score += 5;

    // Score from timeline
    if (lead.timeline === 'immediate') score += 20;
    else if (lead.timeline === '1_month') score += 10;
    else if (lead.timeline === '3_months') score += 5;

    // Score from engagement
    if (lead.emailOpens > 5) score += 10;
    if (lead.emailClicks > 2) score += 10;
    if (lead.activities && lead.activities.length > 3) score += 10;

    // Score from activities
    if (lead.activities) {
      const activityTypes = lead.activities.map(a => a.type);
      if (activityTypes.includes('meeting')) score += 15;
      if (activityTypes.includes('call')) score += 10;
      if (activityTypes.includes('email_sent')) score += 5;
    }

    return Math.min(100, score);
  }

  /**
   * Auto-update status
   */
  static async autoStatus(lead, statusConfig) {
    try {
      const newStatus = typeof statusConfig === 'string' ? statusConfig : statusConfig.status;
      
      if (lead.status !== newStatus) {
        lead.status = newStatus;
        await lead.save();

        await lead.addActivity({
          type: 'other',
          title: 'Status Auto-Updated',
          description: `Status automatically changed to ${newStatus}`,
          metadata: { automation: true, newStatus }
        });

        return { success: true, message: `Status updated to ${newStatus}` };
      }

      return { success: false, message: 'Status already set' };
    } catch (error) {
      console.error('Error in autoStatus:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Auto-update lifecycle stage
   */
  static async autoLifecycleStage(lead, stageConfig) {
    try {
      const newStage = typeof stageConfig === 'string' ? stageConfig : stageConfig.stage;
      
      if (lead.lifecycleStage !== newStage) {
        lead.lifecycleStage = newStage;
        await lead.save();

        await lead.addActivity({
          type: 'other',
          title: 'Lifecycle Stage Auto-Updated',
          description: `Lifecycle stage automatically changed to ${newStage}`,
          metadata: { automation: true, newStage }
        });

        return { success: true, message: `Lifecycle stage updated to ${newStage}` };
      }

      return { success: false, message: 'Lifecycle stage already set' };
    } catch (error) {
      console.error('Error in autoLifecycleStage:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Auto-tag lead
   */
  static async autoTag(lead, tags) {
    try {
      if (!Array.isArray(tags)) tags = [tags];
      
      const newTags = tags.filter(tag => !lead.tags.includes(tag));
      if (newTags.length > 0) {
        lead.tags = [...lead.tags, ...newTags];
        await lead.save();

        await lead.addActivity({
          type: 'other',
          title: 'Tags Auto-Added',
          description: `Tags automatically added: ${newTags.join(', ')}`,
          metadata: { automation: true, tags: newTags }
        });

        return { success: true, message: `Tags added: ${newTags.join(', ')}` };
      }

      return { success: false, message: 'No new tags to add' };
    } catch (error) {
      console.error('Error in autoTag:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Auto-create followup task
   */
  static async autoFollowup(lead, followupConfig) {
    try {
      const dueDate = followupConfig.dueDate 
        ? new Date(followupConfig.dueDate)
        : new Date(Date.now() + (followupConfig.daysAhead || 1) * 24 * 60 * 60 * 1000);

      lead.tasks.push({
        title: followupConfig.title || 'Follow-up',
        description: followupConfig.description || 'Automated follow-up task',
        dueDate: dueDate,
        priority: followupConfig.priority || 'medium',
        assignedTo: followupConfig.assignedTo || lead.owner,
        createdBy: followupConfig.createdBy || lead.owner,
        status: 'pending'
      });

      await lead.save();

      await lead.addActivity({
        type: 'task',
        title: 'Follow-up Task Auto-Created',
        description: `Follow-up task automatically created: ${followupConfig.title || 'Follow-up'}`,
        metadata: { automation: true, dueDate }
      });

      return { success: true, message: 'Follow-up task created' };
    } catch (error) {
      console.error('Error in autoFollowup:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Auto-notify
   */
  static async autoNotify(lead, notifyConfig) {
    try {
      const message = notifyConfig.message || `Lead ${lead.fullName} requires attention`;
      
      await sendNotificationToAllAdmins({
        title: notifyConfig.title || 'Lead Alert',
        message: message,
        type: 'lead',
        category: 'lead',
        priority: notifyConfig.priority || 'medium',
        data: {
          leadId: lead._id,
          leadName: lead.fullName,
          company: lead.company || 'N/A'
        },
        actionUrl: `/system/dashboard/leads/${lead._id}`
      });

      return { success: true, message: 'Notification sent' };
    } catch (error) {
      console.error('Error in autoNotify:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Auto-qualify lead
   */
  static async autoQualify(lead) {
    try {
      if (lead.status !== 'qualified') {
        lead.status = 'qualified';
        lead.lifecycleStage = 'sales_qualified_lead';
        await lead.save();

        await lead.addActivity({
          type: 'other',
          title: 'Lead Auto-Qualified',
          description: 'Lead automatically qualified based on criteria',
          metadata: { automation: true }
        });

        return { success: true, message: 'Lead qualified' };
      }

      return { success: false, message: 'Lead already qualified' };
    } catch (error) {
      console.error('Error in autoQualify:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Auto-convert lead
   */
  static async autoConvert(lead, convertConfig) {
    try {
      if (!lead.converted) {
        await lead.convert({
          convertedTo: convertConfig.convertedTo || 'customer',
          conversionValue: convertConfig.conversionValue
        });

        await lead.addActivity({
          type: 'other',
          title: 'Lead Auto-Converted',
          description: 'Lead automatically converted to customer',
          metadata: { automation: true }
        });

        return { success: true, message: 'Lead converted' };
      }

      return { success: false, message: 'Lead already converted' };
    } catch (error) {
      console.error('Error in autoConvert:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Process scheduled automations
   */
  static async processScheduledAutomations() {
    try {
      const rules = await AutomationRule.find({
        isActive: true,
        triggers: 'scheduled',
        schedule: { $exists: true, $ne: '' }
      });

      // Get all leads that might match
      const leads = await Lead.find({});

      for (const rule of rules) {
        for (const lead of leads) {
          try {
            if (await this.evaluateConditions(lead, rule.conditions)) {
              await this.executeActions(lead, rule.actions);
            }
          } catch (error) {
            console.error(`Error processing scheduled rule ${rule._id} for lead ${lead._id}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Error in processScheduledAutomations:', error);
    }
  }
}

module.exports = LeadAutomationService;

