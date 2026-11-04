/**
 * Professional Scroll Reveal Utility
 * Provides Webflow-like scroll animations with Intersection Observer
 */

/**
 * Check if device is mobile
 * @returns {boolean} - True if device is mobile
 */
const isMobileDevice = () => {
  return window.innerWidth < 1024 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Initialize scroll reveal for elements with data-reveal attribute
 * @param {Object} options - Configuration options
 */
export const initScrollReveal = (options = {}) => {
  // Skip animations on mobile devices
  if (isMobileDevice()) {
    // On mobile, immediately reveal all elements without animation
    const revealElements = document.querySelectorAll('[data-reveal]');
    revealElements.forEach((element) => {
      element.classList.add('reveal', 'revealed');
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    });
    return null;
  }

  const {
    threshold = 0.1,
    rootMargin = '0px 0px -100px 0px',
    animationDelay = 0,
    staggerDelay = 100,
  } = options;

  const observerOptions = {
    threshold,
    rootMargin,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const delay = animationDelay + (index * staggerDelay);
        
        setTimeout(() => {
          element.classList.add('revealed');
          observer.unobserve(element);
        }, delay);
      }
    });
  }, observerOptions);

  // Observe all elements with data-reveal attribute
  const revealElements = document.querySelectorAll('[data-reveal]');
  revealElements.forEach((element) => {
    element.classList.add('reveal');
    observer.observe(element);
  });

  return observer;
};

/**
 * Reveal element with specific animation type
 * @param {HTMLElement} element - Element to reveal
 * @param {string} animationType - Type of animation (fade-in, slide-up, etc.)
 */
export const revealElement = (element, animationType = 'fade-in') => {
  if (!element) return;
  
  // Skip animations on mobile devices
  if (isMobileDevice()) {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
    return;
  }
  
  element.classList.add(animationType);
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        observer.unobserve(element);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(element);
};

/**
 * Parallax scroll effect
 * @param {HTMLElement} element - Element to apply parallax
 * @param {number} speed - Parallax speed (0-1)
 */
export const initParallax = (element, speed = 0.5) => {
  if (!element) return;

  // Skip parallax on mobile devices
  if (isMobileDevice()) {
    return () => {}; // Return empty cleanup function
  }

  const handleScroll = () => {
    const scrolled = window.pageYOffset;
    const parallax = scrolled * speed;
    element.style.transform = `translateY(${parallax}px)`;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
};

/**
 * Smooth scroll to element with offset
 * @param {string|HTMLElement} target - Element ID or element
 * @param {number} offset - Offset from top in pixels
 */
export const smoothScrollTo = (target, offset = 0) => {
  const element = typeof target === 'string' 
    ? document.querySelector(target) 
    : target;
  
  if (!element) return;

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
};

/**
 * Initialize all scroll animations on page load
 */
export const initScrollAnimations = () => {
  // Skip scroll animations on mobile devices
  if (isMobileDevice()) {
    // On mobile, just reveal elements immediately without animations
    const revealElements = document.querySelectorAll('[data-reveal]');
    revealElements.forEach((element) => {
      element.classList.add('reveal', 'revealed');
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    });
    return;
  }

  // Initialize scroll reveal
  initScrollReveal({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    staggerDelay: 100,
  });

  // Add smooth scroll behavior to all anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        smoothScrollTo(target, 100);
      }
    });
  });
};

