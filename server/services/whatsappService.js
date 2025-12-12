const axios = require('axios');
const crypto = require('crypto');
const WhatsAppMessage = require('../models/WhatsAppMessage');
const Contact = require('../models/Contact');

// WhatsApp Business API configuration
const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0';
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_BUSINESS_ACCOUNT_ID = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;
const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'skyfalke_whatsapp_verify_token';
const WHATSAPP_WEBHOOK_SECRET = process.env.WHATSAPP_WEBHOOK_SECRET;

/**
 * Verify webhook signature
 */
const verifyWebhookSignature = (payload, signature) => {
  if (!WHATSAPP_WEBHOOK_SECRET) {
    return true; // Skip verification if secret not set
  }
  
  const hmac = crypto.createHmac('sha256', WHATSAPP_WEBHOOK_SECRET);
  hmac.update(payload);
  const calculatedSignature = hmac.digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(calculatedSignature)
  );
};

/**
 * Verify webhook token (for initial setup)
 */
const verifyWebhookToken = (mode, token) => {
  if (mode === 'subscribe' && token === WHATSAPP_VERIFY_TOKEN) {
    return true;
  }
  return false;
};

/**
 * Format phone number to E.164 format
 */
const formatPhoneNumber = (phone) => {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  
  // If doesn't start with country code, assume Kenya (+254)
  if (!cleaned.startsWith('254')) {
    // Remove leading 0 if present
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    cleaned = '254' + cleaned;
  }
  
  return '+' + cleaned;
};

/**
 * Send text message via WhatsApp
 */
const sendTextMessage = async (to, message, options = {}) => {
  try {
    if (!WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_ACCESS_TOKEN) {
      throw new Error('WhatsApp API credentials not configured');
    }

    const phoneNumber = formatPhoneNumber(to);
    const url = `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: phoneNumber,
      type: 'text',
      text: {
        preview_url: options.previewUrl || false,
        body: message
      }
    };

    const response = await axios.post(url, payload, {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    // Save message to database
    const whatsAppMessage = new WhatsAppMessage({
      messageId: response.data.messages[0].id,
      from: WHATSAPP_PHONE_NUMBER_ID,
      to: phoneNumber,
      type: 'text',
      body: message,
      direction: 'outbound',
      status: 'sent',
      timestamp: new Date(),
      contactId: options.contactId,
      sentBy: options.sentBy,
      metadata: {
        wabaId: WHATSAPP_BUSINESS_ACCOUNT_ID,
        apiResponse: response.data
      }
    });

    await whatsAppMessage.save();

    return {
      success: true,
      messageId: response.data.messages[0].id,
      whatsAppMessage
    };

  } catch (error) {
    console.error('Error sending WhatsApp message:', error.response?.data || error.message);
    
    // Save failed message to database
    try {
      const whatsAppMessage = new WhatsAppMessage({
        messageId: `failed_${Date.now()}`,
        from: WHATSAPP_PHONE_NUMBER_ID,
        to: formatPhoneNumber(to),
        type: 'text',
        body: message,
        direction: 'outbound',
        status: 'failed',
        errorCode: error.response?.data?.error?.code,
        errorMessage: error.response?.data?.error?.message || error.message,
        timestamp: new Date(),
        contactId: options.contactId,
        sentBy: options.sentBy
      });
      await whatsAppMessage.save();
    } catch (dbError) {
      console.error('Error saving failed message:', dbError);
    }

    throw error;
  }
};

/**
 * Send template message via WhatsApp
 */
const sendTemplateMessage = async (to, templateName, templateParams = [], options = {}) => {
  try {
    if (!WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_ACCESS_TOKEN) {
      throw new Error('WhatsApp API credentials not configured');
    }

    const phoneNumber = formatPhoneNumber(to);
    const url = `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

    const components = [];
    if (templateParams.length > 0) {
      components.push({
        type: 'body',
        parameters: templateParams.map(param => ({
          type: 'text',
          text: param
        }))
      });
    }

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: phoneNumber,
      type: 'template',
      template: {
        name: templateName,
        language: {
          code: options.language || 'en'
        },
        components: components.length > 0 ? components : undefined
      }
    };

    const response = await axios.post(url, payload, {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    // Save message to database
    const whatsAppMessage = new WhatsAppMessage({
      messageId: response.data.messages[0].id,
      from: WHATSAPP_PHONE_NUMBER_ID,
      to: phoneNumber,
      type: 'template',
      templateName: templateName,
      templateParams: templateParams,
      direction: 'outbound',
      status: 'sent',
      timestamp: new Date(),
      contactId: options.contactId,
      sentBy: options.sentBy,
      metadata: {
        wabaId: WHATSAPP_BUSINESS_ACCOUNT_ID,
        apiResponse: response.data
      }
    });

    await whatsAppMessage.save();

    return {
      success: true,
      messageId: response.data.messages[0].id,
      whatsAppMessage
    };

  } catch (error) {
    console.error('Error sending WhatsApp template:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Send media message (image, document, etc.)
 */
const sendMediaMessage = async (to, mediaType, mediaUrl, caption = '', options = {}) => {
  try {
    if (!WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_ACCESS_TOKEN) {
      throw new Error('WhatsApp API credentials not configured');
    }

    const phoneNumber = formatPhoneNumber(to);
    const url = `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

    const validTypes = ['image', 'video', 'audio', 'document'];
    if (!validTypes.includes(mediaType)) {
      throw new Error(`Invalid media type. Must be one of: ${validTypes.join(', ')}`);
    }

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: phoneNumber,
      type: mediaType,
      [mediaType]: {
        link: mediaUrl,
        ...(caption && { caption })
      }
    };

    const response = await axios.post(url, payload, {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    // Save message to database
    const whatsAppMessage = new WhatsAppMessage({
      messageId: response.data.messages[0].id,
      from: WHATSAPP_PHONE_NUMBER_ID,
      to: phoneNumber,
      type: mediaType,
      mediaUrl: mediaUrl,
      caption: caption,
      direction: 'outbound',
      status: 'sent',
      timestamp: new Date(),
      contactId: options.contactId,
      sentBy: options.sentBy,
      metadata: {
        wabaId: WHATSAPP_BUSINESS_ACCOUNT_ID,
        apiResponse: response.data
      }
    });

    await whatsAppMessage.save();

    return {
      success: true,
      messageId: response.data.messages[0].id,
      whatsAppMessage
    };

  } catch (error) {
    console.error('Error sending WhatsApp media:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Process incoming webhook message
 */
const processIncomingMessage = async (webhookData) => {
  try {
    const entry = webhookData.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (!value || !value.messages) {
      return { processed: false, reason: 'No messages in webhook' };
    }

    const message = value.messages[0];
    const contact = value.contacts?.[0];
    const phoneNumber = message.from;
    const messageId = message.id;

    // Check if message already exists
    const existingMessage = await WhatsAppMessage.findOne({ messageId });
    if (existingMessage) {
      return { processed: false, reason: 'Message already processed', message: existingMessage };
    }

    // Find or create contact
    let contactRecord = await Contact.findOne({ phone: phoneNumber });
    if (!contactRecord && contact) {
      contactRecord = new Contact({
        name: contact.profile?.name || 'WhatsApp User',
        phone: phoneNumber,
        email: `${phoneNumber.replace(/\D/g, '')}@whatsapp.local`,
        subject: 'WhatsApp Contact',
        message: 'Contact via WhatsApp',
        source: 'whatsapp',
        status: 'new'
      });
      await contactRecord.save();
    }

    // Extract message content based on type
    let body = '';
    let mediaUrl = '';
    let mediaId = '';
    let caption = '';

    switch (message.type) {
      case 'text':
        body = message.text?.body || '';
        break;
      case 'image':
      case 'video':
      case 'audio':
      case 'document':
        mediaId = message[message.type]?.id;
        caption = message[message.type]?.caption || '';
        body = caption;
        // Media URL will be fetched separately if needed
        break;
      case 'location':
        body = `Location: ${message.location?.latitude}, ${message.location?.longitude}`;
        break;
      case 'contacts':
        body = 'Contact shared';
        break;
      default:
        body = JSON.stringify(message);
    }

    // Save incoming message
    const whatsAppMessage = new WhatsAppMessage({
      messageId: messageId,
      from: phoneNumber,
      to: WHATSAPP_PHONE_NUMBER_ID,
      contactName: contact?.profile?.name,
      type: message.type,
      body: body,
      mediaId: mediaId,
      caption: caption,
      direction: 'inbound',
      status: 'delivered',
      timestamp: new Date(parseInt(message.timestamp) * 1000),
      contactId: contactRecord?._id,
      metadata: {
        wabaId: WHATSAPP_BUSINESS_ACCOUNT_ID,
        rawMessage: message
      }
    });

    await whatsAppMessage.save();

    return {
      processed: true,
      message: whatsAppMessage,
      contact: contactRecord
    };

  } catch (error) {
    console.error('Error processing incoming message:', error);
    throw error;
  }
};

/**
 * Process status update webhook
 */
const processStatusUpdate = async (webhookData) => {
  try {
    const entry = webhookData.entry?.[0];
    const changes = entry?.changes?.[0];
    const statuses = changes?.value?.statuses;

    if (!statuses || statuses.length === 0) {
      return { processed: false, reason: 'No statuses in webhook' };
    }

    const statusUpdate = statuses[0];
    const messageId = statusUpdate.id;
    const status = statusUpdate.status; // sent, delivered, read, failed

    // Find message in database
    const whatsAppMessage = await WhatsAppMessage.findOne({ messageId });
    if (!whatsAppMessage) {
      return { processed: false, reason: 'Message not found' };
    }

    // Update status
    await whatsAppMessage.updateStatus(
      status,
      statusUpdate.errors?.[0]?.code,
      statusUpdate.errors?.[0]?.title
    );

    return {
      processed: true,
      message: whatsAppMessage
    };

  } catch (error) {
    console.error('Error processing status update:', error);
    throw error;
  }
};

/**
 * Mark message as read
 */
const markMessageAsRead = async (messageId) => {
  try {
    if (!WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_ACCESS_TOKEN) {
      throw new Error('WhatsApp API credentials not configured');
    }

    const message = await WhatsAppMessage.findOne({ messageId });
    if (!message) {
      throw new Error('Message not found');
    }

    const url = `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;
    const payload = {
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId
    };

    await axios.post(url, payload, {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    await message.markAsRead();

    return { success: true, message };

  } catch (error) {
    console.error('Error marking message as read:', error.response?.data || error.message);
    throw error;
  }
};

module.exports = {
  verifyWebhookToken,
  verifyWebhookSignature,
  sendTextMessage,
  sendTemplateMessage,
  sendMediaMessage,
  processIncomingMessage,
  processStatusUpdate,
  markMessageAsRead,
  formatPhoneNumber
};

