'use client';

import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  initializeAnalyticsWithConsent, 
  trackPageView,
  getAnalyticsConfig,
  testGA4Connection
} from '../../utils/analytics';

const AnalyticsProvider = ({ children }) => {
  const location = useLocation();

  // Initialize analytics on component mount
  useEffect(() => {
    const config = getAnalyticsConfig();
    
    // Initialize analytics if we have a valid measurement ID and cookie consent
    if (config.GA4_MEASUREMENT_ID) {
      initializeAnalyticsWithConsent();
      if (config.DEBUG) {
        // Analytics initialized successfully
        
        // Test GA4 connection after a short delay
        setTimeout(() => {
          testGA4Connection();
        }, 2000);
      }
    } else if (config.DEBUG) {
      console.warn('Analytics not initialized: Missing measurement ID');
    }
  }, []);

  // Track page views on route changes
  useEffect(() => {
    // Check cookie consent before tracking
    if (typeof window === 'undefined') return;
    
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (cookieConsent !== 'all') {
      return;
    }

    // Small delay to ensure page content is loaded
    const timer = setTimeout(() => {
      trackPageView();
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return <>{children}</>;
};

export default AnalyticsProvider;
