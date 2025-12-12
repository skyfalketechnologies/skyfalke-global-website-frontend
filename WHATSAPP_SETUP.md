# WhatsApp Business API Integration Setup Guide

This guide will help you set up WhatsApp Business API integration for Skyfalke customer communications.

## Prerequisites

1. A Facebook Business Account
2. A Meta Business App
3. A WhatsApp Business Account
4. Access to Meta Business Manager

## Step 1: Create a Meta Business App

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Select "Business" as the app type
4. Fill in your app details and create the app

## Step 2: Add WhatsApp Product

1. In your app dashboard, go to "Add Products"
2. Find "WhatsApp" and click "Set Up"
3. Follow the setup wizard

## Step 3: Get Your Credentials

### Phone Number ID
1. Go to WhatsApp → API Setup
2. Find your Phone Number ID (it's a long number)
3. Copy it

### Access Token
1. In WhatsApp → API Setup
2. Find "Temporary access token" (for testing) or create a System User Token (for production)
3. Copy the access token

### Business Account ID
1. Go to WhatsApp → API Setup
2. Find your WhatsApp Business Account ID
3. Copy it

## Step 4: Configure Webhook

### Webhook URL
Your webhook URL will be: `https://your-domain.com/api/whatsapp/webhook`

### Verify Token
Set a secure verify token (e.g., `skyfalke_whatsapp_verify_token`)

### Webhook Secret (Optional but Recommended)
1. In your app settings, go to "Webhooks"
2. Generate a webhook secret
3. Save it securely

## Step 5: Environment Variables

Add these to your `.env` file:

```env
# WhatsApp Business API Configuration
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id
WHATSAPP_VERIFY_TOKEN=skyfalke_whatsapp_verify_token
WHATSAPP_WEBHOOK_SECRET=your_webhook_secret
```

## Step 6: Subscribe to Webhook Fields

In your Meta app dashboard:
1. Go to WhatsApp → Configuration → Webhooks
2. Click "Edit" on your webhook
3. Subscribe to these fields:
   - `messages` - To receive incoming messages
   - `message_status` - To receive delivery/read status updates

## Step 7: Test the Integration

### Test Webhook Verification
Visit: `https://your-domain.com/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=skyfalke_whatsapp_verify_token&hub.challenge=test`

You should receive the challenge string back.

### Send a Test Message
Use the API endpoint:
```bash
POST /api/whatsapp/admin/send/text
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "to": "+254712345678",
  "message": "Hello from Skyfalke!"
}
```

## Step 8: Phone Number Format

The system automatically formats phone numbers to E.164 format:
- Input: `0712345678` → Output: `+254712345678`
- Input: `254712345678` → Output: `+254712345678`
- Input: `+254712345678` → Output: `+254712345678`

## API Endpoints

### Admin Endpoints (Require Authentication)

#### Send Text Message
```
POST /api/whatsapp/admin/send/text
Body: { to, message, contactId?, previewUrl? }
```

#### Send Template Message
```
POST /api/whatsapp/admin/send/template
Body: { to, templateName, templateParams[], contactId?, language? }
```

#### Send Media Message
```
POST /api/whatsapp/admin/send/media
Body: { to, mediaType, mediaUrl, caption?, contactId? }
```

#### Get Messages
```
GET /api/whatsapp/admin/messages?page=1&limit=50&direction=inbound&status=sent
```

#### Get Conversation
```
GET /api/whatsapp/admin/conversation/:phone?limit=100
```

#### Get Recent Conversations
```
GET /api/whatsapp/admin/conversations?limit=20
```

#### Get Statistics
```
GET /api/whatsapp/admin/stats?startDate=2024-01-01&endDate=2024-12-31
```

### Webhook Endpoints (Public)

#### Webhook Verification (GET)
```
GET /api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=xxx&hub.challenge=xxx
```

#### Webhook Handler (POST)
```
POST /api/whatsapp/webhook
```

## Features

### Incoming Messages
- Automatically receives and stores incoming WhatsApp messages
- Creates or links to Contact records
- Sends notifications to admins for new messages
- Supports text, images, videos, documents, and more

### Outgoing Messages
- Send text messages
- Send template messages (for marketing/notifications)
- Send media messages (images, documents, etc.)
- Track delivery and read status

### Conversation Management
- View all conversations
- See message history per contact
- Mark messages as read
- Add notes to messages
- Link messages to contacts

### Integration with Contact System
- Automatically creates contacts from WhatsApp messages
- Links WhatsApp messages to existing contacts
- Can send messages directly from contact records
- Tracks response method as "whatsapp"

## Template Messages

To send template messages, you must first create templates in your Meta Business Manager:
1. Go to WhatsApp → Message Templates
2. Create a new template
3. Get approval from Meta
4. Use the template name in API calls

## Rate Limits

WhatsApp Business API has rate limits:
- Tier 1: 1,000 conversations per 24 hours
- Tier 2: 10,000 conversations per 24 hours
- Tier 3: 100,000 conversations per 24 hours

Check your tier in Meta Business Manager.

## Security

- Webhook signature verification (if webhook secret is configured)
- Admin authentication required for all admin endpoints
- Rate limiting on webhook endpoints
- Secure token storage in environment variables

## Troubleshooting

### Messages Not Sending
1. Check your access token is valid
2. Verify phone number ID is correct
3. Check rate limits
4. Ensure phone number is in E.164 format

### Webhook Not Receiving Messages
1. Verify webhook URL is accessible
2. Check webhook is subscribed to correct fields
3. Verify webhook secret matches
4. Check server logs for errors

### Template Messages Failing
1. Ensure template is approved
2. Check template name matches exactly
3. Verify template parameters count matches
4. Check template language code

## Support

For issues with:
- **WhatsApp API**: Check [Meta's Documentation](https://developers.facebook.com/docs/whatsapp)
- **Integration Issues**: Check server logs and error messages
- **Setup Help**: Refer to Meta's setup guides

## Production Checklist

- [ ] Use System User Token (not temporary token)
- [ ] Set up webhook secret
- [ ] Test webhook verification
- [ ] Test sending and receiving messages
- [ ] Set up monitoring/alerts
- [ ] Configure rate limit handling
- [ ] Set up error logging
- [ ] Test template message approval process

