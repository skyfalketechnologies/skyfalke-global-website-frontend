# Create .env File

Create a new file named `.env` in the `client` directory with the following content:

```env
# Production Environment Configuration
# Google Analytics 4 (GA4) Measurement ID
REACT_APP_GA4_MEASUREMENT_ID=G-17FP61REQX

# Meta (Facebook) Pixel ID (optional)
REACT_APP_META_PIXEL_ID=your_meta_pixel_id_here

# API Configuration
REACT_APP_API_URL=https://apis.mwangikinyanjuiadvocates.com
REACT_APP_SITE_URL=https://skyfalke.com

# PWA Configuration (optional)
REACT_APP_VAPID_PUBLIC_KEY=your_vapid_public_key_here

# Environment
NODE_ENV=production
```

## Steps:
1. Create a new file named `.env` in the `client` directory
2. Copy and paste the content above into the file
3. Save the file
4. Restart your development server

## What this does:
- Sets up GA4 with your measurement ID
- Configures API calls to use your production backend
- Sets up the site URL for production
- Enables production mode

After creating this file, all API requests will automatically point to `https://apis.mwangikinyanjuiadvocates.com` and GA4 will be properly configured.
