# SSR Debugging Guide for Blog Posts

## Issue
The view source shows the raw HTML template without SSR metadata or content, indicating the SSR renderer is not being called.

## Debugging Steps

### 1. Check Server Logs
When accessing a blog post URL (e.g., `/blog/your-slug`), check the server console for these log messages:

```
[SSR] ========================================
[SSR] Handling URL: /blog/your-slug
[SSR] Clean URL: /blog/your-slug
[SSR] Path parts: ['blog', 'your-slug']
[SSR] Detected blog route with slug: your-slug
[SSR] Blog post data fetched: Yes/No
```

### 2. Verify Blog Post Exists
- Check if the blog post exists in the database with the correct slug
- Verify the blog post has `status: 'published'`
- Check MongoDB: `db.blogs.findOne({ slug: 'your-slug', status: 'published' })`

### 3. Check Route Detection
The SSR handler should detect blog routes matching: `/blog/:slug`

If you see:
- `[SSR] Not an SSR route, using static serving` → Route detection failed
- `[SSR] Blog post not found for slug: ...` → Blog post doesn't exist

### 4. Verify SSR Renderer is Called
If blog post is found, you should see:
```
[SSR] Using renderToPipeableStream for blog post
[SSR Stream] Starting blog post render for: your-slug
[SSR Stream] ✅ HTML head written with comprehensive metadata (Next.js style)
[SSR Stream] Shell ready, starting React stream
```

### 5. Common Issues

#### Issue: Blog post not found
**Solution**: Ensure the blog post exists and has `status: 'published'`

#### Issue: Route not detected
**Solution**: Check the URL format - should be `/blog/slug-name` (not `/blog/slug-name/`)

#### Issue: Renderer error
**Solution**: Check server logs for error messages from `[SSR Stream]`

#### Issue: Scripts in wrong place
**Solution**: The renderer now extracts scripts from head and moves them to body

## Testing

1. Access a blog post URL: `https://yourdomain.com/blog/test-slug`
2. View page source (Ctrl+U or Cmd+Option+U)
3. Check for:
   - ✅ Blog post title in `<title>` tag
   - ✅ Meta description
   - ✅ Open Graph tags
   - ✅ Twitter Card tags
   - ✅ Article schema markup
   - ✅ Blog content in `<div id="root">`
   - ✅ Scripts before `</body>` (not in `<head>`)

## Expected HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Base meta tags from template -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  
  <!-- SSR-injected metadata -->
  <title>Blog Post Title | Skyfalke Blog</title>
  <meta name="description" content="Blog post description...">
  <meta property="og:title" content="Blog Post Title">
  <!-- ... more OG tags ... -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Blog Post Title",
    ...
  }
  </script>
</head>
<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root">
    <!-- SSR-rendered blog post content here -->
  </div>
  <script>window.__INITIAL_DATA__ = {...};</script>
  <script src="/static/js/main.xxx.js"></script>
</body>
</html>
```

## Next Steps

If SSR is still not working after checking the above:
1. Share the server console logs when accessing a blog post
2. Verify the blog post slug matches the URL
3. Check if there are any errors in the server logs
4. Ensure the build directory exists: `client/build/index.html`

