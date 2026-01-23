import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Example component demonstrating how to use the Christmas theme context
 * Applies festive styling when Christmas theme is active
 */
const FestiveButton = ({ children, onClick, className = '', ...props }) => {
  const { isChristmasTheme } = useTheme();

  const baseClasses = 'px-6 py-3 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const normalClasses = 'bg-dark-blue text-white hover:bg-primary-700 focus:ring-primary-400';
  const festiveClasses = 'bg-gradient-to-r from-christmas-green to-christmas-red text-white hover:from-christmas-red hover:to-christmas-green focus:ring-christmas-gold shadow-lg hover:shadow-xl';

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isChristmasTheme ? festiveClasses : normalClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default FestiveButton;

