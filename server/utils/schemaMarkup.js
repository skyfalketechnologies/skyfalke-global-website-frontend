// Server-side Schema Markup Generator
// This utility generates structured data for server-side rendering and API responses

const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Skyfalke",
    "url": "https://skyfalke.com",
    "logo": "https://skyfalke.com/images/logos/logo.svg",
    "description": "Skyfalke offers sustainable and reliable web hosting powered by 100% renewable energy. Enjoy eco-friendly domain registration, server renting, and cloud computing services with top-notch performance.",
    "foundingDate": "2023",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "Global",
      "addressRegion": "Africa"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "info@skyfalke.com",
      "url": "https://skyfalke.com/contact"
    },
    "sameAs": [
      "https://www.linkedin.com/company/skyfalke",
      "https://twitter.com/skyfalke",
      "https://facebook.com/skyfalke"
    ]
  };
};

const generateWebsiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Skyfalke",
    "url": "https://skyfalke.com",
    "description": "Sustainable Cloud Solutions Partner In Africa & Beyond",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://skyfalke.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };
};

const generateBreadcrumbSchema = (breadcrumbs) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
};

const generateArticleSchema = (article) => {
  // Add null checks to prevent runtime errors
  if (!article || typeof article !== 'object') {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title || "Blog Post",
    "description": article.excerpt || (article.content ? article.content.substring(0, 160) : "Blog post content"),
    "image": article.featuredImage || "https://skyfalke.com/images/logos/logo.svg",
    "author": {
      "@type": "Person",
      "name": article.author?.name || "Skyfalke Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Skyfalke",
      "logo": {
        "@type": "ImageObject",
        "url": "https://skyfalke.com/images/logos/logo.svg"
      }
    },
    "datePublished": article.publishedAt || new Date().toISOString(),
    "dateModified": article.updatedAt || new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://skyfalke.com/blog/${article.slug || 'post'}`
    },
    "keywords": article.tags?.join(", ") || "digital marketing, cloud solutions, green hosting",
    "articleSection": article.category || "Digital Marketing"
  };
};

const generateProductSchema = (product) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.images?.[0]?.url || "https://skyfalke.com/images/logos/logo.svg",
    "brand": {
      "@type": "Brand",
      "name": "Skyfalke"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "USD",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": `https://skyfalke.com/shop/product/${product.slug}`
    },
    "category": product.category
  };
};

const generateJobPostingSchema = (job) => {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "datePosted": job.createdAt,
    "validThrough": job.deadline,
    "employmentType": job.type || "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": "Skyfalke",
      "sameAs": "https://skyfalke.com"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": job.location?.country || "Global",
        "addressRegion": job.location?.region || "Africa"
      }
    }
  };
};

const generateFAQSchema = (faqs) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

const generateCaseStudySchema = (caseStudy) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": caseStudy.title,
    "description": caseStudy.summary,
    "image": caseStudy.images?.[0]?.url || "https://skyfalke.com/images/logos/logo.svg",
    "author": {
      "@type": "Organization",
      "name": "Skyfalke"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Skyfalke",
      "logo": {
        "@type": "ImageObject",
        "url": "https://skyfalke.com/images/logos/logo.svg"
      }
    },
    "datePublished": caseStudy.publishedAt,
    "dateModified": caseStudy.updatedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://skyfalke.com/case-studies/${caseStudy.slug}`
    },
    "keywords": caseStudy.tags?.join(", ") || "case study, digital marketing, cloud solutions",
    "articleSection": "Case Studies"
  };
};

// Helper function to generate multiple schemas
const generatePageSchemas = (schemas) => {
  return schemas.map(schema => ({
    "@context": "https://schema.org",
    ...schema
  }));
};

// Generate schemas for API responses
const generateAPISchemas = (contentType, data) => {
  const baseSchemas = [generateOrganizationSchema(), generateWebsiteSchema()];
  
  let additionalSchemas = [];
  
  switch (contentType) {
    case 'blog':
      additionalSchemas = [generateArticleSchema(data)];
      break;
    case 'product':
      additionalSchemas = [generateProductSchema(data)];
      break;
    case 'job':
      additionalSchemas = [generateJobPostingSchema(data)];
      break;
    case 'case-study':
      additionalSchemas = [generateCaseStudySchema(data)];
      break;
    default:
      additionalSchemas = [];
  }
  
  // Filter out any null schemas and combine with base schemas
  const validAdditionalSchemas = additionalSchemas.filter(schema => schema !== null);
  return [...baseSchemas, ...validAdditionalSchemas];
};

// Generate HTML script tags for schema markup
const generateSchemaScriptTags = (schemas) => {
  return schemas.map(schema => 
    `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`
  ).join('\n');
};

module.exports = {
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateBreadcrumbSchema,
  generateArticleSchema,
  generateProductSchema,
  generateJobPostingSchema,
  generateFAQSchema,
  generateCaseStudySchema,
  generatePageSchemas,
  generateAPISchemas,
  generateSchemaScriptTags
};
