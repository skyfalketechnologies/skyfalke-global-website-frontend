# 🔧 cPanel Deployment Troubleshooting Guide

## Common Errors and Solutions

### Error 1: "next start" does not work with "output: standalone"

**Error Message:**
```
⚠ "next start" does not work with "output: standalone" configuration. 
Use "node .next/standalone/server.js" instead.
```

**Solution:**
1. **Update package.json start script** (already done):
   ```json
   "start": "node .next/standalone/server.js"
   ```

2. **In cPanel Node.js App Settings:**
   - **Startup File**: Set to `.next/standalone/server.js`
   - **OR** use the `start` script: `npm start`

3. **Make sure you've built the app:**
   ```bash
   npm run build
   ```

4. **Verify standalone server exists:**
   ```bash
   ls -la .next/standalone/server.js
   ```

---

### Error 2: Port Already in Use (EADDRINUSE)

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**

#### Option A: Use a Different Port
1. **In cPanel Node.js App Settings:**
   - Change the port from 3000 to another port (e.g., 3001, 3002, etc.)
   - Update environment variable: `PORT=3001`

2. **Or let cPanel assign a port automatically:**
   - Don't specify a port in settings
   - cPanel will assign an available port

#### Option B: Stop Conflicting Process
1. **Find what's using port 3000:**
   ```bash
   lsof -i :3000
   # or
   netstat -tulpn | grep 3000
   ```

2. **Kill the process** (if it's safe to do so):
   ```bash
   kill -9 <PID>
   ```

#### Option C: Use Environment Variable
Set the port via environment variable in cPanel:
```
PORT=3001
```

Then the app will use that port automatically.

---

### Error 3: Out of Memory (WebAssembly)

**Error Message:**
```
RangeError: WebAssembly.instantiate(): Out of memory: Cannot allocate Wasm memory
```

**Causes:**
- cPanel LVE (Lightweight Virtual Environment) limits
- Process memory limits
- Large Next.js build

**Solutions:**

#### Option A: Increase Memory Limits (Contact Host)
1. **Check current limits:**
   ```bash
   cat /proc/self/limits
   ```

2. **Contact your hosting provider** to increase:
   - Max resident set (RSS)
   - Max address space
   - Max data size

#### Option B: Optimize Build
1. **Reduce build size:**
   ```bash
   # Remove unnecessary dependencies
   npm prune --production
   ```

2. **Use production build optimizations:**
   - Already configured in `next.config.js`
   - Consider code splitting

#### Option C: Disable WebAssembly Features (if not needed)
If you're not using WebAssembly features, you might be able to optimize:
- Check if any dependencies use WebAssembly unnecessarily
- Consider alternatives for heavy image processing

#### Option D: Build Locally and Upload
1. **Build on your local machine** (more memory):
   ```bash
   cd client
   npm install
   npm run build
   ```

2. **Upload only the built files:**
   - `.next/standalone/` folder
   - `.next/static/` folder
   - `public/` folder
   - `package.json` (for dependencies)

3. **On cPanel, only install production dependencies:**
   ```bash
   npm install --production --no-optional
   ```

#### Option E: Use Node.js Memory Flags
In cPanel Node.js app settings, add to environment variables:
```
NODE_OPTIONS=--max-old-space-size=2048
```

Or in startup command:
```bash
NODE_OPTIONS=--max-old-space-size=2048 node .next/standalone/server.js
```

---

### Error 4: Standalone Server Not Found

**Error Message:**
```
Cannot find module '.next/standalone/server.js'
```

**Solutions:**

1. **Make sure you've built the app:**
   ```bash
   npm run build
   ```

2. **Verify the build output:**
   ```bash
   ls -la .next/standalone/
   ```

3. **If standalone folder doesn't exist:**
   - Check `next.config.js` has `output: 'standalone'`
   - Rebuild: `npm run build`
   - Check build logs for errors

4. **Upload all required files:**
   - `.next/standalone/` (entire folder)
   - `.next/static/` (entire folder)
   - `public/` (entire folder)

---

### Error 5: Module Not Found After Build

**Error Message:**
```
Cannot find module 'next'
Error: Cannot find module 'react'
```

**Solutions:**

1. **Install production dependencies:**
   ```bash
   npm install --production
   ```

2. **For standalone build, dependencies should be included:**
   - Check `.next/standalone/node_modules/` exists
   - If not, rebuild: `npm run build`

3. **Make sure you're in the right directory:**
   ```bash
   cd ~/nodeapps/skyfalke-frontend
   ```

---

## Quick Fix Checklist

When encountering errors, check:

- [ ] **Build completed successfully**: `npm run build` ran without errors
- [ ] **Standalone server exists**: `.next/standalone/server.js` is present
- [ ] **Port is available**: Check if port is already in use
- [ ] **Environment variables set**: All required env vars in cPanel
- [ ] **Dependencies installed**: `npm install --production` completed
- [ ] **Memory limits**: Check if hitting LVE limits
- [ ] **File permissions**: Ensure files are readable
- [ ] **Node.js version**: Matches requirements (18+)

---

## Recommended cPanel Configuration

### Frontend Node.js App Settings:

```
Application Root: /home/username/nodeapps/skyfalke-frontend
Startup File: .next/standalone/server.js
Application URL: (your domain or subdomain)
Node.js Version: 18.x or 20.x
Application Mode: Production
Port: (let cPanel assign or use 3000+)
```

### Environment Variables:

```
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NODE_OPTIONS=--max-old-space-size=2048
```

---

## Step-by-Step Recovery

If your app won't start:

1. **Stop the application** in cPanel

2. **Check logs** in cPanel for specific errors

3. **Verify build:**
   ```bash
   cd ~/nodeapps/skyfalke-frontend
   ls -la .next/standalone/server.js
   ```

4. **If build is missing or incomplete:**
   ```bash
   npm run build
   ```

5. **Check port availability:**
   ```bash
   # Try a different port in cPanel settings
   PORT=3001
   ```

6. **Start with minimal config:**
   - Remove optional environment variables
   - Use default port assignment
   - Start with basic settings

7. **Gradually add features:**
   - Add environment variables one by one
   - Test after each addition

---

## Contact Your Host

If memory issues persist, contact your hosting provider with:

1. **Error logs** from cPanel
2. **Current limits** (from `/proc/self/limits`)
3. **Request to increase:**
   - Max resident set (RSS): 4GB+ recommended
   - Max address space: 4GB+ recommended
   - Max data size: 4GB+ recommended

---

## Alternative: Build Locally

If cPanel build keeps failing due to memory:

1. **Build on local machine:**
   ```bash
   cd client
   npm install
   npm run build
   ```

2. **Create deployment package:**
   ```bash
   # Include only what's needed
   tar -czf frontend-deploy.tar.gz \
     .next/standalone/ \
     .next/static/ \
     public/ \
     package.json
   ```

3. **Upload to cPanel:**
   - Extract in `~/nodeapps/skyfalke-frontend/`
   - Install only production dependencies: `npm install --production`

4. **Start the app** in cPanel

---

## Still Having Issues?

1. Check cPanel application logs
2. Verify all files uploaded correctly
3. Test with minimal configuration first
4. Contact hosting support for LVE limit increases
5. Consider using a VPS if limits are too restrictive

