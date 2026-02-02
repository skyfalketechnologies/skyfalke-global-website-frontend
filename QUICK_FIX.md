# 🚨 Quick Fix for Current Errors

## Immediate Actions Required

### 1. Fix Startup File in cPanel

**Current Error**: `"next start" does not work with "output: standalone"`

**Fix**:
1. Go to your cPanel Node.js app settings
2. **Change Startup File** from `start.js` or `npm start` to:
   ```
   .next/standalone/server.js
   ```
3. Save and restart the application

### 2. Fix Port Conflict

**Current Error**: `EADDRINUSE: address already in use :::3000`

**Fix Option A** (Recommended):
1. In cPanel Node.js app settings
2. **Remove** the `PORT=3000` environment variable
3. Let cPanel assign a port automatically
4. Restart the application

**Fix Option B**:
1. In cPanel Node.js app settings
2. Change environment variable: `PORT=3001` (or any available port)
3. Restart the application

### 3. Fix Memory Issues

**Current Error**: `Out of memory: Cannot allocate Wasm memory`

**Fix Option A** (Quick):
1. In cPanel Node.js app settings
2. Add environment variable:
   ```
   NODE_OPTIONS=--max-old-space-size=2048
   ```
3. Restart the application

**Fix Option B** (If Option A doesn't work):
1. **Build on your local machine** (more memory):
   ```bash
   cd client
   npm install
   npm run build
   ```
2. **Upload the built files** to cPanel:
   - `.next/standalone/` folder
   - `.next/static/` folder
   - `public/` folder
3. **On cPanel**, only install production dependencies:
   ```bash
   cd ~/nodeapps/skyfalke-frontend
   npm install --production
   ```

---

## Updated cPanel Configuration

### Node.js App Settings:

```
Application Root: /home/username/nodeapps/skyfalke-frontend
Startup File: .next/standalone/server.js  ⚠️ THIS IS CRITICAL
Application URL: (your domain)
Node.js Version: 18.x or 20.x
Application Mode: Production
Port: (leave empty or let cPanel assign)
```

### Environment Variables:

```
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NODE_OPTIONS=--max-old-space-size=2048
```

**Do NOT set PORT** - let cPanel assign it automatically.

---

## Verification Steps

After making changes:

1. **Check startup file exists**:
   ```bash
   ls -la .next/standalone/server.js
   ```
   If it doesn't exist, run: `npm run build`

2. **Restart the application** in cPanel

3. **Check logs** for any remaining errors

4. **Test the application**: Visit your domain

---

## Still Having Issues?

See detailed troubleshooting: `CPANEL_TROUBLESHOOTING.md`

