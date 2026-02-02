# 📄 .htaccess Configuration Guide for cPanel Deployment

## Do You Need .htaccess?

**Short Answer**: **Usually NO** - if you're using the recommended setup.

### Recommended Setup (No .htaccess Needed):
- ✅ **Frontend**: Deploy as Node.js app on main domain (`yourdomain.com`)
- ✅ **Backend**: Deploy as Node.js app on subdomain (`api.yourdomain.com`)
- ✅ cPanel Node.js apps handle routing automatically
- ✅ **No .htaccess required**

### When You DO Need .htaccess:
- 🔄 Using reverse proxy to route through `public_html/`
- 🔄 Serving static files from `public_html/` while Node.js runs on different port
- 🔄 Custom URL rewriting rules
- 🔄 Security headers configuration

---

## Option 1: Recommended Setup (No .htaccess)

### Configuration:
1. **Frontend Node.js App**:
   - Domain: `yourdomain.com`
   - Startup: `.next/standalone/server.js`
   - Port: Auto-assigned by cPanel

2. **Backend Node.js App**:
   - Domain: `api.yourdomain.com`
   - Startup: `index.js`
   - Port: Auto-assigned by cPanel

**Result**: Everything works without `.htaccess`! ✅

---

## Option 2: Reverse Proxy Setup (Requires .htaccess)

If you want to serve through `public_html/` and proxy to Node.js apps:

### Create `.htaccess` in `public_html/`:

```apache
# Enable Rewrite Engine
<IfModule mod_rewrite.c>
  RewriteEngine On
  
  # Enable Proxy Module (required for reverse proxy)
  <IfModule mod_proxy.c>
    ProxyPreserveHost On
    ProxyRequests Off
  </IfModule>
  
  # Frontend (Next.js) - Route all non-API requests to Node.js app
  RewriteCond %{REQUEST_URI} !^/api/
  RewriteCond %{REQUEST_URI} !^/_next/
  RewriteCond %{REQUEST_URI} !\.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|webp|avif|json|xml|txt|map)$ [NC]
  RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
  
  # Backend API - Route /api/* requests to backend Node.js app
  RewriteCond %{REQUEST_URI} ^/api/
  RewriteRule ^api/(.*)$ http://localhost:5000/api/$1 [P,L]
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  # Prevent clickjacking
  Header always set X-Frame-Options "SAMEORIGIN"
  
  # XSS Protection
  Header always set X-XSS-Protection "1; mode=block"
  
  # Prevent MIME type sniffing
  Header always set X-Content-Type-Options "nosniff"
  
  # Referrer Policy
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  
  # Content Security Policy (adjust as needed)
  Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/pdf "access plus 1 month"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>
```

### Important Notes:
- ⚠️ Replace `localhost:3000` with your actual frontend Node.js port
- ⚠️ Replace `localhost:5000` with your actual backend Node.js port
- ⚠️ Requires `mod_rewrite` and `mod_proxy` enabled in Apache
- ⚠️ Some cPanel hosts disable `mod_proxy` for security

---

## Option 3: Static Files Only (Minimal .htaccess)

If you're serving static files from `public_html/` while Node.js handles dynamic content:

```apache
# Serve static files directly
<IfModule mod_rewrite.c>
  RewriteEngine On
  
  # Allow direct access to static files
  RewriteCond %{REQUEST_FILENAME} -f
  RewriteRule ^ - [L]
  
  # Proxy everything else to Node.js
  RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
</IfModule>
```

---

## Option 4: Next.js Specific Configuration

For Next.js with standalone output, you might need:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  
  # Handle Next.js static files
  RewriteCond %{REQUEST_URI} ^/_next/static
  RewriteRule ^ - [L]
  
  # Handle Next.js image optimization
  RewriteCond %{REQUEST_URI} ^/_next/image
  RewriteRule ^ - [L]
  
  # Handle public folder files
  RewriteCond %{REQUEST_FILENAME} -f
  RewriteRule ^ - [L]
  
  # Proxy all other requests to Next.js
  RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
</IfModule>
```

---

## Security Headers Only (No Proxy)

If you just want security headers without reverse proxy:

```apache
<IfModule mod_headers.c>
  # Security Headers
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set X-XSS-Protection "1; mode=block"
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
  
  # HSTS (only if using HTTPS)
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</IfModule>
```

---

## Finding Your Node.js Ports

To find the ports assigned by cPanel:

1. **Check cPanel Node.js App Settings**:
   - Go to Node.js Selector
   - View your applications
   - Note the port numbers

2. **Or check via SSH**:
   ```bash
   # Check what ports are in use
   netstat -tulpn | grep node
   ```

3. **Or check environment variables**:
   - In cPanel Node.js app settings
   - Check the `PORT` environment variable

---

## Troubleshooting

### Issue: Reverse Proxy Not Working

**Check:**
1. `mod_rewrite` is enabled:
   ```bash
   apache2ctl -M | grep rewrite
   ```

2. `mod_proxy` is enabled:
   ```bash
   apache2ctl -M | grep proxy
   ```

3. Correct ports in `.htaccess`

4. Apache error logs:
   ```bash
   tail -f /usr/local/apache/logs/error_log
   ```

### Issue: 500 Internal Server Error

**Possible causes:**
- `mod_proxy` not enabled (contact host)
- Incorrect port numbers
- Syntax error in `.htaccess`

**Fix:**
- Remove `.htaccess` and use recommended setup (no proxy)
- Or contact hosting support to enable `mod_proxy`

### Issue: Static Files Not Loading

**Check:**
- Static files are being served by Node.js (not Apache)
- Or update `.htaccess` to exclude static file extensions from proxy

---

## Recommended Approach Summary

### ✅ Best Practice (No .htaccess):
```
Frontend: yourdomain.com → Node.js App (port 3000)
Backend:  api.yourdomain.com → Node.js App (port 5000)
```

**Advantages:**
- ✅ Simpler setup
- ✅ No Apache configuration needed
- ✅ Better performance (direct Node.js)
- ✅ Works on all cPanel hosts
- ✅ No proxy module requirements

### ⚠️ Alternative (With .htaccess):
```
public_html/ → .htaccess → Proxy to Node.js apps
```

**Use this only if:**
- You need to serve from `public_html/`
- You have specific routing requirements
- Your host supports `mod_proxy`

---

## Quick Reference

| Scenario | Need .htaccess? | File Location |
|----------|----------------|---------------|
| Node.js apps on separate domains | ❌ No | N/A |
| Reverse proxy through public_html | ✅ Yes | `public_html/.htaccess` |
| Security headers only | ✅ Optional | `public_html/.htaccess` |
| Static file serving | ✅ Optional | `public_html/.htaccess` |

---

## Final Recommendation

**For your setup, you likely DON'T need .htaccess!**

Just use:
- Frontend Node.js app on main domain
- Backend Node.js app on subdomain
- cPanel handles everything automatically

Only create `.htaccess` if you have specific requirements that can't be handled by Node.js apps directly.

