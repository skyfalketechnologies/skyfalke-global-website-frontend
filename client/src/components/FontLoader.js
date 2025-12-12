import React, { useEffect } from 'react';

const FontLoader = () => {
  useEffect(() => {
    // Preload critical fonts
    const preloadFonts = () => {
      const fonts = [
        {
          href: '/font/Nexa-ExtraLight.ttf',
          type: 'font/ttf',
          crossorigin: 'anonymous'
        },
        {
          href: '/font/Nexa-Heavy.ttf',
          type: 'font/ttf',
          crossorigin: 'anonymous'
        }
      ];

      fonts.forEach(font => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'font';
        link.href = font.href;
        link.type = font.type;
        link.crossOrigin = font.crossorigin;
        document.head.appendChild(link);
      });
    };

    // Load Google Fonts with display=swap
    const loadGoogleFonts = () => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = 'https://fonts.googleapis.com';
      document.head.appendChild(link);

      const link2 = document.createElement('link');
      link2.rel = 'preconnect';
      link2.href = 'https://fonts.gstatic.com';
      link2.crossOrigin = 'anonymous';
      document.head.appendChild(link2);

      const fontLink = document.createElement('link');
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700&display=swap';
      fontLink.rel = 'stylesheet';
      document.head.appendChild(fontLink);
    };

    preloadFonts();
    loadGoogleFonts();

    // Add font-display: swap to existing font faces
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Nexa';
        src: url('/font/Nexa-ExtraLight.ttf') format('truetype');
        font-weight: 200;
        font-style: normal;
        font-display: swap;
      }
      
      @font-face {
        font-family: 'Nexa';
        src: url('/font/Nexa-Heavy.ttf') format('truetype');
        font-weight: 800;
        font-style: normal;
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
  }, []);

  return null;
};

export default FontLoader;
