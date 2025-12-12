#!/usr/bin/env node

/**
 * Auto-generate llms.txt from sitemap and curated content
 * This script creates a machine and human-readable llms.txt file
 * that guides LLMs to high-value content on the Skyfalke website
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Configuration
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://skyfalke.com' 
  : 'http://localhost:5000';

const OUTPUT_PATH = path.join(__dirname, '../../client/public/llms.txt');

// High-priority pages for LLM guidance
const HIGH_PRIORITY_PAGES = {
  // Core pages
  '/': 'Homepage with company overview and key services',
  '/about': 'Company background, mission, and team information',
  '/services': 'Comprehensive digital marketing and technology solutions',
  '/cloud': 'Sustainable hosting and cloud infrastructure services',
  '/contact': 'Get in touch for consultations and support',
  
  // High-value content
  '/blog': 'Latest insights on digital marketing, technology trends, and industry best practices',
  '/case-studies': 'Real-world success stories and client transformations',
  '/careers': 'Join our team of digital marketing and technology experts',
  '/partners': 'Strategic partnerships and technology integrations',
  '/events': 'Industry events, webinars, and networking opportunities',
  '/support': 'Technical support and customer service resources',
  '/schedule-consultation': 'Book a consultation with our experts',
  '/shop': 'Digital products and business tools',
  
  // Service solutions
  '/services/data-analytics': 'Data analytics and business intelligence solutions',
  '/services/earned-media': 'Public relations and content marketing services',
  '/services/paid-media': 'Digital advertising and paid media campaigns',
  '/services/creative': 'Creative design and content production services',
  '/services/business-tools': 'AI-powered business automation and tools',
  
  // Legal
  '/privacy': 'Data protection and privacy practices',
  '/terms': 'Terms and conditions for service usage'
};

// Service sub-pages with descriptions
const SERVICE_PAGES = {
  // Data Analytics
  '/services/data-analytics/business-intelligence': 'Transform data into actionable insights',
  '/services/data-analytics/data-analytics': 'Comprehensive data analysis and reporting',
  '/services/data-analytics/predictive-analytics': 'AI-powered forecasting and trend analysis',
  '/services/data-analytics/performance-tracking': 'Real-time monitoring and optimization',
  '/services/data-analytics/custom-dashboards': 'Tailored analytics interfaces',
  
  // Earned Media
  '/services/earned-media/public-relations': 'Strategic PR and media relations',
  '/services/earned-media/influencer-marketing': 'Authentic brand partnerships',
  '/services/earned-media/content-marketing': 'Strategic content creation and distribution',
  '/services/earned-media/social-media-management': 'Comprehensive social media strategies',
  '/services/earned-media/brand-awareness': 'Building and maintaining brand recognition',
  
  // Paid Media
  '/services/paid-media/google-ads': 'Search and display advertising optimization',
  '/services/paid-media/social-media-ads': 'Targeted social media advertising campaigns',
  '/services/paid-media/display-advertising': 'Visual advertising across digital platforms',
  '/services/paid-media/video-advertising': 'Engaging video marketing campaigns',
  '/services/paid-media/retargeting-campaigns': 'Re-engage website visitors',
  
  // Creative Services
  '/services/creative/brand-design': 'Complete brand identity and visual systems',
  '/services/creative/ui-ux-design': 'User-centered design for digital products',
  '/services/creative/graphic-design': 'Visual communication and marketing materials',
  '/services/creative/video-production': 'Professional video content creation',
  '/services/creative/content-creation': 'Multi-format content development',
  
  // Business Tools
  '/services/business-tools/seo-tools-analytics': 'Search engine optimization and performance tracking',
  '/services/business-tools/process-automation': 'Streamline business operations with AI',
  '/services/business-tools/custom-applications': 'Tailored software solutions',
  '/services/business-tools/business-intelligence': 'Data-driven decision making tools',
  '/services/business-tools/performance-optimization': 'System and process improvements'
};

/**
 * Fetch dynamic content from the API
 */
async function fetchDynamicContent() {
  try {
    console.log('Fetching dynamic content...');
    
    // Fetch recent blog posts (limit to 10 most recent)
    const blogResponse = await axios.get(`${BASE_URL}/api/blogs?limit=10&status=published`);
    const blogs = blogResponse.data.blogs || [];
    
    // Fetch recent case studies (limit to 5 most recent)
    const caseStudiesResponse = await axios.get(`${BASE_URL}/api/case-studies?limit=5&status=published`);
    const caseStudies = caseStudiesResponse.data.caseStudies || [];
    
    // Fetch active job listings (limit to 5 most recent)
    const jobsResponse = await axios.get(`${BASE_URL}/api/jobs?limit=5&status=active`);
    const jobs = jobsResponse.data.jobs || [];
    
    return { blogs, caseStudies, jobs };
  } catch (error) {
    console.warn('Warning: Could not fetch dynamic content:', error.message);
    return { blogs: [], caseStudies: [], jobs: [] };
  }
}

/**
 * Generate the llms.txt content
 */
async function generateLLMSTxt() {
  console.log('Generating llms.txt...');
  
  const dynamicContent = await fetchDynamicContent();
  const currentDate = new Date().toISOString().split('T')[0];
  
  let content = `# Skyfalke
> Leading digital marketing & technology solutions partner in Africa. Sustainable cloud hosting, AI-powered business tools, creative services & data analytics.

## Core Documentation
`;

  // Add core documentation
  const corePages = ['/', '/about', '/services', '/cloud', '/contact'];
  corePages.forEach(page => {
    if (HIGH_PRIORITY_PAGES[page]) {
      content += `- [${getPageTitle(page)}](${page}): ${HIGH_PRIORITY_PAGES[page]}\n`;
    }
  });

  content += `\n## High-Value Pages\n`;

  // Add high-value pages
  const highValuePages = ['/blog', '/case-studies', '/careers', '/partners', '/events', '/support', '/schedule-consultation', '/shop'];
  highValuePages.forEach(page => {
    if (HIGH_PRIORITY_PAGES[page]) {
      content += `- [${getPageTitle(page)}](${page}): ${HIGH_PRIORITY_PAGES[page]}\n`;
    }
  });

  // Add recent blog posts
  if (dynamicContent.blogs.length > 0) {
    content += `\n## Recent Blog Posts\n`;
    dynamicContent.blogs.slice(0, 5).forEach(blog => {
      const title = blog.title || 'Blog Post';
      const excerpt = blog.excerpt || 'Latest insights and industry updates';
      content += `- [${title}](/blog/${blog.slug}): ${excerpt}\n`;
    });
  }

  // Add recent case studies
  if (dynamicContent.caseStudies.length > 0) {
    content += `\n## Recent Case Studies\n`;
    dynamicContent.caseStudies.slice(0, 3).forEach(caseStudy => {
      const title = caseStudy.title || 'Case Study';
      const description = caseStudy.description || 'Real-world success story';
      content += `- [${title}](/case-studies/${caseStudy.slug}): ${description}\n`;
    });
  }

  // Add service solutions
  content += `\n## Service Solutions\n`;
  
  const serviceCategories = {
    'Data Analytics': Object.keys(SERVICE_PAGES).filter(path => path.includes('/data-analytics/')),
    'Earned Media': Object.keys(SERVICE_PAGES).filter(path => path.includes('/earned-media/')),
    'Paid Media': Object.keys(SERVICE_PAGES).filter(path => path.includes('/paid-media/')),
    'Creative Services': Object.keys(SERVICE_PAGES).filter(path => path.includes('/creative/')),
    'Business Tools': Object.keys(SERVICE_PAGES).filter(path => path.includes('/business-tools/'))
  };

  Object.entries(serviceCategories).forEach(([category, pages]) => {
    if (pages.length > 0) {
      content += `### ${category}\n`;
      pages.forEach(page => {
        const title = getPageTitle(page);
        const description = SERVICE_PAGES[page];
        content += `- [${title}](${page}): ${description}\n`;
      });
      content += '\n';
    }
  });

  // Add useful endpoints
  content += `## Useful Endpoints & Formats
- Sitemap: /sitemap.xml
- API Documentation: /api/docs (authentication required)
- Blog RSS: /blog/rss
- Job Listings: /careers
- Product Catalog: /shop
- Consultation Booking: /schedule-consultation

## Legal & Policy
- [Privacy Policy](/privacy): Data protection and privacy practices
- [Terms of Service](/terms): Terms and conditions for service usage

## Usage & Licensing
- Content may be used for non-commercial summarization with attribution to Skyfalke
- For commercial use or full-text reproduction, contact: info@skyfalke.com
- Blog content and case studies are available for educational and research purposes
- API access requires authentication and proper usage agreements

## Contact
- General Inquiries: info@skyfalke.com
- Business Development: business@skyfalke.com
- Technical Support: support@skyfalke.com
- Careers: careers@skyfalke.com
- Last Updated: ${currentDate}
`;

  return content;
}

/**
 * Get a readable page title from URL path
 */
function getPageTitle(path) {
  if (path === '/') return 'Home';
  
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0) return 'Home';
  
  // Handle service pages
  if (segments[0] === 'services') {
    if (segments.length === 1) return 'Services';
    if (segments.length === 2) {
      return segments[1].split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
    if (segments.length === 3) {
      return segments[2].split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
  }
  
  // Handle other pages
  return segments[segments.length - 1]
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('Starting llms.txt generation...');
    
    const content = await generateLLMSTxt();
    
    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write the file
    fs.writeFileSync(OUTPUT_PATH, content, 'utf8');
    
    console.log(`✅ llms.txt generated successfully at ${OUTPUT_PATH}`);
    console.log(`📄 File size: ${(content.length / 1024).toFixed(2)} KB`);
    
    // Verify file was created
    if (fs.existsSync(OUTPUT_PATH)) {
      const stats = fs.statSync(OUTPUT_PATH);
      console.log(`📊 File stats: ${stats.size} bytes, modified ${stats.mtime}`);
    }
    
  } catch (error) {
    console.error('❌ Error generating llms.txt:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateLLMSTxt, fetchDynamicContent };
