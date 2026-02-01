import React, { useState, useEffect, useRef } from 'react';

/**
 * Table of Contents Component - Generates TOC from headings
 * SEO-friendly navigation for long articles
 */
const TableOfContents = ({ content }) => {
  const [headings, setHeadings] = useState([]);
  const [activeHeading, setActiveHeading] = useState('');
  const contentRef = useRef(null);

  useEffect(() => {
    if (!content) return;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const headingElements = tempDiv.querySelectorAll('h2, h3, h4');
    
    const tocItems = Array.from(headingElements).map((element, index) => {
      const id = element.id || `heading-${index}`;
      if (!element.id) {
        element.id = id;
      }
      
      return {
        id,
        text: element.textContent.trim(),
        level: element.tagName.toLowerCase(),
        element
      };
    });

    setHeadings(tocItems);
  }, [content]);

  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (let i = headings.length - 1; i >= 0; i--) {
        const element = document.getElementById(headings[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveHeading(headings[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const scrollToHeading = (headingId) => {
    const element = document.getElementById(headingId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  if (headings.length === 0) return null;

  return (
    <nav 
      className="hidden lg:block w-64 flex-shrink-0"
      aria-label="Table of contents"
    >
      <div className="sticky top-24 bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4 font-nexa-heavy flex items-center gap-2">
          <svg className="w-5 h-5 text-dark-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Table of Contents
        </h3>
        <ul className="space-y-1">
          {headings.map((heading) => (
            <li key={heading.id}>
              <button
                onClick={() => scrollToHeading(heading.id)}
                className={`toc-item block w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  activeHeading === heading.id 
                    ? 'bg-yellow/10 text-yellow font-semibold' 
                    : 'text-gray-600 hover:bg-gray-100'
                } ${
                  heading.level === 'h3' ? 'ml-4' : heading.level === 'h4' ? 'ml-8' : ''
                }`}
              >
                <span className="truncate block">{heading.text}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default TableOfContents;

