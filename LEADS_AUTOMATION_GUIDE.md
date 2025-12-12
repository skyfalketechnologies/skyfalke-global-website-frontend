# Leads Management Automation Guide

## Overview

The leads management automation system allows you to automate various tasks in your lead management workflow, including:
- Auto-assignment of leads to team members
- Auto-scoring based on lead data
- Auto-status updates
- Auto-followup task creation
- Auto-tagging
- Auto-notifications
- Auto-qualification
- Auto-conversion

## Installation

1. Install the required dependency:
```bash
npm install node-cron
```

2. The automation system is already integrated into your server. Restart your server to activate it.

## Automation Types

### 1. Auto-Assign (`auto_assign`)
Automatically assigns leads to team members.

**Example Rule:**
```json
{
  "name": "Assign Website Leads to Sales Team",
  "type": "auto_assign",
  "isActive": true,
  "priority": 10,
  "triggers": ["lead_created"],
  "conditions": {
    "source": "website"
  },
  "actions": {
    "assignTo": {
      "roundRobin": true,
      "userIds": ["user_id_1", "user_id_2", "user_id_3"]
    }
  }
}
```

### 2. Auto-Score (`auto_score`)
Automatically calculates and updates lead scores.

**Example Rule:**
```json
{
  "name": "Calculate Lead Score",
  "type": "auto_score",
  "isActive": true,
  "priority": 5,
  "triggers": ["lead_created", "lead_updated"],
  "conditions": {},
  "actions": {
    "updateScore": {
      "calculate": true
    }
  }
}
```

### 3. Auto-Status (`auto_status`)
Automatically updates lead status based on conditions.

**Example Rule:**
```json
{
  "name": "Mark High-Score Leads as Qualified",
  "type": "auto_status",
  "isActive": true,
  "priority": 15,
  "triggers": ["score_changed", "lead_updated"],
  "conditions": {
    "leadScore": {
      "min": 70
    },
    "status": "new"
  },
  "actions": {
    "updateStatus": "qualified"
  }
}
```

### 4. Auto-Followup (`auto_followup`)
Automatically creates follow-up tasks.

**Example Rule:**
```json
{
  "name": "Create Follow-up for New Leads",
  "type": "auto_followup",
  "isActive": true,
  "priority": 20,
  "triggers": ["lead_created"],
  "conditions": {
    "status": "new"
  },
  "actions": {
    "createFollowup": {
      "title": "Follow up with new lead",
      "description": "Contact the lead within 24 hours",
      "daysAhead": 1,
      "priority": "high"
    }
  }
}
```

### 5. Auto-Tag (`auto_tag`)
Automatically adds tags to leads.

**Example Rule:**
```json
{
  "name": "Tag High-Value Leads",
  "type": "auto_tag",
  "isActive": true,
  "priority": 10,
  "triggers": ["lead_created", "lead_updated"],
  "conditions": {
    "budget": ["over_100k", "50k_100k"],
    "timeline": "immediate"
  },
  "actions": {
    "addTags": ["high-value", "urgent", "priority"]
  }
}
```

### 6. Auto-Notify (`auto_notify`)
Automatically sends notifications.

**Example Rule:**
```json
{
  "name": "Notify on Hot Leads",
  "type": "auto_notify",
  "isActive": true,
  "priority": 25,
  "triggers": ["lead_created", "status_changed"],
  "conditions": {
    "leadRating": "hot"
  },
  "actions": {
    "notify": {
      "title": "Hot Lead Alert",
      "message": "A hot lead requires immediate attention",
      "priority": "high"
    }
  }
}
```

### 7. Auto-Qualify (`auto_qualify`)
Automatically qualifies leads.

**Example Rule:**
```json
{
  "name": "Auto-Qualify High-Score Leads",
  "type": "auto_qualify",
  "isActive": true,
  "priority": 30,
  "triggers": ["score_changed"],
  "conditions": {
    "leadScore": {
      "min": 60
    },
    "status": ["new", "contacted"]
  },
  "actions": {
    "qualify": true
  }
}
```

### 8. Auto-Convert (`auto_convert`)
Automatically converts leads to customers.

**Example Rule:**
```json
{
  "name": "Auto-Convert Qualified Leads with Budget",
  "type": "auto_convert",
  "isActive": true,
  "priority": 40,
  "triggers": ["status_changed"],
  "conditions": {
    "status": "qualified",
    "budget": ["over_100k", "50k_100k"],
    "timeline": "immediate"
  },
  "actions": {
    "convert": {
      "convertedTo": "customer",
      "conversionValue": 50000
    }
  }
}
```

## API Endpoints

### Get All Automation Rules
```
GET /api/automations/admin
Query params: type, isActive
```

### Get Single Rule
```
GET /api/automations/admin/:id
```

### Create Rule
```
POST /api/automations/admin
Body: Automation rule JSON
```

### Update Rule
```
PATCH /api/automations/admin/:id
Body: Update fields
```

### Delete Rule
```
DELETE /api/automations/admin/:id
```

### Toggle Rule Active Status
```
PATCH /api/automations/admin/:id/toggle
```

### Test Rule on Lead
```
POST /api/automations/admin/:id/test/:leadId
```

### Get Statistics
```
GET /api/automations/admin/stats
```

## Conditions Reference

### Status Conditions
```json
{
  "status": "new"  // or ["new", "contacted"]
}
```

### Lifecycle Stage Conditions
```json
{
  "lifecycleStage": "lead"  // or ["lead", "marketing_qualified_lead"]
}
```

### Lead Score Conditions
```json
{
  "leadScore": {
    "min": 50,
    "max": 100
  }
}
```

### Lead Rating Conditions
```json
{
  "leadRating": "hot"  // or ["hot", "warm"]
}
```

### Source Conditions
```json
{
  "source": "website"  // or ["website", "referral"]
}
```

### Owner Conditions
```json
{
  "hasOwner": true  // or false
}
```

### Time-Based Conditions
```json
{
  "createdWithinDays": 7,  // Lead created within last 7 days
  "lastActivityWithinDays": 3,  // Last activity within 3 days
  "noActivityForDays": 30  // No activity for 30 days
}
```

### Company Size Conditions
```json
{
  "companySize": "1000+"  // or ["1000+", "501-1000"]
}
```

### Budget Conditions
```json
{
  "budget": "over_100k"  // or ["over_100k", "50k_100k"]
}
```

### Custom Fields Conditions
```json
{
  "customFields": {
    "fieldName": "fieldValue"
  }
}
```

## Triggers

- `lead_created` - When a new lead is created
- `lead_updated` - When a lead is updated
- `activity_added` - When an activity is added to a lead
- `status_changed` - When lead status changes
- `score_changed` - When lead score changes
- `email_opened` - When a lead opens an email
- `email_clicked` - When a lead clicks an email link
- `form_submitted` - When a form is submitted
- `page_viewed` - When a page is viewed
- `scheduled` - For scheduled/recurring automations

## Scheduled Automations

For recurring automations, use the `schedule` field with a cron expression:

```json
{
  "name": "Daily Lead Nurturing",
  "type": "auto_followup",
  "schedule": "0 9 * * *",  // Every day at 9 AM
  "triggers": ["scheduled"],
  "conditions": {
    "status": "nurturing",
    "noActivityForDays": 7
  },
  "actions": {
    "createFollowup": {
      "title": "Nurture follow-up",
      "daysAhead": 0
    }
  }
}
```

## Best Practices

1. **Priority Order**: Rules with higher priority execute first. Use priorities to control execution order.

2. **Condition Specificity**: Make conditions as specific as possible to avoid unintended matches.

3. **Test Before Activating**: Use the test endpoint to verify rules work correctly before activating them.

4. **Monitor Performance**: Check automation statistics regularly to ensure rules are working as expected.

5. **Start Simple**: Begin with simple automations and gradually add complexity.

6. **Document Rules**: Use descriptive names and descriptions for your automation rules.

## Example Workflow

1. **Lead Created** → Auto-assign to sales team
2. **Lead Assigned** → Calculate initial score
3. **Score > 70** → Mark as qualified, add "hot" tag, notify team
4. **Qualified + Budget** → Create follow-up task
5. **Follow-up Completed** → Convert to customer

## Troubleshooting

- **Rules not executing**: Check if rule is active and conditions match
- **Scheduled jobs not running**: Ensure node-cron is installed
- **Performance issues**: Review rule priorities and condition complexity
- **Unexpected behavior**: Test rules on individual leads first

## Support

For issues or questions, check the automation statistics endpoint to see execution counts and success/failure rates.

