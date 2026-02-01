'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SocialSharing from './SocialSharing';
import useMobileDetection from '../hooks/useMobileDetection';
import { getAnimationProps } from '../utils/animationUtils';

const FloatingSocialBar = ({ 
  title, 
  url, 
  description = '', 
  image = '', 
  platforms = ['facebook', 'whatsapp', 'twitter', 'linkedin'],
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { shouldAnimate } = useMobileDetection();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsVisible(scrollTop > 300); // Show after scrolling 300px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = (platform, shareData) => {
    // Analytics tracking can be added here
    console.log(`Shared on ${platform}:`, shareData);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        {...getAnimationProps({
          initial: { opacity: 0, x: 100 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 100 },
          transition: { duration: 0.3, ease: 'easeOut' }
        }, shouldAnimate)}
        className={`fixed right-6 top-1/2 transform -translate-y-1/2 z-50 ${className}`}
      >
        <div className="relative">
          {/* Main Share Button */}
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
            {...getAnimationProps({
              whileHover: { scale: 1.1 },
              whileTap: { scale: 0.95 }
            }, shouldAnimate)}
            title="Share this page"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </motion.button>

          {/* Social Sharing Buttons */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute right-16 top-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 border border-gray-200 dark:border-gray-700"
              >
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Share</h4>
                </div>
                
                <SocialSharing
                  title={title}
                  url={url}
                  description={description}
                  image={image}
                  platforms={platforms}
                  size="small"
                  variant="vertical"
                  onShare={handleShare}
                  className="mb-3"
                />

                {/* Close Button */}
                <button
                  onClick={() => setIsExpanded(false)}
                  className="w-full px-3 py-2 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  Close
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingSocialBar;
