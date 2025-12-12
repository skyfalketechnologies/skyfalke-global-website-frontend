const express = require('express');
const Content = require('../models/Content');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all content by type
router.get('/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const content = await Content.find({ type, isActive: true })
      .sort({ order: 1, createdAt: -1 });
    
    res.json(content);
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single content item
router.get('/item/:id', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json(content);
  } catch (error) {
    console.error('Get content item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create content (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const content = new Content(req.body);
    await content.save();
    res.status(201).json(content);
  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update content (admin/editor)
router.put('/:id', auth, async (req, res) => {
  try {
    const content = await Content.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    res.json(content);
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete content (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const content = await Content.findByIdAndDelete(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all content for admin
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const content = await Content.find({})
      .sort({ type: 1, order: 1, createdAt: -1 });
    res.json(content);
  } catch (error) {
    console.error('Get all content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
