'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaInfoCircle } from 'react-icons/fa';
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
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-5"
        role="dialog"
        aria-label="Cookie consent"
      >
        <div className="mx-auto max-h-[80vh] w-full max-w-4xl overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="p-5 sm:p-6">
            <h3 className="text-base font-semibold text-gray-900">
              We value your privacy
            </h3>
            <p className="mt-1.5 text-sm leading-6 text-gray-600">
              We use cookies to enhance your browsing experience, analyze site traffic, and deliver
              relevant content. You can accept all cookies, allow essential cookies only, or decline.
              Read our{' '}
              <a href="/privacy" className="font-medium text-primary-600 underline underline-offset-2 hover:text-primary-700">
                Privacy Policy
              </a>{' '}
              to learn more.
            </p>

            {/* Cookie Details */}
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 overflow-hidden rounded-md border border-gray-200 bg-gray-50"
              >
                <div className="divide-y divide-gray-200">
                  <div className="flex items-start justify-between gap-4 p-4">
                    <div>
                      <span className="text-sm font-medium text-gray-900">Essential Cookies</span>
                      <p className="mt-0.5 text-sm text-gray-600">
                        Required for the website to function properly. These cannot be disabled.
                      </p>
                    </div>
                    <span className="mt-0.5 inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                      <FaCheck className="text-[10px]" /> Always on
                    </span>
                  </div>
                  <div className="p-4">
                    <span className="text-sm font-medium text-gray-900">Analytics Cookies</span>
                    <p className="mt-0.5 text-sm text-gray-600">
                      Help us understand how visitors interact with our website by collecting information anonymously.
                    </p>
                  </div>
                  <div className="p-4">
                    <span className="text-sm font-medium text-gray-900">Marketing Cookies</span>
                    <p className="mt-0.5 text-sm text-gray-600">
                      Used to measure the effectiveness of our campaigns and show you relevant content.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700"
              >
                <FaInfoCircle className="text-xs" />
                {showDetails ? 'Hide cookie details' : 'Cookie details'}
              </button>

              <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                <button
                  onClick={handleDecline}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Decline
                </button>
                <button
                  onClick={handleAcceptEssential}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Essential only
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="rounded-md bg-primary-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
                >
                  Accept all
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieBanner;
