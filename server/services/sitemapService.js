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
const { getMarketingStaticRoutes } = require('../data/marketingStaticRoutes');

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

      const staticRoutes = getMarketingStaticRoutes();

      console.log('📋 Fetching dynamic content for sitemap...');

      // Fetch dynamic content
      // For blogs: include both status: 'published' OR isPublished: true, and ensure slug exists
      const [blogs, jobs, products, caseStudies, courses, events, trainers] = await Promise.all([
        Blog.find({
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
        Product.find({ isActive: true, slug: { $exists: true, $ne: null, $ne: '' } }).select('slug updatedAt').sort({ updatedAt: -1 }).lean(),
        CaseStudy.find({ status: 'published', slug: { $exists: true, $ne: null, $ne: '' } }).select('slug updatedAt publishedAt').sort({ updatedAt: -1 }).lean(),
        Course.find({ isActive: true, slug: { $exists: true, $ne: null, $ne: '' } }).select('slug updatedAt').sort({ updatedAt: -1 }).lean(),
        Event.find({ status: 'published', slug: { $exists: true, $ne: null, $ne: '' } }).select('slug updatedAt publishedAt').sort({ updatedAt: -1 }).lean(),
        Trainer.find({ isActive: true }).select('_id updatedAt').sort({ updatedAt: -1 }).lean()
      ]);

      console.log(`✅ Found ${blogs.length} blogs, ${jobs.length} jobs, ${products.length} products, ${caseStudies.length} case studies, ${courses.length} courses, ${events.length} events, ${trainers.length} trainers`);
      
      // Debug: Log blog details
      if (blogs.length > 0) {
        console.log(`📋 Sample blogs for sitemap:`, blogs.slice(0, 5).map(b => ({ 
          slug: b.slug, 
          status: b.status, 
          isPublished: b.isPublished,
          hasUpdatedAt: !!b.updatedAt 
        })));
      } else {
        console.log('⚠️  No blogs found - checking query...');
        // Try to see what blogs exist
        const allBlogs = await Blog.find({}).countDocuments();
        const publishedByStatus = await Blog.find({ status: 'published' }).countDocuments();
        const publishedByFlag = await Blog.find({ isPublished: true }).countDocuments();
        const withSlugs = await Blog.find({ slug: { $exists: true, $ne: null, $ne: '' } }).countDocuments();
        console.log(`   Total blogs in DB: ${allBlogs}`);
        console.log(`   Blogs with status='published': ${publishedByStatus}`);
        console.log(`   Blogs with isPublished=true: ${publishedByFlag}`);
        console.log(`   Blogs with slugs: ${withSlugs}`);
      }
      
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

      // Add blog posts (filter out any without slugs as a safety measure)
      blogs.filter(blog => blog.slug && blog.slug.trim() !== '').forEach(blog => {
        // Use publishedAt if available, otherwise updatedAt, otherwise currentDate
        const lastMod = blog.publishedAt 
          ? new Date(blog.publishedAt).toISOString() 
          : (blog.updatedAt ? new Date(blog.updatedAt).toISOString() : currentDate);
        
        sitemap += `
  <url>
    <loc>${this.baseUrl}/blog/${blog.slug}</loc>
    <lastmod>${lastMod}</lastmod>
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

      // Add products (filter out any without slugs as a safety measure)
      products.filter(p => p.slug && p.slug.trim() !== '').forEach(product => {
        sitemap += `
  <url>
    <loc>${this.baseUrl}/shop/product/${product.slug}</loc>
    <lastmod>${product.updatedAt ? new Date(product.updatedAt).toISOString() : currentDate}</lastmod>
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
    <loc>${this.baseUrl}/how-we-work/case-studies/${caseStudy.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
      });

      // Add courses (filter out any without slugs as a safety measure)
      courses.filter(c => c.slug && c.slug.trim() !== '').forEach(course => {
        sitemap += `
  <url>
    <loc>${this.baseUrl}/academy/courses/${course.slug}</loc>
    <lastmod>${course.updatedAt ? new Date(course.updatedAt).toISOString() : currentDate}</lastmod>
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
    <loc>${this.baseUrl}/events/${event.slug}</loc>
    <lastmod>${lastMod}</lastmod>
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

