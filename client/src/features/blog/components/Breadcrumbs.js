import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaChevronRight } from 'react-icons/fa';

/**
 * Breadcrumbs Component - SEO-friendly navigation
 * Includes schema.org BreadcrumbList markup
 */
const Breadcrumbs = ({ items = [] }) => {
  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    ...items
  ];

  const schemaBreadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://skyfalke.com${item.href}`
    }))
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
                  to={item.href}
                  className="hover:text-yellow transition-colors"
                  itemProp="item"
                >
                  {index === 0 && <FaHome className="w-4 h-4" />}
                  {index > 0 && <span itemProp="name">{item.name}</span>}
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

