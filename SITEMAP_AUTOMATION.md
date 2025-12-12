# Automatic Sitemap Generation Guide

## Overview

The sitemap system has been upgraded to automatically generate and update sitemaps, save them to files, and ping search engines when updates occur.

## Features

✅ **Automatic Generation**: Sitemap is generated daily at 2 AM  
✅ **File Updates**: Automatically saves to `server/public/sitemap.xml`  
✅ **Search Engine Pinging**: Automatically notifies Google, Bing, and Yandex  
✅ **On-Demand Generation**: Manual generation via API endpoint  
✅ **Initial Generation**: Creates sitemap on server start if it doesn't exist  

## How It Works

### 1. Automatic Daily Generation

The sitemap is automatically generated every day at 2 AM (Africa/Nairobi timezone) via a scheduled cron job. This:
- Fetches all dynamic content (blogs, jobs, products, case studies, courses, events, trainers)
- Generates the XML sitemap
- Saves it to `server/public/sitemap.xml`
- Updates `robots.txt`
- Pings search engines (Google, Bing, Yandex)

### 2. Manual Generation

You can manually trigger sitemap generation via the admin API:

```bash
POST /api/sitemap/generate-sitemap
Authorization: Bearer <admin_token>
```

Response:
```json
{
  "success": true,
  "message": "Sitemap generated and updated successfully",
  "data": {
    "totalUrls": 150,
    "staticRoutes": 50,
    "blogs": 30,
    "jobs": 10,
    "products": 20,
    "caseStudies": 15,
    "courses": 10,
    "events": 5,
    "trainers": 10
  },
  "pingResults": [
    {
      "url": "https://www.google.com/ping?sitemap=...",
      "success": true,
      "error": null
    },
    {
      "url": "https://www.bing.com/ping?sitemap=...",
      "success": true,
      "error": null
    }
  ]
}
```

### 3. Command Line Script

You can also run the generation script manually:

```bash
cd server
npm run generate-sitemap
```

This will:
- Connect to MongoDB
- Generate the sitemap
- Save it to file
- Update robots.txt
- Ping search engines
- Exit

## Search Engines Pinging

The system automatically pings the following search engines when the sitemap is updated:

1. **Google**: `https://www.google.com/ping?sitemap=...`
2. **Bing**: `https://www.bing.com/ping?sitemap=...`
3. **Yandex**: `https://www.yandex.com/ping?sitemap=...`

Each ping includes the full sitemap URL and is logged for monitoring.

## File Locations

- **Sitemap**: `server/public/sitemap.xml`
- **Robots.txt**: `server/public/robots.txt`
- **Service**: `server/services/sitemapService.js`
- **Route**: `server/routes/sitemap.js`
- **Script**: `server/scripts/generateSitemap.js`

## API Endpoints

### Get Sitemap
```
GET /api/sitemap.xml
```
Returns the sitemap XML (reads from file if available, generates on-the-fly if not)

### Get Robots.txt
```
GET /api/robots.txt
```
Returns the robots.txt file

### Generate Sitemap (Admin)
```
POST /api/sitemap/generate-sitemap
Authorization: Bearer <admin_token>
```
Manually triggers sitemap generation with search engine pinging

## Configuration

The base URL is configured via environment variable:
```env
BASE_URL=https://skyfalke.com
```

If not set, it defaults to `https://skyfalke.com`.

## Scheduling

The automatic generation runs daily at 2 AM (Africa/Nairobi timezone). This is configured in:
- `server/services/automationScheduler.js`

To change the schedule, modify the cron expression:
```javascript
// Current: Daily at 2 AM
cron.schedule('0 2 * * *', ...)

// Examples:
// Every 6 hours: '0 */6 * * *'
// Every Monday at 3 AM: '0 3 * * 1'
// Twice daily (2 AM and 2 PM): '0 2,14 * * *'
```

## Monitoring

The system logs all activities:
- ✅ Successful generation
- ✅ File saves
- ✅ Search engine ping results
- ❌ Errors (if any)

Check your server logs to monitor sitemap generation.

## Troubleshooting

### Sitemap not generating automatically
- Ensure `node-cron` is installed: `npm install node-cron`
- Check that the automation scheduler is running (check server startup logs)
- Verify MongoDB connection

### Search engines not being pinged
- Check network connectivity
- Verify the sitemap URL is accessible
- Check server logs for ping errors

### File not being saved
- Ensure `server/public/` directory exists and is writable
- Check file permissions
- Review server logs for errors

## Best Practices

1. **Monitor Regularly**: Check sitemap generation logs weekly
2. **Verify Pings**: Confirm search engines are receiving updates
3. **Test Manually**: Use the manual generation endpoint to test
4. **Keep Updated**: Ensure all content types are included in the sitemap
5. **Check File Size**: Large sitemaps (>50,000 URLs) may need to be split

## Next Steps

The system is now fully automated! The sitemap will:
- Generate automatically every day
- Update the file automatically
- Notify search engines automatically
- Work seamlessly with your existing content

No manual intervention required! 🎉

