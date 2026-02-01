'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCookieBite, FaTimes, FaCheck, FaInfoCircle } from 'react-icons/fa';
import { initializeAnalyticsWithConsent } from '../utils/analytics';

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookieConsent', 'all');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
    
    // Initialize analytics with consent
    initializeAnalyticsWithConsent();
    
    // Enable analytics and other tracking
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': 'granted'
      });
    }
  };

  const handleAcceptEssential = () => {
    localStorage.setItem('cookieConsent', 'essential');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
    
    // Only enable essential cookies
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied'
      });
    }
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
    
    // Disable all tracking
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied'
      });
    }
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
                 className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 to-slate-800 border-t-4 border-[#e0ae00] shadow-2xl"
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Main Content */}
            <div className="flex-1">
              <div className="flex items-start gap-4">
                                 <div className="w-12 h-12 bg-gradient-to-br from-[#e0ae00] to-[#f4c430] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <FaCookieBite className="text-white text-lg" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-3">
                    Cookie Preferences
                  </h3>
                  <p className="text-slate-300 text-base leading-relaxed mb-4">
                    We use cookies and similar technologies to provide, protect, and improve our services. 
                    Your privacy is important to us, and we respect your choices.
                  </p>
                  
                  {/* Cookie Details */}
                  {showDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 p-6 bg-slate-800/50 rounded-xl border border-slate-700"
                    >
                      <h4 className="font-semibold text-white mb-4 text-lg">Cookie Categories:</h4>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                                                     <div className="w-6 h-6 bg-[#e0ae00] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <FaCheck className="text-white text-xs" />
                          </div>
                          <div>
                            <span className="font-semibold text-white text-sm">Essential Cookies</span>
                            <p className="text-slate-400 text-sm mt-1">
                              Required for the website to function properly. These cannot be disabled.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <FaInfoCircle className="text-white text-xs" />
                          </div>
                          <div>
                            <span className="font-semibold text-white text-sm">Analytics Cookies</span>
                            <p className="text-slate-400 text-sm mt-1">
                              Help us understand how visitors interact with our website by collecting and reporting information anonymously.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <FaInfoCircle className="text-white text-xs" />
                          </div>
                          <div>
                            <span className="font-semibold text-white text-sm">Marketing Cookies</span>
                            <p className="text-slate-400 text-sm mt-1">
                              Used to track visitors across websites to display relevant and engaging advertisements.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div className="flex items-center gap-6 mt-4">
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className="text-sm text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-2 transition-colors"
                    >
                      <FaInfoCircle className="text-xs" />
                      {showDetails ? 'Hide Details' : 'Learn More'}
                    </button>
                    <a 
                      href="/privacy" 
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <button
                onClick={handleDecline}
                className="px-6 py-3 text-sm font-semibold text-slate-300 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg transition-all duration-200 hover:shadow-lg"
              >
                Decline All
              </button>
              <button
                onClick={handleAcceptEssential}
                className="px-6 py-3 text-sm font-semibold text-slate-800 bg-slate-200 hover:bg-white border border-slate-300 rounded-lg transition-all duration-200 hover:shadow-lg"
              >
                Essential Only
              </button>
              <button
                onClick={handleAcceptAll}
                                 className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#e0ae00] to-[#f4c430] hover:from-[#f4c430] hover:to-[#e0ae00] rounded-lg transition-all duration-200 hover:shadow-lg shadow-md"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieBanner;
