const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const http = require('http');
require('dotenv').config();

// Development proxy for React dev server (enables SSR + hot reload)
let createProxyMiddleware;
try {
  createProxyMiddleware = require('http-proxy-middleware').createProxyMiddleware;
} catch (e) {
  // Package not installed, proxy won't be available
}

// Global error handlers for production stability
process.on('uncaughtException', (err) => {
  console.error('🚨 Uncaught Exception:', err);
  console.error('Stack:', err.stack);
  // Graceful shutdown
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit process for unhandled rejections in production
  if (process.env.NODE_ENV === 'production') {
    console.error('Continuing in production mode...');
  } else {
    process.exit(1);
  }
});

// Graceful shutdown handlers
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
  
  server.close(() => {
    console.log('✅ HTTP server closed');
    
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('⚠️ Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

const app = express();
const server = http.createServer(app);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://ik.imagekit.io", "https://images.unsplash.com"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://ik.imagekit.io"]
    }
  }
}));

// Enhanced compression with better settings
// IMPORTANT: Don't compress HTML responses to ensure meta tags are visible
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    // Don't compress HTML responses - ensures meta tags are visible in view source
    if (req.path === '/' || req.path.endsWith('.html') || req.headers['content-type']?.includes('text/html')) {
      return false;
    }
    // Don't compress if client doesn't support it
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Rate limiting - stricter for production (excluding admin routes and public forms)
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || (process.env.NODE_ENV === 'production' ? 50 : 100), // 50 for production, 100 for development
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  skip: (req) => {
    // Skip rate limiting for admin routes, health checks, public forms, and payment routes
    return req.path.startsWith('/api/admin') || 
           req.path.startsWith('/api/dashboard') || 
           req.path.startsWith('/api/portal') ||
           req.path.includes('/admin') ||                       // Skip any route with /admin in the path
           req.path === '/api/health' ||
           req.path.startsWith('/api/auth/') ||
           req.path.startsWith('/api/payments/') ||             // Skip payment routes
           req.path.startsWith('/api/orders') ||                // Skip order routes
           req.path === '/api/subscriptions/subscribe' ||
           req.path === '/api/contact/submit' ||
           req.path.startsWith('/api/chat') ||
           (process.env.NODE_ENV === 'development' && req.headers['x-skip-rate-limit'] === 'true');
  }
});
app.use(limiter);

// CORS configuration for production
const corsOptions = {
  origin: process.env.CORS_ORIGIN ? 
    process.env.CORS_ORIGIN.split(',') : 
    ['http://localhost:3000', 'https://skyfalke.com', 'https://www.skyfalke.com'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging - different levels for production vs development
const logFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(logFormat));

// Check if build directory exists (required for SSR and static file serving)
const buildPath = path.join(__dirname, '../client/build');
const buildExists = require('fs').existsSync(buildPath);

// MongoDB connection with enhanced error handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skyfalke', {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  bufferCommands: false // Disable mongoose buffering
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
  console.log(`   Database: ${mongoose.connection.name}`);
  console.log(`   Host: ${mongoose.connection.host}`);
  
  // Initialize WebSocket after MongoDB connection
  try {
    const { initializeSocket } = require('./socket');
    initializeSocket(server);

    // Initialize automation scheduler
    try {
      const automationScheduler = require('./services/automationScheduler');
      automationScheduler.start();
      console.log('✅ Automation scheduler initialized (includes sitemap generation)');
    } catch (error) {
      console.warn('⚠️  Automation scheduler not available:', error.message);
      console.warn('   Install node-cron: npm install node-cron');
    }

    // Generate initial sitemap on server start (if file doesn't exist)
    try {
      const sitemapService = require('./services/sitemapService');
      const sitemapPath = require('path').join(__dirname, 'public/sitemap.xml');
      const fs = require('fs');
      
      if (!fs.existsSync(sitemapPath)) {
        console.log('📋 Generating initial sitemap...');
        sitemapService.generateAndUpdate()
          .then(result => {
            console.log(`✅ Initial sitemap generated with ${result.stats.totalUrls} URLs`);
          })
          .catch(err => {
            console.warn('⚠️  Could not generate initial sitemap:', err.message);
          });
      }
    } catch (error) {
      console.warn('⚠️  Sitemap service not available:', error.message);
    }
    console.log('✅ WebSocket initialized successfully');
  } catch (socketError) {
    console.error('❌ WebSocket initialization failed:', socketError);
    // Don't crash the server if WebSocket fails
  }
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  if (err.code === 'ETIMEOUT') {
    console.error('⚠️  DNS/Network timeout - Check your internet connection and MongoDB URI');
    console.error('   The server will continue, but database operations will fail until connection is established');
  } else {
    console.error('   Error details:', err.code || 'Unknown error');
  }
  console.error('   Server will continue without database connection...');
  console.error('   Routes with dbCheck middleware will return 503 until connection is established');
  // Don't exit process, let server start without DB
});

// API Routes - MUST come before static file middleware
// This ensures API requests are handled before static middleware tries to serve them as files
app.use('/api/auth', require('./routes/auth'));
app.use('/api/content', require('./routes/content'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/blogs', require('./routes/blog'));
app.use('/api/chat', require('./routes/chatInsights'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/partnerships', require('./routes/partnerships'));
app.use('/api/events', require('./routes/events'));
app.use('/api/shop', require('./routes/shop'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/case-studies', require('./routes/caseStudies'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/invoices', require('./routes/invoices'));
app.use('/api/quotations', require('./routes/quotations'));
app.use('/api/academy', require('./routes/academy'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/hr', require('./routes/hr'));
app.use('/api/portal', require('./routes/employeePortal'));
app.use('/api/accounting', require('./routes/accounting'));
app.use('/api/campaigns', require('./routes/campaigns'));
app.use('/api/whatsapp', require('./routes/whatsapp'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/automations', require('./routes/automations'));
app.use('/api/tenders', require('./routes/tenders'));
app.use('/api/sitemap', require('./routes/sitemap'));

// ============================================================================
// DEVELOPMENT PROXY - Enables SSR + React Hot Reload
// When accessing Express (port 5000), proxy React dev server assets from port 3000
// ============================================================================
const REACT_DEV_SERVER = process.env.REACT_DEV_SERVER || 'http://localhost:3000';
const isDevelopment = process.env.NODE_ENV !== 'production';

if (isDevelopment && createProxyMiddleware) {
  console.log('[Dev Proxy] ✅ Development proxy enabled');
  console.log('[Dev Proxy] React dev server:', REACT_DEV_SERVER);
  
  // Proxy WebSocket connections for hot module reload
  app.use('/ws', createProxyMiddleware({
    target: REACT_DEV_SERVER,
    ws: true,
    changeOrigin: true,
    logLevel: 'warn'
  }));
  
  // Proxy sockjs-node for Create React App hot reload
  app.use('/sockjs-node', createProxyMiddleware({
    target: REACT_DEV_SERVER,
    ws: true,
    changeOrigin: true,
    logLevel: 'warn'
  }));
  
  // Proxy React's static bundles (JS/CSS) from dev server
  // These are served from /static in development
  app.use('/static', createProxyMiddleware({
    target: REACT_DEV_SERVER,
    changeOrigin: true,
    logLevel: 'warn',
    onError: (err, req, res) => {
      console.warn('[Dev Proxy] React dev server not running. Start it with: cd client && npm start');
      res.status(503).send('React dev server not running');
    }
  }));
  
  // Proxy hot-update files for HMR
  app.use('/*.hot-update.*', createProxyMiddleware({
    target: REACT_DEV_SERVER,
    changeOrigin: true,
    logLevel: 'warn'
  }));
  
  console.log('[Dev Proxy] Proxying /static, /ws, /sockjs-node to React dev server');
  console.log('[Dev Proxy] Access http://localhost:5000 for SSR + hot reload');
}

// Serve static files from React build (both development and production)
// IMPORTANT: This comes AFTER API routes so API requests aren't treated as static files
if (buildExists) {
  // Add logging middleware BEFORE static files to see ALL requests
  app.use((req, res, next) => {
    // Only log non-API, non-static file requests
    if (!req.path.startsWith('/api/') && 
        !req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|webp|avif|json|xml|txt|map)$/i) &&
        !req.path.startsWith('/static/') &&
        !req.path.startsWith('/images/') &&
        !req.path.startsWith('/font/') &&
        !req.path.match(/^\/favicon/)) {
      console.log('[Request Logger] Incoming request:', req.method, req.path, req.url);
    }
    next();
  });
  
  // Serve static files with optimized caching headers
  // IMPORTANT: Do NOT serve index.html automatically - let SSR handler manage it
  // This middleware MUST come after API routes but before the SSR handler route
  app.use(express.static(buildPath, {
    maxAge: process.env.NODE_ENV === 'production' ? '1y' : '0', // No cache in dev
    etag: true,
    lastModified: true,
    index: false, // Don't automatically serve index.html
    fallthrough: true, // Continue to next middleware if file not found (for API routes and SSR)
    setHeaders: (res, filePath) => {
      // Add logging to see what static middleware is doing
      if (process.env.NODE_ENV !== 'production') {
        console.log('[Static Middleware] Serving file:', filePath);
      }
      
      // Set different cache times for different file types
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      } else if (filePath.endsWith('.js') || filePath.endsWith('.css')) {
        const cacheTime = process.env.NODE_ENV === 'production' 
          ? 'public, max-age=31536000, immutable' 
          : 'no-cache';
        res.setHeader('Cache-Control', cacheTime);
      } else if (filePath.match(/\.(jpg|jpeg|png|gif|ico|svg|webp|avif)$/i)) {
        const cacheTime = process.env.NODE_ENV === 'production' 
          ? 'public, max-age=31536000' 
          : 'no-cache';
        res.setHeader('Cache-Control', cacheTime);
      } else if (filePath.match(/\.(woff|woff2|ttf|eot)$/i)) {
        const cacheTime = process.env.NODE_ENV === 'production' 
          ? 'public, max-age=31536000, immutable' 
          : 'no-cache';
        res.setHeader('Cache-Control', cacheTime);
      }
    }
  }));
  
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Static Files] ✅ Serving build files for development SSR testing');
    console.log('[Static Files] Build path:', buildPath);
  }
} else if (process.env.NODE_ENV === 'production') {
  console.warn('[Static Files] ⚠️  WARNING: Build directory not found! Run "npm run build:client" first.');
} else {
  // Development mode without build - serve static assets from client/public
  const publicPath = path.join(__dirname, '../client/public');
  console.log('[Static Files] ℹ️  Development mode - serving assets from client/public');
  console.log('[Static Files] Public path:', publicPath);
  
  app.use(express.static(publicPath, {
    index: false, // Don't serve index.html automatically
    fallthrough: true
  }));
}

// API sitemap route (redirects to root-level sitemap)
app.get('/api/sitemap.xml', async (req, res) => {
  // Redirect to root-level sitemap or serve directly
  try {
    // Try to use the sitemap service first (reads from file if available)
    const sitemapService = require('./services/sitemapService');
    const sitemapPath = require('path').join(__dirname, 'public/sitemap.xml');
    const fs = require('fs');
    
    if (fs.existsSync(sitemapPath)) {
      const sitemap = await fs.promises.readFile(sitemapPath, 'utf8');
      res.header('Content-Type', 'application/xml; charset=utf-8');
      res.header('Cache-Control', 'public, max-age=3600');
      return res.send(sitemap);
    }
    
    // If file doesn't exist, try to generate (but handle DB errors gracefully)
    try {
      const { xml } = await sitemapService.generateSitemapXML();
      res.header('Content-Type', 'application/xml; charset=utf-8');
      res.header('Cache-Control', 'public, max-age=3600');
      return res.send(xml);
    } catch (dbError) {
      // If database is not connected, serve static sitemap only
      console.warn('⚠️  Database not available for sitemap generation, serving static routes only');
      return res.redirect('/sitemap.xml');
    }
  } catch (error) {
    console.error('Error serving /api/sitemap.xml:', error);
    // Fallback: redirect to root sitemap
    return res.redirect('/sitemap.xml');
  }
});

// Root-level sitemap route for better SEO discovery - MUST be before catch-all route
app.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = 'https://skyfalke.com';
    const currentDate = new Date().toISOString();
    
    const { getMarketingStaticRoutes } = require('./data/marketingStaticRoutes');
    const staticRoutes = getMarketingStaticRoutes();

    // Fetch dynamic content (with error handling for database connection issues)
    let blogs = [], jobs = [], products = [], caseStudies = [], courses = [], events = [], trainers = [];
    
    // Check if MongoDB is connected before querying
    const mongoose = require('mongoose');
    const isDbConnected = mongoose.connection.readyState === 1;
    
    if (isDbConnected) {
      try {
        [blogs, jobs, products, caseStudies, courses, events, trainers] = await Promise.all([
          require('./models/Blog').find({
            $and: [
              {
                $or: [
                  { status: 'published' },
                  { isPublished: true }
                ]
              },
              { slug: { $exists: true, $ne: null, $ne: '' } }
            ]
          }).select('slug updatedAt publishedAt status isPublished').sort({ updatedAt: -1 }).lean(),
          require('./models/Job').find({ status: 'active' }).select('slug updatedAt').sort({ updatedAt: -1 }).lean(),
          require('./models/Product').find({ isActive: true, slug: { $exists: true, $ne: null, $ne: '' } }).select('slug updatedAt').sort({ updatedAt: -1 }).lean(),
          require('./models/CaseStudy').find({ status: 'published', slug: { $exists: true, $ne: null, $ne: '' } }).select('slug updatedAt publishedAt').sort({ updatedAt: -1 }).lean(),
          require('./models/Course').find({ isActive: true, slug: { $exists: true, $ne: null, $ne: '' } }).select('slug updatedAt').sort({ updatedAt: -1 }).lean(),
          require('./models/Event').find({ status: 'published', slug: { $exists: true, $ne: null, $ne: '' } }).select('slug updatedAt publishedAt').sort({ updatedAt: -1 }).lean(),
          require('./models/Trainer').find({ isActive: true }).select('_id updatedAt').sort({ updatedAt: -1 }).lean()
        ]);
      } catch (dbError) {
        console.warn('⚠️  Database query failed for sitemap, serving static routes only:', dbError.message);
        // Continue with empty arrays - will only serve static routes
      }
    } else {
      console.warn('⚠️  Database not connected, serving static routes only in sitemap');
    }

    // Build XML sitemap
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`;

    // Add static routes
    staticRoutes.forEach(route => {
      sitemap += `
  <url>
    <loc>${baseUrl}${route.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
    });

    // Add blog posts (filter out any without slugs as a safety measure)
    blogs.filter(blog => blog.slug && blog.slug.trim() !== '').forEach(blog => {
      // Use publishedAt if available, otherwise updatedAt, otherwise currentDate
      const lastMod = blog.publishedAt 
        ? new Date(blog.publishedAt).toISOString() 
        : (blog.updatedAt ? new Date(blog.updatedAt).toISOString() : currentDate);
      sitemap += `
  <url>
    <loc>${baseUrl}/blog/${blog.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
    });

    // Add job listings
    jobs.forEach(job => {
      const updatedAt = job.updatedAt ? new Date(job.updatedAt).toISOString() : currentDate;
      sitemap += `
  <url>
    <loc>${baseUrl}/careers/${job.slug}</loc>
    <lastmod>${updatedAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`;
    });

    // Add products (filter out any without slugs as a safety measure)
    products.filter(p => p.slug && p.slug.trim() !== '').forEach(product => {
      const updatedAt = product.updatedAt ? new Date(product.updatedAt).toISOString() : currentDate;
      sitemap += `
  <url>
    <loc>${baseUrl}/shop/product/${product.slug}</loc>
    <lastmod>${updatedAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    // Add case studies (filter out any without slugs as a safety measure)
    caseStudies.filter(cs => cs.slug && cs.slug.trim() !== '').forEach(caseStudy => {
      // Use publishedAt if available, otherwise updatedAt, otherwise currentDate
      const lastMod = caseStudy.publishedAt 
        ? new Date(caseStudy.publishedAt).toISOString() 
        : (caseStudy.updatedAt ? new Date(caseStudy.updatedAt).toISOString() : currentDate);
      sitemap += `
  <url>
    <loc>${baseUrl}/how-we-work/case-studies/${caseStudy.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
    });

    // Add courses (filter out any without slugs as a safety measure)
    courses.filter(c => c.slug && c.slug.trim() !== '').forEach(course => {
      const updatedAt = course.updatedAt ? new Date(course.updatedAt).toISOString() : currentDate;
      sitemap += `
  <url>
    <loc>${baseUrl}/academy/courses/${course.slug}</loc>
    <lastmod>${updatedAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    // Add events (filter out any without slugs as a safety measure)
    events.filter(e => e.slug && e.slug.trim() !== '').forEach(event => {
      // Use publishedAt if available, otherwise updatedAt, otherwise currentDate
      const lastMod = event.publishedAt 
        ? new Date(event.publishedAt).toISOString() 
        : (event.updatedAt ? new Date(event.updatedAt).toISOString() : currentDate);
      sitemap += `
  <url>
    <loc>${baseUrl}/events/${event.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
    });

    // Add trainers
    trainers.forEach(trainer => {
      const updatedAt = trainer.updatedAt ? new Date(trainer.updatedAt).toISOString() : currentDate;
      sitemap += `
  <url>
    <loc>${baseUrl}/academy/trainers/${trainer._id}</loc>
    <lastmod>${updatedAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`;
    });

    sitemap += `
</urlset>`;

    // Set proper headers for XML
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.send(sitemap);

  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate sitemap' 
    });
  }
});

// Root-level robots.txt route - MUST be before catch-all route
app.get('/robots.txt', (req, res) => {
  const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://skyfalke.com/sitemap.xml

# Disallow admin and API routes
Disallow: /admin/
Disallow: /api/
Disallow: /admin/login
Disallow: /system/

# Crawl delay (optional)
Crawl-delay: 1`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
  res.send(robotsTxt);
});

// Block cPanel access
app.use('/cpanel', (req, res) => {
  res.status(403).json({ 
    error: 'Access denied',
    message: 'This resource is not available'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: require('./package.json').version,
    ssrEnabled: process.env.NODE_ENV === 'production'
  });
});

// Test SSR endpoint - returns the actual SSR HTML for debugging
app.get('/api/test-ssr', async (req, res) => {
  try {
    const { handleSSR } = require('./utils/ssrHandler');
    const testUrl = req.query.url || '/';
    console.log('[Test SSR] Testing SSR handler with URL:', testUrl);
    const ssrHTML = await handleSSR(testUrl);
    
    // Check for meta tags
    const hasTitle = ssrHTML ? ssrHTML.includes('<title>') : false;
    const hasOG = ssrHTML ? ssrHTML.includes('og:title') : false;
    const hasDesc = ssrHTML ? ssrHTML.includes('name="description"') : false;
    
    // Extract head section for preview
    const headMatch = ssrHTML ? ssrHTML.match(/<head>([\s\S]*?)<\/head>/i) : null;
    const headContent = headMatch ? headMatch[1] : 'No head section found';
    
    res.json({
      success: true,
      testUrl,
      hasSSRHTML: !!ssrHTML,
      htmlLength: ssrHTML ? ssrHTML.length : 0,
      metaTags: {
        title: hasTitle,
        ogTags: hasOG,
        description: hasDesc
      },
      headPreview: headContent.substring(0, 1500),
      fullHeadLength: headContent.length
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

// Test endpoint to get raw SSR HTML (for direct browser viewing)
app.get('/api/test-ssr-html', async (req, res) => {
  try {
    const { handleSSR } = require('./utils/ssrHandler');
    const testUrl = req.query.url || '/';
    console.log('[Test SSR HTML] Generating SSR HTML for URL:', testUrl);
    const ssrHTML = await handleSSR(testUrl);
    
    if (ssrHTML) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-store');
      res.setHeader('X-SSR-Test', 'true');
      res.end(ssrHTML, 'utf8');
    } else {
      res.status(500).send('SSR generation failed');
    }
  } catch (error) {
    res.status(500).send(`SSR Error: ${error.message}`);
  }
});

// WebSocket test endpoint
app.get('/api/ws-test', (req, res) => {
  const socketModule = require('./socket');
  const io = socketModule.getIO ? socketModule.getIO() : null;
  res.json({ 
    message: 'WebSocket server is available',
    socketInitialized: !!io,
    connectedClients: io ? io.sockets.sockets.size : 0
  });
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error('🚨 Express Error:', err.message);
  console.error('Stack:', err.stack);
  
  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  res.status(err.status || 500).json({
    message: isDevelopment ? err.message : 'Something went wrong!',
    ...(isDevelopment && { stack: err.stack }),
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    message: 'API endpoint not found',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// SSR Handler for dynamic content
const { handleSSR } = require('./utils/ssrHandler');

// Handle React routing with SSR for dynamic content
// SSR works in both development and production modes
console.log(`[SSR Setup] NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);

// SSR handler works in both development and production
// It will use build/index.html if available, otherwise falls back to public/index.html
const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
console.log(`[SSR Setup] ✅ SSR handler is ENABLED for ${mode} mode`);
console.log(`[SSR Setup] Build directory exists: ${buildExists ? 'Yes' : 'No (will use public/index.html as fallback)'}`);

// This must be AFTER static file middleware but handles all HTML routes
// Static middleware will handle files (JS, CSS, images), but NOT index.html
// IMPORTANT: Use app.use instead of app.get to catch ALL HTTP methods
// NOTE: SSR will work even without build directory (uses public/index.html as fallback)
app.use('*', async (req, res, next) => {
    // Skip API routes first
    if (req.path.startsWith('/api/')) {
      return next();
    }
    
    // IMPORTANT: Log ALL non-API requests to see what's reaching the SSR handler
    // This will help us see if blog routes are reaching the handler
    if (!req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|webp|avif|json|xml|txt|map)$/i) &&
        !req.path.startsWith('/static/') &&
        !req.path.startsWith('/images/') &&
        !req.path.startsWith('/font/') &&
        !req.path.match(/^\/favicon/)) {
      console.log('[SSR Route Handler] ========================================');
      console.log('[SSR Route Handler] Request received:', req.method, req.path);
      console.log('[SSR Route Handler] Full URL:', req.url);
      console.log('[SSR Route Handler] Is blog route?', req.path.startsWith('/blog/'));
    }
    
    // Skip static file requests - these should be handled by static middleware
    // If we reach here, the static middleware didn't find the file, so return 404
    // Check for file extensions and common static paths
    if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|webp|avif|json|xml|txt|map)$/i) ||
        req.path.startsWith('/static/') ||
        req.path.startsWith('/images/') ||
        req.path.startsWith('/font/') ||
        req.path.match(/^\/favicon/)) {
      // Static middleware should have handled this, but if we're here, file doesn't exist
      console.log('[SSR Route Handler] Static file not found (404):', req.path);
      return res.status(404).send('File not found');
    }
    
    // Only process GET requests for SSR (not POST, PUT, etc.)
    if (req.method !== 'GET') {
      return next();
    }
    
    try {
      // Log all requests for debugging (especially blog routes)
      console.log('[SSR Route Handler] ========================================');
      console.log('[SSR Route Handler] Processing request for:', req.url);
      console.log('[SSR Route Handler] Request path:', req.path);
      console.log('[SSR Route Handler] Request method:', req.method);
      console.log('[SSR Route Handler] Is blog route?', req.path.startsWith('/blog/'));
      
      // Try SSR first for dynamic routes
      // Pass res for streaming support (blog posts use renderToPipeableStream)
      const ssrHTML = await handleSSR(req.url, res);
      
      // Check if streaming was used (blog posts)
      if (ssrHTML === 'STREAMED') {
        if (process.env.NODE_ENV !== 'production') {
          console.log('[SSR Route Handler] ✅ SSR streamed using renderToPipeableStream');
        }
        return; // Response already sent via stream
      }
      
      if (ssrHTML) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('[SSR Route Handler] ✅ SSR HTML generated, sending response');
          // Verify meta tags are in the HTML before sending
          const hasTitle = ssrHTML.includes('<title>') && ssrHTML.match(/<title>[\s\S]*?<\/title>/);
          const hasOG = ssrHTML.includes('og:title') || ssrHTML.includes('property="og:');
          console.log('[SSR Route Handler] Pre-send verification - Title:', hasTitle ? '✅' : '❌', 'OG:', hasOG ? '✅' : '❌');
        }
        // Send SSR-rendered HTML with cache-busting headers
        // IMPORTANT: Use res.end() instead of res.send() to ensure HTML is sent exactly as generated
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        // Critical: Set headers to prevent caching for social media crawlers
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Last-Modified', new Date().toUTCString());
        res.setHeader('ETag', `"${Date.now()}"`); // Unique ETag to prevent caching
        res.setHeader('X-SSR-Enabled', 'true'); // Custom header to verify SSR
        // Important for social media crawlers: Vary header to ensure fresh content
        res.setHeader('Vary', 'Accept, User-Agent');
        
        // Final verification before sending
        const titleCheck = ssrHTML.includes('<title>') && ssrHTML.match(/<title>[\s\S]*?<\/title>/);
        const ogCheck = ssrHTML.includes('og:title') || ssrHTML.includes('property="og:');
        
        if (!titleCheck || !ogCheck) {
          console.error('[SSR Route Handler] ❌ CRITICAL: Meta tags missing from HTML!');
          console.error('[SSR Route Handler] Title present:', titleCheck, 'OG present:', ogCheck);
        } else {
          console.log('[SSR Route Handler] ✅ Final verification passed - Meta tags confirmed in HTML');
        }
        
        // Use res.end() to send HTML directly without any Express modifications
        res.end(ssrHTML, 'utf8');
        console.log('[SSR Route Handler] ✅ HTML sent via res.end(), length:', ssrHTML.length);
        return; // Important: return to prevent further processing
      } else {
        // SSR returned null - this should not happen for default routes
        // But if it does, we still need to inject meta tags
        console.warn('[SSR Route Handler] SSR returned null, but we should have meta tags. Generating fallback...');
        
        // Generate meta tags for this route even if SSR returned null
        const { generateMetaTags } = require('./utils/ssrHandler');
        const { getHTMLTemplate } = require('./utils/ssrHandler');
        const { injectSSRData } = require('./utils/ssrHandler');
        
        try {
          const html = await getHTMLTemplate();
          if (html) {
            const metaTags = generateMetaTags({ path: req.path }, 'default');
            if (metaTags) {
              const finalHTML = injectSSRData(html, { path: req.path }, metaTags);
              if (finalHTML) {
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
                res.send(finalHTML);
                return;
              }
            }
          }
        } catch (fallbackError) {
          console.error('[SSR Route Handler] Fallback meta tag injection failed:', fallbackError);
        }
        
        // Final fallback - serve static file (should not reach here)
        if (process.env.NODE_ENV !== 'production') {
          console.log('[SSR Route Handler] Serving static index.html as final fallback for:', req.path);
        }
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        // Try build directory first, then public directory
        const buildIndexPath = path.join(buildPath, 'index.html');
        const publicIndexPath = path.join(__dirname, '../client/public/index.html');
        const indexPath = buildExists ? buildIndexPath : publicIndexPath;
        
        res.sendFile(indexPath, (err) => {
          if (err) {
            console.error('[SSR Route Handler] Error sending index.html:', err);
            res.status(500).send('Internal Server Error');
          }
        });
        return; // Important: return to prevent further processing
      }
    } catch (error) {
      console.error('[SSR Route Handler] Error:', error);
      console.error('[SSR Route Handler] Stack:', error.stack);
      // Fall back to static file serving on error
      try {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.sendFile(path.join(buildPath, 'index.html'), (err) => {
          if (err) {
            console.error('[SSR Route Handler] Error sending index.html after error:', err);
            res.status(500).send('Internal Server Error');
          }
        });
      } catch (sendError) {
        console.error('[SSR Route Handler] Critical error:', sendError);
        res.status(500).send('Internal Server Error');
      }
    }
  });

const PORT = process.env.PORT || 5000;

// Trust proxy for rate limiting to work properly
app.set('trust proxy', 1);

server.listen(PORT, (err) => {
  if (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
  
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔌 WebSocket test: http://localhost:${PORT}/api/ws-test`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
});

// Handle server errors
server.on('error', (err) => {
  console.error('🚨 Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    process.exit(1);
  }
});
