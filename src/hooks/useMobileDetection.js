import { useState, useEffect } from 'react';

/**
 * Custom hook to detect mobile devices and provide animation preferences
 * @returns {Object} - { isMobile, prefersReducedMotion, shouldAnimate }
 */
const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      // Check if device is mobile based on screen width
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      // Check if user prefers reduced motion
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setPrefersReducedMotion(prefersReduced);
    };

    // Initial check
    checkDevice();

    // Listen for resize events
    window.addEventListener('resize', checkDevice);

    // Listen for changes in motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      window.removeEventListener('resize', checkDevice);
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Determine if animations should be enabled
  const shouldAnimate = !isMobile && !prefersReducedMotion;

  return {
    isMobile,
    prefersReducedMotion,
    shouldAnimate
  };
};

export default useMobileDetection;
