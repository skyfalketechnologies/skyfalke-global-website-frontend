'use client';

import React from 'react';
import Link from 'next/link';
import { FaHome, FaChevronRight } from 'react-icons/fa';

/**
 * Breadcrumbs Component - SEO-friendly navigation
 * Includes schema.org BreadcrumbList markup
 */
const Breadcrumbs = ({ items = [] }) => {
  // Ensure all items have valid names and hrefs
  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    ...items.map(item => ({
      name: (item.name && item.name.trim()) || 'Page',
      href: item.href || '#'
    }))
  ].filter(item => item.href && item.href !== '#'); // Only filter out items with no valid href

  const base = 'https://skyfalke.com';
  const schemaBreadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, index) => {
      const url = `${base}${item.href}`;
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: {
          '@type': 'WebPage',
          '@id': url,
          name: item.name,
        },
      };
    }),
  };

  return (
    <>
      <nav 
        className="mb-6 text-sm" 
        aria-label="Breadcrumb"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        <ol className="flex items-center gap-2 text-gray-600">
          {breadcrumbItems.map((item, index) => (
            <li 
              key={index}
              className="flex items-center gap-2"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {index > 0 && <FaChevronRight className="w-3 h-3 text-gray-400" />}
              {index === breadcrumbItems.length - 1 ? (
                <span className="text-gray-900 font-medium" itemProp="name">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-yellow transition-colors"
                  itemProp="item"
                >
                  {index === 0 && <FaHome className="w-4 h-4" aria-hidden />}
                  {/* Google requires ListItem name or item.name; icon-only home had neither in microdata */}
                  <span itemProp="name" className={index === 0 ? 'sr-only' : ''}>
                    {item.name}
                  </span>
                </Link>
              )}
              <meta itemProp="position" content={index + 1} />
            </li>
          ))}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumbs) }}
      />
    </>
  );
};

export default Breadcrumbs;

