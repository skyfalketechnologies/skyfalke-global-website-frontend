/**
 * SSR Handler - Simplified approach
 * Fetches data server-side and injects it into HTML
 * This improves SEO without requiring full React SSR
 */

const path = require('path');
const fs = require('fs').promises;
const {
  fetchBlogPost,
  fetchCaseStudy,
  fetchProduct,
  fetchCourse,
  fetchEvent,
  fetchJob
} = require('./ssrDataFetcher');

/**
 * Get the base HTML template
 * Tries build/index.html first, then falls back to public/index.html
 */
async function getHTMLTemplate() {
  try {
    // Try build directory first (production)
    const buildTemplatePath = path.join(__dirname, '../../client/build/index.html');
    try {
      const template = await fs.readFile(buildTemplatePath, 'utf-8');
      console.log('[SSR] Using template from build directory');
      return template;
    } catch (buildError) {
      // Fallback to public directory (development)
      console.log('[SSR] Build template not found, trying public directory');
      const publicTemplatePath = path.join(__dirname, '../../client/public/index.html');
      try {
        const template = await fs.readFile(publicTemplatePath, 'utf-8');
        console.log('[SSR] Using template from public directory');
    return template;
      } catch (publicError) {
        console.error('[SSR] Error reading HTML template from both locations:', publicError);
        throw publicError;
      }
    }
  } catch (error) {
    console.error('[SSR] Error reading HTML template:', error);
    // Minimal fallback template
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#303661" />
  <title>Skyfalke</title>
</head>
<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
</body>
</html>`;
  }
}

/**
 * Normalize image URL to absolute URL
 */
function normalizeImageUrl(imageUrl, defaultImage = 'https://skyfalke.com/images/logos/logo.svg') {
  if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
    return defaultImage;
  }
  
  const trimmedUrl = imageUrl.trim();
  
  // If already absolute HTTPS URL, return as is
  if (trimmedUrl.startsWith('https://')) {
    return trimmedUrl;
  }
  
  // If HTTP URL, convert to HTTPS
  if (trimmedUrl.startsWith('http://')) {
    return trimmedUrl.replace('http://', 'https://');
  }
  
  // If protocol-relative URL (starts with //), add https:
  if (trimmedUrl.startsWith('//')) {
    return `https:${trimmedUrl}`;
  }
  
  // If relative URL (starts with /), make it absolute
  if (trimmedUrl.startsWith('/')) {
    return `https://skyfalke.com${trimmedUrl}`;
  }
  
  // If it's an ImageKit URL without protocol, add https
  if (trimmedUrl.includes('ik.imagekit.io') && !trimmedUrl.startsWith('http')) {
    return `https://${trimmedUrl}`;
  }
  
  // Default fallback
  return defaultImage;
}

/**
 * Generate meta tags from data
 */
function generateMetaTags(data, routeType) {
  let metaTags = '';
  let title = 'Skyfalke • Leading Digital Marketing & Technology Solutions Partner in Africa';
  let description = 'Skyfalke - Leading digital marketing & technology solutions partner in Africa. Sustainable cloud hosting, AI-powered business tools, creative services & data analytics. Serving Africa & beyond with eco-friendly solutions.';
  let image = 'https://skyfalke.com/images/logos/logo.svg';
  let url = 'https://skyfalke.com';
  let keywords = 'digital marketing agency Africa, sustainable cloud hosting Kenya, AI business solutions, eco-friendly web hosting, renewable energy servers, digital transformation Africa, IT consultancy Kenya, creative services Africa, data analytics, business intelligence, SEO services, social media marketing, web development, mobile app development, cloud computing, cybersecurity, digital advertising, content marketing, brand design, UI UX design, performance optimization, marketing automation, lead generation, e-commerce solutions, digital strategy, technology consulting, startup solutions, enterprise IT support, green technology, carbon-neutral hosting, sustainable business solutions';
  
  // Handle default/static routes with path-based meta tags
  if (routeType === 'default' && data && data.path) {
    const path = data.path.toLowerCase();
    url = `https://skyfalke.com${path === '/' ? '' : path}`;
    
    // Route-specific meta tags
    if (path === '/' || path === '') {
      title = 'Skyfalke • Helping Businesses Succeed Online';
      description = 'Skyfalke is a digital firm based in Nairobi, Kenya, offering web hosting, domain registration, cloud computing, IT consultancy, and digital marketing services.';
      keywords = 'digital firm, marketing agency, advertisement agency, Marketing agency in Nairobi, Marketing agency in Kenya, Marketing agency in Africa, SSL certificates, sectigo, SSL certificates, hosting, eco-friendly web hosting, renewable energy servers, sustainable hosting, domain names, cloud computing, reliable hosting, carbon-neutral hosting, IT consultancy, AI agency, SME business solutions, cloud computing services, digital marketing agency, IT services, business technology solutions, enterprise IT support, technology consulting';
    } else if (path.includes('/about')) {
      title = 'About Us | Skyfalke';
      description = 'Learn about Skyfalke, a leading digital marketing and technology solutions partner in Africa. Our mission, vision, and commitment to sustainable technology.';
      keywords = 'about Skyfalke, digital marketing company Africa, technology solutions Kenya, company history, team, mission, vision';
    } else if (path.includes('/services')) {
      title = 'Our Services | Skyfalke';
      description = 'Comprehensive digital marketing, cloud hosting, AI business tools, creative services, and data analytics solutions for businesses across Africa.';
      keywords = 'digital marketing services, cloud hosting services, AI business tools, creative services, data analytics, SEO services, social media marketing, web development';
    } else if (path.includes('/contact')) {
      title = 'Contact Us | Skyfalke';
      description = 'Get in touch with Skyfalke for digital marketing, cloud hosting, and technology solutions. Contact our team in Nairobi, Kenya.';
      keywords = 'contact Skyfalke, digital marketing contact, cloud hosting support, IT consultancy contact, Nairobi Kenya';
    } else if (path.includes('/blog')) {
      title = 'Blog | Skyfalke';
      description = 'Read the latest insights on digital marketing, cloud solutions, and sustainable technology from Skyfalke.';
      keywords = 'digital marketing blog, cloud solutions blog, technology blog, SEO tips, marketing insights';
    } else if (path.includes('/careers')) {
      title = 'Careers | Skyfalke';
      description = 'Join the Skyfalke team. Explore career opportunities in digital marketing, cloud computing, and technology solutions.';
      keywords = 'careers Skyfalke, jobs digital marketing, IT jobs Kenya, technology careers, cloud computing jobs';
    } else if (path.includes('/shop')) {
      title = 'Shop | Skyfalke';
      description = 'Shop for digital products, cloud hosting plans, SSL certificates, and technology solutions from Skyfalke.';
      keywords = 'shop Skyfalke, digital products, cloud hosting plans, SSL certificates, technology products';
    } else if (path.includes('/case-studies')) {
      title = 'Case Studies | Skyfalke';
      description = 'Explore our portfolio of successful digital marketing and technology projects. See how we help businesses succeed.';
      keywords = 'case studies, portfolio, digital marketing projects, technology projects, success stories';
    } else if (path.includes('/cloud')) {
      title = 'Cloud Hosting | Skyfalke';
      description = 'Sustainable cloud hosting powered by 100% renewable energy. Eco-friendly web hosting solutions for businesses.';
      keywords = 'cloud hosting, eco-friendly hosting, sustainable hosting, renewable energy servers, green hosting, web hosting Kenya';
    }
  }

  if (routeType === 'blog' && data.post) {
    const post = data.post;
    
    // CRITICAL: Log post data to debug empty meta tags
    console.log('[generateMetaTags] Blog post data:', {
      hasTitle: !!post.title,
      title: post.title || 'MISSING',
      hasExcerpt: !!post.excerpt,
      excerpt: post.excerpt ? post.excerpt.substring(0, 50) + '...' : 'MISSING',
      hasContent: !!post.content,
      hasFeaturedImage: !!post.featuredImage?.url,
      featuredImageUrl: post.featuredImage?.url || 'MISSING',
      hasSEO: !!post.seo,
      seoMetaTitle: post.seo?.metaTitle || 'MISSING',
      seoMetaDescription: post.seo?.metaDescription || 'MISSING'
    });
    
    // CRITICAL: Ensure we always have valid content, never empty strings
    title = (post.seo?.metaTitle || post.title || 'Blog Post | Skyfalke Blog').trim();
    if (!title || title.length === 0) {
      title = 'Blog Post | Skyfalke Blog';
    }
    
    // Get description with multiple fallbacks
    let rawDesc = post.seo?.metaDescription || post.excerpt || '';
    if (!rawDesc || rawDesc.trim().length === 0) {
      // Try extracting from content
      if (post.content) {
        rawDesc = post.content.replace(/<[^>]*>/g, '').substring(0, 200).trim();
      }
    }
    if (!rawDesc || rawDesc.trim().length === 0) {
      rawDesc = 'Read the latest insights on digital marketing, cloud solutions, and sustainable technology from Skyfalke.';
    }
    description = rawDesc;
    // Get image with fallbacks - ensure we always have a valid image URL
    let rawImage = post.seo?.ogImage?.url || post.featuredImage?.url || '';
    if (!rawImage || rawImage.trim().length === 0) {
      rawImage = image; // Use default image
    }
    image = normalizeImageUrl(rawImage, image);
    
    // Ensure image is never empty
    if (!image || image.trim().length === 0) {
      image = 'https://skyfalke.com/images/logos/logo.svg';
    }
    url = `https://skyfalke.com/blog/${post.slug}`;
    
    // Clean description - remove HTML tags and limit length
    let cleanDescription = description;
    if (typeof description === 'string') {
      cleanDescription = description.replace(/<[^>]*>/g, '').substring(0, 160).trim();
    }
    if (!cleanDescription || cleanDescription.length === 0) {
      // Fallback: extract from content if available
      if (post.content) {
        cleanDescription = post.content.replace(/<[^>]*>/g, '').substring(0, 160).trim();
      }
      if (!cleanDescription) {
        cleanDescription = 'Read the latest insights on digital marketing, cloud solutions, and sustainable technology from Skyfalke.';
      }
    }
    
    // Get keywords
    const keywords = (post.seo?.keywords || post.tags || []).filter(Boolean).join(', ') || 'digital marketing, cloud solutions, green hosting, sustainable technology';
    
    // Format dates properly
    const publishedTime = post.publishedAt ? new Date(post.publishedAt).toISOString() : '';
    const modifiedTime = post.updatedAt ? new Date(post.updatedAt).toISOString() : (post.publishedAt ? new Date(post.publishedAt).toISOString() : '');
    
    // Generate Article schema markup
    // Clean text values (remove HTML tags) but don't escape - JSON.stringify will handle escaping
    const cleanText = (text) => {
      if (!text) return '';
      return String(text).replace(/<[^>]*>/g, '').trim();
    };
    
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": cleanText(post.title || title),
      "description": cleanDescription,
      "image": image,
      "author": {
        "@type": "Person",
        "name": cleanText(post.author?.name || 'Skyfalke Team')
      },
      "publisher": {
        "@type": "Organization",
        "name": "Skyfalke",
        "logo": {
          "@type": "ImageObject",
          "url": "https://skyfalke.com/images/logos/logo.svg",
          "width": 200,
          "height": 60
        }
      },
      "datePublished": publishedTime,
      "dateModified": modifiedTime || publishedTime,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url
      },
      "url": url,
      "articleSection": cleanText(post.category || 'Digital Marketing'),
      "keywords": keywords
    };
    
    if (post.tags && post.tags.length > 0) {
      articleSchema.about = post.tags.filter(Boolean).map(tag => ({
        "@type": "Thing",
        "name": cleanText(tag)
      }));
    }
    
    const articleSchemaScript = `<script type="application/ld+json">${JSON.stringify(articleSchema, null, 2)}</script>`;
    
    metaTags = `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(cleanDescription)}" />
    <meta name="keywords" content="${escapeHtml(keywords)}" />
    <meta name="author" content="${escapeHtml(post.author?.name || 'Skyfalke Team')}" />
    <link rel="canonical" href="${url}" />
    
    <!-- Open Graph -->
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(cleanDescription)}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(title)}" />
    <meta property="og:site_name" content="Skyfalke" />
    <meta property="og:locale" content="en_US" />
    ${publishedTime ? `<meta property="article:published_time" content="${publishedTime}" />` : ''}
    ${modifiedTime ? `<meta property="article:modified_time" content="${modifiedTime}" />` : ''}
    <meta property="article:author" content="${escapeHtml(post.author?.name || 'Skyfalke Team')}" />
    <meta property="article:section" content="${escapeHtml(post.category || 'Digital Marketing')}" />
    ${(post.tags || []).filter(Boolean).map(tag => `<meta property="article:tag" content="${escapeHtml(tag)}" />`).join('\n    ')}
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(cleanDescription)}" />
    <meta name="twitter:image" content="${image}" />
    <meta name="twitter:image:alt" content="${escapeHtml(title)}" />
    
    <!-- Article Schema Markup -->
    ${articleSchemaScript}
    <meta name="twitter:site" content="@skyfalke" />
    <meta name="twitter:creator" content="@skyfalke" />
    
    <!-- Article Schema Markup -->
    ${articleSchemaScript}`;
  } else if (routeType === 'case-study' && data.caseStudy) {
    const caseStudy = data.caseStudy;
    title = `${caseStudy.title} | Skyfalke Case Study`;
    description = caseStudy.excerpt || description;
    const rawImage = caseStudy.featuredImage?.url || image;
    image = normalizeImageUrl(rawImage, image);
    url = `https://skyfalke.com/case-studies/${caseStudy.slug}`;
    const cleanDescription = description.replace(/<[^>]*>/g, '').substring(0, 200).trim();
    
    metaTags = `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(cleanDescription)}" />
    <link rel="canonical" href="${url}" />
    
    <!-- Open Graph -->
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(cleanDescription)}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(title)}" />
    <meta property="og:site_name" content="Skyfalke" />
    <meta property="og:locale" content="en_US" />
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(cleanDescription)}" />
    <meta name="twitter:image" content="${image}" />
    <meta name="twitter:site" content="@skyfalke" />
    <meta name="twitter:creator" content="@skyfalke" />`;
  } else if (routeType === 'product' && data.product) {
    const product = data.product;
    title = `${product.name} | Skyfalke Shop`;
    description = product.description || description;
    const rawImage = product.images?.[0]?.url || image;
    image = normalizeImageUrl(rawImage, image);
    url = `https://skyfalke.com/shop/product/${product.slug}`;
    const cleanDescription = description.replace(/<[^>]*>/g, '').substring(0, 200).trim();
    
    metaTags = `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(cleanDescription)}" />
    <link rel="canonical" href="${url}" />
    
    <!-- Open Graph -->
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(cleanDescription)}" />
    <meta property="og:type" content="product" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(title)}" />
    <meta property="og:site_name" content="Skyfalke" />
    <meta property="og:locale" content="en_US" />
    <meta property="product:price:amount" content="${product.currentPrice || ''}" />
    <meta property="product:price:currency" content="USD" />
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(cleanDescription)}" />
    <meta name="twitter:image" content="${image}" />
    <meta name="twitter:site" content="@skyfalke" />
    <meta name="twitter:creator" content="@skyfalke" />`;
  } else if (routeType === 'course' && data.course) {
    const course = data.course;
    title = `${course.title} | Skyfalke Academy`;
    description = course.description || description;
    const rawImage = course.image?.url || image;
    image = normalizeImageUrl(rawImage, image);
    url = `https://skyfalke.com/academy/courses/${course.slug}`;
    const cleanDescription = description.replace(/<[^>]*>/g, '').substring(0, 200).trim();
    
    metaTags = `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(cleanDescription)}" />
    <link rel="canonical" href="${url}" />
    
    <!-- Open Graph -->
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(cleanDescription)}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(title)}" />
    <meta property="og:site_name" content="Skyfalke" />
    <meta property="og:locale" content="en_US" />
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(cleanDescription)}" />
    <meta name="twitter:image" content="${image}" />
    <meta name="twitter:site" content="@skyfalke" />
    <meta name="twitter:creator" content="@skyfalke" />`;
  } else if (routeType === 'default') {
    // Generate meta tags for static/default routes
    // CRITICAL: Ensure all values are valid and never empty
    console.log('[generateMetaTags] Default route - Current values:', {
      title: title || 'MISSING',
      description: description ? description.substring(0, 50) + '...' : 'MISSING',
      image: image || 'MISSING',
      url: url || 'MISSING',
      keywords: keywords ? keywords.substring(0, 50) + '...' : 'MISSING',
      path: data?.path || 'MISSING'
    });
    
    // Validate and ensure values are never empty
    if (!title || title.trim().length === 0) {
      title = 'Skyfalke • Helping Businesses Succeed Online';
      console.warn('[generateMetaTags] ⚠️ Title was empty, using default');
    }
    
    if (!description || description.trim().length === 0) {
      description = 'Skyfalke is a digital firm based in Nairobi, Kenya, offering web hosting, domain registration, cloud computing, IT consultancy, and digital marketing services.';
      console.warn('[generateMetaTags] ⚠️ Description was empty, using default');
    }
    
    if (!image || image.trim().length === 0) {
      image = 'https://skyfalke.com/images/logos/logo.svg';
      console.warn('[generateMetaTags] ⚠️ Image was empty, using default');
    }
    
    if (!url || url.trim().length === 0) {
      url = 'https://skyfalke.com';
      console.warn('[generateMetaTags] ⚠️ URL was empty, using default');
    }
    
    if (!keywords || keywords.trim().length === 0) {
      keywords = 'digital marketing agency Africa, sustainable cloud hosting Kenya, AI business solutions';
      console.warn('[generateMetaTags] ⚠️ Keywords was empty, using default');
    }
    
    let cleanDescription = description.replace(/<[^>]*>/g, '').substring(0, 160).trim();
    
    // Ensure cleanDescription is never empty
    if (!cleanDescription || cleanDescription.length === 0) {
      cleanDescription = 'Skyfalke is a digital firm based in Nairobi, Kenya, offering web hosting, domain registration, cloud computing, IT consultancy, and digital marketing services.';
    }
    
    // Escape HTML and ensure values are still not empty after escaping
    const escapedTitle = escapeHtml(title.trim());
    const escapedDescription = escapeHtml(cleanDescription);
    const escapedKeywords = escapeHtml(keywords.trim());
    const escapedImage = image.trim(); // Image URLs don't need HTML escaping
    
    console.log('[generateMetaTags] After validation:', {
      escapedTitle: escapedTitle.substring(0, 50),
      escapedDescription: escapedDescription.substring(0, 50),
      escapedImage: escapedImage.substring(0, 50)
    });
    
    metaTags = `
    <title>${escapedTitle}</title>
    <meta name="description" content="${escapedDescription}" />
    <meta name="keywords" content="${escapedKeywords}" />
    <link rel="canonical" href="${url}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${escapedTitle}" />
    <meta property="og:description" content="${escapedDescription}" />
    <meta property="og:image" content="${escapedImage}" />
    <meta property="og:image:secure_url" content="${escapedImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapedTitle}" />
    <meta property="og:site_name" content="Skyfalke" />
    <meta property="og:locale" content="en_US" />
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@skyfalke" />
    <meta name="twitter:creator" content="@skyfalke" />
    <meta name="twitter:title" content="${escapedTitle}" />
    <meta name="twitter:description" content="${escapedDescription}" />
    <meta name="twitter:image" content="${escapedImage}" />
    <meta name="twitter:image:alt" content="${escapedTitle}" />`;
  } else {
    // Fallback for unknown route types
    metaTags = `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${url}" />`;
  }

  return metaTags;
}

/**
 * Escape HTML to prevent XSS
 * CRITICAL: Never return empty string - always return a valid value
 */
function escapeHtml(text) {
  if (!text || (typeof text === 'string' && text.trim().length === 0)) {
    // Return empty string but log warning - caller should handle fallback
    console.warn('[escapeHtml] ⚠️ Empty or null text provided to escapeHtml');
    return '';
  }
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  const escaped = String(text).replace(/[&<>"']/g, m => map[m]);
  // Ensure escaped value is not empty
  if (!escaped || escaped.trim().length === 0) {
    console.warn('[escapeHtml] ⚠️ Escaped value is empty, original text:', text);
  }
  return escaped;
}

/**
 * Inject data and meta tags into HTML
 */
function injectSSRData(html, data, metaTags) {
  if (!html || !metaTags) {
    console.error('[injectSSRData] Missing html or metaTags');
    return html;
  }
  
  console.log('[injectSSRData] Starting injection...');
  console.log('[injectSSRData] Original HTML length:', html.length);
  console.log('[injectSSRData] MetaTags length:', metaTags.length);
  
  // Store original for comparison
  const originalHtml = html;
  
  // Remove existing meta tags that might conflict
  // IMPORTANT: Use more specific regex to avoid removing tags that are part of other attributes
  html = html.replace(/<title>[\s\S]*?<\/title>/gi, '');
  html = html.replace(/<meta\s+name=["']description["'][^>]*?\/?>/gi, '');
  // More specific regex for OG tags - match property="og:..." or property='og:...'
  html = html.replace(/<meta\s+property\s*=\s*["']og:[^"']*["'][^>]*?\/?>/gi, '');
  html = html.replace(/<meta\s+name=["']twitter:[^"']*["'][^>]*?\/?>/gi, '');
  html = html.replace(/<link\s+rel\s*=\s*["']canonical["'][^>]*?\/?>/gi, '');
  html = html.replace(/<meta\s+name=["']keywords["'][^>]*?\/?>/gi, '');
  html = html.replace(/<meta\s+name=["']author["'][^>]*?\/?>/gi, '');
  html = html.replace(/<meta\s+property\s*=\s*["']article:[^"']*["'][^>]*?\/?>/gi, '');
  // Remove Article schema scripts (but keep Organization schema from base template)
  html = html.replace(/<script\s+type\s*=\s*["']application\/ld\+json["'][^>]*>[\s\S]*?Article[\s\S]*?<\/script>/gi, '');
  
  // Clean up whitespace
  html = html.replace(/\n\s*\n\s*\n+/g, '\n\n');
  
  console.log('[injectSSRData] After cleanup HTML length:', html.length);
  
  // Format meta tags with proper indentation
  const formattedMetaTags = metaTags
    .trim()
    .split('\n')
    .map(line => {
      const trimmed = line.trim();
      if (trimmed) {
        return `    ${trimmed}`;
      }
      return '';
    })
    .filter(line => line)
    .join('\n');
  
  console.log('[injectSSRData] Formatted meta tags length:', formattedMetaTags.length);
  
  // Find the <head> tag and insert meta tags right after it
  const headOpenMatch = html.match(/<head[^>]*>/i);
  if (headOpenMatch) {
    const headTag = headOpenMatch[0];
    const headIndex = html.indexOf(headTag);
    if (headIndex !== -1) {
      const afterHead = headIndex + headTag.length;
      // Find the charset and viewport meta tags (keep them first)
      const charsetMatch = html.match(/(<meta\s+charset[^>]*>)/i);
      const viewportMatch = html.match(/(<meta\s+name=["']viewport["'][^>]*>)/i);
      
      let insertPoint = afterHead;
      
      // If viewport exists, insert after it
      if (viewportMatch) {
        const viewportTag = viewportMatch[1];
        const viewportIndex = html.indexOf(viewportTag);
        if (viewportIndex !== -1) {
          insertPoint = viewportIndex + viewportTag.length;
          // Skip to next line
          const nextNewline = html.indexOf('\n', insertPoint);
          if (nextNewline !== -1 && nextNewline - insertPoint < 100) {
            insertPoint = nextNewline + 1;
          }
        }
      }
      
      // Insert the meta tags
      const before = html.slice(0, insertPoint);
      const after = html.slice(insertPoint);
      const result = before + '\n' + formattedMetaTags + '\n' + after;
      
      console.log('[injectSSRData] ✅ Inserted meta tags at position:', insertPoint);
      console.log('[injectSSRData] Result HTML length:', result.length);
      
      // CRITICAL: Verify OG tags are present and properly formatted
      const titleMatch = result.match(/<title>([^<]*)<\/title>/i);
      const ogTitleMatch = result.match(/<meta\s+property\s*=\s*["']og:title["'][^>]*>/i);
      const ogImageMatch = result.match(/<meta\s+property\s*=\s*["']og:image["'][^>]*>/i);
      const ogUrlMatch = result.match(/<meta\s+property\s*=\s*["']og:url["'][^>]*>/i);
      const ogTypeMatch = result.match(/<meta\s+property\s*=\s*["']og:type["'][^>]*>/i);
      const descMatch = result.includes('name="description"');
      
      console.log('[injectSSRData] Verification:');
      console.log('[injectSSRData]   - Title found:', titleMatch ? `"${titleMatch[1].substring(0, 50)}..."` : 'NO');
      console.log('[injectSSRData]   - OG:title found:', ogTitleMatch ? 'YES' : 'NO');
      console.log('[injectSSRData]   - OG:image found:', ogImageMatch ? 'YES' : 'NO');
      console.log('[injectSSRData]   - OG:url found:', ogUrlMatch ? 'YES' : 'NO');
      console.log('[injectSSRData]   - OG:type found:', ogTypeMatch ? 'YES' : 'NO');
      console.log('[injectSSRData]   - Description found:', descMatch ? 'YES' : 'NO');
      
      // Check if all critical OG tags are present
      const allOGTagsPresent = ogTitleMatch && ogImageMatch && ogUrlMatch && ogTypeMatch;
      
      if (!titleMatch || !allOGTagsPresent || !descMatch) {
        console.error('[injectSSRData] ❌ CRITICAL: Meta tags not properly injected!');
        console.error('[injectSSRData] Missing tags - Title:', !titleMatch, 'OG Tags:', !allOGTagsPresent, 'Description:', !descMatch);
        console.error('[injectSSRData] Meta tags being injected:', formattedMetaTags.substring(0, 500));
        // Extract a sample of the result HTML around the head section for debugging
        const headSection = result.match(/<head[^>]*>([\s\S]{0,2000})<\/head>/i);
        if (headSection) {
          console.error('[injectSSRData] Head section sample:', headSection[1].substring(0, 1000));
        }
      } else {
        console.log('[injectSSRData] ✅ All meta tags verified in result');
      }
      
      return result;
    }
  }
  
  // Fallback: insert before </head>
  console.warn('[injectSSRData] ⚠️ Using fallback: inserting before </head>');
  const headCloseIndex = html.indexOf('</head>');
  if (headCloseIndex !== -1) {
    const result = html.slice(0, headCloseIndex) + '\n' + formattedMetaTags + '\n  ' + html.slice(headCloseIndex);
    console.log('[injectSSRData] ✅ Inserted meta tags before </head>');
    return result;
  }
  
  console.error('[injectSSRData] ❌ FAILED: Could not find <head> or </head> tag!');
  return html;
}

/**
 * Handle SSR for a given URL
 * Returns null if streaming should be used (for blog posts)
 * Returns HTML string for other routes
 */
async function handleSSR(url, res = null) {
  try {
    console.log('[SSR] ========================================');
    console.log('[SSR] 🚀 Starting SSR handler');
    console.log('[SSR] Handling URL:', url);
    console.log('[SSR] Response object provided:', res ? '✅ Yes' : '❌ No');
    
    // Extract slug from URL path
    const cleanUrl = url.split('?')[0]; // Remove query string
    const pathParts = cleanUrl.split('/').filter(Boolean);
    
    console.log('[SSR] Clean URL:', cleanUrl);
    console.log('[SSR] Path parts:', pathParts);
    
    // Fetch data based on URL pattern
    let data = null;
    let routeType = 'default';
    let slug = null;

    // Check for blog post route: /blog/:slug
    const blogIndex = pathParts.indexOf('blog');
    if (blogIndex !== -1 && pathParts.length > blogIndex + 1) {
      slug = pathParts[blogIndex + 1];
      console.log('[SSR] ✅ Detected blog route with slug:', slug);
      console.log('[SSR] Path parts:', JSON.stringify(pathParts));
      console.log('[SSR] Blog index:', blogIndex, 'Path parts length:', pathParts.length);
      
      if (slug && slug !== 'index') {
        console.log('[SSR] Fetching blog post data for slug:', slug);
        data = await fetchBlogPost(slug);
        routeType = 'blog';
        console.log('[SSR] Blog post data fetched:', data ? '✅ Yes' : '❌ No');
        
        if (data && data.post) {
          console.log('[SSR] Blog post found:', data.post.title || 'NO TITLE');
          console.log('[SSR] Post data check:', {
            hasTitle: !!data.post.title,
            hasExcerpt: !!data.post.excerpt,
            hasFeaturedImage: !!data.post.featuredImage?.url,
            hasSEO: !!data.post.seo,
            hasAuthor: !!data.post.author
          });
          console.log('[SSR] Response object provided:', res ? '✅ Yes' : '❌ No');
        } else {
          console.error('[SSR] ❌ Blog post data is missing or invalid:', {
            hasData: !!data,
            hasPost: !!(data && data.post),
            dataKeys: data ? Object.keys(data) : []
          });
        }
        
        // Use renderToPipeableStream for blog posts if res is provided
        if (data && data.post && res && routeType === 'blog') {
          const { renderBlogPostStream } = require('./ssrRenderer');
          console.log('[SSR] 🚀 Using renderToPipeableStream for blog post');
          try {
            await renderBlogPostStream(data, res);
            console.log('[SSR] ✅ Streaming completed successfully');
            return 'STREAMED'; // Special return value to indicate streaming was used
          } catch (renderError) {
            console.error('[SSR] ❌ Error in renderBlogPostStream:', renderError);
            console.error('[SSR] Error message:', renderError.message);
            console.error('[SSR] Stack:', renderError.stack);
            // Don't fall through - if streaming fails, we should handle it
            if (!res.headersSent) {
              res.status(500).send('Error rendering blog post');
            }
            return 'ERROR'; // Indicate error occurred
          }
        } else if (!data || !data.post) {
          console.log('[SSR] ⚠️ Blog post not found for slug:', slug);
          console.log('[SSR] This will fall back to static serving (client-side 404)');
          // Still return null to let client handle 404, but log it
          return null; // Let it fall through to 404 handling
        } else if (!res) {
          console.warn('[SSR] ⚠️ Response object not provided for blog post streaming');
          console.warn('[SSR] Falling back to non-streaming SSR');
          // Fall through to non-streaming SSR - will generate HTML with meta tags
        } else {
          console.warn('[SSR] ⚠️ Conditions not met for streaming.');
          console.warn('[SSR] Debug info - Data:', !!data, 'Post:', !!(data && data.post), 'Res:', !!res, 'RouteType:', routeType);
          console.warn('[SSR] Falling back to non-streaming SSR');
          // Fall through to non-streaming SSR - will generate HTML with meta tags
        }
      } else {
        console.log('[SSR] ⚠️ Invalid slug or slug is "index":', slug);
      }
    } else if (cleanUrl.includes('/case-studies/') && pathParts.length > 1) {
      const caseStudyIndex = pathParts.indexOf('case-studies');
      if (caseStudyIndex !== -1 && pathParts.length > caseStudyIndex + 1) {
        slug = pathParts[caseStudyIndex + 1];
        console.log('[SSR] Detected case study route with slug:', slug);
        data = await fetchCaseStudy(slug);
        routeType = 'case-study';
      }
    } else if (cleanUrl.includes('/shop/product/') && pathParts.length > 2) {
      const productIndex = pathParts.indexOf('product');
      if (productIndex !== -1 && pathParts.length > productIndex + 1) {
        slug = pathParts[productIndex + 1];
        console.log('[SSR] Detected product route with slug:', slug);
        data = await fetchProduct(slug);
        routeType = 'product';
      }
    } else if (cleanUrl.includes('/academy/courses/') && pathParts.length > 2) {
      const courseIndex = pathParts.indexOf('courses');
      if (courseIndex !== -1 && pathParts.length > courseIndex + 1) {
        slug = pathParts[courseIndex + 1];
        console.log('[SSR] Detected course route with slug:', slug);
        data = await fetchCourse(slug);
        routeType = 'course';
      }
    } else if (cleanUrl.includes('/events/') && pathParts.length > 1) {
      const eventIndex = pathParts.indexOf('events');
      if (eventIndex !== -1 && pathParts.length > eventIndex + 1) {
        slug = pathParts[eventIndex + 1];
        console.log('[SSR] Detected event route with slug:', slug);
        data = await fetchEvent(slug);
        routeType = 'event';
      }
    } else if (cleanUrl.includes('/careers/') && pathParts.length > 1) {
      const jobIndex = pathParts.indexOf('careers');
      if (jobIndex !== -1 && pathParts.length > jobIndex + 1) {
        slug = pathParts[jobIndex + 1];
        console.log('[SSR] Detected job route with slug:', slug);
        data = await fetchJob(slug);
        routeType = 'job';
      }
    } else {
      // Static route - generate default meta tags based on path
      console.log('[SSR] Static route detected, generating default meta tags for:', cleanUrl);
      routeType = 'default';
      data = { path: cleanUrl }; // Pass path for route-specific meta tags
    }

    // For dynamic routes, check if data exists
    if (!data && routeType !== 'blog' && routeType !== 'default') {
      console.log('[SSR] No data found for route type:', routeType, 'slug:', slug);
      return null;
    }
    
    // For blog posts, if no data, return null to let client handle 404
    if (!data && routeType === 'blog') {
      console.log('[SSR] Blog post not found for slug:', slug);
      console.log('[SSR] This will fall back to static serving (client-side 404)');
      return null;
    }

    // For default/static routes, we ALWAYS generate meta tags
    // Ensure data.path is set for default routes
    if (routeType === 'default') {
      if (!data || !data.path) {
        console.log('[SSR] Default route but no path data, setting path from URL');
        data = { path: cleanUrl };
      }
      console.log('[SSR] ✅ Default route - will generate meta tags for path:', data.path);
    }
    
    console.log('[SSR] Generating HTML with meta tags for route type:', routeType);

    // Get HTML template
    const html = await getHTMLTemplate();
    if (!html) {
      console.error('[SSR] Failed to get HTML template');
      return null;
    }

    // Generate meta tags
    const metaTags = generateMetaTags(data, routeType);
    if (!metaTags) {
      console.error('[SSR] Failed to generate meta tags for route type:', routeType);
      console.error('[SSR] Data:', JSON.stringify(data, null, 2));
      return null;
    }

    console.log('[SSR] Meta tags generated, length:', metaTags.length);
    if (process.env.NODE_ENV !== 'production') {
      console.log('[SSR] Meta tags preview:', metaTags.substring(0, 200) + '...');
    }

    // Inject data and meta tags
    const finalHTML = injectSSRData(html, data, metaTags);
    
    if (!finalHTML) {
      console.error('[SSR] Failed to inject SSR data');
      return null;
    }

    // Verify meta tags were injected
    const hasTitle = finalHTML.includes('<title>') && finalHTML.match(/<title>[\s\S]*?<\/title>/);
    const hasOGTags = finalHTML.includes('og:title') || finalHTML.includes('property="og:');
    const hasDescription = finalHTML.includes('name="description"');
    
    console.log('[SSR] Injection verification:');
    console.log('[SSR]   - Title tag present:', hasTitle ? '✅' : '❌');
    console.log('[SSR]   - OG tags present:', hasOGTags ? '✅' : '❌');
    console.log('[SSR]   - Description tag present:', hasDescription ? '✅' : '❌');
    console.log('[SSR] Final HTML length:', finalHTML.length);
    
    // Extract and show head section for debugging
    const headMatch = finalHTML.match(/<head>([\s\S]*?)<\/head>/i);
    if (headMatch) {
      const headContent = headMatch[1];
      const titleInHead = headContent.includes('<title>');
      const ogInHead = headContent.includes('og:title') || headContent.includes('property="og:');
      console.log('[SSR] Head section analysis:');
      console.log('[SSR]   - Head content length:', headContent.length);
      console.log('[SSR]   - Title in head:', titleInHead ? '✅' : '❌');
      console.log('[SSR]   - OG tags in head:', ogInHead ? '✅' : '❌');
      
      // Show first 800 chars of head for debugging
      if (process.env.NODE_ENV !== 'production') {
        console.log('[SSR] Head section preview (first 800 chars):');
        console.log(headContent.substring(0, 800));
      }
    } else {
      console.error('[SSR] ❌ ERROR: Could not find <head> tag in final HTML!');
    }
    
    if (!hasTitle || !hasOGTags || !hasDescription) {
      console.warn('[SSR] ⚠️  WARNING: Meta tags may not have been injected correctly!');
    }

    console.log('[SSR] ✅ Successfully generated SSR HTML');
    console.log('[SSR] ========================================');
    return finalHTML;
  } catch (error) {
    console.error('[SSR] ❌ Error:', error);
    console.error('[SSR] Stack:', error.stack);
    console.log('[SSR] ========================================');
    return null; // Fall back to default static serving
  }
}

module.exports = {
  handleSSR,
  getHTMLTemplate,
  generateMetaTags,
  injectSSRData
};

