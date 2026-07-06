const mongoose = require('mongoose');

const portalAnnouncementSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  bodyHtml: { type: String, default: '' },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  category: { type: String, trim: true, default: 'general' },
  published: { type: Boolean, default: true, index: true },
  pinned: { type: Boolean, default: false },
  audience: {
    type: String,
    enum: ['all', 'department', 'role'],
    default: 'all'
  },
  departments: [{ type: String, trim: true }],
  roles: [{ type: String, trim: true }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expiresAt: Date
}, { timestamps: true });

portalAnnouncementSchema.index({ createdAt: -1 });

module.exports = mongoose.model('PortalAnnouncement', portalAnnouncementSchema);
