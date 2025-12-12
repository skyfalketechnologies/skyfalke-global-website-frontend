const express = require('express');
const router = express.Router();
const Partnership = require('../models/Partnership');
const User = require('../models/User');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Submit partnership application (public)
router.post('/submit', async (req, res) => {
  try {
    const {
      companyName,
      contactName,
      email,
      phone,
      website,
      industry,
      partnershipType,
      companySize,
      description,
      referralSource,
      referralDetails
    } = req.body;

    // Validate required fields
    if (!companyName || !contactName || !email || !industry || !partnershipType || !description) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if email already exists
    const existingPartnership = await Partnership.findOne({ email });
    if (existingPartnership) {
      return res.status(400).json({
        success: false,
        message: 'A partnership application with this email already exists'
      });
    }

    // Create new partnership application
    const partnership = new Partnership({
      companyName,
      contactName,
      email,
      phone,
      website,
      industry,
      partnershipType,
      companySize,
      description,
      referralSource,
      referralDetails
    });

    await partnership.save();

    // Send notification email (implement email service)
    // await sendPartnershipNotification(partnership);

    res.status(201).json({
      success: true,
      message: 'Partnership application submitted successfully',
      data: {
        id: partnership._id,
        companyName: partnership.companyName,
        status: partnership.status
      }
    });

  } catch (error) {
    console.error('Partnership submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all partnerships (admin only)
router.get('/', authenticateToken, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      partnershipType,
      industry,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};
    
    if (status) query.status = status;
    if (partnershipType) query.partnershipType = partnershipType;
    if (industry) query.industry = industry;
    
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { contactName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const partnerships = await Partnership.find(query)
      .populate('assignedTo', 'name email')
      .populate('reviewedBy', 'name email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total count
    const total = await Partnership.countDocuments(query);

    res.json({
      success: true,
      data: partnerships,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });

  } catch (error) {
    console.error('Get partnerships error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get partnership by ID (admin only)
router.get('/:id', authenticateToken, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const partnership = await Partnership.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('reviewedBy', 'name email');

    if (!partnership) {
      return res.status(404).json({
        success: false,
        message: 'Partnership not found'
      });
    }

    res.json({
      success: true,
      data: partnership
    });

  } catch (error) {
    console.error('Get partnership error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update partnership status (admin only)
router.patch('/:id/status', authenticateToken, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const { status, notes, priority, estimatedValue, nextFollowUp } = req.body;

    const partnership = await Partnership.findById(req.params.id);
    if (!partnership) {
      return res.status(404).json({
        success: false,
        message: 'Partnership not found'
      });
    }

    // Update fields
    if (status) partnership.status = status;
    if (notes) partnership.adminNotes = notes;
    if (priority) partnership.priority = priority;
    if (estimatedValue !== undefined) partnership.estimatedValue = estimatedValue;
    if (nextFollowUp) partnership.nextFollowUp = new Date(nextFollowUp);

    // Update review info if status is changing
    if (status && status !== partnership.status) {
      partnership.reviewedBy = req.user.id;
      partnership.reviewedAt = new Date();
    }

    await partnership.save();

    res.json({
      success: true,
      message: 'Partnership updated successfully',
      data: partnership
    });

  } catch (error) {
    console.error('Update partnership error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Assign partnership to admin (admin only)
router.patch('/:id/assign', authenticateToken, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const { assignedTo } = req.body;

    const partnership = await Partnership.findById(req.params.id);
    if (!partnership) {
      return res.status(404).json({
        success: false,
        message: 'Partnership not found'
      });
    }

    partnership.assignedTo = assignedTo;
    await partnership.save();

    res.json({
      success: true,
      message: 'Partnership assigned successfully',
      data: partnership
    });

  } catch (error) {
    console.error('Assign partnership error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Add contact attempt (admin only)
router.post('/:id/contact-attempt', authenticateToken, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const { method, notes, outcome } = req.body;

    const partnership = await Partnership.findById(req.params.id);
    if (!partnership) {
      return res.status(404).json({
        success: false,
        message: 'Partnership not found'
      });
    }

    await partnership.addContactAttempt(method, notes, outcome);

    res.json({
      success: true,
      message: 'Contact attempt added successfully',
      data: partnership
    });

  } catch (error) {
    console.error('Add contact attempt error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Add tags to partnership (admin only)
router.patch('/:id/tags', authenticateToken, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const { tags } = req.body;

    const partnership = await Partnership.findById(req.params.id);
    if (!partnership) {
      return res.status(404).json({
        success: false,
        message: 'Partnership not found'
      });
    }

    partnership.tags = tags;
    await partnership.save();

    res.json({
      success: true,
      message: 'Tags updated successfully',
      data: partnership
    });

  } catch (error) {
    console.error('Update tags error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get partnership statistics (admin only)
router.get('/stats/overview', authenticateToken, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const stats = await Partnership.getStats();
    
    // Get total count
    const total = await Partnership.countDocuments();
    
    // Get recent partnerships
    const recent = await Partnership.getRecent(5);
    
    // Get partnerships by type
    const byType = await Partnership.aggregate([
      {
        $group: {
          _id: '$partnershipType',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        total,
        stats,
        recent,
        byType
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete partnership (admin only)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const partnership = await Partnership.findByIdAndDelete(req.params.id);
    
    if (!partnership) {
      return res.status(404).json({
        success: false,
        message: 'Partnership not found'
      });
    }

    res.json({
      success: true,
      message: 'Partnership deleted successfully'
    });

  } catch (error) {
    console.error('Delete partnership error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
