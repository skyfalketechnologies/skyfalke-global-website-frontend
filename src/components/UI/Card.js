'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Professional Card Component
 * Webflow-inspired card with hover effects
 */
const Card = ({
  children,
  variant = 'default',
  hover = true,
  className = '',
  onClick,
  ...props
}) => {
  const baseClasses = 'bg-white rounded-2xl transition-all duration-500 border border-gray-100';
  
  const variants = {
    default: 'card',
    gradient: 'card-gradient',
    elevated: 'card shadow-2xl',
  };
  
  const hoverClass = hover ? 'hover-lift cursor-pointer' : '';
  
  const cardClasses = `${baseClasses} ${variants[variant]} ${hoverClass} ${className}`;
  
  const Component = onClick ? motion.div : 'div';
  const motionProps = onClick ? {
    whileHover: { y: -4 },
    whileTap: { y: 0 },
    transition: { duration: 0.2 }
  } : {};
  
  return (
    <Component
      className={cardClasses}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;

