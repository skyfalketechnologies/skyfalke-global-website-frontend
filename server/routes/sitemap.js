const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const sitemapService = require('../services/sitemapService');
const fs = require('fs');
const path = require('path');

// Generate sitemap XML (API route)
router.get('/sitemap.xml', async (req, res) => {
  try {
    // Check if client wants to bypass cache
    const noCache = req.query.t || req.headers['cache-control'] === 'no-cache';
    
    // Try to read from file first (faster)
    const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
    if (fs.existsSync(sitemapPath)) {
      // Read file fresh (not from any internal cache)
      const sitemap = await fs.promises.readFile(sitemapPath, 'utf8');
      res.header('Content-Type', 'application/xml');
      
      // Set cache headers based on request
      if (noCache) {
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.header('Expires', '0');
      } else {
        res.header('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
      }
      
      // Set last-modified header based on file stats
      try {
        const stats = await fs.promises.stat(sitemapPath);
        res.header('Last-Modified', stats.mtime.toUTCString());
      } catch (statError) {
        // Ignore stat errors
      }
      
      return res.send(sitemap);
    }

    // If file doesn't exist, generate on-the-fly
    const { xml } = await sitemapService.generateSitemapXML();
    res.header('Content-Type', 'application/xml');
    res.header('Cache-Control', noCache ? 'no-cache, no-store, must-revalidate' : 'public, max-age=3600');
    res.send(xml);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate sitemap' 
    });
  }
});

// Generate robots.txt
router.get('/robots.txt', async (req, res) => {
  try {
    // Try to read from file first
    const robotsPath = path.join(__dirname, '../public/robots.txt');
    if (fs.existsSync(robotsPath)) {
      const robotsTxt = await fs.promises.readFile(robotsPath, 'utf8');
      res.header('Content-Type', 'text/plain');
      res.header('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
      return res.send(robotsTxt);
    }

    // If file doesn't exist, generate on-the-fly
    await sitemapService.updateRobotsTxt();
    const robotsTxt = await fs.promises.readFile(robotsPath, 'utf8');
    res.header('Content-Type', 'text/plain');
    res.header('Cache-Control', 'public, max-age=86400');
    res.send(robotsTxt);
  } catch (error) {
    console.error('Error serving robots.txt:', error);
    // Fallback
  const robotsTxt = `User-agent: *
Allow: /
Sitemap: https://skyfalke.com/sitemap.xml
Disallow: /admin/
Disallow: /api/`;
  res.header('Content-Type', 'text/plain');
  res.send(robotsTxt);
  }
});

// Generate sitemap manually (admin endpoint) - with search engine pinging
router.post('/generate-sitemap', adminAuth, async (req, res) => {
  try {
    const result = await sitemapService.generateAndUpdate();

    res.json({
      success: true,
      message: 'Sitemap generated and updated successfully',
      data: result.stats,
      pingResults: result.pingResults
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate sitemap'
    });
  }
});

// Generate llms.txt
router.get('/llms.txt', (req, res) => {
  try {
    // Try to read the generated llms.txt file
    const llmsPath = path.join(__dirname, '../../client/public/llms.txt');
    
    if (fs.existsSync(llmsPath)) {
      const content = fs.readFileSync(llmsPath, 'utf8');
      
      // Set proper headers
      res.header('Content-Type', 'text/plain; charset=utf-8');
      res.header('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
      res.header('X-Robots-Tag', 'index, follow');
      
      res.send(content);
    } else {
      // Fallback: serve a basic llms.txt if file doesn't exist
      const fallbackContent = `# Skyfalke
> Leading digital marketing & technology solutions partner in Africa.

## Core Documentation
- [Home](/): Company overview and services
- [About](/about): Company information
- [Services](/services): Digital marketing solutions
- [Contact](/contact): Get in touch

## Contact
- Email: info@skyfalke.com
- Last Updated: ${new Date().toISOString().split('T')[0]}
`;

      res.header('Content-Type', 'text/plain; charset=utf-8');
      res.header('Cache-Control', 'public, max-age=3600');
      res.send(fallbackContent);
    }
  } catch (error) {
    console.error('Error serving llms.txt:', error);
    res.status(500).send('Error loading llms.txt');
  }
});

// Root-level sitemap route (for better SEO discovery)
router.get('/', (req, res) => {
  res.redirect('/sitemap.xml');
});

module.exports = router;
