import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { usePathname } from 'next/navigation';

const MetaManager = ({ 
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
}) => {
  const pathname = usePathname();
  const [isInitialized, setIsInitialized] = useState(false);

  // Get the current URL
  const currentUrl = url || `${window.location.origin}${pathname}`;
  
  // Get the full image URL
  const fullImageUrl = image && image.startsWith('http') ? image : `${window.location.origin}${image || '/images/logos/logo.svg'}`;

  // Prevent flash of default content by updating meta tags immediately
  useEffect(() => {
    // Update document title immediately
    if (title) {
      document.title = title;
    }

    // Update critical meta tags immediately to prevent flash
    const updateMetaTag = (name, content, property = false) => {
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
      
      if (content) {
        meta.setAttribute('content', content);
      }
    };

    // Update critical meta tags immediately
    if (description) {
      updateMetaTag('description', description);
    }
    
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }

    // Update Open Graph tags immediately
    if (ogTitle || title) {
      updateMetaTag('og:title', ogTitle || title, true);
    }
    
    if (ogDescription || description) {
      updateMetaTag('og:description', ogDescription || description, true);
    }
    
    if (fullImageUrl) {
      updateMetaTag('og:image', fullImageUrl, true);
    }
    
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', currentUrl, true);

    // Update Twitter Card tags immediately
    if (twitterTitle || title) {
      updateMetaTag('twitter:title', twitterTitle || title);
    }
    
    if (twitterDescription || description) {
      updateMetaTag('twitter:description', twitterDescription || description);
    }
    
    if (twitterImage || fullImageUrl) {
      updateMetaTag('twitter:image', twitterImage || fullImageUrl);
    }

    // Update canonical URL
    const canonicalUrl = canonical || currentUrl;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    setIsInitialized(true);
  }, [title, description, keywords, image, url, type, author, publishedTime, category, tags, ogTitle, ogDescription, twitterTitle, twitterDescription, twitterImage, canonical, currentUrl, fullImageUrl]);

  // Don't render anything if not initialized to prevent flash
  if (!isInitialized) {
    return null;
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical || currentUrl} />
      
      {/* Robots Meta */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={ogDescription || description} />
      <meta property="og:site_name" content="Skyfalke" />
      <meta property="og:locale" content="en_US" />
      
      {/* Additional Open Graph tags for articles */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {author && <meta property="article:author" content={author} />}
          {category && <meta property="article:section" content={category} />}
          {tags && tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={twitterTitle || title} />
      <meta name="twitter:description" content={twitterDescription || description} />
      <meta name="twitter:image" content={twitterImage || fullImageUrl} />
      <meta name="twitter:image:alt" content={twitterDescription || description} />
      <meta name="twitter:site" content="@skyfalke" />
      <meta name="twitter:creator" content="@skyfalke" />
    </Helmet>
  );
};

export default MetaManager;
