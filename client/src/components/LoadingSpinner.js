'use client';

import React from 'react';
import { motion } from 'framer-motion';
import useMobileDetection from '../hooks/useMobileDetection';
import { getAnimationProps } from '../utils/animationUtils';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...', variant = 'primary' }) => {
  const { shouldAnimate } = useMobileDetection();
  
  const sizeClasses = {
    small: 'w-6 h-6 border-3',
    medium: 'w-12 h-12 border-4',
    large: 'w-16 h-16 border-5'
  };
  
  const variantClasses = {
    primary: 'border-primary-200 border-t-primary-600 border-r-yellow-500',
    secondary: 'border-yellow-200 border-t-yellow-600 border-r-primary-500',
    white: 'border-white/30 border-t-white border-r-white/60',
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <motion.div
        className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-full spinner`}
        {...getAnimationProps({
          animate: { rotate: 360 },
          transition: { duration: 0.8, repeat: Infinity, ease: "linear" }
        }, shouldAnimate)}
      />
      {text && (
        <motion.p
          {...getAnimationProps({
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.2, duration: 0.4 }
          }, shouldAnimate)}
          className="mt-6 text-gray-600 dark:text-gray-400 font-semibold text-sm tracking-wide"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;
