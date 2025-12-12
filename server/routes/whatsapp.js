const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const WhatsAppMessage = require('../models/WhatsAppMessage');
const Contact = require('../models/Contact');
const {
  verifyWebhookToken,
  verifyWebhookSignature,
  sendTextMessage,
  sendTemplateMessage,
  sendMediaMessage,
  processIncomingMessage,
  processStatusUpdate,
  markMessageAsRead,
  formatPhoneNumber
} = require('../services/whatsappService');
const { sendNotificationToAllAdmins } = require('../socket');

// Webhook verification (GET) - Required by WhatsApp
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (verifyWebhookToken(mode, token)) {
    console.log('WhatsApp webhook verified');
    res.status(200).send(challenge);
  } else {
    console.log('WhatsApp webhook verification failed');
    res.status(403).send('Forbidden');
  }
});

// Webhook endpoint (POST) - Receives messages and status updates
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    // Verify signature if webhook secret is configured
    const signature = req.headers['x-hub-signature-256'];
    if (signature && process.env.WHATSAPP_WEBHOOK_SECRET) {
      const isValid = verifyWebhookSignature(req.body, signature.replace('sha256=', ''));
      if (!isValid) {
        console.error('Invalid webhook signature');
        return res.status(403).send('Invalid signature');
      }
    }

    const webhookData = JSON.parse(req.body.toString());

    // Handle different webhook types
    const entry = webhookData.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    // Process messages
    if (value?.messages) {
      const result = await processIncomingMessage(webhookData);
      
      if (result.processed && result.message) {
        // Send notification to admins for new messages
        try {
          await sendNotificationToAllAdmins({
            title: 'New WhatsApp Message',
            message: `New message from ${result.message.contactName || result.message.from}`,
            type: 'whatsapp',
            category: 'communication',
            priority: 'medium',
            data: {
              messageId: result.message._id,
              from: result.message.from,
              contactId: result.contact?._id
            },
            actionUrl: `/system/dashboard/whatsapp/messages/${result.message._id}`
          });
        } catch (notificationError) {
          console.error('Error sending notification:', notificationError);
        }
      }
    }

    // Process status updates
    if (value?.statuses) {
      await processStatusUpdate(webhookData);
    }

    res.status(200).send('OK');

  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Admin routes - require authentication

// Get all messages with pagination and filtering
router.get('/admin/messages', adminAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      direction,
      status,
      contactId,
      phone,
      search,
      sortBy = 'timestamp',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Build filter object
    const filter = {};
    if (direction) filter.direction = direction;
    if (status) filter.status = status;
    if (contactId) filter.contactId = contactId;
    if (phone) filter.from = formatPhoneNumber(phone);

    if (search) {
      filter.$or = [
        { body: { $regex: search, $options: 'i' } },
        { from: { $regex: search, $options: 'i' } },
        { contactName: { $regex: search, $options: 'i' } }
      ];
    }

    const messages = await WhatsAppMessage.find(filter)
      .populate('contactId', 'name email company phone')
      .populate('sentBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await WhatsAppMessage.countDocuments(filter);

    res.json({
      success: true,
      messages,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
});

// Get conversation with a specific phone number
router.get('/admin/conversation/:phone', adminAuth, async (req, res) => {
  try {
    const { phone } = req.params;
    const { limit = 100 } = req.query;

    const formattedPhone = formatPhoneNumber(phone);
    const messages = await WhatsAppMessage.getConversation(formattedPhone, parseInt(limit));

    // Reverse to show oldest first
    messages.reverse();

    res.json({
      success: true,
      messages,
      phone: formattedPhone
    });

  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversation'
    });
  }
});

// Get recent conversations
router.get('/admin/conversations', adminAuth, async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const conversations = await WhatsAppMessage.getRecentConversations(parseInt(limit));

    res.json({
      success: true,
      conversations
    });

  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations'
    });
  }
});

// Get single message by ID
router.get('/admin/messages/:id', adminAuth, async (req, res) => {
  try {
    const message = await WhatsAppMessage.findById(req.params.id)
      .populate('contactId', 'name email company phone')
      .populate('sentBy', 'name email')
      .populate('notes.createdBy', 'name');

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.json({
      success: true,
      message
    });

  } catch (error) {
    console.error('Get message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch message'
    });
  }
});

// Send text message
router.post('/admin/send/text', adminAuth, async (req, res) => {
  try {
    const { to, message, contactId, previewUrl } = req.body;

    if (!to || !message) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and message are required'
      });
    }

    const result = await sendTextMessage(to, message, {
      contactId,
      sentBy: req.user._id,
      previewUrl
    });

    res.json({
      success: true,
      message: 'Message sent successfully',
      data: result
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: error.response?.data?.error?.message || error.message || 'Failed to send message'
    });
  }
});

// Send template message
router.post('/admin/send/template', adminAuth, async (req, res) => {
  try {
    const { to, templateName, templateParams, contactId, language } = req.body;

    if (!to || !templateName) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and template name are required'
      });
    }

    const result = await sendTemplateMessage(to, templateName, templateParams || [], {
      contactId,
      sentBy: req.user._id,
      language
    });

    res.json({
      success: true,
      message: 'Template message sent successfully',
      data: result
    });

  } catch (error) {
    console.error('Send template error:', error);
    res.status(500).json({
      success: false,
      message: error.response?.data?.error?.message || error.message || 'Failed to send template message'
    });
  }
});

// Send media message
router.post('/admin/send/media', adminAuth, async (req, res) => {
  try {
    const { to, mediaType, mediaUrl, caption, contactId } = req.body;

    if (!to || !mediaType || !mediaUrl) {
      return res.status(400).json({
        success: false,
        message: 'Phone number, media type, and media URL are required'
      });
    }

    const result = await sendMediaMessage(to, mediaType, mediaUrl, caption || '', {
      contactId,
      sentBy: req.user._id
    });

    res.json({
      success: true,
      message: 'Media message sent successfully',
      data: result
    });

  } catch (error) {
    console.error('Send media error:', error);
    res.status(500).json({
      success: false,
      message: error.response?.data?.error?.message || error.message || 'Failed to send media message'
    });
  }
});

// Mark message as read
router.patch('/admin/messages/:id/read', adminAuth, async (req, res) => {
  try {
    const message = await WhatsAppMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    await message.markAsRead();

    // If it's an inbound message, mark as read on WhatsApp
    if (message.direction === 'inbound' && message.messageId) {
      try {
        await markMessageAsRead(message.messageId);
      } catch (error) {
        console.error('Error marking as read on WhatsApp:', error);
      }
    }

    res.json({
      success: true,
      message: 'Message marked as read'
    });

  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark message as read'
    });
  }
});

// Get message statistics
router.get('/admin/stats', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const stats = await WhatsAppMessage.getStats(startDate, endDate);
    const unreadCount = await WhatsAppMessage.getUnreadCount();

    res.json({
      success: true,
      stats: {
        ...stats,
        unread: unreadCount
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

// Add note to message
router.post('/admin/messages/:id/notes', adminAuth, async (req, res) => {
  try {
    const { note } = req.body;

    if (!note || !note.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Note is required'
      });
    }

    const message = await WhatsAppMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    message.notes.push({
      note: note.trim(),
      createdBy: req.user._id
    });

    await message.save();

    const updatedMessage = await WhatsAppMessage.findById(req.params.id)
      .populate('notes.createdBy', 'name');

    res.json({
      success: true,
      message: 'Note added successfully',
      data: updatedMessage
    });

  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add note'
    });
  }
});

// Send message to contact
router.post('/admin/contacts/:contactId/send', adminAuth, async (req, res) => {
  try {
    const { contactId } = req.params;
    const { message, type, mediaUrl, caption, templateName, templateParams } = req.body;

    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    if (!contact.phone) {
      return res.status(400).json({
        success: false,
        message: 'Contact does not have a phone number'
      });
    }

    let result;
    if (type === 'template') {
      result = await sendTemplateMessage(contact.phone, templateName, templateParams || [], {
        contactId: contact._id,
        sentBy: req.user._id
      });
    } else if (type === 'media') {
      result = await sendMediaMessage(contact.phone, 'image', mediaUrl, caption || '', {
        contactId: contact._id,
        sentBy: req.user._id
      });
    } else {
      result = await sendTextMessage(contact.phone, message, {
        contactId: contact._id,
        sentBy: req.user._id
      });
    }

    // Update contact response method
    await contact.markAsResponded('whatsapp');

    res.json({
      success: true,
      message: 'Message sent successfully',
      data: result
    });

  } catch (error) {
    console.error('Send to contact error:', error);
    res.status(500).json({
      success: false,
      message: error.response?.data?.error?.message || error.message || 'Failed to send message'
    });
  }
});

module.exports = router;

