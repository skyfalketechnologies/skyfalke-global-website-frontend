'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCookieBite, FaCheck, FaInfoCircle } from 'react-icons/fa';
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
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 32 }}
        className="fixed inset-x-0 bottom-0 z-50 p-2 pb-3 sm:p-6"
      >
        <div className="mx-auto max-h-[86vh] max-w-6xl overflow-y-auto overflow-x-hidden rounded-xl border border-secondary-500/45 bg-primary-900 shadow-[0_30px_80px_-35px_rgba(2,6,23,0.95)] backdrop-blur sm:rounded-2xl">
          <div className="h-[1px] w-full bg-secondary-500/80" />
          <div className="flex flex-col gap-5 p-4 sm:gap-6 sm:p-6 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
            {/* Main Content */}
            <div className="flex-1">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-secondary-500/40 bg-secondary-500/10 text-secondary-300">
                  <FaCookieBite className="text-base" />
                </div>
                <div className="flex-1">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-secondary-400/90">
                    Privacy & data transparency
                  </p>
                  <h3 className="mb-2 text-base font-semibold tracking-[0.01em] text-white sm:text-xl">
                    Cookie Preferences
                  </h3>
                  <p className="mb-4 max-w-3xl text-sm leading-5 text-slate-300 sm:leading-6 sm:text-[15px]">
                    We use cookies and similar technologies to provide, protect, and improve our services.
                    Your privacy is important to us, and we respect your choices.
                  </p>
                  
                  {/* Cookie Details */}
                  {showDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 rounded-xl border border-white/10 bg-primary-900/35 p-4 sm:mt-5 sm:p-5"
                    >
                      <h4 className="mb-4 text-base font-semibold text-white">Cookie categories</h4>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-secondary-500">
                            <FaCheck className="text-xs text-white" />
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-white">Essential Cookies</span>
                            <p className="mt-1 text-sm text-slate-300">
                              Required for the website to function properly. These cannot be disabled.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-500">
                            <FaInfoCircle className="text-xs text-white" />
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-white">Analytics Cookies</span>
                            <p className="mt-1 text-sm text-slate-300">
                              Help us understand how visitors interact with our website by collecting and reporting information anonymously.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-500">
                            <FaInfoCircle className="text-xs text-white" />
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-white">Marketing Cookies</span>
                            <p className="mt-1 text-sm text-slate-300">
                              Used to track visitors across websites to display relevant and engaging advertisements.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className="flex items-center gap-2 text-sm font-medium text-secondary-300 transition-colors hover:text-secondary-200"
                    >
                      <FaInfoCircle className="text-xs" />
                      {showDetails ? 'Hide details' : 'Manage preferences'}
                    </button>
                    <a 
                      href="/privacy" 
                      className="text-sm font-medium text-slate-400 transition-colors hover:text-secondary-200"
                    >
                      Privacy Policy
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid w-full grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:flex lg:w-auto lg:min-w-[220px] lg:flex-col">
              <button
                onClick={handleDecline}
                className="min-h-[44px] w-full rounded-lg border border-slate-500/70 bg-slate-800/40 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-all duration-200 hover:border-slate-300 hover:bg-slate-700/45"
              >
                Decline All
              </button>
              <button
                onClick={handleAcceptEssential}
                className="min-h-[44px] w-full rounded-lg border border-secondary-500/50 bg-secondary-500/10 px-4 py-2.5 text-sm font-semibold text-secondary-300 transition-all duration-200 hover:bg-secondary-500/20"
              >
                Essential Only
              </button>
              <button
                onClick={handleAcceptAll}
                className="order-first min-h-[46px] w-full rounded-lg bg-secondary-500 px-4 py-2.5 text-sm font-semibold text-[#0c0f14] shadow-[0_8px_22px_-8px_rgba(224,174,0,0.65)] transition-all duration-200 hover:bg-secondary-400 sm:order-none"
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
