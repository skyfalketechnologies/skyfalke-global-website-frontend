# 🚀 Quick Deployment Checklist

Since your cPanel supports Node.js, here's a quick checklist to get you deployed:

## ✅ Pre-Deployment Checklist

### Backend
- [ ] Create `.env` file in `server/` directory
- [ ] Update `CORS_ORIGIN` with your production domain
- [ ] Verify MongoDB Atlas IP whitelist includes cPanel server

### Frontend
- [ ] Create `.env.production` in `client/` directory
- [ ] Set `NEXT_PUBLIC_API_BASE_URL` to backend URL
- [ ] Set `NEXT_PUBLIC_SITE_URL` to frontend URL

## 📦 Deployment Steps

### 1. Backend Deployment

```bash
# On your local machine or cPanel terminal
cd server
cp env.example .env
# Edit .env with production values

# Upload to cPanel: ~/nodeapps/skyfalke-backend/
# Then in cPanel:
# 1. Create Node.js app
# 2. Set startup file: index.js
# 3. Set port: 5000
# 4. Add environment variables
# 5. Install: npm install --production
# 6. Start application
```

### 2. Frontend Deployment

```bash
# On your local machine
cd client
echo "NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com" > .env.production
echo "NEXT_PUBLIC_SITE_URL=https://yourdomain.com" >> .env.production
npm install
npm run build

# Upload to cPanel: ~/nodeapps/skyfalke-frontend/
# Upload entire client folder OR just:
# - .next/standalone/ (and its contents)
# - .next/static/
# - public/

# Then in cPanel:
# 1. Create Node.js app
# 2. Set startup file: .next/standalone/server.js (or use start.js)
# 3. Set port: 3000
# 4. Add environment variables
# 5. Install: npm install --production
# 6. Start application
```

## 🔗 Domain Configuration

**Recommended Setup**:
- **Frontend**: `https://yourdomain.com` (main domain)
- **Backend**: `https://api.yourdomain.com` (subdomain)

## ✅ Post-Deployment Tests

1. **Backend Health**: `https://api.yourdomain.com/api/health`
2. **Frontend**: `https://yourdomain.com`
3. **API Integration**: Test login, data fetching
4. **WebSocket**: Test real-time features

## 📚 Full Documentation

For detailed instructions, see:
- **Complete Guide**: `CPANEL_NODEJS_DEPLOYMENT_GUIDE.md`
- **Readiness Assessment**: `CPANEL_DEPLOYMENT_READINESS.md`
- **Backend Guide**: `server/CPANEL_DEPLOYMENT.md`

---

**You're all set! 🎉**

