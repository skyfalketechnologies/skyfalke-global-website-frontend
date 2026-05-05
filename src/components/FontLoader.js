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

    preloadFonts();

    // Ensure the locally hosted brand fonts use swap behavior.
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
