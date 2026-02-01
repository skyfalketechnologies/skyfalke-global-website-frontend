import React, { useEffect } from 'react';

const CriticalCSS = () => {
  useEffect(() => {
    // Inject critical CSS inline for above-the-fold content
    const criticalCSS = `
      /* Critical CSS for above-the-fold content */
      .App {
        min-height: 100vh;
        background-color: #f7fafc;
      }
      
      /* Header critical styles */
      .header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 50;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }
      
      /* Hero section critical styles */
      .hero {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      
      /* Typography critical styles */
      h1, h2, h3, h4, h5, h6 {
        font-family: 'Nexa', 'Inter', sans-serif;
        font-weight: 800;
        line-height: 1.2;
        margin: 0;
      }
      
      /* Button critical styles */
      .btn-primary {
        background: linear-gradient(135deg, #e0ae00 0%, #f6d55c 100%);
        color: #2d3748;
        font-weight: 600;
        padding: 12px 24px;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(224, 174, 0, 0.3);
      }
      
      /* Loading spinner */
      .loading-spinner {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #e0ae00;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      /* Image optimization */
      img {
        max-width: 100%;
        height: auto;
        display: block;
      }
      
      /* Lazy loading placeholder */
      .lazy-load-placeholder {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
      }
      
      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      
      /* Marquee animation */
      @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      
      .animate-marquee {
        animation: marquee 30s linear infinite;
      }
    `;

    // Create and inject critical CSS
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    style.setAttribute('data-critical', 'true');
    document.head.appendChild(style);

    // Load non-critical CSS asynchronously
    const loadNonCriticalCSS = () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/static/css/main.css';
      link.media = 'print';
      link.onload = () => {
        link.media = 'all';
      };
      document.head.appendChild(link);
    };

    // Load non-critical CSS after page load
    if (document.readyState === 'complete') {
      loadNonCriticalCSS();
    } else {
      window.addEventListener('load', loadNonCriticalCSS);
    }

    return () => {
      window.removeEventListener('load', loadNonCriticalCSS);
    };
  }, []);

  return null;
};

export default CriticalCSS;
