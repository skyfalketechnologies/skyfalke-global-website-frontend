# Testing SSR Meta Tags in Production

## Quick Test Steps

### 1. Build the Client
```bash
cd client
npm run build
```

### 2. Start Production Server
```bash
cd server
NODE_ENV=production npm start
```

### 3. Test in Browser
1. Open browser in **Incognito/Private mode** (to avoid service worker cache)
2. Visit `http://localhost:5000` (or your production URL)
3. View page source (Ctrl+U)
4. Check for meta tags in `<head>` section

## What to Look For

In view source, you should see:
```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  
  <title>Skyfalke • Helping Businesses Succeed Online</title>
  <meta name="description" content="Skyfalke is a digital firm based in Nairobi, Kenya..." />
  <meta name="keywords" content="..." />
  <link rel="canonical" href="https://skyfalke.com" />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://skyfalke.com" />
  <meta property="og:title" content="Skyfalke • Helping Businesses Succeed Online" />
  ...
</head>
```

## Troubleshooting

### If meta tags still don't appear:

1. **Check server logs** - Should see:
   - `[SSR] ✅ Successfully generated SSR HTML`
   - `[SSR Route Handler] ✅ Response sent`

2. **Disable service worker temporarily**:
   - In DevTools → Application → Service Workers
   - Check "Bypass for network"
   - Reload page

3. **Clear all caches**:
   - DevTools → Application → Clear storage
   - Check all boxes → Clear site data

4. **Test with curl** (to bypass browser cache):
   ```bash
   curl http://localhost:5000/ | grep -A 5 "<title>"
   ```

## Production Deployment

When deploying to production:
1. Ensure `client/build` directory exists (run `npm run build` in client folder)
2. The SSR handler will use `build/index.html` if available
3. Service worker will be updated with new cache version
4. Users will get fresh HTML with meta tags on next visit

## Service Worker Update

The service worker has been updated to:
- **NOT cache HTML pages** (`/` and `/index.html`)
- **Always fetch HTML from server** (network-first)
- **Force cache refresh** (updated cache version to v1.0.1)

This ensures SSR meta tags are always fresh!

