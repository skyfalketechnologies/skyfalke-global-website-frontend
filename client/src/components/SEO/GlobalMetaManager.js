'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const NOINDEX_PATH_PREFIXES = [
  '/system',
  '/admin',
  '/admin-panel',
  '/administrator',
  '/login',
  '/dashboard',
  '/portal',
  '/checkout',
];

const GlobalMetaManager = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const shouldNoIndex = NOINDEX_PATH_PREFIXES.some((prefix) =>
      pathname === prefix || pathname.startsWith(`${prefix}/`)
    );

    // Function to update meta tags immediately
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

    // Update canonical URL immediately on route change
    const currentUrl = `${window.location.origin}${pathname}`;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentUrl);

    // Update og:url immediately
    updateMetaTag('og:url', currentUrl, true);

    // Keep robots aligned with App Router metadata after client navigations
    updateMetaTag('robots', shouldNoIndex ? 'noindex, nofollow' : 'index, follow');

  }, [pathname]);

  return null; // This component doesn't render anything
};

export default GlobalMetaManager;
