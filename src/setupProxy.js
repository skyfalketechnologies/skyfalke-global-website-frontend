const { createProxyMiddleware } = require('http-proxy-middleware');

/**
 * Setup proxy for React dev server
 * Proxies API requests and HTML requests (for SSR) to the backend server
 */
module.exports = function(app) {
  const backendUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
  
  // Proxy API requests
  app.use(
    '/api',
    createProxyMiddleware({
      target: backendUrl,
      changeOrigin: true,
      logLevel: 'debug'
    })
  );

  // For development SSR: Proxy HTML requests for blog posts to backend
  // This allows SSR to work even when accessing through React dev server
  if (process.env.REACT_APP_ENABLE_DEV_SSR === 'true') {
    app.use(
      '/blog',
      createProxyMiddleware({
        target: backendUrl,
        changeOrigin: true,
        logLevel: 'debug',
        // Only proxy if it's a blog post route (has a slug)
        filter: (pathname, req) => {
          // Don't proxy if it's just /blog (listing page)
          // Only proxy if it's /blog/something (detail page)
          const parts = pathname.split('/').filter(Boolean);
          return parts.length > 1 && parts[0] === 'blog';
        }
      })
    );
  }
};

