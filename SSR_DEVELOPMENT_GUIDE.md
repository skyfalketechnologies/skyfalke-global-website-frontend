# SSR Development Guide

## How SSR Works in Development

Server-Side Rendering (SSR) for blog posts and other dynamic content works when accessing through the **backend server** (port 5000), not the React dev server (port 3000).

## Setup for Development SSR

### 1. Build the Client
```bash
cd client
npm run build
```

### 2. Start the Backend Server
```bash
cd server
npm start
# or
npm run dev
```

### 3. Access Through Backend Server
- ✅ **SSR Enabled**: `http://localhost:5000/blog/your-slug`
- ❌ **No SSR**: `http://localhost:3000/blog/your-slug` (React dev server)

## Why This Happens

- **React Dev Server (port 3000)**: Serves its own HTML template from `public/index.html` and doesn't go through Express SSR handler
- **Backend Server (port 5000)**: Serves the built files and processes requests through the SSR handler, injecting dynamic metadata

## Development Workflow

### Option 1: Full SSR Testing (Recommended for SEO Testing)
1. Make changes to your React components
2. Rebuild: `cd client && npm run build`
3. Restart backend: `cd server && npm start`
4. Test at `http://localhost:5000/blog/your-slug`
5. View page source to verify metadata is injected

### Option 2: Development with Hot Reload
1. Run React dev server: `cd client && npm start` (port 3000)
2. Run backend server: `cd server && npm start` (port 5000)
3. Use port 3000 for development (no SSR, but hot reload)
4. Use port 5000 for SSR testing (no hot reload, but full SSR)

## Verifying SSR is Working

1. Access a blog post through the backend server:
   ```
   http://localhost:5000/blog/your-post-slug
   ```

2. View page source (Right-click → View Page Source)

3. Check for:
   - ✅ Dynamic `<title>` tag with blog post title
   - ✅ `<meta name="description">` with blog post description
   - ✅ Open Graph tags (`og:title`, `og:description`, `og:image`)
   - ✅ Twitter Card tags
   - ✅ JSON-LD schema markup (`<script type="application/ld+json">`)
   - ✅ Canonical URL

4. Check server logs for SSR processing:
   ```
   [SSR] ========================================
   [SSR] Handling URL: /blog/your-slug
   [SSR] Detected blog route with slug: your-slug
   [SSR] Blog post data fetched: Yes
   [SSR] ✅ Successfully generated SSR HTML
   ```

## Troubleshooting

### SSR Not Working?
1. **Check if build exists**: `Test-Path client\build` (Windows) or `test -d client/build` (Linux/Mac)
2. **Check server logs**: Look for `[SSR]` messages
3. **Verify NODE_ENV**: Should be `development` or `production`
4. **Check route pattern**: Blog posts must be `/blog/:slug`

### Static Files 404?
- Static files are served by Express static middleware
- Check that `client/build` directory exists
- Verify middleware order in `server/index.js`

### Metadata Not Appearing?
- Check server logs for SSR processing
- Verify blog post exists in database
- Check that slug matches the URL
- Ensure `fetchBlogPost` is working correctly

## Production

In production, SSR works automatically when:
- Client is built (`npm run build` in client directory)
- Server is running with `NODE_ENV=production`
- All requests go through the backend server

