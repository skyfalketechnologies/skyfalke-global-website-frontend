import React, { useMemo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FaSnowflake, FaStar } from 'react-icons/fa';

/**
 * Lightweight, non-intrusive Christmas decorations component
 * Only renders subtle snowflakes and stars when Christmas theme is active
 */
const ChristmasDecorations = () => {
  const { isChristmasTheme } = useTheme();

  // Generate stable random positions using useMemo to prevent regeneration on every render
  const snowflakeData = useMemo(() => {
    return Array.from({ length: 12 }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 4,
    }));
  }, []);

  const starData = useMemo(() => {
    return Array.from({ length: 8 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
    }));
  }, []);

  if (!isChristmasTheme) {
    return null;
  }

  return (
    <div className="christmas-decorations fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Subtle snowflakes */}
      <div className="snowflakes" aria-hidden="true">
        {snowflakeData.map((snowflake, i) => (
          <div
            key={`snowflake-${i}`}
            className="snowflake"
            style={{
              left: `${snowflake.left}%`,
              animationDelay: `${snowflake.delay}s`,
              animationDuration: `${snowflake.duration}s`,
            }}
          >
            <FaSnowflake className="snowflake-icon" />
          </div>
        ))}
      </div>

      {/* Subtle stars */}
      <div className="stars" aria-hidden="true">
        {starData.map((star, i) => (
          <div
            key={`star-${i}`}
            className="star"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          >
            <FaStar className="star-icon" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChristmasDecorations;

