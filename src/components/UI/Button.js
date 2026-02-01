'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Professional Button Component
 * Webflow-inspired button with smooth animations
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  fullWidth = false,
  ...props
}) => {
  const baseClasses = 'relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    accent: 'btn-accent',
  };
  
  const sizes = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3.5 px-8 text-base',
    lg: 'py-4 px-10 text-lg',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`;
  
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 20 : 18;
  
  return (
    <motion.button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="spinner spinner-sm"></span>
        </span>
      )}
      
      <span className={`flex items-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {Icon && iconPosition === 'left' && (
          <Icon size={iconSize} className="transition-transform duration-300 group-hover:translate-x-1" />
        )}
        {children}
        {Icon && iconPosition === 'right' && (
          <Icon size={iconSize} className="transition-transform duration-300 group-hover:-translate-x-1" />
        )}
      </span>
    </motion.button>
  );
};

export default Button;

