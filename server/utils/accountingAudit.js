const AuditLog = require('../models/AuditLog');

/**
 * @param {object} opts
 * @param {import('mongoose').Types.ObjectId} opts.userId
 * @param {string} opts.action
 * @param {string} opts.entityType
 * @param {import('mongoose').Types.ObjectId} [opts.entityId]
 * @param {object} [opts.details]
 * @param {import('express').Request} [opts.req]
 */
async function logAccountingAudit(opts) {
  try {
    const { userId, action, entityType, entityId, details, req } = opts;
    await AuditLog.create({
      userId,
      action,
      entityType,
      entityId,
      details: details || {},
      ip: req?.ip || req?.connection?.remoteAddress,
      userAgent: req?.get?.('user-agent')
    });
  } catch (err) {
    console.error('Audit log write failed:', err.message);
  }
}

module.exports = { logAccountingAudit };
