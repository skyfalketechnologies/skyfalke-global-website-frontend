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
  <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
    <title>${campaign.subject}</title>
    <!--[if mso]>
    <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
    <![endif]-->
    <style type="text/css">
      * { box-sizing: border-box; }
      body, table, td, p, a, li, blockquote {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }
      table, td {
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        border-collapse: collapse !important;
      }
      img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
      body {
        margin: 0 !important; padding: 0 !important;
        background-color: #eef1f5;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      }
  
      /* CONTENT TYPOGRAPHY */
      .content-cell h1, .content-cell h2, .content-cell h3 {
        margin: 0 0 12px 0; color: #1a1f36; font-weight: 700; line-height: 1.3;
      }
      .content-cell h1 { font-size: 26px; }
      .content-cell h2 { font-size: 20px; margin-top: 24px; }
      .content-cell h3 { font-size: 17px; margin-top: 20px; }
      .content-cell p {
        margin: 0 0 18px 0; color: #3c4257; font-size: 15px; line-height: 1.75;
      }
      .content-cell p:last-child { margin-bottom: 0; }
      .content-cell a { color: #303661; text-decoration: underline; }
      .content-cell ul, .content-cell ol {
        margin: 0 0 18px 0; padding-left: 22px;
        color: #3c4257; font-size: 15px; line-height: 1.75;
      }
      .content-cell a.button, .content-cell a.btn {
        display: inline-block;
        background-color: #303661;
        color: #ffffff !important;
        font-size: 15px; font-weight: 600; line-height: 1;
        text-decoration: none !important;
        padding: 15px 34px; border-radius: 5px; letter-spacing: 0.3px;
      }
  
      /* PREHEADER */
      .preheader {
        display: none !important; visibility: hidden; mso-hide: all;
        font-size: 1px; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden;
      }
 
  
      /* RESPONSIVE */
      @media only screen and (max-width: 620px) {
        .outer-wrap  { padding: 20px 0 !important; }
        .card        { border-radius: 0 !important; }
        .header-cell { padding: 24px 20px 20px !important; }
        .hero-cell   { padding: 28px 20px !important; }
        .body-cell   { padding: 32px 20px !important; }
        .trust-cell  { padding: 18px 20px !important; }
        .footer-cell { padding: 28px 20px !important; }
        .logo        { width: 120px !important; }
        .content-cell h1 { font-size: 21px !important; }
        .badge-wrap  { display: none !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background-color:#eef1f5;">
  
    <!-- Preheader text -->
    <div class="preheader">
      ${campaign.subject}&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;
    </div>
  
    <!-- ══════════════════  PAGE WRAPPER  ══════════════════ -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
      style="background-color:#eef1f5;">
      <tr>
        <td class="outer-wrap" align="center" style="padding:48px 16px;">
  
          <!-- ─────────────  EMAIL CARD  ───────────── -->
          <table role="presentation" class="card" width="600" cellpadding="0" cellspacing="0" border="0"
            style="max-width:600px;width:100%;background-color:#ffffff;
                   border-radius:8px;overflow:hidden;
                   box-shadow:0 4px 20px rgba(0,0,0,0.10);">
  
            <!-- TOP ACCENT BAR: brand gradient -->
            <tr>
              <td style="height:5px;background:linear-gradient(90deg,#303661 0%,#4a5296 50%,#e0ae00 100%);
                         font-size:0;line-height:0;">&nbsp;</td>
            </tr>
  
            <!-- ══  HEADER: Logo + Date  ══ -->
            <tr>
              <td class="header-cell"
                style="padding:30px 48px 24px;background-color:#ffffff;
                       border-bottom:1px solid #eef1f5;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td valign="middle">
                      <img src="${logoUrl}" alt="Skyfalke Limited" class="logo"
                        width="148" style="display:block;height:auto;max-width:148px;border:0;" />
                    </td>
                    <td valign="middle" align="right"
                      style="color:#8898aa;font-size:11px;font-weight:600;
                             white-space:nowrap;letter-spacing:0.6px;text-transform:uppercase;
                             font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
                      ${new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
  
            <!-- ══  HERO BAND: dark with subject title  ══ -->
            <tr>
              <td class="hero-cell"
                style="background-color:#1a1f36;padding:36px 48px 32px;">
                <p style="margin:0 0 10px;color:#e0ae00;font-size:10px;font-weight:700;
                          letter-spacing:2px;text-transform:uppercase;
                          font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
                  Skyfalke Limited &nbsp;&#8202;&#8202;&#8202;&bull;&nbsp;&#8202;&#8202;&#8202; Official Communication
                </p>
                <h1 style="margin:0;color:#ffffff;font-size:25px;font-weight:700;
                           line-height:1.35;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
                  ${campaign.subject}
                </h1>
              </td>
            </tr>
  
            <!-- ══  BODY  ══ -->
            <tr>
              <td class="body-cell" style="padding:44px 48px 40px;background-color:#ffffff;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td class="content-cell"
                      style="color:#3c4257;font-size:15px;line-height:1.75;
                             font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
                      ${html}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
  
            <!-- ══  FOOTER  ══ -->
            <tr>
              <td class="footer-cell"
                style="padding:30px 48px 34px;background-color:#f8fafc;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  
                  <!-- Nav links -->
                  <tr>
                    <td align="center" style="padding-bottom:18px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0"
                        style="margin:0 auto;">
                        <tr>
                          <td style="padding:0 14px;">
                            <a href="https://skyfalke.com/?utm_source=newsletter&utm_medium=email&utm_campaign=email_campaign"
                              style="color:#303661;text-decoration:none;font-size:13px;font-weight:600;
                                     font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
                              Website
                            </a>
                          </td>
                          <td style="color:#d1d9e0;font-size:12px;">&bull;</td>
                          <td style="padding:0 14px;">
                            <a href="https://skyfalke.com/contact?utm_source=newsletter&utm_medium=email&utm_campaign=email_campaign"
                              style="color:#303661;text-decoration:none;font-size:13px;font-weight:600;
                                     font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
                              Contact Us
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
  
                  <!-- Divider -->
                  <tr>
                    <td style="padding:0 0 18px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="border-top:1px solid #e8ecf0;font-size:0;line-height:0;">&nbsp;</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
  
                  <!-- Legal -->
                  <tr>
                    <td align="center">
                      <p style="margin:0 0 8px;color:#8898aa;font-size:12px;line-height:1.65;
                                font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
                        To make sure you keep getting these emails, please add strategic@skyfalke.com to your address book or allow list.
                       </p>
                      <p style="margin:0 0 14px;">
                        <a href="${unsubscribeLink}"
                          style="color:#8898aa;font-size:12px;text-decoration:underline;
                                 font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
                          Unsubscribe
                        </a>
                      </p>
                      <p style="margin:0;color:#b0bec5;font-size:11px;line-height:1.5;
                                font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
                        &copy; ${new Date().getFullYear()} Skyfalke Limited &bull; All rights reserved.
                      </p>
                    </td>
                  </tr>
  
                </table>
              </td>
            </tr>
  
            <!-- BOTTOM ACCENT BAR -->
            <tr>
              <td style="height:4px;background-color:#e0ae00;font-size:0;line-height:0;">&nbsp;</td>
            </tr>
  
          </table>
          <!-- /EMAIL CARD -->
  
        </td>
      </tr>
    </table>
    <!-- /PAGE WRAPPER -->
  
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

