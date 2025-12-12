/**
 * Utility functions for handling animations based on device type and user preferences
 */

/**
 * Get animation properties that respect mobile and reduced motion preferences
 * @param {Object} defaultAnimation - Default animation object
 * @param {boolean} shouldAnimate - Whether animations should be enabled
 * @returns {Object} - Animation object with disabled properties if needed
 */
export const getAnimationProps = (defaultAnimation, shouldAnimate) => {
  if (!shouldAnimate) {
    return {
      initial: false,
      animate: false,
      exit: false,
      transition: { duration: 0 },
      whileHover: {},
      whileTap: {},
      whileInView: {},
      ...defaultAnimation
    };
  }
  return defaultAnimation;
};

/**
 * Get motion component props that disable animations on mobile
 * @param {Object} props - Original motion component props
 * @param {boolean} shouldAnimate - Whether animations should be enabled
 * @returns {Object} - Modified props with animations disabled if needed
 */
export const getMotionProps = (props, shouldAnimate) => {
  if (!shouldAnimate) {
    return {
      ...props,
      initial: false,
      animate: false,
      exit: false,
      transition: { duration: 0 },
      whileHover: {},
      whileTap: {},
      whileInView: {}
    };
  }
  return props;
};

/**
 * Get transition properties that respect mobile preferences
 * @param {Object} defaultTransition - Default transition object
 * @param {boolean} shouldAnimate - Whether animations should be enabled
 * @returns {Object} - Transition object with duration set to 0 if needed
 */
export const getTransitionProps = (defaultTransition, shouldAnimate) => {
  if (!shouldAnimate) {
    return { duration: 0 };
  }
  return defaultTransition;
};

/**
 * Get scroll-based animation values that respect mobile preferences
 * @param {Object} scrollValues - Scroll-based animation values
 * @param {boolean} shouldAnimate - Whether animations should be enabled
 * @returns {Object} - Scroll values with animations disabled if needed
 */
export const getScrollAnimationValues = (scrollValues, shouldAnimate) => {
  if (!shouldAnimate) {
    return Object.keys(scrollValues).reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {});
  }
  return scrollValues;
};

/**
 * Create a motion component wrapper that conditionally disables animations
 * @param {React.Component} Component - The motion component to wrap
 * @param {boolean} shouldAnimate - Whether animations should be enabled
 * @returns {React.Component} - Wrapped component with conditional animations
 */
export const createConditionalMotionComponent = (Component, shouldAnimate) => {
  return (props) => {
    const motionProps = getMotionProps(props, shouldAnimate);
    return <Component {...motionProps} />;
  };
};
