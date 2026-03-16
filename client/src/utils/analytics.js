// Analytics Configuration and Tracking Utilities
// Google Analytics 4 (GA4) and Meta Pixel integration

// Configuration
const ANALYTICS_CONFIG = {
  // Google Analytics 4
  GA4_MEASUREMENT_ID: process.env.REACT_APP_GA4_MEASUREMENT_ID || 'G-17FP61REQX',
  
  // Meta Pixel
  META_PIXEL_ID: process.env.REACT_APP_META_PIXEL_ID || '1234567890',
  
  // Debug mode
  DEBUG: process.env.NODE_ENV === 'development'
};

// Admin URL patterns to exclude from analytics tracking
const ADMIN_URL_PATTERNS = [
  '/system/dashboard',
  '/system/portal',
  '/system/',
  '/admin',
  '/administrator',
  '/admin-panel'
];

// Check if current URL is an admin URL
const isAdminURL = (url = null) => {
  if (typeof window === 'undefined') return false;
  
  let pathname;
  if (url) {
    // If URL is provided, extract pathname from it
    try {
      const urlObj = url.startsWith('http') ? new URL(url) : { pathname: url };
      pathname = urlObj.pathname;
    } catch (e) {
      // If URL parsing fails, treat as pathname
      pathname = url;
    }
  } else {
    pathname = window.location.pathname;
  }
  
  return ADMIN_URL_PATTERNS.some(pattern => {
    if (pattern.endsWith('/')) {
      return pathname.startsWith(pattern);
    }
    return pathname === pattern || pathname.startsWith(pattern + '/');
  });
};

// Initialize Google Analytics 4
export const initializeGA4 = () => {
  if (typeof window === 'undefined' || !ANALYTICS_CONFIG.GA4_MEASUREMENT_ID) {
    if (ANALYTICS_CONFIG.DEBUG) {
      console.warn('GA4 not initialized: Missing measurement ID or not in browser environment');
    }
    return;
  }

  // Skip initialization on admin URLs
  if (isAdminURL()) {
    if (ANALYTICS_CONFIG.DEBUG) {
      console.log('GA4 initialization skipped: Admin URL detected');
    }
    return;
  }

  // Check cookie consent
  const cookieConsent = localStorage.getItem('cookieConsent');
  if (cookieConsent !== 'all') {
    // Cookie consent not granted
    return;
  }

  // Check if GA4 is already initialized
  if (window.gtag) {
    return;
  }

  // Load Google Analytics script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.GA4_MEASUREMENT_ID}`;
  
  script.onload = () => {
    try {
      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      
      gtag('js', new Date());
      
      // Only send page view if not on admin URL
      if (!isAdminURL()) {
        gtag('config', ANALYTICS_CONFIG.GA4_MEASUREMENT_ID, {
          page_title: document.title,
          page_location: window.location.href,
          debug_mode: ANALYTICS_CONFIG.DEBUG,
          send_page_view: true
        });
      } else {
        // Initialize without page view tracking
        gtag('config', ANALYTICS_CONFIG.GA4_MEASUREMENT_ID, {
          debug_mode: ANALYTICS_CONFIG.DEBUG,
          send_page_view: false
        });
      }

      window.gtag = gtag;

      // Google Analytics 4 initialized successfully
    } catch (error) {
      if (ANALYTICS_CONFIG.DEBUG) {
        console.error('Error initializing GA4:', error);
      }
      // Remove the script tag if initialization fails
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    }
  };

  script.onerror = () => {
    if (ANALYTICS_CONFIG.DEBUG) {
      console.error('Failed to load Google Analytics script');
    }
    // Remove the script tag to prevent further errors
    if (script.parentNode) {
      script.parentNode.removeChild(script);
    }
  };

  document.head.appendChild(script);
};

// Initialize Meta Pixel
export const initializeMetaPixel = () => {
  if (typeof window === 'undefined' || !ANALYTICS_CONFIG.META_PIXEL_ID) {
    return;
  }

  // Skip initialization on admin URLs
  if (isAdminURL()) {
    if (ANALYTICS_CONFIG.DEBUG) {
      console.log('Meta Pixel initialization skipped: Admin URL detected');
    }
    return;
  }

  // Check cookie consent
  const cookieConsent = localStorage.getItem('cookieConsent');
  if (cookieConsent !== 'all') {
    return;
  }

  // Load Meta Pixel script
  const script = document.createElement('script');
  const shouldTrackPageView = !isAdminURL();
  script.innerHTML = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${ANALYTICS_CONFIG.META_PIXEL_ID}');
    ${shouldTrackPageView ? "fbq('track', 'PageView');" : ''}
  `;
  document.head.appendChild(script);

  // Add noscript fallback (only if not admin URL)
  if (shouldTrackPageView) {
    const noscript = document.createElement('noscript');
    const img = document.createElement('img');
    img.height = 1;
    img.width = 1;
    img.style.display = 'none';
    img.src = `https://www.facebook.com/tr?id=${ANALYTICS_CONFIG.META_PIXEL_ID}&ev=PageView&noscript=1`;
    noscript.appendChild(img);
    document.head.appendChild(noscript);
  }

  // Meta Pixel initialized successfully
};

// Google Analytics 4 Event Tracking
export const trackGA4Event = (eventName, parameters = {}) => {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  // Skip tracking on admin URLs
  if (isAdminURL()) {
    return;
  }

  // Check cookie consent
  const cookieConsent = localStorage.getItem('cookieConsent');
  if (cookieConsent !== 'all') {
    return;
  }

  window.gtag('event', eventName, {
    ...parameters,
    event_timeout: 2000
  });

  // GA4 Event tracked
};

// Meta Pixel Event Tracking
export const trackMetaPixelEvent = (eventName, parameters = {}) => {
  if (typeof window === 'undefined' || !window.fbq) {
    return;
  }

  // Skip tracking on admin URLs
  if (isAdminURL()) {
    return;
  }

  // Check cookie consent
  const cookieConsent = localStorage.getItem('cookieConsent');
  if (cookieConsent !== 'all') {
    return;
  }

  window.fbq('track', eventName, parameters);

  // Meta Pixel Event tracked
};

// Page View Tracking
export const trackPageView = (pageTitle = null, pageLocation = null) => {
  // Skip tracking on admin URLs
  const location = pageLocation || (typeof window !== 'undefined' ? window.location.href : '');
  if (isAdminURL(location)) {
    if (ANALYTICS_CONFIG.DEBUG) {
      console.log('Page view tracking skipped: Admin URL detected');
    }
    return;
  }

  // Check cookie consent
  const cookieConsent = localStorage.getItem('cookieConsent');
  if (cookieConsent !== 'all') {
    return;
  }

  const title = pageTitle || document.title;

  // GA4 Page View
  if (window.gtag) {
    window.gtag('config', ANALYTICS_CONFIG.GA4_MEASUREMENT_ID, {
      page_title: title,
      page_location: location
    });
  }

  // Meta Pixel Page View
  if (window.fbq) {
    window.fbq('track', 'PageView');
  }

  // Page View tracked
};

// E-commerce Tracking
export const trackPurchase = (transactionId, value, currency = 'USD', items = []) => {
  // GA4 Purchase Event
  trackGA4Event('purchase', {
    transaction_id: transactionId,
    value: value,
    currency: currency,
    items: items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
      category: item.category
    }))
  });

  // Meta Pixel Purchase Event
  trackMetaPixelEvent('Purchase', {
    content_ids: items.map(item => item.id),
    content_type: 'product',
    value: value,
    currency: currency,
    num_items: items.reduce((sum, item) => sum + item.quantity, 0)
  });
};

export const trackAddToCart = (item) => {
  // GA4 Add to Cart Event
  trackGA4Event('add_to_cart', {
    currency: 'USD',
    value: item.price,
    items: [{
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: 1,
      category: item.category
    }]
  });

  // Meta Pixel Add to Cart Event
  trackMetaPixelEvent('AddToCart', {
    content_ids: [item.id],
    content_name: item.name,
    content_type: 'product',
    value: item.price,
    currency: 'USD'
  });
};

export const trackViewItem = (item) => {
  // GA4 View Item Event
  trackGA4Event('view_item', {
    currency: 'USD',
    value: item.price,
    items: [{
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      category: item.category
    }]
  });

  // Meta Pixel View Content Event
  trackMetaPixelEvent('ViewContent', {
    content_ids: [item.id],
    content_name: item.name,
    content_type: 'product',
    value: item.price,
    currency: 'USD'
  });
};

// Lead Generation Tracking
export const trackLead = (source = 'website', value = null) => {
  // GA4 Lead Event
  trackGA4Event('generate_lead', {
    value: value,
    currency: 'USD',
    source: source
  });

  // Meta Pixel Lead Event
  trackMetaPixelEvent('Lead', {
    content_name: 'Lead Generation',
    content_category: source,
    value: value,
    currency: 'USD'
  });
};

// Contact Form Tracking
export const trackContactForm = (formType = 'general') => {
  trackGA4Event('form_submit', {
    form_name: formType,
    form_id: `${formType}_contact_form`
  });

  trackMetaPixelEvent('Lead', {
    content_name: `${formType} Contact Form`,
    content_category: 'Contact'
  });
};

// Blog Engagement Tracking
export const trackBlogView = (blogPost) => {
  trackGA4Event('view_item', {
    content_type: 'blog',
    item_id: blogPost.id,
    item_name: blogPost.title,
    item_category: blogPost.category
  });

  trackMetaPixelEvent('ViewContent', {
    content_ids: [blogPost.id],
    content_name: blogPost.title,
    content_type: 'article',
    content_category: blogPost.category
  });
};

// Service Page Tracking
export const trackServiceView = (service) => {
  trackGA4Event('view_item', {
    content_type: 'service',
    item_id: service.id,
    item_name: service.name,
    item_category: service.category
  });

  trackMetaPixelEvent('ViewContent', {
    content_ids: [service.id],
    content_name: service.name,
    content_type: 'service',
    content_category: service.category
  });
};

// Custom Event Tracking
export const trackCustomEvent = (eventName, parameters = {}) => {
  trackGA4Event(eventName, parameters);
  trackMetaPixelEvent(eventName, parameters);
};

// User Properties
export const setUserProperties = (properties) => {
  if (window.gtag) {
    window.gtag('config', ANALYTICS_CONFIG.GA4_MEASUREMENT_ID, {
      custom_map: properties
    });
  }
};

// User ID Tracking
export const setUserId = (userId) => {
  if (window.gtag) {
    window.gtag('config', ANALYTICS_CONFIG.GA4_MEASUREMENT_ID, {
      user_id: userId
    });
  }

  if (window.fbq) {
    window.fbq('init', ANALYTICS_CONFIG.META_PIXEL_ID, {
      external_id: userId
    });
  }
};

// Conversion Tracking
export const trackConversion = (conversionId, conversionLabel, value = null) => {
  if (window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: `${ANALYTICS_CONFIG.GA4_MEASUREMENT_ID}/${conversionId}/${conversionLabel}`,
      value: value,
      currency: 'USD'
    });
  }
};

// Enhanced E-commerce Tracking
export const trackCheckout = (step, value, items = []) => {
  trackGA4Event('begin_checkout', {
    currency: 'USD',
    value: value,
    items: items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
      category: item.category
    }))
  });

  trackMetaPixelEvent('InitiateCheckout', {
    content_ids: items.map(item => item.id),
    content_type: 'product',
    value: value,
    currency: 'USD',
    num_items: items.reduce((sum, item) => sum + item.quantity, 0)
  });
};

// Social Media Tracking
export const trackSocialShare = (platform, content) => {
  trackGA4Event('share', {
    method: platform,
    content_type: content.type,
    item_id: content.id
  });

  trackMetaPixelEvent('Share', {
    content_name: content.title,
    content_type: content.type,
    content_ids: [content.id]
  });
};

// Search Tracking
export const trackSearch = (searchTerm, resultsCount) => {
  trackGA4Event('search', {
    search_term: searchTerm,
    results_count: resultsCount
  });

  trackMetaPixelEvent('Search', {
    search_string: searchTerm,
    content_category: 'Search'
  });
};

// Video Tracking
export const trackVideoPlay = (videoTitle, videoId) => {
  trackGA4Event('video_start', {
    video_title: videoTitle,
    video_id: videoId
  });

  trackMetaPixelEvent('VideoView', {
    content_name: videoTitle,
    content_ids: [videoId],
    content_type: 'video'
  });
};

// Initialize all analytics
export const initializeAnalytics = () => {
  initializeGA4();
  initializeMetaPixel();
  
  // Track initial page view
  setTimeout(() => {
    trackPageView();
  }, 100);
};

// Initialize analytics when cookie consent is granted
export const initializeAnalyticsWithConsent = () => {
  const cookieConsent = localStorage.getItem('cookieConsent');
  if (cookieConsent === 'all') {
    initializeGA4();
    initializeMetaPixel();
    
    // Track initial page view
    setTimeout(() => {
      trackPageView();
    }, 100);
  }
};

// Test GA4 Connection
export const testGA4Connection = () => {
  if (typeof window === 'undefined' || !window.gtag) {
    console.warn('GA4 not available for testing');
    return false;
  }

  // Skip test on admin URLs
  if (isAdminURL()) {
    return false;
  }

  // Send a test event
  window.gtag('event', 'test_connection', {
    event_category: 'analytics_test',
    event_label: 'GA4 connection test',
    value: 1
  });

  // GA4 test event sent successfully
  return true;
};

// Export configuration for external use
export const getAnalyticsConfig = () => ANALYTICS_CONFIG;
