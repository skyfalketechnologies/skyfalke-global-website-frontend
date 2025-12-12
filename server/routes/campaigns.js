const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const EmailCampaign = require('../models/EmailCampaign');
const EmailCampaignRecipient = require('../models/EmailCampaignRecipient');
const {
  sendCampaign,
  scheduleCampaign,
  trackOpen,
  trackClick,
  handleUnsubscribe
} = require('../services/emailCampaignService');

// Get all campaigns
router.get('/', adminAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const campaigns = await EmailCampaign.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await EmailCampaign.countDocuments(query);
    
    res.json({
      success: true,
      campaigns,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get campaign statistics
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const stats = await EmailCampaign.getStats();
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get campaign stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get single campaign
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const campaign = await EmailCampaign.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    // Get recipient statistics
    const recipientStats = await EmailCampaignRecipient.aggregate([
      { $match: { campaign: campaign._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      success: true,
      campaign: {
        ...campaign.toObject(),
        recipientStats
      }
    });
  } catch (error) {
    console.error('Get campaign error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Create campaign
router.post('/', adminAuth, async (req, res) => {
  try {
    const {
      name,
      subject,
      content,
      recipientType,
      recipients,
      scheduledAt,
      settings,
      template,
      tags,
      notes
    } = req.body;
    
    const campaign = new EmailCampaign({
      name,
      subject,
      content,
      recipientType,
      recipients: recipients || {},
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      settings: settings || {},
      template: template || 'newsletter',
      tags: tags || [],
      notes,
      createdBy: req.user.id
    });
    
    await campaign.save();
    
    res.status(201).json({
      success: true,
      campaign
    });
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// Update campaign
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const campaign = await EmailCampaign.findById(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    // Don't allow editing sent campaigns
    if (campaign.status === 'sent') {
      return res.status(400).json({
        success: false,
        message: 'Cannot edit a sent campaign'
      });
    }
    
    const {
      name,
      subject,
      content,
      recipientType,
      recipients,
      scheduledAt,
      settings,
      template,
      tags,
      notes
    } = req.body;
    
    if (name) campaign.name = name;
    if (subject) campaign.subject = subject;
    if (content) campaign.content = content;
    if (recipientType) campaign.recipientType = recipientType;
    if (recipients) campaign.recipients = recipients;
    if (scheduledAt !== undefined) campaign.scheduledAt = scheduledAt ? new Date(scheduledAt) : null;
    if (settings) campaign.settings = { ...campaign.settings, ...settings };
    if (template) campaign.template = template;
    if (tags) campaign.tags = tags;
    if (notes !== undefined) campaign.notes = notes;
    
    await campaign.save();
    
    res.json({
      success: true,
      campaign
    });
  } catch (error) {
    console.error('Update campaign error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// Delete campaign
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const campaign = await EmailCampaign.findById(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    // Don't allow deleting sent campaigns
    if (campaign.status === 'sent') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete a sent campaign'
      });
    }
    
    // Delete associated recipients
    await EmailCampaignRecipient.deleteMany({ campaign: campaign._id });
    
    await campaign.deleteOne();
    
    res.json({
      success: true,
      message: 'Campaign deleted successfully'
    });
  } catch (error) {
    console.error('Delete campaign error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Send campaign
router.post('/:id/send', adminAuth, async (req, res) => {
  try {
    const campaign = await EmailCampaign.findById(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    if (campaign.status === 'sent') {
      return res.status(400).json({
        success: false,
        message: 'Campaign has already been sent'
      });
    }
    
    // Send campaign asynchronously
    sendCampaign(campaign._id)
      .then(result => {
        console.log('Campaign sent successfully:', result);
      })
      .catch(error => {
        console.error('Error sending campaign:', error);
      });
    
    res.json({
      success: true,
      message: 'Campaign is being sent'
    });
  } catch (error) {
    console.error('Send campaign error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// Schedule campaign
router.post('/:id/schedule', adminAuth, async (req, res) => {
  try {
    const { scheduledAt } = req.body;
    
    if (!scheduledAt) {
      return res.status(400).json({
        success: false,
        message: 'Scheduled date is required'
      });
    }
    
    const campaign = await scheduleCampaign(req.params.id, new Date(scheduledAt));
    
    res.json({
      success: true,
      campaign
    });
  } catch (error) {
    console.error('Schedule campaign error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// Get campaign recipients
router.get('/:id/recipients', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 50, status } = req.query;
    const query = { campaign: req.params.id };
    
    if (status) {
      query.status = status;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const recipients = await EmailCampaignRecipient.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await EmailCampaignRecipient.countDocuments(query);
    
    res.json({
      success: true,
      recipients,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get recipients error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get recipient list preview (before sending)
router.post('/preview/recipients', adminAuth, async (req, res) => {
  try {
    const { recipientType, recipients } = req.body;
    
    // Create a temporary campaign object for preview
    const tempCampaign = {
      recipientType,
      recipients: recipients || {},
      getRecipientList: async function() {
        const Subscription = require('../models/Subscription');
        const Contact = require('../models/Contact');
        const mongoose = require('mongoose');
        
        let recipientList = [];
        
        switch (this.recipientType) {
          case 'all_subscribers':
            recipientList = await Subscription.find({ status: 'active' })
              .select('email name');
            break;
            
          case 'contacts':
            const contactQuery = {};
            if (this.recipients.contactCriteria !== 'all') {
              contactQuery.status = this.recipients.contactCriteria;
            }
            const contacts = await Contact.find(contactQuery)
              .select('email name');
            recipientList = contacts.filter(c => c.email);
            break;
            
          case 'custom':
            recipientList = (this.recipients.customEmails || []).map(email => ({
              email,
              name: ''
            }));
            break;
            
          case 'segmented':
            const segmentQuery = { status: 'active' };
            
            if (this.recipients.segmentCriteria?.tags?.length > 0) {
              segmentQuery.tags = { $in: this.recipients.segmentCriteria.tags };
            }
            
            if (this.recipients.segmentCriteria?.source) {
              segmentQuery.source = this.recipients.segmentCriteria.source;
            }
            
            if (this.recipients.segmentCriteria?.subscribedAfter) {
              segmentQuery.subscribedAt = { $gte: new Date(this.recipients.segmentCriteria.subscribedAfter) };
            }
            
            if (this.recipients.segmentCriteria?.subscribedBefore) {
              segmentQuery.subscribedAt = { 
                ...segmentQuery.subscribedAt,
                $lte: new Date(this.recipients.segmentCriteria.subscribedBefore) 
              };
            }
            
            recipientList = await Subscription.find(segmentQuery)
              .select('email name');
            break;
        }
        
        // Remove duplicates and invalid emails
        const uniqueRecipients = [];
        const seenEmails = new Set();
        
        for (const recipient of recipientList) {
          const email = recipient.email?.toLowerCase().trim();
          if (email && !seenEmails.has(email) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            seenEmails.add(email);
            uniqueRecipients.push({
              email,
              name: recipient.name || ''
            });
          }
        }
        
        return uniqueRecipients;
      }
    };
    
    const recipientList = await tempCampaign.getRecipientList();
    
    res.json({
      success: true,
      count: recipientList.length,
      recipients: recipientList.slice(0, 100) // Preview first 100
    });
  } catch (error) {
    console.error('Get recipient preview error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// Get recipient list preview for existing campaign
router.get('/:id/recipients/preview', adminAuth, async (req, res) => {
  try {
    const campaign = await EmailCampaign.findById(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    const recipients = await campaign.getRecipientList();
    
    res.json({
      success: true,
      count: recipients.length,
      recipients: recipients.slice(0, 100) // Preview first 100
    });
  } catch (error) {
    console.error('Get recipient preview error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// Track email open (public endpoint)
router.get('/:id/track/open/:token', async (req, res) => {
  try {
    console.log(`Track open route hit: id=${req.params.id}, token=${req.params.token?.substring(0, 8)}...`);
    await trackOpen(req.params.id, req.params.token);
    
    // Return 1x1 transparent pixel
    const pixel = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    );
    
    res.writeHead(200, {
      'Content-Type': 'image/gif',
      'Content-Length': pixel.length,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(pixel);
  } catch (error) {
    console.error('Track open error:', error);
    // Still return pixel to avoid breaking email
    const pixel = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    );
    res.writeHead(200, {
      'Content-Type': 'image/gif',
      'Content-Length': pixel.length
    });
    res.end(pixel);
  }
});

// Track email click (public endpoint)
router.get('/:id/track/click/:token', async (req, res) => {
  try {
    const { url } = req.query;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');
    
    await trackClick(req.params.id, req.params.token, url, ipAddress, userAgent);
    
    // Redirect to original URL
    res.redirect(url || '/');
  } catch (error) {
    console.error('Track click error:', error);
    // Still redirect even on error
    const { url } = req.query;
    res.redirect(url || '/');
  }
});

// Unsubscribe (public endpoint)
router.get('/unsubscribe/:token', async (req, res) => {
  try {
    const recipient = await handleUnsubscribe(req.params.token);
    
    if (!recipient) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Unsubscribe</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .container { max-width: 600px; margin: 0 auto; }
            .error { color: #d32f2f; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Unsubscribe Failed</h1>
            <p class="error">Invalid unsubscribe link. Please contact support if you continue to receive emails.</p>
          </div>
        </body>
        </html>
      `);
    }
    
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Unsubscribed</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .success { color: #2e7d32; }
          h1 { color: #2b1a8d; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Successfully Unsubscribed</h1>
          <p class="success">You have been unsubscribed from our email list. You will no longer receive marketing emails from Skyfalke Limited.</p>
          <p>If you change your mind, you can resubscribe through our website.</p>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Unsubscribe Error</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          .container { max-width: 600px; margin: 0 auto; }
          .error { color: #d32f2f; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Unsubscribe Error</h1>
          <p class="error">An error occurred while processing your unsubscribe request. Please contact support.</p>
        </div>
      </body>
      </html>
    `);
  }
});

module.exports = router;

