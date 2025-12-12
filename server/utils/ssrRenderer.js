/**
 * React SSR Renderer using renderToPipeableStream
 * Streams React components to HTML for better performance
 */

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { StaticRouter } = require('react-router-dom/server');
const { HelmetProvider } = require('react-helmet-async');
const path = require('path');
const fs = require('fs').promises;

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
 * Generate comprehensive meta tags for SEO (Next.js style)
 * Includes all metadata: title, description, OG tags, Twitter cards, and Schema markup
 */
function generateMetaTags(blogData, type = 'blog') {
  const { post } = blogData;
  
  if (!post) {
    console.error('[generateMetaTags] ❌ No post data provided!');
    return '<title>Blog Post Not Found | Skyfalke</title>';
  }
  
  // CRITICAL: Log post structure to debug empty meta tags
  console.log('[generateMetaTags] Post structure:', {
    hasPost: !!post,
    postKeys: Object.keys(post || {}),
    title: post.title || 'MISSING',
    excerpt: post.excerpt ? post.excerpt.substring(0, 30) + '...' : 'MISSING',
    hasFeaturedImage: !!post.featuredImage,
    featuredImageKeys: post.featuredImage ? Object.keys(post.featuredImage) : [],
    featuredImageUrl: post.featuredImage?.url || 'MISSING',
    hasSEO: !!post.seo,
    seoKeys: post.seo ? Object.keys(post.seo) : []
  });

  // Get SEO data with fallbacks
  // CRITICAL: Ensure we have valid data, log if missing
  if (!post.title) {
    console.error('[generateMetaTags] ❌ Post title is missing!', { postId: post._id, slug: post.slug });
  }
  
  // CRITICAL: Ensure we always have valid content, never empty strings
  let title = (post.seo?.metaTitle || post.title || 'Blog Post | Skyfalke Blog').trim();
  if (!title || title.length === 0) {
    title = 'Blog Post | Skyfalke Blog';
  }
  
  // Get description with multiple fallbacks
  let rawDescription = post.seo?.metaDescription || post.excerpt || '';
  if (!rawDescription || rawDescription.trim().length === 0) {
    // Try extracting from content
    if (post.content) {
      rawDescription = post.content.replace(/<[^>]*>/g, '').substring(0, 200).trim();
    }
  }
  if (!rawDescription || rawDescription.trim().length === 0) {
    rawDescription = 'Read the latest insights on digital marketing, cloud solutions, and sustainable technology from Skyfalke.';
  }
  
  // Get image with fallbacks
  let rawImage = post.seo?.ogImage?.url || post.featuredImage?.url || 'https://skyfalke.com/images/logos/logo.svg';
  const image = normalizeImageUrl(rawImage);
  
  console.log('[generateMetaTags] Generated meta data:', {
    title: title.substring(0, 60),
    description: rawDescription.substring(0, 60),
    image: image.substring(0, 60),
    hasImage: !!post.featuredImage?.url
  });
  
  // Clean description - remove HTML tags and limit length
  let cleanDescription = rawDescription;
  if (typeof rawDescription === 'string') {
    cleanDescription = rawDescription.replace(/<[^>]*>/g, '').substring(0, 160).trim();
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
  
  const rawImage = post.seo?.ogImage?.url || post.featuredImage?.url || 'https://skyfalke.com/images/logos/logo.svg';
  const image = normalizeImageUrl(rawImage);
  const url = `https://skyfalke.com/blog/${post.slug}`;
  
  // Get keywords
  const keywords = (post.seo?.keywords || post.tags || []).filter(Boolean).join(', ') || 'digital marketing, cloud solutions, green hosting, sustainable technology';
  
  // Format dates properly
  const publishedTime = post.publishedAt ? new Date(post.publishedAt).toISOString() : '';
  const modifiedTime = post.updatedAt ? new Date(post.updatedAt).toISOString() : (post.publishedAt ? new Date(post.publishedAt).toISOString() : '');
  
  // Generate Article schema markup
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

  return `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(cleanDescription)}" />
    <meta name="keywords" content="${escapeHtml(keywords)}" />
    <meta name="author" content="${escapeHtml(post.author?.name || 'Skyfalke Team')}" />
    <link rel="canonical" href="${url}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(cleanDescription)}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:secure_url" content="${image}" />
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
    <meta name="twitter:site" content="@skyfalke" />
    <meta name="twitter:creator" content="@skyfalke" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(cleanDescription)}" />
    <meta name="twitter:image" content="${image}" />
    <meta name="twitter:image:alt" content="${escapeHtml(title)}" />
    
    <!-- Article Schema Markup -->
    ${articleSchemaScript}`.trim();
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Create a comprehensive BlogPost component for SSR
 * Renders full content server-side (Next.js style) so it's visible in initial HTML
 */
function createBlogPostComponent(blogData) {
  const { post, relatedPosts } = blogData;
  
  if (!post) {
    return React.createElement('div', { className: 'min-h-screen bg-gray-50 flex items-center justify-center' },
      React.createElement('div', { className: 'text-center' },
        React.createElement('h1', { className: 'text-2xl font-bold text-gray-900 mb-4' }, 'Blog Post Not Found'),
        React.createElement('p', { className: 'text-gray-600' }, 'The blog post you are looking for does not exist.')
      )
    );
  }

  const content = post.content || '';
  
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate reading time (approximate: 200 words per minute)
  const wordCount = content ? content.replace(/<[^>]*>/g, '').split(/\s+/).length : 0;
  const readingTime = Math.ceil(wordCount / 200) || 1;

  return React.createElement(
    'div',
    { className: 'min-h-screen bg-gray-50' },
    // Main content container
    React.createElement(
      'article',
      { className: 'max-w-4xl mx-auto px-4 py-8' },
      // Header with title and meta
      React.createElement(
        'header',
        { className: 'mb-8' },
        React.createElement('h1', { 
          className: 'text-4xl md:text-5xl font-bold text-gray-900 mb-4',
          itemProp: 'headline'
        }, post.title || 'Untitled'),
        React.createElement(
          'div',
          { className: 'flex flex-wrap items-center gap-4 text-gray-600 mb-6' },
          post.author?.name && React.createElement('div', { className: 'flex items-center gap-2' },
            React.createElement('span', { className: 'font-medium' }, 'By'),
            React.createElement('span', { itemProp: 'author' }, post.author.name)
          ),
          post.publishedAt && React.createElement('div', { className: 'flex items-center gap-2' },
            React.createElement('time', { 
              dateTime: new Date(post.publishedAt).toISOString(),
              itemProp: 'datePublished'
            }, formatDate(post.publishedAt))
          ),
          React.createElement('div', { className: 'flex items-center gap-2' },
            React.createElement('span', null, `${readingTime} min read`)
          )
        ),
        post.category && React.createElement(
        'div',
          { className: 'mb-4' },
          React.createElement('span', { 
            className: 'inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium'
          }, post.category)
        )
      ),
      // Featured image
    post.featuredImage?.url && React.createElement(
        'div',
        { className: 'mb-8' },
        React.createElement('img', {
        src: post.featuredImage.url,
        alt: post.title || 'Featured image',
          className: 'w-full h-auto rounded-lg shadow-lg',
          itemProp: 'image'
        })
    ),
      // Main content
    React.createElement(
      'div',
      {
          className: 'prose prose-lg max-w-none blog-content',
          itemProp: 'articleBody',
        dangerouslySetInnerHTML: { __html: content }
      }
      ),
      // Tags
      post.tags && post.tags.length > 0 && React.createElement(
        'div',
        { className: 'mt-8 pt-6 border-t border-gray-200' },
        React.createElement('div', { className: 'flex flex-wrap gap-2' },
          post.tags.map((tag, index) =>
            React.createElement(
              'span',
              { 
                key: index,
                className: 'inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm'
              },
              tag
            )
          )
        )
      )
    ),
    // Related posts section
    relatedPosts && relatedPosts.length > 0 && React.createElement(
      'section',
      { className: 'max-w-4xl mx-auto px-4 py-8 border-t border-gray-200' },
      React.createElement('h2', { className: 'text-2xl font-bold text-gray-900 mb-6' }, 'Related Posts'),
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-3 gap-6' },
        relatedPosts.map((related, index) =>
          React.createElement(
            'article',
            { 
              key: related._id || index,
              className: 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'
            },
            related.featuredImage?.url && React.createElement(
              'a',
              { href: `/blog/${related.slug}` },
              React.createElement('img', {
                src: related.featuredImage.url,
                alt: related.title || 'Related post',
                className: 'w-full h-48 object-cover'
              })
            ),
            React.createElement(
              'div',
              { className: 'p-4' },
              React.createElement(
                'a',
                { 
                  href: `/blog/${related.slug}`,
                  className: 'text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors'
                },
              related.title
              ),
              related.excerpt && React.createElement(
                'p',
                { className: 'text-gray-600 text-sm mt-2 line-clamp-2' },
                related.excerpt.replace(/<[^>]*>/g, '').substring(0, 100) + '...'
              )
            )
          )
        )
      )
    )
  );
}

/**
 * Get base HTML template
 */
async function getHTMLTemplate() {
  try {
    const templatePath = path.join(__dirname, '../../client/build/index.html');
    const template = await fs.readFile(templatePath, 'utf-8');
    return template;
  } catch (error) {
    console.error('Error reading HTML template:', error);
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#e0ae00" />
</head>
<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
</body>
</html>`;
  }
}

/**
 * Clean head content by removing conflicting meta tags
 */
function cleanHeadContent(headContent) {
  return headContent
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta\s+name=["']description["'][^>]*?>/gi, '')
    .replace(/<meta\s+property=["']og:[^"']*["'][^>]*?>/gi, '')
    .replace(/<meta\s+name=["']twitter:[^"']*["'][^>]*?>/gi, '')
    .replace(/<link\s+rel=["']canonical["'][^>]*?>/gi, '');
}

/**
 * Render blog post with renderToPipeableStream
 */
async function renderBlogPostStream(blogData, res) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('[SSR Stream] Starting blog post render for:', blogData.post?.slug);
      
      // Get HTML template
      const template = await getHTMLTemplate();
      const headMatch = template.match(/<head>([\s\S]*?)<\/head>/i);
      const bodyMatch = template.match(/<body>([\s\S]*?)<\/body>/i);
      
      if (!headMatch) {
        throw new Error('Could not parse HTML template head');
      }

      // Clean and prepare head content
      let headContent = cleanHeadContent(headMatch[1]);
      
      // Extract script tags from both head and body to preserve them
      // Scripts in head should be moved to body for proper loading
      let bodyScripts = '';
      const allScriptMatches = [];
      
      // Extract from head (these should be moved to body)
      if (headMatch) {
        const headScriptMatches = headMatch[1].match(/<script[^>]*>[\s\S]*?<\/script>/gi);
        if (headScriptMatches) {
          allScriptMatches.push(...headScriptMatches);
          // Remove scripts from head content (they'll be in body)
          headScriptMatches.forEach(script => {
            headContent = headContent.replace(script, '');
          });
        }
      }
      
      // Extract from body
      if (bodyMatch) {
        const bodyScriptMatches = bodyMatch[1].match(/<script[^>]*>[\s\S]*?<\/script>/gi);
        if (bodyScriptMatches) {
          allScriptMatches.push(...bodyScriptMatches);
        }
      }
      
      if (allScriptMatches.length > 0) {
        bodyScripts = allScriptMatches.join('\n  ');
      }
      
      // Clean up any extra whitespace left by script removal
      headContent = headContent.replace(/\n\s*\n\s*\n+/g, '\n\n').trim();
      
      // Generate comprehensive meta tags BEFORE streaming starts
      // This ensures all metadata is in the initial HTML (Next.js style)
      const metaTags = generateMetaTags(blogData, 'blog');
      
      // Format meta tags with proper indentation (2 spaces to match HTML structure)
      const formattedMetaTags = metaTags
        .trim()
        .split('\n')
        .map(line => {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('<!--') && !trimmed.endsWith('-->')) {
            // Add 2 spaces indentation for meta tags to match HTML structure
            return `    ${trimmed}`;
          } else if (trimmed) {
            // Comments get 2 spaces too
            return `    ${trimmed}`;
          }
          return '';
        })
        .filter(line => line)
        .join('\n');
      
      // Insert meta tags right after viewport meta tag (before other content)
      // This ensures they appear early in the head for better SEO
      const viewportIndex = headContent.indexOf('<meta name="viewport"');
      if (viewportIndex !== -1) {
        // Find the end of the viewport line
        const viewportEnd = headContent.indexOf('>', viewportIndex) + 1;
        // Insert meta tags right after viewport
        headContent = headContent.slice(0, viewportEnd) + '\n' + formattedMetaTags + headContent.slice(viewportEnd);
      } else {
        // Fallback: append to head content if viewport not found
        headContent = headContent + '\n' + formattedMetaTags;
      }
      
      // Try to get script paths from asset manifest (read synchronously before streaming)
      let mainScriptPath = null;
      try {
        const assetManifestPath = path.join(__dirname, '../../client/build/asset-manifest.json');
        const assetManifest = JSON.parse(await fs.readFile(assetManifestPath, 'utf-8'));
        if (assetManifest.files && assetManifest.files['main.js']) {
          mainScriptPath = assetManifest.files['main.js'];
        } else if (assetManifest.entrypoints && assetManifest.entrypoints.length > 0) {
          // Try entrypoints array
          const jsFiles = assetManifest.entrypoints.filter(ep => ep.endsWith('.js'));
          if (jsFiles.length > 0) {
            mainScriptPath = jsFiles[0];
          }
        }
      } catch (err) {
        console.warn('[SSR Stream] Could not read asset manifest:', err.message);
      }
      
      // Prepare initial data script (must be before other scripts for hydration)
      const dataScript = `  <script>window.__INITIAL_DATA__ = ${JSON.stringify(blogData).replace(/</g, '\\u003c')};</script>`;
      
      // Create the blog post component
      const blogComponent = createBlogPostComponent(blogData);
      const location = `/blog/${blogData.post?.slug || ''}`;
      
      const app = React.createElement(
        HelmetProvider,
        {},
        React.createElement(
          StaticRouter,
          { location },
          blogComponent
        )
      );

      // Set response headers FIRST
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600');
      
      // Write the complete HTML head BEFORE starting React stream
      // This ensures all metadata is in the initial HTML response (Next.js style)
      // Format headContent with proper indentation
      const formattedHead = headContent
        .split('\n')
        .map(line => line.trim() ? `  ${line}` : line)
        .join('\n');
      
      const htmlHead = `<!DOCTYPE html>
<html lang="en">
<head>
${formattedHead}
</head>
<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root">`;
      
      // Write head immediately - this ensures meta tags are in page source
      // This is critical for SEO - metadata must be in initial HTML
      res.write(htmlHead);
      console.log('[SSR Stream] ✅ HTML head written with comprehensive metadata (Next.js style)');
      console.log('[SSR Stream] 📋 Meta tags included:', {
        title: blogData.post?.seo?.metaTitle || blogData.post?.title,
        description: (blogData.post?.seo?.metaDescription || blogData.post?.excerpt || '').substring(0, 50) + '...',
        image: blogData.post?.seo?.ogImage?.url || blogData.post?.featuredImage?.url || 'default',
        url: `https://skyfalke.com/blog/${blogData.post?.slug}`
      });

      // Create transform stream for React content
      const { Transform } = require('stream');
      const reactTransform = new Transform({
        transform(chunk, encoding, callback) {
          this.push(chunk);
          callback();
        },
        flush(callback) {
          // Close root div and add scripts
          // Initial data script must come first for client-side hydration
          let htmlTail = `</div>\n  ${dataScript}`;
          
          // Add any scripts from the template body
          if (bodyScripts) {
            htmlTail += '\n  ' + bodyScripts;
          } else if (mainScriptPath) {
            // Use script path from asset manifest
            htmlTail += `\n  <script src="${mainScriptPath}"></script>`;
          } else {
            // Final fallback: try common build output patterns
            htmlTail += '\n  <script src="/static/js/main.js"></script>';
          }
          
          htmlTail += '\n</body>\n</html>';
          this.push(htmlTail);
          callback();
        }
      });
      
      // Start React streaming
      const { pipe, abort } = ReactDOMServer.renderToPipeableStream(
        app,
        {
          bootstrapScripts: [], // We manually add scripts
          onShellReady() {
            console.log('[SSR Stream] Shell ready, starting React stream');
            pipe(reactTransform);
            reactTransform.pipe(res);
          },
          onAllReady() {
            console.log('[SSR Stream] ✅ All content streamed successfully');
          },
          onError(error) {
            console.error('[SSR Stream] ❌ Error during rendering:', error);
            abort();
            if (!res.headersSent) {
              res.status(500).send('Error rendering page');
            } else {
              res.end();
            }
            reject(error);
          }
        }
      );
      
      // Handle response events
      res.on('finish', () => {
        console.log('[SSR Stream] Response finished successfully');
        resolve();
      });
      
      res.on('error', (error) => {
        console.error('[SSR Stream] Response error:', error);
        abort();
        reject(error);
      });
      
    } catch (error) {
      console.error('[SSR Stream] ❌ Fatal error:', error);
      if (!res.headersSent) {
        res.status(500).send('Error rendering page');
      } else {
        res.end();
      }
      reject(error);
    }
  });
}

module.exports = {
  renderBlogPostStream,
  createBlogPostComponent,
  generateMetaTags
};