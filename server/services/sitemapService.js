const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const http = require('http');

// Import models
const Blog = require('../models/Blog');
const Job = require('../models/Job');
const Product = require('../models/Product');
const CaseStudy = require('../models/CaseStudy');
const Course = require('../models/Course');
const Event = require('../models/Event');
const Trainer = require('../models/Trainer');

class SitemapService {
  constructor() {
    this.baseUrl = process.env.BASE_URL || 'https://skyfalke.com';
    this.sitemapPath = path.join(__dirname, '../public/sitemap.xml');
    this.robotsPath = path.join(__dirname, '../public/robots.txt');
  }

  /**
   * Generate sitemap XML content
   */
  async generateSitemapXML() {
    try {
      const currentDate = new Date().toISOString();

      // Static routes
      const staticRoutes = [
        { url: '', priority: '1.0', changefreq: 'daily' },
        { url: '/about', priority: '0.8', changefreq: 'monthly' },
        { url: '/services', priority: '0.8', changefreq: 'monthly' },
        { url: '/cloud', priority: '0.8', changefreq: 'monthly' },
        { url: '/contact', priority: '0.7', changefreq: 'monthly' },
        { url: '/careers', priority: '0.7', changefreq: 'weekly' },
        { url: '/shop', priority: '0.8', changefreq: 'daily' },
        { url: '/case-studies', priority: '0.8', changefreq: 'weekly' },
        { url: '/blog', priority: '0.8', changefreq: 'weekly' },
        { url: '/support', priority: '0.6', changefreq: 'monthly' },
        { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
        { url: '/terms', priority: '0.3', changefreq: 'yearly' },
        { url: '/partners', priority: '0.6', changefreq: 'monthly' },
        { url: '/events', priority: '0.7', changefreq: 'weekly' },
        { url: '/academy', priority: '0.8', changefreq: 'weekly' },
        { url: '/schedule-consultation', priority: '0.7', changefreq: 'monthly' },
        // Solution pages
        { url: '/services/data-analytics', priority: '0.7', changefreq: 'monthly' },
        { url: '/services/earned-media', priority: '0.7', changefreq: 'monthly' },
        { url: '/services/paid-media', priority: '0.7', changefreq: 'monthly' },
        { url: '/services/creative', priority: '0.7', changefreq: 'monthly' },
        { url: '/services/business-tools', priority: '0.7', changefreq: 'monthly' },
        // Data Analytics sub-pages
        { url: '/services/data-analytics/business-intelligence', priority: '0.6', changefreq: 'monthly' },
        { url: '/services/data-analytics/data-analytics', priority: '0.6', changefreq: 'monthly' },
        { url: '/services/data-analytics/predictive-analytics', priority: '0.6', changefreq: 'monthly' },
        { url: '/services/data-analytics/performance-tracking', priority: '0.6', changefreq: 'monthly' },
        { url: '/services/data-analytics/custom-dashboards', priority: '0.6', changefreq: 'monthly' },
        // Earned Media sub-pages
        { url: '/services/earned-media/public-relations', priority: '0.6', changefreq: 'monthly' },
        { url: '/services/earned-media/influencer-marketing', priority: '0.6', changefreq: 'monthly' },
        { url: '/services/earned-media/content-marketing', priority: '0.6', changefreq: 'monthly' },
        { url: '/services/earned-media/social-media-management', priority: '0.6', changefreq: 'monthly' },
        { url: '/services/earned-media/brand-awareness', priority: '0.6', changefreq: 'monthly' },
        // Paid Media sub-pages
        { url: '/services/paid-media/google-ads', priority: '0.6', changefreq: 'monthly' },
        { url: '/services/paid-media/social-media-ads', priority: '0.6', changefreq: 'monthly' },
        { url: '/services/paid-media/display-advertising', priority: '0.6', changefreq: 'monthly' },
        { url: '/services/paid-media/video-advertising', priority: '0.6', changefreq: 'monthly' },
        { url: '/services/paid-media/retargeting-campaigns', priority: '0.6', changefreq: 'monthly' },
        // Creative sub-pages
        { url: '/services/creative/brand-design', priority: '0.6', changefreq: 'monthly' },
        { url: '/services/creative/ui-ux-design', priority: '0.6', changefreq: 'monthly' },
        { url: '/services/creative/graphic-design', priority: '0.6', changefreq: 'monthly' },
        { url: '/services/creative/video-production', priority: '0.6', changefreq: 'monthly' },
        { url: '/services/creative/content-creation', priority: '0.6', changefreq: 'monthly' },
        // Business Tools sub-pages
        { url: '/services/business-tools/seo-tools-analytics', priority: '0.6', changefreq: 'monthly' },
        { url: '/services/business-tools/process-automation', priority: '0.6', changefreq: 'monthly' },
        { url: '/services/business-tools/custom-applications', priority: '0.6', changefreq: 'monthly' },
        { url: '/services/business-tools/business-intelligence', priority: '0.6', changefreq: 'monthly' },
        { url: '/services/business-tools/performance-optimization', priority: '0.6', changefreq: 'monthly' }
      ];

      console.log('📋 Fetching dynamic content for sitemap...');

      // Fetch dynamic content
      const [blogs, jobs, products, caseStudies, courses, events, trainers] = await Promise.all([
        Blog.find({ status: 'published' }).select('slug updatedAt').sort({ updatedAt: -1 }).lean(),
        Job.find({ 
          $and: [
            {
              $or: [
                { isActive: true },
                { isActive: { $exists: false } }
              ]
            },
            {
              $or: [
                { deadline: { $exists: false } },
                { deadline: null },
                { deadline: { $gte: new Date() } }
              ]
            }
          ]
        }).select('_id slug updatedAt deadline').sort({ updatedAt: -1 }).lean(),
        Product.find({ isActive: true }).select('slug updatedAt').sort({ updatedAt: -1 }).lean(),
        CaseStudy.find({ status: 'published' }).select('slug updatedAt').sort({ updatedAt: -1 }).lean(),
        Course.find({ isActive: true }).select('slug updatedAt').sort({ updatedAt: -1 }).lean(),
        Event.find({ status: 'published' }).select('slug updatedAt').sort({ updatedAt: -1 }).lean(),
        Trainer.find({ isActive: true }).select('_id updatedAt').sort({ updatedAt: -1 }).lean()
      ]);

      console.log(`✅ Found ${blogs.length} blogs, ${jobs.length} jobs, ${products.length} products, ${caseStudies.length} case studies, ${courses.length} courses, ${events.length} events, ${trainers.length} trainers`);
      
      // Debug: Log job details if found
      if (jobs.length > 0) {
        console.log(`📋 Sample jobs for sitemap:`, jobs.slice(0, 3).map(j => ({ id: j._id, slug: j.slug, hasDeadline: !!j.deadline })));
      } else {
        console.log('⚠️  No jobs found - checking query...');
        // Try a simpler query to see if any jobs exist
        const allJobs = await Job.find({}).countDocuments();
        const activeJobs = await Job.find({ isActive: true }).countDocuments();
        console.log(`   Total jobs in DB: ${allJobs}, Active jobs: ${activeJobs}`);
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
    <loc>${this.baseUrl}${route.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
      });

      // Add blog posts
      blogs.forEach(blog => {
        sitemap += `
  <url>
    <loc>${this.baseUrl}/blog/${blog.slug}</loc>
    <lastmod>${blog.updatedAt ? new Date(blog.updatedAt).toISOString() : currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
      });

      // Add job listings
      if (jobs && jobs.length > 0) {
        jobs.forEach(job => {
          // Use slug if available, otherwise use ID
          const jobIdentifier = job.slug || (job._id ? job._id.toString() : job._id);
          const lastMod = job.updatedAt ? new Date(job.updatedAt).toISOString() : currentDate;
          sitemap += `
  <url>
    <loc>${this.baseUrl}/careers/${jobIdentifier}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
        });
      } else {
        console.log('⚠️  No active jobs found for sitemap');
      }

      // Add products
      products.forEach(product => {
        sitemap += `
  <url>
    <loc>${this.baseUrl}/shop/product/${product.slug}</loc>
    <lastmod>${product.updatedAt ? new Date(product.updatedAt).toISOString() : currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
      });

      // Add case studies
      caseStudies.forEach(caseStudy => {
        sitemap += `
  <url>
    <loc>${this.baseUrl}/case-studies/${caseStudy.slug}</loc>
    <lastmod>${caseStudy.updatedAt ? new Date(caseStudy.updatedAt).toISOString() : currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
      });

      // Add courses
      courses.forEach(course => {
        sitemap += `
  <url>
    <loc>${this.baseUrl}/academy/courses/${course.slug}</loc>
    <lastmod>${course.updatedAt ? new Date(course.updatedAt).toISOString() : currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
      });

      // Add events
      events.forEach(event => {
        sitemap += `
  <url>
    <loc>${this.baseUrl}/events/${event.slug}</loc>
    <lastmod>${event.updatedAt ? new Date(event.updatedAt).toISOString() : currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
      });

      // Add trainers
      trainers.forEach(trainer => {
        sitemap += `
  <url>
    <loc>${this.baseUrl}/academy/trainers/${trainer._id}</loc>
    <lastmod>${trainer.updatedAt ? new Date(trainer.updatedAt).toISOString() : currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`;
      });

      sitemap += `
</urlset>`;

      const totalUrls = staticRoutes.length + blogs.length + jobs.length + products.length + 
                       caseStudies.length + courses.length + events.length + trainers.length;

      return {
        xml: sitemap,
        stats: {
          totalUrls,
          staticRoutes: staticRoutes.length,
          blogs: blogs.length,
          jobs: jobs.length,
          products: products.length,
          caseStudies: caseStudies.length,
          courses: courses.length,
          events: events.length,
          trainers: trainers.length
        }
      };
    } catch (error) {
      console.error('❌ Error generating sitemap XML:', error);
      throw error;
    }
  }

  /**
   * Save sitemap to file
   */
  async saveSitemapToFile(sitemapXML) {
    try {
      // Ensure public directory exists
      const publicDir = path.dirname(this.sitemapPath);
      try {
        await fs.access(publicDir);
      } catch {
        await fs.mkdir(publicDir, { recursive: true });
      }

      // Write sitemap file
      await fs.writeFile(this.sitemapPath, sitemapXML, 'utf8');
      console.log(`✅ Sitemap saved to ${this.sitemapPath}`);

      return true;
    } catch (error) {
      console.error('❌ Error saving sitemap to file:', error);
      throw error;
    }
  }

  /**
   * Generate and update robots.txt
   */
  async updateRobotsTxt() {
    try {
      const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${this.baseUrl}/sitemap.xml
Sitemap: ${this.baseUrl}/api/sitemap.xml

# Disallow admin and API routes
Disallow: /admin/
Disallow: /api/
Disallow: /admin/login
Disallow: /system/

# Allow important API endpoints for SEO
Allow: /api/sitemap.xml
Allow: /api/robots.txt

# Crawl delay (optional)
Crawl-delay: 1`;

      // Ensure public directory exists
      const publicDir = path.dirname(this.robotsPath);
      try {
        await fs.access(publicDir);
      } catch {
        await fs.mkdir(publicDir, { recursive: true });
      }

      await fs.writeFile(this.robotsPath, robotsTxt, 'utf8');
      console.log(`✅ Robots.txt updated at ${this.robotsPath}`);

      return true;
    } catch (error) {
      console.error('❌ Error updating robots.txt:', error);
      throw error;
    }
  }

  /**
   * Ping search engines about sitemap update
   */
  async pingSearchEngines() {
    const sitemapUrl = encodeURIComponent(`${this.baseUrl}/sitemap.xml`);
    const pingUrls = [
      `https://www.google.com/ping?sitemap=${sitemapUrl}`,
      `https://www.bing.com/ping?sitemap=${sitemapUrl}`,
      `https://www.yandex.com/ping?sitemap=${sitemapUrl}`
    ];

    const results = [];

    for (const pingUrl of pingUrls) {
      try {
        const result = await this.pingUrl(pingUrl);
        results.push({ url: pingUrl, success: result, error: null });
        if (result) {
          console.log(`✅ Successfully pinged: ${pingUrl}`);
        } else {
          console.log(`⚠️  Failed to ping: ${pingUrl}`);
        }
      } catch (error) {
        console.error(`❌ Error pinging ${pingUrl}:`, error.message);
        results.push({ url: pingUrl, success: false, error: error.message });
      }
    }

    return results;
  }

  /**
   * Ping a single URL
   */
  pingUrl(url) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const client = urlObj.protocol === 'https:' ? https : http;

      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        timeout: 10000,
        headers: {
          'User-Agent': 'Skyfalke-Sitemap-Bot/1.0'
        }
      };

      const req = client.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          // Consider 200-299 as success
          resolve(res.statusCode >= 200 && res.statusCode < 300);
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.end();
    });
  }

  /**
   * Generate sitemap, save to file, and ping search engines
   */
  async generateAndUpdate() {
    try {
      console.log('🚀 Starting sitemap generation...');

      // Generate sitemap XML
      const { xml, stats } = await this.generateSitemapXML();

      // Save to file
      await this.saveSitemapToFile(xml);

      // Update robots.txt
      await this.updateRobotsTxt();

      console.log(`📊 Sitemap statistics:`, stats);

      // Ping search engines
      console.log('🔔 Pinging search engines...');
      const pingResults = await this.pingSearchEngines();

      const successCount = pingResults.filter(r => r.success).length;
      console.log(`✅ Successfully pinged ${successCount}/${pingResults.length} search engines`);

      return {
        success: true,
        stats,
        pingResults,
        message: 'Sitemap generated and updated successfully'
      };
    } catch (error) {
      console.error('❌ Error in generateAndUpdate:', error);
      throw error;
    }
  }
}

module.exports = new SitemapService();

