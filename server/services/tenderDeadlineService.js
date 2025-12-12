const Tender = require('../models/Tender');
const Notification = require('../models/Notification');
const { sendNotificationToAdmin } = require('../socket');

class TenderDeadlineService {
  /**
   * Check for tenders approaching deadline and send notifications
   * @param {number} daysBefore - Number of days before deadline to send reminder
   */
  static async checkDeadlines(daysBefore = [7, 3, 1]) {
    try {
      const now = new Date();
      const notifications = [];

      // Check for each reminder day
      for (const days of daysBefore) {
        const futureDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));
        const startOfDay = new Date(futureDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(futureDate.setHours(23, 59, 59, 999));

        // Find tenders with deadline in this range
        const tenders = await Tender.find({
          deadline: {
            $gte: startOfDay,
            $lte: endOfDay
          },
          status: { $in: ['open', 'in_progress'] },
          assignee: { $exists: true, $ne: null }
        }).populate('assignee', 'name email').populate('createdBy', 'name email');

        for (const tender of tenders) {
          // Check if we've already sent a reminder for this day
          const reminderAlreadySent = tender.deadlineRemindersSent.some(
            reminder => reminder.daysBefore === days
          );

          if (!reminderAlreadySent) {
            // Send notification to assignee
            try {
              const daysText = days === 1 ? '1 day' : `${days} days`;
              const deadlineDate = new Date(tender.deadline).toLocaleDateString();
              
              const notification = await Notification.createNotification({
                title: 'Tender Deadline Approaching',
                message: `Tender "${tender.title}" deadline is in ${daysText} (${deadlineDate})`,
                type: 'warning',
                category: 'system',
                recipient: tender.assignee._id,
                priority: days <= 1 ? 'urgent' : days <= 3 ? 'high' : 'medium',
                actionUrl: `/system/dashboard/tenders/${tender._id}`,
                data: {
                  tenderId: tender._id,
                  tenderTitle: tender.title,
                  deadline: tender.deadline,
                  daysBefore: days
                }
              });

              // Send via socket
              await sendNotificationToAdmin(tender.assignee._id.toString(), {
                title: notification.title,
                message: notification.message,
                type: notification.type,
                category: notification.category,
                priority: notification.priority,
                actionUrl: notification.actionUrl,
                data: notification.data
              });

              // Record that reminder was sent
              tender.deadlineRemindersSent.push({
                sentAt: new Date(),
                daysBefore: days
              });
              await tender.save();

              notifications.push({
                tenderId: tender._id,
                tenderTitle: tender.title,
                assignee: tender.assignee.email,
                daysBefore: days,
                deadline: tender.deadline
              });
            } catch (error) {
              console.error(`Error sending deadline reminder for tender ${tender._id}:`, error);
            }
          }
        }
      }

      return {
        success: true,
        notificationsSent: notifications.length,
        notifications
      };
    } catch (error) {
      console.error('Error checking tender deadlines:', error);
      throw error;
    }
  }

  /**
   * Get tenders approaching deadline (for dashboard display)
   */
  static async getApproachingDeadlines(daysBefore = 7) {
    try {
      return await Tender.getTendersApproachingDeadline(daysBefore);
    } catch (error) {
      console.error('Error getting approaching deadlines:', error);
      throw error;
    }
  }
}

module.exports = TenderDeadlineService;

