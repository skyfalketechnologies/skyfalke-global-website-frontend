const express = require('express');
const router = express.Router();
const multer = require('multer');
const { adminAuth } = require('../middleware/auth');
const WhatsAppMessage = require('../models/WhatsAppMessage');
const Contact = require('../models/Contact');
const Lead = require('../models/Lead');
const ImageKitService = require('../services/imageKitService');
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

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 16 * 1024 * 1024 } // WhatsApp's own media cap
});

const mediaTypeFromMime = (mimetype = '') => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype.startsWith('audio/')) return 'audio';
  return 'document';
};

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
router.post('/webhook', async (req, res) => {
  try {
    // Verify signature if webhook secret is configured
    // req.body may be a raw Buffer (if express.raw ran) or a parsed object (if express.json ran first)
    const signature = req.headers['x-hub-signature-256'];
    if (signature && process.env.WHATSAPP_WEBHOOK_SECRET) {
      const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body));
      const isValid = verifyWebhookSignature(rawBody, signature.replace('sha256=', ''));
      if (!isValid) {
        console.error('Invalid webhook signature');
        return res.status(403).send('Invalid signature');
      }
    }

    const webhookData = Buffer.isBuffer(req.body) ? JSON.parse(req.body.toString()) : req.body;

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
            actionUrl: `/system/dashboard/whatsapp?phone=${encodeURIComponent(result.message.from)}`
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

// Upload a file to send as WhatsApp media (returns a public URL)
router.post('/admin/upload-media', adminAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }

    const uploadResult = await ImageKitService.uploadImage(req.file, 'whatsapp-media');

    res.json({
      success: true,
      url: uploadResult.url,
      mediaType: mediaTypeFromMime(req.file.mimetype),
      name: uploadResult.name,
      size: uploadResult.size
    });
  } catch (error) {
    console.error('WhatsApp media upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload media'
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

// Fetch approved templates from Meta API
router.get('/admin/templates', adminAuth, async (req, res) => {
  try {
    const wabaId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;
    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    if (!wabaId || !token) {
      return res.status(500).json({ success: false, message: 'WhatsApp credentials not configured' });
    }
    const url = `https://graph.facebook.com/v18.0/${wabaId}/message_templates?fields=name,language,status,components&limit=100`;
    const response = await require('axios').get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const raw = response.data.data || [];
    console.log('Meta templates raw:', JSON.stringify(raw.map(t => ({ name: t.name, status: t.status, language: t.language }))));
    const templates = raw
      .filter(t => !['REJECTED', 'DELETED', 'PAUSED', 'DISABLED'].includes(t.status))
      .map(t => ({ name: t.name, language: t.language, components: t.components }));
    res.json({ success: true, templates });
  } catch (error) {
    console.error('Fetch templates error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch templates from Meta' });
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

// Mark all inbound messages in a conversation as read
router.patch('/admin/conversation/:phone/read', adminAuth, async (req, res) => {
  try {
    const result = await WhatsAppMessage.markConversationRead(req.params.phone);
    res.json({
      success: true,
      updated: result.modifiedCount
    });
  } catch (error) {
    console.error('Mark conversation read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark conversation as read'
    });
  }
});

// Get WhatsApp conversation for a lead
router.get('/admin/leads/:leadId/conversation', adminAuth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.leadId).select('firstName lastName phone');
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    if (!lead.phone) {
      return res.json({ success: true, messages: [], phone: null });
    }

    const formattedPhone = formatPhoneNumber(lead.phone);
    const messages = await WhatsAppMessage.getConversation(formattedPhone, parseInt(req.query.limit) || 100);
    messages.reverse();

    res.json({
      success: true,
      messages,
      phone: formattedPhone
    });
  } catch (error) {
    console.error('Get lead conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lead conversation'
    });
  }
});

// Send WhatsApp message to a lead (and log it as a lead activity)
router.post('/admin/leads/:leadId/send', adminAuth, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const lead = await Lead.findById(req.params.leadId);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    if (!lead.phone) {
      return res.status(400).json({ success: false, message: 'Lead does not have a phone number' });
    }

    const result = await sendTextMessage(lead.phone, message.trim(), {
      leadId: lead._id,
      sentBy: req.user._id
    });

    // Log activity and bump lead to contacted if still new
    try {
      if (lead.status === 'new') lead.status = 'contacted';
      await lead.addActivity({
        type: 'whatsapp',
        title: 'WhatsApp message sent',
        description: message.trim().substring(0, 500),
        createdBy: req.user._id,
        metadata: { messageId: result.whatsAppMessage?._id, direction: 'outbound' }
      });
    } catch (activityError) {
      console.error('Error logging WhatsApp activity on lead:', activityError);
    }

    res.json({
      success: true,
      message: 'Message sent successfully',
      data: result
    });
  } catch (error) {
    console.error('Send to lead error:', error);
    res.status(500).json({
      success: false,
      message: error.response?.data?.error?.message || error.message || 'Failed to send message'
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

