const nodemailer = require('nodemailer');
const EmailCampaign = require('../models/EmailCampaign');
const EmailCampaignRecipient = require('../models/EmailCampaignRecipient');
const crypto = require('crypto');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_PORT == 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Generate email HTML with tracking
const generateEmailHTML = (campaign, recipient, baseUrl) => {
  const trackingToken = recipient.trackingToken;
  const unsubscribeToken = recipient.unsubscribeToken;
  
  let html = campaign.content;
  
  // Prepare tracking pixel if enabled (will be added at end of body)
  let trackingPixel = '';
  if (campaign.settings && campaign.settings.trackOpens && trackingToken) {
    trackingPixel = `<img src="${baseUrl}/api/campaigns/${campaign._id}/track/open/${trackingToken}" width="1" height="1" style="display:block;width:1px;height:1px;border:0;margin:0;padding:0;" alt="" />`;
    console.log(`Tracking pixel added for campaign ${campaign._id}, recipient ${recipient.email}`);
  } else {
    console.log(`Tracking pixel NOT added - trackOpens: ${campaign.settings?.trackOpens}, trackingToken: ${!!trackingToken}`);
  }
  
  // Replace links with tracking links if enabled
  if (campaign.settings.trackClicks && trackingToken) {
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href=["']([^"']+)["']/gi;
    html = html.replace(linkRegex, (match, url) => {
      // Don't track unsubscribe links or external tracking pixels
      if (url.includes('/unsubscribe') || url.includes('/track/')) {
        return match;
      }
      const trackedUrl = `${baseUrl}/api/campaigns/${campaign._id}/track/click/${trackingToken}?url=${encodeURIComponent(url)}`;
      return match.replace(url, trackedUrl);
    });
  }
  
  // Store unsubscribe link for use in template footer
  const unsubscribeLink = `${baseUrl}/api/campaigns/unsubscribe/${unsubscribeToken}`;
  
  // Get logo URL - use absolute URL for email clients
  // Using PNG for better email client compatibility (SVG not supported in most email clients)
  const logoUrl = `https://skyfalke.com/images/logos/logo.png`;
  
  // Wrap in email template
  const emailTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="x-apple-disable-message-reformatting">
      <title>${campaign.subject}</title>
      <style type="text/css">
        /* Reset styles */
        body, table, td, p, a, li, blockquote {
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        table, td {
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
        }
        img {
          -ms-interpolation-mode: bicubic;
          border: 0;
          outline: none;
          text-decoration: none;
          display: block;
        }
        
        /* Typography */
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background-color: #f5f7fa;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Link styles */
        a {
          color: #303661;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        a:hover {
          color: #e0ae00;
          text-decoration: underline;
        }
        
        /* Content link styles */
        .content a {
          color: #303661;
          text-decoration: underline;
        }
        .content a:hover {
          color: #e0ae00;
        }
        .content a.button {
          background-color: #303661;
          color: #ffffff !important;
          padding: 14px 28px;
          border-radius: 6px;
          text-decoration: none;
          display: inline-block;
          font-weight: 600;
          font-size: 16px;
          line-height: 1.5;
          transition: background-color 0.2s ease;
        }
        .content a.button:hover {
          background-color: #24284b;
          color: #ffffff !important;
          text-decoration: none;
        }
        
        /* Responsive */
        @media only screen and (max-width: 600px) {
          .email-container {
            width: 100% !important;
            max-width: 100% !important;
          }
          .email-padding {
            padding: 30px 20px !important;
          }
          .logo-width {
            width: 150px !important;
            max-width: 150px !important;
          }
        }
      </style>
      <!--[if mso]>
      <style type="text/css">
        body, table, td {
          font-family: Arial, sans-serif !important;
        }
        a.button {
          background-color: #303661 !important;
          color: #ffffff !important;
        }
      </style>
      <![endif]-->
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f7fa;">
      <!-- Preheader Text -->
      <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
        ${campaign.subject}
      </div>
      
      <!-- Main Wrapper -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 40px 0;">
        <tr>
          <td align="center" style="padding: 0;">
            <!-- Email Container -->
            <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); max-width: 600px; width: 100%; margin: 0 auto;">
              
              <!-- Header with Logo -->
              <tr>
                <td style="background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%); padding: 40px 40px 30px 40px; text-align: center; border-bottom: 2px solid #e0ae00;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <img src="${logoUrl}" alt="Skyfalke Limited" class="logo-width" width="180" style="display:block;max-width:180px;height:auto;margin:0 auto;border:0;" />
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Content Area -->
              <tr>
                <td class="email-padding" style="padding: 50px 40px; background-color: #ffffff;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td class="content" style="color: #2d3748; font-size: 16px; line-height: 1.75; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                        ${html}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%); padding: 0;">
                  <!-- Company Info Section -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td class="email-padding" style="padding: 35px 40px 25px 40px; text-align: center;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding-bottom: 20px;">
                              <p style="margin: 0 0 8px 0; color: #303661; font-size: 18px; font-weight: 700; line-height: 1.4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                                Skyfalke Limited
                              </p>
                              <p style="margin: 0; color: #6c757d; font-size: 14px; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                                Empowering businesses with innovative solutions
                        </p>
                      </td>
                    </tr>
                    <tr>
                            <td align="center" style="padding-top: 20px; padding-bottom: 20px;">
                        <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                          <tr>
                                  <td style="padding: 0 12px;">
                                    <a href="https://skyfalke.com/?utm_source=newsletter&utm_medium=email&utm_campaign=email_campaign" style="color: #303661; text-decoration: none; font-size: 14px; font-weight: 500; padding: 8px 0; display: inline-block; border-bottom: 2px solid transparent; transition: border-color 0.2s ease;">Website</a>
                                  </td>
                                  <td style="padding: 0 8px; color: #dee2e6; font-size: 14px;">•</td>
                                  <td style="padding: 0 12px;">
                                    <a href="https://skyfalke.com/contact?utm_source=newsletter&utm_medium=email&utm_campaign=email_campaign" style="color: #303661; text-decoration: none; font-size: 14px; font-weight: 500; padding: 8px 0; display: inline-block; border-bottom: 2px solid transparent; transition: border-color 0.2s ease;">Contact Us</a>
                            </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Divider -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding: 0 40px;">
                        <div style="height: 1px; background: linear-gradient(90deg, transparent 0%, #e9ecef 20%, #e9ecef 80%, transparent 100%); width: 100%;"></div>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Legal & Unsubscribe Section -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td class="email-padding" style="padding: 25px 40px 30px 40px; text-align: center;">
                        <p style="margin: 0 0 12px 0; color: #868e96; font-size: 12px; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                          You received this email because you are subscribed to Skyfalke Limited communications.
                        </p>
                        <p style="margin: 0 0 20px 0;">
                          <a href="${unsubscribeLink}" style="color: #e0ae00; text-decoration: underline; font-size: 12px; font-weight: 500;">Unsubscribe from this list</a>
                        </p>
                        <p style="margin: 0; color: #adb5bd; font-size: 11px; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                          © ${new Date().getFullYear()} Skyfalke Limited. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
      ${trackingPixel}
    </body>
    </html>
  `;
  
  return emailTemplate;
};

// Send campaign to recipients
const sendCampaign = async (campaignId, batchSize = 10) => {
  const campaign = await EmailCampaign.findById(campaignId);
  if (!campaign) {
    throw new Error('Campaign not found');
  }
  
  if (campaign.status === 'sent') {
    throw new Error('Campaign has already been sent');
  }
  
  // Update campaign status
  campaign.status = 'sending';
  await campaign.save();
  
  try {
    // Get recipient list
    const recipients = await campaign.getRecipientList();
    campaign.stats.totalRecipients = recipients.length;
    await campaign.save();
    
    // Create transporter
    const transporter = createTransporter();
    const baseUrl = process.env.CLIENT_URL || process.env.BASE_URL || 'https://skyfalke.com';
    
    // Process recipients in batches
    let sentCount = 0;
    let deliveredCount = 0;
    let failedCount = 0;
    
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      
      await Promise.allSettled(
        batch.map(async (recipientData) => {
          try {
            // Check if recipient already exists
            let recipient = await EmailCampaignRecipient.findOne({
              campaign: campaignId,
              email: recipientData.email
            });
            
            if (!recipient) {
              recipient = new EmailCampaignRecipient({
                campaign: campaignId,
                email: recipientData.email,
                name: recipientData.name
              });
              recipient.generateTrackingToken();
              recipient.generateUnsubscribeToken();
              await recipient.save();
            } else {
              // Ensure existing recipient has tracking tokens
              if (!recipient.trackingToken) {
                recipient.generateTrackingToken();
              }
              if (!recipient.unsubscribeToken) {
                recipient.generateUnsubscribeToken();
              }
              if (recipient.trackingToken || recipient.unsubscribeToken) {
                await recipient.save();
              }
            }
            
            // Skip if already sent
            if (recipient.status === 'sent' || recipient.status === 'delivered') {
              return;
            }
            
            // Generate email HTML
            const html = generateEmailHTML(campaign, recipient, baseUrl);
            
            // Always use EMAIL_USER as from address - SMTP servers require the from address 
            // to match the authenticated account to prevent spoofing
            const fromEmail = process.env.EMAIL_USER;
            const fromName = campaign.settings.fromName || 'Skyfalke Limited';
            const replyTo = campaign.settings.replyTo || process.env.EMAIL_USER;
            
            // Send email
            const mailOptions = {
              from: `"${fromName}" <${fromEmail}>`,
              to: recipientData.email,
              replyTo: replyTo,
              subject: campaign.subject,
              html: html
            };
            
            await transporter.sendMail(mailOptions);
            
            // Update recipient status
            recipient.status = 'sent';
            recipient.sentAt = new Date();
            await recipient.save();
            
            sentCount++;
            deliveredCount++; // Assume delivered if sent successfully
            
          } catch (error) {
            console.error(`Error sending to ${recipientData.email}:`, error);
            
            // Update recipient status
            const recipient = await EmailCampaignRecipient.findOne({
              campaign: campaignId,
              email: recipientData.email
            });
            
            if (recipient) {
              recipient.status = 'failed';
              recipient.failureReason = error.message;
              await recipient.save();
            }
            
            failedCount++;
          }
        })
      );
      
      // Update campaign stats
      campaign.stats.sent = sentCount;
      campaign.stats.delivered = deliveredCount;
      campaign.stats.failed = failedCount;
      await campaign.save();
      
      // Small delay between batches to avoid rate limiting
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Mark campaign as sent
    campaign.status = 'sent';
    campaign.sentAt = new Date();
    await campaign.save();
    
    return {
      success: true,
      total: recipients.length,
      sent: sentCount,
      delivered: deliveredCount,
      failed: failedCount
    };
    
  } catch (error) {
    console.error('Error sending campaign:', error);
    campaign.status = 'draft';
    await campaign.save();
    throw error;
  }
};

// Schedule campaign
const scheduleCampaign = async (campaignId, scheduledAt) => {
  const campaign = await EmailCampaign.findById(campaignId);
  if (!campaign) {
    throw new Error('Campaign not found');
  }
  
  campaign.status = 'scheduled';
  campaign.scheduledAt = scheduledAt;
  await campaign.save();
  
  return campaign;
};

// Track email open
const trackOpen = async (campaignId, trackingToken) => {
  try {
    console.log(`Track open called: campaignId=${campaignId}, token=${trackingToken?.substring(0, 8)}...`);
    
  const recipient = await EmailCampaignRecipient.findOne({
    campaign: campaignId,
    trackingToken: trackingToken
  });
  
  if (!recipient) {
      console.log(`Track open: Recipient not found for campaign ${campaignId}, token ${trackingToken?.substring(0, 8)}...`);
    return null;
  }
  
    console.log(`Track open: Found recipient ${recipient.email}, current status: ${recipient.status}`);
    
    // Only track first open (skip if already opened or clicked)
  if (recipient.status === 'opened' || recipient.status === 'clicked') {
      console.log(`Track open: Recipient already ${recipient.status}, skipping`);
    return recipient;
  }
  
    // Mark as opened (this method handles status update)
  await recipient.markAsOpened();
  
    // Reload recipient from database to ensure we have the latest data
    const updatedRecipient = await EmailCampaignRecipient.findById(recipient._id);
    console.log(`Track open: Marked recipient ${updatedRecipient.email} as opened. New status: ${updatedRecipient.status}, openedAt: ${updatedRecipient.openedAt}`);
    
    // Update campaign stats - use atomic increment to avoid race conditions
    const campaign = await EmailCampaign.findById(campaignId);
    if (campaign) {
      // Use atomic increment to prevent race conditions
      await EmailCampaign.updateOne(
        { _id: campaignId },
        { $inc: { 'stats.opened': 1 } }
      );
      
      // Reload to get updated stats
      const updatedCampaign = await EmailCampaign.findById(campaignId);
      console.log(`Track open: Updated campaign ${campaignId} stats. Total opens: ${updatedCampaign.stats.opened}`);
    } else {
      console.log(`Track open: Campaign ${campaignId} not found`);
    }
    
    return updatedRecipient;
  } catch (error) {
    console.error('Error in trackOpen:', error);
    throw error;
  }
};

// Track email click
const trackClick = async (campaignId, trackingToken, url, ipAddress, userAgent) => {
  const recipient = await EmailCampaignRecipient.findOne({
    campaign: campaignId,
    trackingToken: trackingToken
  });
  
  if (!recipient) {
    return null;
  }
  
  const isFirstClick = recipient.status !== 'clicked';
  await recipient.markAsClicked(url, ipAddress, userAgent);
  
  // Update campaign stats (only count first click)
  if (isFirstClick) {
    const campaign = await EmailCampaign.findById(campaignId);
    if (campaign) {
      campaign.stats.clicked = (campaign.stats.clicked || 0) + 1;
      await campaign.save();
    }
  }
  
  return recipient;
};

// Handle unsubscribe
const handleUnsubscribe = async (unsubscribeToken) => {
  const recipient = await EmailCampaignRecipient.findOne({
    unsubscribeToken: unsubscribeToken
  });
  
  if (!recipient) {
    return null;
  }
  
  await recipient.markAsUnsubscribed();
  
  // Update campaign stats
  const campaign = await EmailCampaign.findById(recipient.campaign);
  if (campaign) {
    campaign.stats.unsubscribed = (campaign.stats.unsubscribed || 0) + 1;
    await campaign.save();
  }
  
  return recipient;
};

module.exports = {
  sendCampaign,
  scheduleCampaign,
  trackOpen,
  trackClick,
  handleUnsubscribe,
  generateEmailHTML
};

