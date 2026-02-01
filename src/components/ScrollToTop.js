'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initScrollAnimations } from '../utils/scrollReveal';

const ScrollToTop = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top when pathname changes
    const scrollToTop = () => {
      // Use smooth scrolling with easing
      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      } else {
        // Fallback for browsers that don't support smooth scrolling
        window.scrollTo(0, 0);
      }
    };

    // Small delay to ensure the page has rendered
    const timer = setTimeout(scrollToTop, 100);

    // Initialize scroll animations after route change
    const animationTimer = setTimeout(() => {
      initScrollAnimations();
    }, 300);

    return () => {
      clearTimeout(timer);
      clearTimeout(animationTimer);
    };
  }, [pathname]);

  // Initialize scroll animations on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      initScrollAnimations();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return null; // This component doesn't render anything
};

export default ScrollToTop;
