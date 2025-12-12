# 🚀 Production Deployment Guide

## Quick Fix for Admin Panel 404 Error

The admin panel was returning 404 because the server wasn't configured to serve the React build files and handle client-side routing. This has been fixed!

## ✅ Deployment Steps

### 1. Build for Production
```bash
npm run build
```

### 2. Start Production Server
```bash
npm run start:prod
```

### 3. Access Admin Panel
- Go to: `https://skyfalke.com/admin/login`
- Login with:
  - Email: `admin@skyfalke.com`
  - Password: `admin123`

## 🔧 What Was Fixed

### Server Configuration (`server/index.js`)
- ✅ Added static file serving for React build
- ✅ Added client-side routing support
- ✅ Proper 404 handling for production vs development

### Production Scripts
- ✅ `npm run build` - Builds React app for production
- ✅ `npm run start:prod` - Starts production server
- ✅ Environment variables set correctly

## 🌐 How It Works Now

1. **API Routes** (`/api/*`) - Handled by Express server
2. **Static Files** - Served from `client/build/`
3. **React Routes** (`/admin`, `/about`, etc.) - Handled by React Router
4. **Fallback** - All other routes serve `index.html` for client-side routing

## 🐳 Docker Deployment

If using Docker, the build process is already handled in the Dockerfile:

```bash
docker-compose up -d
```

## 🔍 Troubleshooting

### Still getting 404?
1. Ensure `NODE_ENV=production` is set
2. Verify React app is built (`client/build/` exists)
3. Check server logs for errors

### Admin login not working?
1. Create admin user: `cd server && npm run create-admin`
2. Use credentials: `admin@skyfalke.com` / `admin123`

## 📞 Support

If you're still having issues, check:
- Server logs for errors
- Network tab in browser dev tools
- Ensure all environment variables are set correctly
