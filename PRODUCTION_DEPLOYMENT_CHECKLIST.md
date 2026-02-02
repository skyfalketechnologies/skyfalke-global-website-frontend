# ✅ Production Deployment Checklist

## Pre-Deployment: Local Build & Test

### 1. Build Frontend Locally
```bash
cd client
npm install
npm run build
```

**What happens:**
- ✅ Next.js builds the application
- ✅ Creates `.next/standalone/` folder
- ✅ `postbuild` script automatically runs `setup-standalone.js`
- ✅ Static files are linked/copied to standalone directory

### 2. Test Standalone Build Locally
```bash
npm start
```

**Verify:**
- ✅ Pages load correctly
- ✅ CSS/styling works
- ✅ Images load
- ✅ No console errors

### 3. Verify Static Files
```bash
# Check static files exist in standalone
ls -la .next/standalone/.next/static/chunks/*.css
ls -la .next/standalone/public
```

---

## Deployment to cPanel

### Option A: Upload Pre-Built Standalone (Recommended)

**Advantages:**
- ✅ Faster deployment
- ✅ No build process on server (saves memory)
- ✅ Static files already properly linked
- ✅ Works even if server has memory limits

**Steps:**

1. **Build locally** (already done above)

2. **Create deployment package:**
   ```bash
   cd client
   tar -czf frontend-deploy.tar.gz \
     .next/standalone/ \
     package.json
   ```

3. **Upload to cPanel:**
   - Upload `frontend-deploy.tar.gz` to `~/nodeapps/skyfalke-frontend/`
   - Extract: `tar -xzf frontend-deploy.tar.gz`

4. **Install production dependencies:**
   ```bash
   cd ~/nodeapps/skyfalke-frontend
   npm install --production
   ```

5. **Verify structure:**
   ```bash
   ls -la .next/standalone/server.js
   ls -la .next/standalone/.next/static
   ls -la .next/standalone/public
   ```

6. **Configure Node.js app in cPanel:**
   - Startup file: `.next/standalone/server.js`
   - Environment variables set
   - Start application

---

### Option B: Build on Server

**Use this if:**
- You prefer building on the server
- You want to ensure server compatibility
- You have sufficient memory on server

**Steps:**

1. **Upload full project:**
   - Upload entire `client/` folder to `~/nodeapps/skyfalke-frontend/`

2. **On server, build:**
   ```bash
   cd ~/nodeapps/skyfalke-frontend
   npm install
   npm run build
   ```
   - The `postbuild` script will automatically run `setup-standalone.js`
   - On Linux (cPanel), it will create symlinks (more efficient)

3. **Verify build:**
   ```bash
   ls -la .next/standalone/server.js
   ls -la .next/standalone/.next/static
   ```

4. **Configure Node.js app in cPanel:**
   - Startup file: `.next/standalone/server.js`
   - Start application

---

## How Setup Script Works in Production

### On Windows (Local Build):
- **Copies** static files to standalone directory
- Files are physically duplicated
- Works when uploaded to Linux server

### On Linux (cPanel Server):
- **Creates symlinks** to static files
- More efficient (no duplication)
- Files remain in original location
- Symlinks work perfectly on Linux

### Result:
✅ **Both approaches work in production!**

- If you build on Windows and upload: Files are copied, works fine
- If you build on Linux: Symlinks created, works efficiently

---

## Verification After Deployment

### 1. Check Application Logs
In cPanel, check Node.js app logs for:
- ✅ Server started successfully
- ✅ No errors loading static files
- ✅ Port assigned correctly

### 2. Test Website
- ✅ Visit your domain
- ✅ Check browser console (F12) for errors
- ✅ Verify CSS loads: Check Network tab for `.css` files
- ✅ Verify images load
- ✅ Test navigation

### 3. Check Static Files
```bash
# On server via SSH/Terminal
cd ~/nodeapps/skyfalke-frontend
curl http://localhost:PORT/_next/static/chunks/main-[hash].js
```

Should return JavaScript content (not 404).

---

## Troubleshooting Production Issues

### Issue: CSS not loading (404 errors)

**Check:**
1. Static files exist:
   ```bash
   ls -la .next/standalone/.next/static
   ```

2. If missing, run setup script:
   ```bash
   node setup-standalone.js
   ```

3. Or rebuild:
   ```bash
   npm run build
   ```

### Issue: Images not loading

**Check:**
1. Public folder exists:
   ```bash
   ls -la .next/standalone/public
   ```

2. If missing, run setup script or rebuild

### Issue: Symlinks not working

**If symlinks fail on server:**
1. The setup script should handle this automatically
2. On Linux, symlinks should work fine
3. If issues persist, the script will copy files instead

---

## Best Practices

1. ✅ **Always test locally first** with `npm start`
2. ✅ **Build locally and upload** (saves server resources)
3. ✅ **Verify static files** before deploying
4. ✅ **Check browser console** after deployment
5. ✅ **Monitor server logs** for errors

---

## Summary

**Yes, the setup script works in production!**

- ✅ Works on Windows (local build) - copies files
- ✅ Works on Linux (cPanel) - creates symlinks
- ✅ Automatically runs after `npm run build`
- ✅ Handles both deployment scenarios
- ✅ No manual steps required

**Just run `npm run build` and deploy!** 🚀

