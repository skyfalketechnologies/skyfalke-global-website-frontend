'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Check if it's Christmas season (December through January 6th)
const isChristmasSeason = () => {
  const now = new Date();
  const month = now.getMonth(); // 0-11, where 11 is December, 0 is January
  const day = now.getDate(); // 1-31
  
  // December (month 11) or January 1-6 (month 0, days 1-6)
  return month === 11 || (month === 0 && day <= 6);
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isChristmasTheme, setIsChristmasTheme] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    if (typeof window === 'undefined') return;
    
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(prefersDark);
    }

    // Check for Christmas theme preference or auto-enable during Christmas season
    const savedChristmasTheme = localStorage.getItem('christmasTheme');
    const isChristmasTime = isChristmasSeason();
    
    // Priority: If it's Christmas season (Dec 1 - Jan 6), auto-enable (user can still toggle it off)
    // If not Christmas season, use saved preference or default to false
    if (isChristmasTime) {
      // It's Christmas season - auto-enable Christmas theme
      setIsChristmasTheme(true);
    } else if (savedChristmasTheme !== null) {
      // Not Christmas season - use saved preference
      setIsChristmasTheme(savedChristmasTheme === 'true');
    } else {
      // Not Christmas season and no saved preference - default to false
      setIsChristmasTheme(false);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Apply Christmas theme to document
    if (isChristmasTheme) {
      document.documentElement.classList.add('christmas');
      localStorage.setItem('christmasTheme', 'true');
    } else {
      document.documentElement.classList.remove('christmas');
      localStorage.setItem('christmasTheme', 'false');
    }
  }, [isChristmasTheme]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const toggleChristmasTheme = () => {
    setIsChristmasTheme(prev => !prev);
  };

  const value = {
    isDarkMode,
    toggleTheme,
    isChristmasTheme,
    toggleChristmasTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
