# Error Troubleshooting Guide

This document explains common errors and their solutions.

## 1. Preload Warning

**Error Message:**
```
The resource <URL> was preloaded using link preload but not used within a few seconds from the window's load event.
```

**Explanation:**
This warning occurs when resources are preloaded but not used immediately. Browsers expect preloaded resources to be used within a few seconds of the page load.

**Solution:**
- Only preload resources that are used immediately (above the fold)
- Ensure preload links have correct `as` attributes
- Use `fetchpriority="high"` for critical resources
- Remove preloads for resources that load later or conditionally

**Fixed in:**
- Removed hero image preload (not always above the fold)
- Added proper `type` attributes to preload links
- Added `fetchpriority="high"` for critical resources

## 2. SSL Certificate Error (ERR_CERT_DATE_INVALID)

**Error Message:**
```
Failed to load resource: net::ERR_CERT_DATE_INVALID
```

**Explanation:**
The API server's SSL certificate is expired or invalid. This is a server-side issue that needs to be fixed on the backend server.

**Root Cause:**
The API URL `https://apis.mwangikinyanjuiadvocates.com` has an invalid SSL certificate.

**Solutions:**

### Immediate Fix (Server-Side Required):
1. **Renew the SSL Certificate:**
   - Log into your server/hosting provider
   - Check certificate expiration date
   - Renew or install a new SSL certificate
   - Ensure the certificate is valid for the domain `apis.mwangikinyanjuiadvocates.com`

2. **Verify Certificate Installation:**
   ```bash
   # Test certificate validity
   openssl s_client -connect apis.mwangikinyanjuiadvocates.com:443 -servername apis.mwangikinyanjuiadvocates.com
   ```

3. **Check Certificate Chain:**
   - Ensure intermediate certificates are properly installed
   - Verify the certificate chain is complete

### Client-Side Improvements (Already Implemented):
- Enhanced error logging to identify SSL certificate issues
- Better error messages for users
- Proper error handling in API interceptors

### Temporary Workaround (Development Only):
⚠️ **Warning:** Only use this for development/testing. Never use in production.

If you need to test locally, you can temporarily disable SSL verification (NOT RECOMMENDED for production):

```javascript
// In api.js (DEVELOPMENT ONLY)
const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false // ONLY FOR DEVELOPMENT
  })
});
```

## 3. MIME Type Error for CSS

**Error Message:**
```
Refused to apply style from 'https://skyfalke.com/static/css/main.css' because its MIME type is not a supported stylesheet MIME type.
```

**Explanation:**
The web server is serving CSS files with an incorrect MIME type (Content-Type header). This is a server configuration issue.

**Root Cause:**
The web server (nginx, Apache, or hosting provider) is not configured to serve `.css` files with the correct `text/css` MIME type.

**Solutions:**

### For Nginx:
Add or update the MIME types configuration in your `nginx.conf`:

```nginx
http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    # Ensure CSS files are served with correct MIME type
    location ~* \.css$ {
        add_header Content-Type text/css;
    }
    
    # Or add to your main location block
    location / {
        types {
            text/css css;
        }
    }
}
```

### For Apache:
Ensure your `.htaccess` or `httpd.conf` includes:

```apache
AddType text/css .css
```

### For cPanel/Shared Hosting:
1. Check your hosting provider's documentation
2. Contact support to ensure CSS files are served with `text/css` MIME type
3. Verify `.htaccess` file has correct MIME type declarations

### Verification:
Test the MIME type with:
```bash
curl -I https://skyfalke.com/static/css/main.css
```

Look for:
```
Content-Type: text/css
```

If it shows something else (like `text/html` or `application/octet-stream`), the server configuration needs to be fixed.

## 4. Login Error: "W"

**Error Message:**
```
AuthContext.js:58 Login error: W
```

**Explanation:**
This was caused by incomplete error logging. The error object was being logged incorrectly, showing only a partial error message.

**Solution:**
Enhanced error logging has been implemented to show:
- Full error messages
- Error codes
- API URLs
- Stack traces (for debugging)
- User-friendly error messages

**Fixed in:**
- `client/src/contexts/AuthContext.js` - Enhanced error handling and logging
- `client/src/utils/api.js` - Added SSL certificate error detection

## General Troubleshooting Steps

1. **Check Browser Console:**
   - Open Developer Tools (F12)
   - Check Console tab for detailed error messages
   - Check Network tab to see failed requests

2. **Verify Environment Variables:**
   - Ensure `REACT_APP_API_BASE_URL` is set correctly
   - Check that the API URL is accessible

3. **Test API Connectivity:**
   ```bash
   curl https://apis.mwangikinyanjuiadvocates.com/api/health
   ```

4. **Check Server Logs:**
   - Review server error logs
   - Check SSL certificate status
   - Verify MIME type configurations

5. **Clear Browser Cache:**
   - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
   - Clear browser cache and cookies
   - Try incognito/private mode

## Contact Support

If issues persist after trying these solutions:
1. Check server/hosting provider status
2. Verify SSL certificate is valid and properly installed
3. Ensure server MIME type configuration is correct
4. Review server error logs for additional details

