// SEO-friendly Schema Markup Generator
// This utility generates structured data for better search engine understanding

/** Canonical site origin (matches NEXT_PUBLIC_SITE_URL in production). */
export const SITE_URL =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SITE_URL) ||
  'https://skyfalke.com';

const LOGO_URL = `${SITE_URL}/images/logos/logo.svg`;

/**
 * Global Organization + WebSite graph — injected once in app/layout.js to avoid
 * duplicating these on every page (client SchemaMarkup adds page-level types only).
 */
export function getGlobalSchemaJsonLd(siteUrl = SITE_URL) {
  const base = siteUrl.replace(/\/$/, '');
  const logoUrl = `${base}/images/logos/logo.svg`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${base}/#organization`,
        name: 'Skyfalke',
        url: base,
        logo: {
          '@type': 'ImageObject',
          url: logoUrl,
          width: 200,
          height: 60,
        },
        description:
          'Digital growth and automation systems for modern organizations — combining AI, cloud, data, and digital marketing.',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'KE',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: 'info@skyfalke.com',
          telephone: '+254-717-797-238',
          url: `${base}/contact`,
        },
        sameAs: [
          'https://www.linkedin.com/company/skyfalke',
          'https://twitter.com/skyfalke',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${base}/#website`,
        name: 'Skyfalke',
        url: base,
        description:
          'Digital growth and automation systems for modern organizations — combining AI, cloud, data, and digital marketing.',
        publisher: { '@id': `${base}/#organization` },
        inLanguage: 'en-US',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${base}/blog?search={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };
}

export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Skyfalke",
    "url": SITE_URL,
    "logo": {
      "@type": "ImageObject",
      "url": LOGO_URL,
    },
    "description":
      "Digital growth and automation systems for modern organizations - combining AI, cloud, data, and digital marketing.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "KE"
    },
    "sameAs": [
      "https://www.linkedin.com/company/skyfalke",
      "https://twitter.com/skyfalke"
    ]
  };
};

export const generateWebsiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Skyfalke",
    "url": SITE_URL,
    "description":
      "Digital growth and automation systems for modern organizations — combining AI, cloud, data, and digital marketing.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${SITE_URL}/blog?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Skyfalke",
      "logo": {
        "@type": "ImageObject",
        "url": LOGO_URL
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
    "image": article.featuredImage || LOGO_URL,
    "author": {
      "@type": "Person",
      "name": article.author?.name || "Skyfalke Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Skyfalke",
      "logo": {
        "@type": "ImageObject",
        "url": LOGO_URL
      }
    },
    "datePublished": article.publishedAt || new Date().toISOString(),
    "dateModified": article.updatedAt || new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${article.slug || 'post'}`
    },
    "keywords": article.tags?.join(", ") || "digital marketing, cloud solutions, web hosting",
    "articleSection": article.category || "Digital Marketing"
  };
};

export const generateProductSchema = (product) => {
  // Add null checks to prevent runtime errors
  if (!product || typeof product !== 'object') {
    return null;
  }

  const base = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name || "Product",
    "description": product.description || "Product description",
    "image": product.images?.[0]?.url || LOGO_URL,
    "brand": {
      "@type": "Brand",
      "name": "Skyfalke"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price || 0,
      "priceCurrency": "USD",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": `${SITE_URL}/shop/product/${product.slug || 'product'}`
    },
    "category": product.category || "General",
  };
  if (product.rating) {
    base.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewCount || 0
    };
  }
  return base;
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
      "sameAs": SITE_URL
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

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name || "Service",
    "description": service.description || "Service description",
    "provider": {
      "@type": "Organization",
      "name": "Skyfalke",
      "url": SITE_URL
    },
    "areaServed": {
      "@type": "Country",
      "name": "Global"
    },
    "serviceType": service.category || "General Service",
  };
  const price = service.price;
  if (price != null && Number(price) > 0) {
    schema.offers = {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    };
  }
  return schema;
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
    "url": SITE_URL,
    "telephone": "+254-717-797-238",
    "email": "info@skyfalke.com",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "KE",
      "addressRegion": "Africa"
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
      "url": SITE_URL
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
    "image": caseStudy.images?.[0]?.url || LOGO_URL,
    "author": {
      "@type": "Organization",
      "name": "Skyfalke"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Skyfalke",
      "logo": {
        "@type": "ImageObject",
        "url": LOGO_URL
      }
    },
    "datePublished": caseStudy.publishedAt || new Date().toISOString(),
    "dateModified": caseStudy.updatedAt || new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_URL}/case-studies/${caseStudy.slug || 'case-study'}`
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
    "url": `${SITE_URL}/contact`,
    "mainEntity": {
      "@type": "Organization",
      "name": "Skyfalke",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "info@skyfalke.com",
        "url": `${SITE_URL}/contact`
      }
    }
  };
};

/** Generic WebPage for home, academy hub, etc. */
export const generateWebPageSchema = (page = {}) => {
  const url = page.url || SITE_URL;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url.replace(/\/$/, '')}/#webpage`,
    "name": page.name || "Skyfalke",
    "description": page.description || "",
    "url": url,
    "isPartOf": { "@id": `${SITE_URL.replace(/\/$/, '')}/#website` },
    "inLanguage": "en-US",
  };
};

export const generateAboutPageSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Skyfalke",
    "description":
      "Learn about Skyfalke's mission to provide sustainable cloud solutions and digital marketing services across Africa and beyond.",
    "url": `${SITE_URL}/about`,
    "mainEntity": { "@id": `${SITE_URL.replace(/\/$/, '')}/#organization` },
  };
};

/** Blog listing: CollectionPage + Blog (publisher references global Organization). */
export const generateBlogIndexSchemas = () => {
  const base = SITE_URL.replace(/\/$/, '');
  const blogUrl = `${base}/blog`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${blogUrl}/#webpage`,
      name: "Skyfalke Blog",
      description:
        "Insights on digital marketing, cloud solutions, sustainable technology, and business growth.",
      url: blogUrl,
      isPartOf: { "@id": `${base}/#website` },
      inLanguage: "en-US",
    },
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      "@id": `${blogUrl}/#blog`,
      name: "Skyfalke Blog",
      url: blogUrl,
      publisher: { "@id": `${base}/#organization` },
      inLanguage: "en-US",
    },
  ];
};

export const generateCollectionPageSchema = (page = {}) => {
  const url = page.url || SITE_URL;
  const base = SITE_URL.replace(/\/$/, '');
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: page.name || "Skyfalke",
    description: page.description || "",
    url,
    isPartOf: { "@id": `${base}/#website` },
    inLanguage: "en-US",
  };
};

export const generateCourseSchema = (course) => {
  if (!course || typeof course !== "object") {
    return null;
  }
  const slug = course.slug || "course";
  const pageUrl = `${SITE_URL}/academy/courses/${slug}`;
  const imageUrl =
    course.image && String(course.image).startsWith("http")
      ? course.image
      : course.image
        ? `${SITE_URL.replace(/\/$/, "")}${course.image.startsWith("/") ? "" : "/"}${course.image}`
        : LOGO_URL;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title || "Course",
    description: course.shortDescription || course.description || "",
    url: pageUrl,
    provider: {
      "@type": "Organization",
      name: "Skyfalke",
      url: SITE_URL,
      sameAs: [
        "https://www.linkedin.com/company/skyfalke",
        "https://twitter.com/skyfalke",
      ],
    },
    educationalLevel: course.level || undefined,
    courseCode: course.category || undefined,
    image: imageUrl,
  };

  if (course.price != null && Number(course.price) > 0) {
    schema.offers = {
      "@type": "Offer",
      price: course.price,
      priceCurrency: "USD",
      url: pageUrl,
    };
  }

  if (course.durationHours != null) {
    schema.timeRequired = `PT${course.durationHours}H`;
  }

  return JSON.parse(JSON.stringify(schema));
};

// Helper function to generate multiple schemas
export const generatePageSchemas = (schemas) => {
  return schemas.map(schema => ({
    "@context": "https://schema.org",
    ...schema
  }));
};

/**
 * Page-level JSON-LD only. Organization + WebSite are emitted once via
 * getGlobalSchemaJsonLd() in the root layout.
 */
export const getDefaultSchemas = (pageType, data = {}) => {
  let additionalSchemas = [];

  switch (pageType) {
    case 'home':
      additionalSchemas = [
        generateWebPageSchema({
          name: 'Skyfalke | Digital Growth & Automation Systems for Modern Organizations',
          url: `${SITE_URL}/`,
          description:
            'Skyfalke helps businesses simplify operations, automate workflows, and scale smarter with AI, cloud, data, and digital marketing.',
        }),
      ];
      break;
    case 'about':
      additionalSchemas = [generateAboutPageSchema()];
      break;
    case 'contact':
      additionalSchemas = [generateContactPageSchema()];
      break;
    case 'blog':
      additionalSchemas = [generateArticleSchema(data)];
      break;
    case 'blog-index':
      additionalSchemas = generateBlogIndexSchemas();
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
    case 'course':
      additionalSchemas = [generateCourseSchema(data)];
      break;
    case 'courses':
      additionalSchemas = [
        generateCollectionPageSchema({
          name: 'All Courses | Skyfalke Academy',
          description:
            'Browse online courses in ICT, AI, digital transformation, and cloud innovation.',
          url: `${SITE_URL}/academy/courses`,
        }),
      ];
      break;
    case 'academy':
      additionalSchemas = [
        generateWebPageSchema({
          name: 'Skyfalke Academy – Online ICT & AI Learning',
          url: `${SITE_URL}/academy`,
          description:
            'Short courses and masterclasses in ICT, AI, Cloud, and Digital Transformation.',
        }),
      ];
      break;
    case 'resources':
      additionalSchemas = [
        generateCollectionPageSchema({
          name: 'Free Marketing & Business Resources | Skyfalke',
          description:
            'Templates, guides, and tools for digital marketing, SEO, and business growth.',
          url: `${SITE_URL}/resources`,
        }),
      ];
      break;
    default:
      additionalSchemas = [];
  }

  return additionalSchemas.filter((schema) => schema !== null);
};
