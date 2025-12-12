# Environment Variables Setup Guide

This guide explains how to configure environment variables for the Skyfalke application.

## Environment Files

The application uses different environment files for different environments:

- `.env.local` - Local development (ignored by git)
- `.env.production` - Production environment
- `.env` - Default environment (ignored by git)

## Required Environment Variables

### API Configuration
```env
# Backend API Base URL
REACT_APP_API_BASE_URL=http://localhost:5000
```

### Site Configuration
```env
# Frontend Site URL
REACT_APP_SITE_URL=http://localhost:3000
```

### Analytics Configuration (Optional)
```env
# Google Analytics 4 Measurement ID
REACT_APP_GA4_MEASUREMENT_ID=G-XXXXXXXXXX

# Meta (Facebook) Pixel ID
REACT_APP_META_PIXEL_ID=XXXXXXXXXX
```

## Environment-Specific Configurations

### Development Environment (.env.local)
```env
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:5000

# Site Configuration
REACT_APP_SITE_URL=http://localhost:3000

# Analytics (optional for development)
REACT_APP_GA4_MEASUREMENT_ID=
REACT_APP_META_PIXEL_ID=

# Environment
NODE_ENV=development
```

### Production Environment (.env.production)
```env
# API Configuration
REACT_APP_API_BASE_URL=https://apis.mwangikinyanjuiadvocates.com

# Site Configuration
REACT_APP_SITE_URL=https://skyfalke.com

# Analytics Configuration
REACT_APP_GA4_MEASUREMENT_ID=G-17FP61REQX
REACT_APP_META_PIXEL_ID=your_meta_pixel_id_here

# Environment
NODE_ENV=production
```

## How to Set Up

1. **For Local Development:**
   - Create `.env.local` file in the `client` directory
   - Copy the development configuration above
   - Update the API URL if your backend runs on a different port

2. **For Production:**
   - Create `.env.production` file in the `client` directory
   - Copy the production configuration above
   - Update the API URL to your production backend URL
   - Update analytics IDs with your actual values

## Important Notes

- Environment variables must be prefixed with `REACT_APP_` to be accessible in the React application
- The application will fall back to default values if environment variables are not set
- Never commit `.env` or `.env.local` files to version control
- Always restart the development server after changing environment variables

## API Usage

The application uses the `REACT_APP_API_BASE_URL` environment variable in the following ways:

1. **Axios Configuration** (`src/utils/api.js`):
   - All API calls use this base URL
   - WebSocket connections use this URL
   - Health checks use this URL

2. **Components and Pages**:
   - All API calls are made through the centralized `api.js` utility
   - No hardcoded URLs should exist in components

## Troubleshooting

If API calls are not working:

1. Check that `REACT_APP_API_BASE_URL` is set correctly
2. Verify the backend server is running on the specified URL
3. Check browser console for any CORS errors
4. Ensure the environment file is in the correct location (`client/.env.local` or `client/.env.production`)

## Migration from Old Configuration

If you were previously using `REACT_APP_API_URL`, update your environment files to use `REACT_APP_API_BASE_URL` instead. The old variable is no longer supported.
