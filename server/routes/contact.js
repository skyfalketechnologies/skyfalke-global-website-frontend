const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { adminAuth } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');
const { sendNotificationToAllAdmins } = require('../socket');

// Rate limiting for contact submissions
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many contact submissions from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes (no authentication required)
// Submit contact form
router.post('/submit', contactLimiter, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      subject,
      message,
      type = 'contact',
      service,
      budget,
      timeline
    } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      });
    }

    // Email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Create contact submission
    const contactData = {
      name,
      email,
      phone,
      company,
      subject,
      message,
      type,
      service,
      budget,
      timeline,
      source: 'website',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    };

    const contact = new Contact(contactData);
    await contact.save();

    // Send notification to all admins
    try {
      // Customize title and message based on contact type
      let typeTitle, notificationMessage;
      
      switch (type) {
        case 'hire_us':
          typeTitle = 'New Hire Us Request';
          notificationMessage = `New hire us request from ${name}${company ? ` from ${company}` : ''} - ${subject}`;
          break;
        case 'quote_request':
          typeTitle = 'New Quote Request';
          notificationMessage = `New quote request from ${name}${company ? ` from ${company}` : ''} - ${subject}`;
          break;
        case 'partnership':
          typeTitle = 'New Partnership Inquiry';
          notificationMessage = `New partnership inquiry from ${name}${company ? ` from ${company}` : ''} - ${subject}`;
          break;
        case 'consultation':
          typeTitle = 'New Consultation Request';
          notificationMessage = `New consultation request from ${name}${company ? ` from ${company}` : ''} - ${subject}`;
          break;
        case 'contact':
        default:
          typeTitle = 'New Contact Inquiry';
          notificationMessage = `New contact inquiry from ${name}${company ? ` from ${company}` : ''} - ${subject}`;
          break;
      }
      
      await sendNotificationToAllAdmins({
        title: typeTitle,
        message: notificationMessage,
        type: 'contact',
        category: 'contact',
        priority: 'medium',
        data: {
          contactId: contact._id,
          contactType: type,
          company: company || 'N/A',
          email: email,
          subject: subject
        },
        actionUrl: `/system/dashboard/contacts/${contact._id}`
      });
    } catch (notificationError) {
      console.error('Error sending notification:', notificationError);
      // Log error but don't fail the contact submission
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
      contactId: contact._id
    });

  } catch (error) {
    console.error('Contact submission error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.'
    });
  }
});

// Admin routes (require authentication)
// Get all contacts with pagination and filtering
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      priority,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (priority) filter.priority = priority;
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    const contacts = await Contact.find(filter)
      .populate('assignedTo', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Contact.countDocuments(filter);

    res.json({
      success: true,
      contacts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts'
    });
  }
});

// Get contact statistics
router.get('/admin/stats', adminAuth, async (req, res) => {
  try {
    const stats = await Contact.getStats();
    
    // Get recent contacts
    const recentContacts = await Contact.getRecent(5);
    
    res.json({
      success: true,
      stats,
      recentContacts
    });

  } catch (error) {
    console.error('Get contact stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact statistics'
    });
  }
});

// Get single contact by ID
router.get('/admin/:id', adminAuth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('notes.createdBy', 'name');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      contact
    });

  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact'
    });
  }
});

// Update contact status
router.patch('/admin/:id/status', adminAuth, async (req, res) => {
  try {
    const { status, priority, assignedTo } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (assignedTo) updateData.assignedTo = assignedTo;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('assignedTo', 'name email');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact updated successfully',
      contact
    });

  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact'
    });
  }
});

// Mark contact as read
router.patch('/admin/:id/read', adminAuth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    await contact.markAsRead();

    res.json({
      success: true,
      message: 'Contact marked as read'
    });

  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark contact as read'
    });
  }
});

// Mark contact as responded
router.patch('/admin/:id/responded', adminAuth, async (req, res) => {
  try {
    const { responseMethod = 'email' } = req.body;
    
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    await contact.markAsResponded(responseMethod);

    res.json({
      success: true,
      message: 'Contact marked as responded'
    });

  } catch (error) {
    console.error('Mark as responded error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark contact as responded'
    });
  }
});

// Add note to contact
router.post('/admin/:id/notes', adminAuth, async (req, res) => {
  try {
    const { note } = req.body;

    if (!note || !note.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Note is required'
      });
    }

    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    contact.notes.push({
      note: note.trim(),
      createdBy: req.user._id
    });

    await contact.save();

    const updatedContact = await Contact.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('notes.createdBy', 'name');

    res.json({
      success: true,
      message: 'Note added successfully',
      contact: updatedContact
    });

  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add note'
    });
  }
});

// Delete contact
router.delete('/admin/:id', adminAuth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });

  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact'
    });
  }
});

// Bulk update contacts
router.patch('/admin/bulk', adminAuth, async (req, res) => {
  try {
    const { contactIds, updates } = req.body;

    if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Contact IDs are required'
      });
    }

    const updateData = {};
    if (updates.status) updateData.status = updates.status;
    if (updates.priority) updateData.priority = updates.priority;
    if (updates.assignedTo) updateData.assignedTo = updates.assignedTo;

    const result = await Contact.updateMany(
      { _id: { $in: contactIds } },
      updateData
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} contacts updated successfully`
    });

  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contacts'
    });
  }
});

module.exports = router;
