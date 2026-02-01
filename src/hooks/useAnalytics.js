import { useCallback } from 'react';
import {
  trackGA4Event,
  trackMetaPixelEvent,
  trackPageView,
  trackPurchase,
  trackAddToCart,
  trackViewItem,
  trackLead,
  trackContactForm,
  trackBlogView,
  trackServiceView,
  trackCustomEvent,
  setUserProperties,
  setUserId,
  trackConversion,
  trackCheckout,
  trackSocialShare,
  trackSearch,
  trackVideoPlay
} from '../utils/analytics';

// Custom hook for analytics
export const useAnalytics = () => {
  // Page tracking
  const trackPage = useCallback((title = null, location = null) => {
    trackPageView(title, location);
  }, []);

  // E-commerce tracking
  const trackProductPurchase = useCallback((transactionId, value, currency = 'USD', items = []) => {
    trackPurchase(transactionId, value, currency, items);
  }, []);

  const trackProductAddToCart = useCallback((item) => {
    trackAddToCart(item);
  }, []);

  const trackProductView = useCallback((item) => {
    trackViewItem(item);
  }, []);

  const trackCheckoutProcess = useCallback((step, value, items = []) => {
    trackCheckout(step, value, items);
  }, []);

  // Lead generation tracking
  const trackLeadGeneration = useCallback((source = 'website', value = null) => {
    trackLead(source, value);
  }, []);

  const trackContactFormSubmission = useCallback((formType = 'general') => {
    trackContactForm(formType);
  }, []);

  // Content tracking
  const trackBlogPostView = useCallback((blogPost) => {
    trackBlogView(blogPost);
  }, []);

  const trackServicePageView = useCallback((service) => {
    trackServiceView(service);
  }, []);

  // Social media tracking
  const trackSocialMediaShare = useCallback((platform, content) => {
    trackSocialShare(platform, content);
  }, []);

  // Search tracking
  const trackSearchQuery = useCallback((searchTerm, resultsCount) => {
    trackSearch(searchTerm, resultsCount);
  }, []);

  // Video tracking
  const trackVideoStart = useCallback((videoTitle, videoId) => {
    trackVideoPlay(videoTitle, videoId);
  }, []);

  // User tracking
  const setUserData = useCallback((properties) => {
    setUserProperties(properties);
  }, []);

  const setUserIdentifier = useCallback((userId) => {
    setUserId(userId);
  }, []);

  // Conversion tracking
  const trackConversionEvent = useCallback((conversionId, conversionLabel, value = null) => {
    trackConversion(conversionId, conversionLabel, value);
  }, []);

  // Custom event tracking
  const trackEvent = useCallback((eventName, parameters = {}) => {
    trackCustomEvent(eventName, parameters);
  }, []);

  // GA4 specific tracking
  const trackGA4 = useCallback((eventName, parameters = {}) => {
    trackGA4Event(eventName, parameters);
  }, []);

  // Meta Pixel specific tracking
  const trackMeta = useCallback((eventName, parameters = {}) => {
    trackMetaPixelEvent(eventName, parameters);
  }, []);

  return {
    // Page tracking
    trackPage,
    
    // E-commerce
    trackProductPurchase,
    trackProductAddToCart,
    trackProductView,
    trackCheckoutProcess,
    
    // Lead generation
    trackLeadGeneration,
    trackContactFormSubmission,
    
    // Content
    trackBlogPostView,
    trackServicePageView,
    
    // Social media
    trackSocialMediaShare,
    
    // Search
    trackSearchQuery,
    
    // Video
    trackVideoStart,
    
    // User tracking
    setUserData,
    setUserIdentifier,
    
    // Conversion
    trackConversionEvent,
    
    // Custom events
    trackEvent,
    trackGA4,
    trackMeta
  };
};
