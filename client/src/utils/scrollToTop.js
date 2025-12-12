/**
 * Utility function to scroll to the top of the page
 * @param {boolean} smooth - Whether to use smooth scrolling (default: true)
 */
export const scrollToTop = (smooth = true) => {
  if (smooth && 'scrollBehavior' in document.documentElement.style) {
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

/**
 * Utility function to scroll to a specific element by ID
 * @param {string} elementId - The ID of the element to scroll to
 * @param {boolean} smooth - Whether to use smooth scrolling (default: true)
 */
export const scrollToElement = (elementId, smooth = true) => {
  const element = document.getElementById(elementId);
  if (element) {
    if (smooth && 'scrollBehavior' in document.documentElement.style) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      element.scrollIntoView();
    }
  }
};

/**
 * Utility function to scroll to a specific element by selector
 * @param {string} selector - CSS selector for the element
 * @param {boolean} smooth - Whether to use smooth scrolling (default: true)
 */
export const scrollToSelector = (selector, smooth = true) => {
  const element = document.querySelector(selector);
  if (element) {
    if (smooth && 'scrollBehavior' in document.documentElement.style) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      element.scrollIntoView();
    }
  }
};
