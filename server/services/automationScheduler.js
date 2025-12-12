let cron;
try {
  cron = require('node-cron');
} catch (error) {
  console.warn('node-cron not installed. Scheduled automations will not work.');
  console.warn('Install it with: npm install node-cron');
}

const LeadAutomationService = require('./leadAutomationService');
const TenderDeadlineService = require('./tenderDeadlineService');

class AutomationScheduler {
  constructor() {
    this.jobs = [];
    this.isRunning = false;
  }

  /**
   * Start the automation scheduler
   */
  start() {
    if (this.isRunning) {
      console.log('Automation scheduler is already running');
      return;
    }

    if (!cron) {
      console.warn('⚠️  node-cron not available. Automation scheduler cannot start.');
      console.warn('   Install it with: npm install node-cron');
      return;
    }

    console.log('🚀 Starting automation scheduler...');

    // Run scheduled automations every hour
    const hourlyJob = cron.schedule('0 * * * *', async () => {
      console.log('⏰ Running scheduled automations...');
      try {
        await LeadAutomationService.processScheduledAutomations();
        console.log('✅ Scheduled automations completed');
      } catch (error) {
        console.error('❌ Error running scheduled automations:', error);
      }
    }, {
      scheduled: true,
      timezone: 'Africa/Nairobi'
    });

    // Run lead scoring automation every 6 hours
    const scoringJob = cron.schedule('0 */6 * * *', async () => {
      console.log('⏰ Running lead scoring automation...');
      try {
        // This can be enhanced to recalculate scores for all leads
        // For now, it's handled by event-driven automation
        console.log('✅ Lead scoring automation completed');
      } catch (error) {
        console.error('❌ Error running lead scoring automation:', error);
      }
    }, {
      scheduled: true,
      timezone: 'Africa/Nairobi'
    });

    // Run follow-up automation every day at 9 AM
    const followupJob = cron.schedule('0 9 * * *', async () => {
      console.log('⏰ Running follow-up automation...');
      try {
        // Process leads that need follow-ups
        // This can be enhanced based on your business logic
        console.log('✅ Follow-up automation completed');
      } catch (error) {
        console.error('❌ Error running follow-up automation:', error);
      }
    }, {
      scheduled: true,
      timezone: 'Africa/Nairobi'
    });

    // Run sitemap generation daily at 2 AM
    const sitemapJob = cron.schedule('0 2 * * *', async () => {
      console.log('⏰ Running automatic sitemap generation...');
      try {
        const sitemapService = require('./sitemapService');
        const result = await sitemapService.generateAndUpdate();
        console.log('✅ Automatic sitemap generation completed');
        console.log(`📊 Generated ${result.stats.totalUrls} URLs`);
        console.log(`🔔 Pinged ${result.pingResults.filter(r => r.success).length} search engines`);
      } catch (error) {
        console.error('❌ Error running automatic sitemap generation:', error);
      }
    }, {
      scheduled: true,
      timezone: 'Africa/Nairobi'
    });

    // Run tender deadline reminders daily at 8 AM
    const tenderDeadlineJob = cron.schedule('0 8 * * *', async () => {
      console.log('⏰ Running tender deadline reminders...');
      try {
        const result = await TenderDeadlineService.checkDeadlines([7, 3, 1]);
        console.log('✅ Tender deadline reminders completed');
        console.log(`📧 Sent ${result.notificationsSent} deadline reminder(s)`);
      } catch (error) {
        console.error('❌ Error running tender deadline reminders:', error);
      }
    }, {
      scheduled: true,
      timezone: 'Africa/Nairobi'
    });

    this.jobs.push(hourlyJob, scoringJob, followupJob, sitemapJob, tenderDeadlineJob);
    this.isRunning = true;

    console.log('✅ Automation scheduler started successfully');
  }

  /**
   * Stop the automation scheduler
   */
  stop() {
    if (!this.isRunning) {
      console.log('Automation scheduler is not running');
      return;
    }

    console.log('🛑 Stopping automation scheduler...');
    
    this.jobs.forEach(job => {
      if (job && typeof job.stop === 'function') {
        job.stop();
      }
    });

    this.jobs = [];
    this.isRunning = false;

    console.log('✅ Automation scheduler stopped');
  }

  /**
   * Restart the automation scheduler
   */
  restart() {
    this.stop();
    setTimeout(() => {
      this.start();
    }, 1000);
  }
}

// Create singleton instance
const automationScheduler = new AutomationScheduler();

module.exports = automationScheduler;

