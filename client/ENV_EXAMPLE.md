# Environment Variables Setup

## Analytics Configuration

Create a `.env` file in the `client` directory with the following variables:

```env
# Google Analytics 4 (GA4) Measurement ID
# Get this from Google Analytics: Admin > Data Streams > Web Stream > Measurement ID
REACT_APP_GA4_MEASUREMENT_ID=G-XXXXXXXXXX

# Meta (Facebook) Pixel ID
# Get this from Facebook Business Manager: Events Manager > Data Sources > Pixels
REACT_APP_META_PIXEL_ID=XXXXXXXXXX

# API Configuration
REACT_APP_API_BASE_URL=https://apis.mwangikinyanjuiadvocates.com

# Site Configuration
REACT_APP_SITE_URL=https://skyfalke.com
```

## How to Get Your Analytics IDs

### Google Analytics 4 (GA4)
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property or select existing one
3. Go to Admin > Data Streams
4. Click on your web stream
5. Copy the Measurement ID (starts with G-)

### Meta (Facebook) Pixel
1. Go to [Facebook Business Manager](https://business.facebook.com/)
2. Navigate to Events Manager > Data Sources
3. Create a new pixel or select existing one
4. Copy the Pixel ID (numeric value)

## Production Setup
For production, update the environment variables with your actual IDs:

```env
REACT_APP_GA4_MEASUREMENT_ID=G-1234567890
REACT_APP_META_PIXEL_ID=123456789012345
```
