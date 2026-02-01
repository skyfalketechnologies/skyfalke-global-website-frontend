// SEO-friendly Schema Markup Generator
// This utility generates structured data for better search engine understanding

export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Skyfalke",
    "url": "https://skyfalke.com",
    "logo": "https://skyfalke.com/images/logos/logo.svg",
    "description": "Skyfalke offers sustainable and reliable web hosting powered by 100% renewable energy. Enjoy eco-friendly domain registration, server renting, and cloud computing services with top-notch performance.",
    "foundingDate": "2020",
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
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Digital Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Green Web Hosting",
            "description": "Eco-friendly web hosting powered by renewable energy"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Digital Marketing",
            "description": "Comprehensive digital marketing solutions"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Cloud Computing",
            "description": "Sustainable cloud computing services"
          }
        }
      ]
    }
  };
};

export const generateWebsiteSchema = () => {
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
    },
    "publisher": {
      "@type": "Organization",
      "name": "Skyfalke",
      "logo": {
        "@type": "ImageObject",
        "url": "https://skyfalke.com/images/logos/logo.svg"
      }
    }
  };
};

export const generateBreadcrumbSchema = (breadcrumbs) => {
  // Add null checks to prevent runtime errors
  if (!breadcrumbs || !Array.isArray(breadcrumbs) || breadcrumbs.length === 0) {
    return null;
  }

  // Ensure all breadcrumbs have valid names and filter out invalid ones
  const validBreadcrumbs = breadcrumbs
    .filter((crumb) => crumb && crumb.url) // Must have a URL
    .map((crumb) => ({
      name: (crumb.name && String(crumb.name).trim()) || "Page", // Ensure name is always present and non-empty
      url: crumb.url
    }));

  if (validBreadcrumbs.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": validBreadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name, // Name is guaranteed to be present and non-empty
      "item": crumb.url
    }))
  };
};

export const generateArticleSchema = (article) => {
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

export const generateProductSchema = (product) => {
  // Add null checks to prevent runtime errors
  if (!product || typeof product !== 'object') {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name || "Product",
    "description": product.description || "Product description",
    "image": product.images?.[0]?.url || "https://skyfalke.com/images/logos/logo.svg",
    "brand": {
      "@type": "Brand",
      "name": "Skyfalke"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price || 0,
      "priceCurrency": "USD",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": `https://skyfalke.com/shop/product/${product.slug || 'product'}`
    },
    "category": product.category || "General",
    "aggregateRating": product.rating ? {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewCount || 0
    } : undefined
  };
};

export const generateJobPostingSchema = (job) => {
  // Add null checks to prevent runtime errors
  if (!job || typeof job !== 'object') {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title || "Job Position",
    "description": job.description || "Job description",
    "datePosted": job.createdAt || new Date().toISOString(),
    "validThrough": job.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
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
    },
    "applicantLocationRequirements": {
      "@type": "Country",
      "name": job.location?.country || "Global"
    },
    "qualifications": job.requirements || "Requirements not specified",
    "responsibilities": job.responsibilities || "Responsibilities not specified",
    "salaryCurrency": "USD",
    "baseSalary": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": {
        "@type": "QuantitativeValue",
        "minValue": job.salary?.min || 0,
        "maxValue": job.salary?.max || 0,
        "unitText": "YEAR"
      }
    }
  };
};

export const generateServiceSchema = (service) => {
  // Add null checks to prevent runtime errors
  if (!service || typeof service !== 'object') {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name || "Service",
    "description": service.description || "Service description",
    "provider": {
      "@type": "Organization",
      "name": "Skyfalke",
      "url": "https://skyfalke.com"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Global"
    },
    "serviceType": service.category || "General Service",
    "offers": {
      "@type": "Offer",
      "price": service.price || 0,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  };
};

export const generateFAQSchema = (faqs) => {
  // Add null checks to prevent runtime errors
  if (!faqs || !Array.isArray(faqs) || faqs.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question || "Question",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer || "Answer"
      }
    }))
  };
};

export const generateLocalBusinessSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Skyfalke",
    "description": "Sustainable Cloud Solutions Partner In Africa & Beyond",
    "url": "https://skyfalke.com",
    "telephone": "+254-717-797-238",
    "email": "info@skyfalke.com",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "Global",
      "addressRegion": "Africa"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 0,
      "longitude": 0
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday", 
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://www.linkedin.com/company/skyfalke",
      "https://twitter.com/skyfalke"
    ]
  };
};

export const generateEventSchema = (event) => {
  // Add null checks to prevent runtime errors
  if (!event || typeof event !== 'object') {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title || "Event",
    "description": event.description || "Event description",
    "startDate": event.startDate || new Date().toISOString(),
    "endDate": event.endDate || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    "location": {
      "@type": "Place",
      "name": event.location?.name || "Online",
      "address": event.location?.address || "Virtual Event"
    },
    "organizer": {
      "@type": "Organization",
      "name": "Skyfalke",
      "url": "https://skyfalke.com"
    },
    "performer": {
      "@type": "Organization",
      "name": "Skyfalke"
    },
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": event.isVirtual ? "https://schema.org/OnlineEventAttendanceMode" : "https://schema.org/OfflineEventAttendanceMode"
  };
};

export const generateCaseStudySchema = (caseStudy) => {
  // Add null checks to prevent runtime errors
  if (!caseStudy || typeof caseStudy !== 'object') {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": caseStudy.title || "Case Study",
    "description": caseStudy.summary || "Case study summary",
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
    "datePublished": caseStudy.publishedAt || new Date().toISOString(),
    "dateModified": caseStudy.updatedAt || new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://skyfalke.com/case-studies/${caseStudy.slug || 'case-study'}`
    },
    "keywords": caseStudy.tags?.join(", ") || "case study, digital marketing, cloud solutions",
    "articleSection": "Case Studies",
    "about": {
      "@type": "Organization",
      "name": caseStudy.client?.name || "Client",
      "industry": caseStudy.client?.industry || "Technology"
    }
  };
};

export const generateContactPageSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Skyfalke",
    "description": "Get in touch with Skyfalke for sustainable cloud solutions and digital marketing services",
    "url": "https://skyfalke.com/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "Skyfalke",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "info@skyfalke.com",
        "url": "https://skyfalke.com/contact"
      }
    }
  };
};

// Helper function to generate multiple schemas
export const generatePageSchemas = (schemas) => {
  return schemas.map(schema => ({
    "@context": "https://schema.org",
    ...schema
  }));
};

// Default schemas for common pages
export const getDefaultSchemas = (pageType, data = {}) => {
  const baseSchemas = [generateOrganizationSchema(), generateWebsiteSchema()];
  
  let additionalSchemas = [];
  
  switch (pageType) {
    case 'home':
      additionalSchemas = [];
      break;
    case 'about':
      additionalSchemas = [generateLocalBusinessSchema()];
      break;
    case 'contact':
      additionalSchemas = [generateContactPageSchema()];
      break;
    case 'blog':
      additionalSchemas = [generateArticleSchema(data)];
      break;
    case 'product':
      additionalSchemas = [generateProductSchema(data)];
      break;
    case 'job':
      additionalSchemas = [generateJobPostingSchema(data)];
      break;
    case 'service':
      additionalSchemas = [generateServiceSchema(data)];
      break;
    case 'case-study':
      additionalSchemas = [generateCaseStudySchema(data)];
      break;
    case 'event':
      additionalSchemas = [generateEventSchema(data)];
      break;
    default:
      additionalSchemas = [];
  }
  
  // Filter out any null schemas and combine with base schemas
  const validAdditionalSchemas = additionalSchemas.filter(schema => schema !== null);
  return [...baseSchemas, ...validAdditionalSchemas];
};
