const mongoose = require('mongoose');

/**
 * Singleton-style doc (key: global) for Slack, Jira, Trello, GitHub, Google Workspace hooks.
 * Secrets should be loaded from env in production; stored fields are integration-ready.
 */
const integrationSettingsSchema = new mongoose.Schema({
  key: { type: String, default: 'global', unique: true },
  slack: {
    webhookUrl: { type: String, default: '' },
    channel: { type: String, default: '' },
    enabled: { type: Boolean, default: false }
  },
  jira: {
    baseUrl: { type: String, default: '' },
    projectKey: { type: String, default: '' },
    enabled: { type: Boolean, default: false }
  },
  trello: {
    boardId: { type: String, default: '' },
    enabled: { type: Boolean, default: false }
  },
  github: {
    org: { type: String, default: '' },
    defaultRepo: { type: String, default: '' },
    enabled: { type: Boolean, default: false }
  },
  googleWorkspace: {
    domain: { type: String, default: '' },
    enabled: { type: Boolean, default: false }
  },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('IntegrationSettings', integrationSettingsSchema);
