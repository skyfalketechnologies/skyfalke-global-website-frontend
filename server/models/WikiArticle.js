const mongoose = require('mongoose');

const wikiArticleSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true, index: true },
  category: { type: String, trim: true, default: 'General' },
  tags: [{ type: String, trim: true }],
  content: { type: String, default: '' },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
    index: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  currentVersion: { type: Number, default: 1 },
  versions: [{
    version: Number,
    title: String,
    content: String,
    editedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    editedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

wikiArticleSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('WikiArticle', wikiArticleSchema);
