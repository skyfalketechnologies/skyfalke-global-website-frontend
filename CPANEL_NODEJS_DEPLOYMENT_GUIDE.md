# 🚀 Complete cPanel Node.js Deployment Guide

## Overview

This guide covers deploying both your **Backend (Express)** and **Frontend (Next.js)** applications as Node.js apps on cPanel.

---

## 📋 Prerequisites Checklist

- [x] cPanel with Node.js support (confirmed)
- [ ] SSH access to cPanel (recommended) or File Manager access
- [ ] MongoDB Atlas account (already configured)
- [ ] Domain name configured in cPanel
- [ ] SSL certificate installed (for HTTPS)

---

## 🎯 Deployment Architecture

```
┌─────────────────────────────────────────┐
│           cPanel Server                 │
│                                         │
│  ┌─────────────────┐  ┌──────────────┐ │
│  │  Frontend       │  │  Backend     │ │
│  │  (Next.js)      │  │  (Express)   │ │
│  │  Port: 3000     │  │  Port: 5000  │ │
│  └─────────────────┘  └──────────────┘ │
│         │                    │          │
│         └────────┬───────────┘          │
│                  │                      │
│         ┌────────▼──────────┐          │
│         │   Reverse Proxy   │          │
│         │   (cPanel/Apache) │          │
│         └────────┬──────────┘          │
│                  │                      │
│         ┌────────▼──────────┐          │
│         │   public_html/    │          │
│         │   (Main Domain)   │          │
│         └───────────────────┘          │
└─────────────────────────────────────────┘
```

---

## 🔧 Part 1: Backend Deployment

### Step 1: Prepare Backend Code

1. **Navigate to server directory**:
   ```bash
   cd server
   ```

2. **Create production environment file**:
   ```bash
   cp env.example .env
   ```

3. **Edit `.env` file** with production values:
   ```env
   NODE_ENV=production
   PORT=5000
   
   # MongoDB (use your production MongoDB URI)
   MONGODB_URI=mongodb+srv://skyfalkegroup:87654321Skyfalke$$.@skyfalkegroup-cluster.kiwaycv.mongodb.net/Skyfalkegroup
   
   # JWT Configuration
   JWT_SECRET=hj899kjjjjjghfwqwweoewxosdkdoghdfdgknopmij8967rvd
   JWT_EXPIRE=7d
   
   # Email configuration
   EMAIL_HOST=smtp.skyfalke.com
   EMAIL_PORT=465
   EMAIL_USER=noreply@skyfalke.com
   EMAIL_PASS=37016568Matekwa@@.
   
   # Admin credentials
   ADMIN_EMAIL=mronald@skyfalke.com
   ADMIN_PASSWORD=admin123
   
   # ImageKit Configuration
   IMAGEKIT_PUBLIC_KEY=public_u6yPpR7WdsopVg9Tbueiha1ydHw=
   IMAGEKIT_PRIVATE_KEY=private_k9vORRBoensuszXaRw3DWpsFiGs=
   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/g3nahgeeu/
   
   # CORS Configuration (UPDATE WITH YOUR DOMAINS)
   CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   
   # Trust Proxy (for cPanel)
   TRUST_PROXY=true
   ```

### Step 2: Upload Backend to cPanel

**Option A: Using File Manager**
1. Log into cPanel
2. Open **File Manager**
3. Navigate to `home/username/nodeapps/` (or create this directory)
4. Create folder: `skyfalke-backend`
5. Upload all server files (except `node_modules`)

**Option B: Using Git (Recommended)**
```bash
# In cPanel terminal or via SSH
cd ~/nodeapps
git clone your-repo-url skyfalke-backend
cd skyfalke-backend/server
```

**Option C: Using ZIP Upload**
1. Create a ZIP of the server folder (excluding `node_modules`)
2. Upload via File Manager
3. Extract in `nodeapps/skyfalke-backend/`

### Step 3: Create Node.js Application in cPanel

1. **In cPanel**, navigate to **Software** → **Node.js Selector** (or **Setup Node.js App**)

2. **Click "Create Application"**

3. **Configure the application**:
   - **Node.js version**: `18.x` or `20.x` (LTS)
   - **Application mode**: `Production`
   - **Application root**: `/home/username/nodeapps/skyfalke-backend`
   - **Application URL**: Choose one:
     - Subdomain: `api.yourdomain.com`
     - Or port: `yourdomain.com:5000`
   - **Application startup file**: `index.js`
   - **Application URL**: (cPanel will assign or you can specify)
   - **Passenger port**: `5000` (or let cPanel assign)

4. **Set Environment Variables**:
   - In the Node.js app settings, add all variables from your `.env` file
   - Or ensure `.env` file is in the application root

5. **Click "Create"**

### Step 4: Install Dependencies

**Via Terminal/SSH**:
```bash
cd ~/nodeapps/skyfalke-backend
npm install --production
```

**Or via cPanel File Manager**:
- Upload `package.json` and `package-lock.json`
- Use Terminal in cPanel to run `npm install --production`

### Step 5: Start Backend Application

1. In cPanel Node.js app settings, click **"Restart"** or **"Start"**
2. Check logs for any errors
3. Test health endpoint: `https://api.yourdomain.com/api/health`

---

## 🎨 Part 2: Frontend Deployment

### Step 1: Prepare Frontend Code

1. **Navigate to client directory**:
   ```bash
   cd client
   ```

2. **Create production environment file**:
   ```bash
   # Create .env.production
   cat > .env.production << EOF
   NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   NODE_ENV=production
   EOF
   ```

   **Important**: Replace `api.yourdomain.com` and `yourdomain.com` with your actual domains.

### Step 2: Build Frontend

```bash
cd client
npm install
npm run build
```

This will create:
- `.next/` - Build output
- `.next/standalone/` - Standalone Node.js application (this is what we'll deploy)

### Step 3: Upload Frontend to cPanel

**Option A: Build Locally and Upload (Recommended)**
1. **Build on your local machine:**
   ```bash
   cd client
   npm install
   npm run build
   ```
   The `postbuild` script automatically runs `setup-standalone.js` to link static files.

2. **Upload the complete standalone build:**
   - Upload entire `.next/standalone/` folder to:
     - `~/nodeapps/skyfalke-frontend/`
   - The static files are already included (copied on Windows, symlinked on Linux)

3. **Verify structure on server:**
   ```bash
   ls -la ~/nodeapps/skyfalke-frontend/.next/static
   ls -la ~/nodeapps/skyfalke-frontend/public
   ```

**Option B: Build on Server**
1. Upload entire `client/` folder to:
   - `~/nodeapps/skyfalke-frontend/`

2. **On the server, build and setup:**
   ```bash
   cd ~/nodeapps/skyfalke-frontend
   npm install
   npm run build
   # setup-standalone.js runs automatically via postbuild script
   ```

**Note**: The setup script works on both Windows (copies files) and Linux (creates symlinks). On cPanel (Linux), it will use symlinks which is more efficient.

### Step 4: Create Node.js Application for Frontend

1. **In cPanel**, navigate to **Software** → **Node.js Selector**

2. **Click "Create Application"**

3. **Configure the application**:
   - **Node.js version**: `18.x` or `20.x` (LTS)
   - **Application mode**: `Production`
   - **Application root**: `/home/username/nodeapps/skyfalke-frontend`
   - **Application URL**: Your main domain or subdomain
   - **Application startup file**: `.next/standalone/server.js` ⚠️ **IMPORTANT: Use this exact path**
   - **Passenger port**: Let cPanel assign automatically (or use 3001+ if 3000 is in use)

4. **Set Environment Variables**:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   NODE_ENV=production
   PORT=3000
   NODE_OPTIONS=--max-old-space-size=2048
   ```
   
   **Note**: If you get "port already in use" error, either:
   - Let cPanel assign port automatically (remove PORT variable)
   - Or use a different port like `PORT=3001`

5. **Click "Create"**

### Step 5: Verify Standalone Server

**IMPORTANT**: With `output: 'standalone'`, you MUST use `.next/standalone/server.js` as the startup file.

After building, verify the standalone server exists:
```bash
ls -la .next/standalone/server.js
```

If it doesn't exist, the build failed. Check build logs and rebuild:
```bash
npm run build
```

**Do NOT use `next start` or custom start scripts** - the standalone server is self-contained and includes all dependencies.

### Step 6: Install Dependencies and Start

```bash
cd ~/nodeapps/skyfalke-frontend
npm install --production
```

In cPanel Node.js settings, click **"Restart"** or **"Start"**.

---

## 🔄 Part 3: Configure Reverse Proxy (Optional but Recommended)

If you want to serve both apps through your main domain:

### Option A: Frontend on Main Domain, Backend on Subdomain

1. **Frontend**: Deploy on main domain (`yourdomain.com`)
2. **Backend**: Deploy on subdomain (`api.yourdomain.com`)

This is the simplest approach and recommended.

### Option B: Both on Main Domain with Path Routing

Create `.htaccess` in `public_html/`:

```apache
# Frontend (Next.js)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{REQUEST_URI} !^/api/
  RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
</IfModule>

# Backend API
<IfModule mod_rewrite.c>
  RewriteCond %{REQUEST_URI} ^/api/
  RewriteRule ^api/(.*)$ http://localhost:5000/api/$1 [P,L]
</IfModule>
```

---

## ✅ Part 4: Post-Deployment Verification

### Test Backend

```bash
# Health check
curl https://api.yourdomain.com/api/health

# Should return: {"status":"OK","timestamp":"..."}
```

### Test Frontend

1. Visit: `https://yourdomain.com`
2. Check browser console for errors
3. Test API calls
4. Verify WebSocket connections (if used)

### Test Integration

1. **Login functionality**
2. **Data fetching**
3. **Form submissions**
4. **Image uploads**
5. **Real-time features** (WebSocket)

---

## 🔧 Troubleshooting

### Backend Issues

**Port already in use**:
- Change port in `.env` and cPanel Node.js settings
- Or use a different port assignment

**MongoDB connection failed**:
- Check MongoDB Atlas IP whitelist
- Add cPanel server IP to whitelist
- Verify connection string format

**CORS errors**:
- Update `CORS_ORIGIN` in backend `.env`
- Include exact frontend domain (with https://)

### Frontend Issues

**"next start" does not work with standalone**:
- ✅ **FIXED**: Use `.next/standalone/server.js` as startup file
- Do NOT use `next start` command
- Set startup file in cPanel to: `.next/standalone/server.js`

**Port already in use (EADDRINUSE)**:
- Let cPanel assign port automatically (remove PORT env var)
- Or use different port: `PORT=3001`
- Check what's using the port: `lsof -i :3000`

**Out of memory errors**:
- Build locally and upload (see troubleshooting guide)
- Add `NODE_OPTIONS=--max-old-space-size=2048` to env vars
- Contact host to increase LVE limits
- See `CPANEL_TROUBLESHOOTING.md` for details

**Standalone server not found**:
- Run `npm run build` first
- Verify `.next/standalone/server.js` exists
- Check build completed successfully

**API calls fail**:
- Verify `NEXT_PUBLIC_API_BASE_URL` is set correctly
- Check CORS configuration on backend
- Verify backend is running

**404 errors on routes**:
- Next.js needs proper routing configuration
- Check `.htaccess` if using reverse proxy
- Verify standalone build includes all routes

### General Issues

**Application won't start**:
- Check Node.js version compatibility
- Verify startup file path
- Check application logs in cPanel
- Ensure all environment variables are set

**WebSocket not working**:
- Verify WebSocket support in cPanel
- Check firewall settings
- May need to configure reverse proxy for WebSocket

---

## 📊 Monitoring & Maintenance

### Health Checks

Set up automated health checks:
```bash
# Backend
curl https://api.yourdomain.com/api/health

# Frontend
curl https://yourdomain.com
```

### Logs

- **Backend logs**: Check in cPanel Node.js app logs
- **Frontend logs**: Check in cPanel Node.js app logs
- **Application logs**: Check `server/logs/` if configured

### Updates

When updating:
1. Pull latest code (if using Git)
2. Install dependencies: `npm install`
3. Rebuild frontend: `npm run build`
4. Restart applications in cPanel

---

## 🔒 Security Checklist

- [ ] SSL certificates installed and working
- [ ] All environment variables set (not hardcoded)
- [ ] `.env` files not committed to Git
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Helmet security headers enabled
- [ ] MongoDB credentials secure
- [ ] JWT secret is strong and unique
- [ ] Admin passwords changed from defaults
- [ ] File uploads validated
- [ ] API endpoints protected with authentication

---

## 📝 Quick Reference

### Backend
- **Location**: `~/nodeapps/skyfalke-backend/`
- **Start file**: `index.js`
- **Port**: `5000`
- **URL**: `https://api.yourdomain.com`

### Frontend
- **Location**: `~/nodeapps/skyfalke-frontend/`
- **Start file**: `.next/standalone/server.js` or `start.js`
- **Port**: `3000`
- **URL**: `https://yourdomain.com`

### Environment Variables

**Backend** (in `.env` or cPanel settings):
- `NODE_ENV=production`
- `PORT=5000`
- `MONGODB_URI=...`
- `CORS_ORIGIN=https://yourdomain.com`

**Frontend** (in `.env.production` or cPanel settings):
- `NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com`
- `NEXT_PUBLIC_SITE_URL=https://yourdomain.com`
- `NODE_ENV=production`
- `PORT=3000`

---

## 🎯 Success Criteria

After deployment, you should have:

- ✅ Backend API responding at `https://api.yourdomain.com/api/health`
- ✅ Frontend loading at `https://yourdomain.com`
- ✅ API calls working from frontend
- ✅ Authentication working
- ✅ Database connections working
- ✅ Image uploads working
- ✅ WebSocket connections working (if applicable)
- ✅ SSL/HTTPS working
- ✅ No CORS errors
- ✅ All routes accessible

---

## 🆘 Need Help?

If you encounter issues:
1. Check cPanel application logs
2. Verify environment variables
3. Test endpoints individually
4. Check MongoDB connectivity
5. Verify DNS and SSL configuration
6. Review this guide's troubleshooting section

**Good luck with your deployment! 🚀**

