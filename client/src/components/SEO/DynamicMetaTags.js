import { useEffect } from 'react';

const DynamicMetaTags = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website',
  author = 'Skyfalke',
  publishedTime,
  category,
  tags = [],
  ogTitle,
  ogDescription,
  twitterTitle,
  twitterDescription,
  twitterImage
}) => {
  useEffect(() => {
    console.log('DynamicMetaTags: Updating meta tags for:', { title, description, image, url, type });
    
    // Update document title
    if (title) {
      document.title = title;
    }

    // Force update meta tags by removing and recreating them
    const forceUpdateMetaTag = (name, content, property = false) => {
      // Remove existing meta tag if it exists
      const existingMeta = document.querySelector(`meta[${property ? 'property' : 'name'}="${name}"]`);
      if (existingMeta) {
        existingMeta.remove();
      }
      
      // Create new meta tag
      const meta = document.createElement('meta');
      if (property) {
        meta.setAttribute('property', name);
      } else {
        meta.setAttribute('name', name);
      }
      meta.setAttribute('content', content);
      document.head.appendChild(meta);
    };

    // Update or create meta tags
    const updateMetaTag = (name, content, property = false) => {
      let meta = document.querySelector(`meta[${property ? 'property' : 'name'}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Update basic meta tags - Force update critical ones
    if (description) {
      console.log('Updating description meta tag:', description);
      forceUpdateMetaTag('description', description);
    }
    if (keywords) {
      console.log('Updating keywords meta tag:', keywords);
      updateMetaTag('keywords', keywords);
    }
    if (author) {
      console.log('Updating author meta tag:', author);
      updateMetaTag('author', author);
    }

    // Update Open Graph meta tags - Force update critical ones
    const ogTitleValue = ogTitle || title;
    const ogDescriptionValue = ogDescription || description;
    const ogImageValue = image;
    
    if (ogTitleValue) {
      console.log('Updating og:title meta tag:', ogTitleValue);
      forceUpdateMetaTag('og:title', ogTitleValue, true);
    }
    if (ogDescriptionValue) {
      console.log('Updating og:description meta tag:', ogDescriptionValue);
      forceUpdateMetaTag('og:description', ogDescriptionValue, true);
    }
    if (type) {
      console.log('Updating og:type meta tag:', type);
      forceUpdateMetaTag('og:type', type, true);
    }
    if (url) {
      console.log('Updating og:url meta tag:', url);
      forceUpdateMetaTag('og:url', url, true);
    }
    if (ogImageValue) {
      console.log('Updating og:image meta tag:', ogImageValue);
      forceUpdateMetaTag('og:image', ogImageValue, true);
      updateMetaTag('og:image:width', '1200', true);
      updateMetaTag('og:image:height', '630', true);
      updateMetaTag('og:image:alt', ogDescriptionValue || ogTitleValue, true);
    }

    // Update Twitter Card meta tags - Force update critical ones
    const twitterTitleValue = twitterTitle || title;
    const twitterDescriptionValue = twitterDescription || description;
    const twitterImageValue = twitterImage || image;
    
    if (twitterTitleValue) {
      forceUpdateMetaTag('twitter:title', twitterTitleValue);
    }
    if (twitterDescriptionValue) {
      forceUpdateMetaTag('twitter:description', twitterDescriptionValue);
    }
    if (twitterImageValue) {
      forceUpdateMetaTag('twitter:image', twitterImageValue);
      updateMetaTag('twitter:image:alt', twitterDescriptionValue || twitterTitleValue);
    }

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    if (url) {
      canonical.setAttribute('href', url);
    }

    // Update article-specific meta tags for blog posts
    if (type === 'article') {
      if (publishedTime) {
        updateMetaTag('article:published_time', publishedTime, true);
      }
      if (author) {
        updateMetaTag('article:author', author, true);
      }
      if (category) {
        updateMetaTag('article:section', category, true);
      }
      if (tags && tags.length > 0) {
        // Remove existing article:tag meta tags
        const existingTags = document.querySelectorAll('meta[property="article:tag"]');
        existingTags.forEach(tag => tag.remove());
        
        // Add new article:tag meta tags
        tags.forEach(tag => {
          const tagMeta = document.createElement('meta');
          tagMeta.setAttribute('property', 'article:tag');
          tagMeta.setAttribute('content', tag);
          document.head.appendChild(tagMeta);
        });
      }
    }

    // Verify meta tags were updated
    setTimeout(() => {
      console.log('=== Meta Tag Verification ===');
      console.log('Description:', document.querySelector('meta[name="description"]')?.getAttribute('content'));
      console.log('og:title:', document.querySelector('meta[property="og:title"]')?.getAttribute('content'));
      console.log('og:description:', document.querySelector('meta[property="og:description"]')?.getAttribute('content'));
      console.log('og:image:', document.querySelector('meta[property="og:image"]')?.getAttribute('content'));
      console.log('twitter:title:', document.querySelector('meta[name="twitter:title"]')?.getAttribute('content'));
      console.log('twitter:description:', document.querySelector('meta[name="twitter:description"]')?.getAttribute('content'));
      console.log('twitter:image:', document.querySelector('meta[name="twitter:image"]')?.getAttribute('content'));
      console.log('===========================');
    }, 100);

    // Cleanup function
    return () => {
      // Optionally restore original meta tags when component unmounts
      // This is optional and depends on your needs
    };
  }, [title, description, keywords, image, url, type, author, publishedTime, category, tags, ogTitle, ogDescription, twitterTitle, twitterDescription, twitterImage]);

  return null; // This component doesn't render anything
};

export default DynamicMetaTags;
