const mongoose = require('mongoose');
require('dotenv').config();
const AutomationRule = require('../models/AutomationRule');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skyfalke', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const createDefaultAutomations = async () => {
  try {
    console.log('Creating default automation rules...');

    // Get first admin user for createdBy field
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.error('No admin user found. Please create an admin user first.');
      process.exit(1);
    }

    const defaultRules = [
      {
        name: 'Auto-Assign Website Leads',
        description: 'Automatically assign leads from website to sales team using round-robin',
        type: 'auto_assign',
        isActive: true,
        priority: 10,
        triggers: ['lead_created'],
        conditions: {
          source: 'website'
        },
        actions: {
          assignTo: {
            roundRobin: true
          }
        },
        createdBy: admin._id,
        updatedBy: admin._id
      },
      {
        name: 'Calculate Lead Score',
        description: 'Automatically calculate lead score based on lead data',
        type: 'auto_score',
        isActive: true,
        priority: 5,
        triggers: ['lead_created', 'lead_updated'],
        conditions: {},
        actions: {
          updateScore: {
            calculate: true
          }
        },
        createdBy: admin._id,
        updatedBy: admin._id
      },
      {
        name: 'Mark High-Score Leads as Qualified',
        description: 'Automatically mark leads with score >= 70 as qualified',
        type: 'auto_status',
        isActive: true,
        priority: 15,
        triggers: ['score_changed', 'lead_updated'],
        conditions: {
          leadScore: {
            min: 70
          },
          status: 'new'
        },
        actions: {
          updateStatus: 'qualified',
          updateLifecycleStage: 'sales_qualified_lead'
        },
        createdBy: admin._id,
        updatedBy: admin._id
      },
      {
        name: 'Tag High-Value Leads',
        description: 'Tag leads with high budget and immediate timeline',
        type: 'auto_tag',
        isActive: true,
        priority: 12,
        triggers: ['lead_created', 'lead_updated'],
        conditions: {
          budget: ['over_100k', '50k_100k'],
          timeline: 'immediate'
        },
        actions: {
          addTags: ['high-value', 'urgent']
        },
        createdBy: admin._id,
        updatedBy: admin._id
      },
      {
        name: 'Notify on Hot Leads',
        description: 'Send notification when a hot lead is created',
        type: 'auto_notify',
        isActive: true,
        priority: 25,
        triggers: ['lead_created', 'status_changed'],
        conditions: {
          leadRating: 'hot'
        },
        actions: {
          notify: {
            title: 'Hot Lead Alert',
            message: 'A hot lead requires immediate attention',
            priority: 'high'
          }
        },
        createdBy: admin._id,
        updatedBy: admin._id
      },
      {
        name: 'Create Follow-up for New Leads',
        description: 'Create a follow-up task for new leads within 24 hours',
        type: 'auto_followup',
        isActive: true,
        priority: 20,
        triggers: ['lead_created'],
        conditions: {
          status: 'new'
        },
        actions: {
          createFollowup: {
            title: 'Follow up with new lead',
            description: 'Contact the lead within 24 hours',
            daysAhead: 1,
            priority: 'high'
          }
        },
        createdBy: admin._id,
        updatedBy: admin._id
      },
      {
        name: 'Auto-Qualify High-Score Leads',
        description: 'Automatically qualify leads with score >= 60',
        type: 'auto_qualify',
        isActive: true,
        priority: 30,
        triggers: ['score_changed'],
        conditions: {
          leadScore: {
            min: 60
          },
          status: ['new', 'contacted']
        },
        actions: {
          qualify: true
        },
        createdBy: admin._id,
        updatedBy: admin._id
      }
    ];

    let created = 0;
    let skipped = 0;

    for (const ruleData of defaultRules) {
      // Check if rule already exists
      const existing = await AutomationRule.findOne({ name: ruleData.name });
      if (existing) {
        console.log(`⏭️  Skipping "${ruleData.name}" - already exists`);
        skipped++;
        continue;
      }

      const rule = new AutomationRule(ruleData);
      await rule.save();
      console.log(`✅ Created automation rule: "${ruleData.name}"`);
      created++;
    }

    console.log(`\n✅ Done! Created ${created} rules, skipped ${skipped} existing rules.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating default automations:', error);
    process.exit(1);
  }
};

// Run the script
createDefaultAutomations();

