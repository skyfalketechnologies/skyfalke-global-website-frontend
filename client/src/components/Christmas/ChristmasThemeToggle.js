import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FaTree, FaSnowflake } from 'react-icons/fa';

/**
 * Christmas Theme Toggle Button Component
 * Allows users to manually enable/disable the Christmas theme
 */
const ChristmasThemeToggle = ({ className = '' }) => {
  const { isChristmasTheme, toggleChristmasTheme } = useTheme();

  return (
    <button
      onClick={toggleChristmasTheme}
      className={`christmas-toggle-btn ${className}`}
      aria-label={isChristmasTheme ? 'Disable Christmas theme' : 'Enable Christmas theme'}
      title={isChristmasTheme ? 'Disable Christmas theme' : 'Enable Christmas theme'}
    >
      <span className="christmas-toggle-icon">
        {isChristmasTheme ? <FaTree /> : <FaSnowflake />}
      </span>
      <span className="christmas-toggle-text">
        {isChristmasTheme ? 'Christmas Mode' : 'Enable Christmas'}
      </span>
    </button>
  );
};

export default ChristmasThemeToggle;

