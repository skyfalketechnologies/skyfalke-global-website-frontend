'use client';

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  getDefaultSchemas, 
  generateBreadcrumbSchema,
  generateFAQSchema 
} from '../../utils/schemaMarkup';

const SchemaMarkup = ({ 
  pageType = 'home', 
  data = {}, 
  breadcrumbs = [], 
  faqs = [],
  customSchemas = [] 
}) => {
  // Get default schemas for the page type
  const defaultSchemas = getDefaultSchemas(pageType, data);
  
  // Generate additional schemas
  const additionalSchemas = [];
  
  // Add breadcrumb schema if breadcrumbs are provided
  if (breadcrumbs.length > 0) {
    const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
    if (breadcrumbSchema) {
      additionalSchemas.push(breadcrumbSchema);
    }
  }
  
  // Add FAQ schema if FAQs are provided
  if (faqs.length > 0) {
    const faqSchema = generateFAQSchema(faqs);
    if (faqSchema) {
      additionalSchemas.push(faqSchema);
    }
  }
  
  // Add custom schemas (filter out null values)
  const validCustomSchemas = customSchemas.filter(schema => schema !== null);
  additionalSchemas.push(...validCustomSchemas);
  
  // Combine all schemas and filter out any null values
  const allSchemas = [...defaultSchemas, ...additionalSchemas].filter(schema => schema !== null);
  
  return (
    <Helmet>
      {allSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 2)
          }}
        />
      ))}
    </Helmet>
  );
};

export default SchemaMarkup;
