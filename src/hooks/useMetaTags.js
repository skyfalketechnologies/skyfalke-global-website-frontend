import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const useMetaTags = (metaData) => {
  const pathname = usePathname();

  useEffect(() => {
    if (!metaData) return;

    const {
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
      twitterImage,
      canonical,
      noIndex = false
    } = metaData;

    // Get the current URL
    const currentUrl = url || `${window.location.origin}${pathname}`;
    
    // Get the full image URL
    const fullImageUrl = image && image.startsWith('http') ? image : `${window.location.origin}${image || '/images/logos/logo.svg'}`;

    // Update document title immediately
    if (title) {
      document.title = title;
    }

    // Helper function to update or create meta tags
    const updateMetaTag = (name, content, property = false) => {
      if (!content) return;
      
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector);
      
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

    // Update critical meta tags immediately
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);

    // Update Open Graph tags immediately
    updateMetaTag('og:title', ogTitle || title, true);
    updateMetaTag('og:description', ogDescription || description, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:image', fullImageUrl, true);
    updateMetaTag('og:image:width', '1200', true);
    updateMetaTag('og:image:height', '630', true);
    updateMetaTag('og:image:alt', ogDescription || description, true);
    updateMetaTag('og:site_name', 'Skyfalke', true);
    updateMetaTag('og:locale', 'en_US', true);

    // Update Twitter Card tags immediately
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', twitterTitle || title);
    updateMetaTag('twitter:description', twitterDescription || description);
    updateMetaTag('twitter:image', twitterImage || fullImageUrl);
    updateMetaTag('twitter:image:alt', twitterDescription || description);
    updateMetaTag('twitter:site', '@skyfalke');
    updateMetaTag('twitter:creator', '@skyfalke');

    // Update canonical URL
    const canonicalUrl = canonical || currentUrl;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Update robots meta
    const robotsContent = noIndex ? 'noindex, nofollow' : 'index, follow';
    updateMetaTag('robots', robotsContent);

    // Update article-specific meta tags for blog posts
    if (type === 'article') {
      updateMetaTag('article:published_time', publishedTime, true);
      updateMetaTag('article:author', author, true);
      updateMetaTag('article:section', category, true);
      
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

  }, [metaData, pathname]);
};

export default useMetaTags;
