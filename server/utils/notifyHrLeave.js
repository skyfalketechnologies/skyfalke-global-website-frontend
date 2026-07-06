const axios = require('axios');
const User = require('../models/User');
const Employee = require('../models/Employee');
const Notification = require('../models/Notification');
const IntegrationSettings = require('../models/IntegrationSettings');

/**
 * Notify HR/Admin users in-app and optionally Slack when a new leave request is created.
 */
async function notifyHrNewLeaveRequest(leaveRequest, requesterUser) {
  try {
    const emp = await Employee.findById(leaveRequest.employee)
      .select('personalInfo.firstName personalInfo.lastName employeeId')
      .lean();

    const name = emp
      ? `${emp.personalInfo?.firstName || ''} ${emp.personalInfo?.lastName || ''}`.trim()
      : 'Employee';
    const title = 'New leave request';
    const message = `${requesterUser.name} requested ${leaveRequest.leaveType} leave (${leaveRequest.days} day(s)) — ${name} (${emp?.employeeId || '—'}).`;

    const hrUsers = await User.find({
      isActive: true,
      role: { $in: ['hr', 'admin', 'super_admin'] }
    })
      .select('_id')
      .lean();

    for (const u of hrUsers) {
      try {
        await Notification.create({
          title,
          message,
          type: 'info',
          category: 'portal',
          recipient: u._id,
          actionUrl: '/system/dashboard/portal/leave',
          data: { leaveId: String(leaveRequest._id) }
        });
      } catch (e) {
        console.warn('notifyHrNewLeaveRequest notification:', e.message);
      }
    }

    const settings = await IntegrationSettings.findOne({ key: 'global' }).lean();
    if (settings?.slack?.enabled && settings.slack?.webhookUrl) {
      try {
        await axios.post(
          settings.slack.webhookUrl,
          {
            text: `*${title}*\n${message}\n_Open Employee Portal → Leave to review._`
          },
          { timeout: 8000, headers: { 'Content-Type': 'application/json' } }
        );
      } catch (e) {
        console.warn('Slack webhook (leave):', e.message);
      }
    }
  } catch (e) {
    console.warn('notifyHrNewLeaveRequest:', e.message);
  }
}

module.exports = { notifyHrNewLeaveRequest };
