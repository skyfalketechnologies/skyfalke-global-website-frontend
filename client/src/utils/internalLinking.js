/**
 * Internal Linking Utility
 * Provides functions to optimize internal linking structure for better SEO and user experience
 */

// Internal linking suggestions based on content type and keywords
export const internalLinkingSuggestions = {
  // Homepage links
  homepage: [
    { url: '/services', text: 'Our Services', context: 'comprehensive digital marketing solutions' },
    { url: '/about', text: 'About Skyfalke', context: 'learn more about our company' },
    { url: '/case-studies', text: 'Case Studies', context: 'see our success stories' },
    { url: '/blog', text: 'Latest Insights', context: 'read our latest articles' },
    { url: '/contact', text: 'Get Started', context: 'contact us today' }
  ],

  // Service page links
  services: [
    { url: '/services/data-analytics', text: 'Data Analytics', context: 'comprehensive data analysis' },
    { url: '/services/creative', text: 'Creative Services', context: 'stunning design solutions' },
    { url: '/services/business-tools', text: 'Business Tools', context: 'streamline your operations' },
    { url: '/case-studies', text: 'Success Stories', context: 'see how we help businesses' },
    { url: '/contact', text: 'Free Consultation', context: 'discuss your project' }
  ],

  // Blog post links
  blog: [
    { url: '/blog', text: 'More Articles', context: 'explore our blog' },
    { url: '/services', text: 'Our Services', context: 'discover our solutions' },
    { url: '/case-studies', text: 'Case Studies', context: 'real client results' },
    { url: '/academy', text: 'Free Courses', context: 'learn with our academy' },
    { url: '/contact', text: 'Get Help', context: 'need assistance?' }
  ],

  // Case study links
  caseStudies: [
    { url: '/case-studies', text: 'All Case Studies', context: 'browse more success stories' },
    { url: '/services', text: 'Our Services', context: 'see what we offer' },
    { url: '/blog', text: 'Related Articles', context: 'read our insights' },
    { url: '/contact', text: 'Start Your Project', context: 'get similar results' }
  ],

  // Product/Shop links
  products: [
    { url: '/shop', text: 'All Products', context: 'browse our full catalog' },
    { url: '/services', text: 'Custom Solutions', context: 'need something specific?' },
    { url: '/contact', text: 'Bulk Orders', context: 'contact for volume pricing' },
    { url: '/blog', text: 'Product Guides', context: 'learn how to use our products' }
  ]
};

// Keyword-based internal linking suggestions
export const keywordBasedLinks = {
  'digital marketing': [
    { url: '/services', text: 'Digital Marketing Services', priority: 'high' },
    { url: '/blog', text: 'Marketing Insights', priority: 'medium' },
    { url: '/case-studies', text: 'Marketing Success Stories', priority: 'medium' }
  ],
  'cloud hosting': [
    { url: '/cloud', text: 'Cloud Hosting Solutions', priority: 'high' },
    { url: '/services/cloud-solutions', text: 'Cloud Services', priority: 'high' },
    { url: '/blog', text: 'Cloud Computing Articles', priority: 'medium' }
  ],
  'web design': [
    { url: '/services/creative', text: 'Web Design Services', priority: 'high' },
    { url: '/services/creative/ui-ux-design', text: 'UI/UX Design', priority: 'high' },
    { url: '/case-studies', text: 'Design Portfolio', priority: 'medium' }
  ],
  'seo': [
    { url: '/services/business-tools/seo-tools-analytics', text: 'SEO Services', priority: 'high' },
    { url: '/blog', text: 'SEO Tips', priority: 'medium' },
    { url: '/academy', text: 'SEO Courses', priority: 'medium' }
  ],
  'data analytics': [
    { url: '/services/data-analytics', text: 'Data Analytics Services', priority: 'high' },
    { url: '/services/data-analytics/business-intelligence', text: 'Business Intelligence', priority: 'high' },
    { url: '/case-studies', text: 'Analytics Case Studies', priority: 'medium' }
  ]
};

// Contextual linking suggestions based on content
export const contextualLinks = {
  // When mentioning specific services
  'marketing strategy': { url: '/services', text: 'Marketing Strategy Services' },
  'brand design': { url: '/services/creative/brand-design', text: 'Brand Design Services' },
  'social media': { url: '/services/earned-media/social-media-management', text: 'Social Media Management' },
  'content marketing': { url: '/services/earned-media/content-marketing', text: 'Content Marketing' },
  'paid advertising': { url: '/services/paid-media', text: 'Paid Media Services' },
  'email marketing': { url: '/services/business-tools', text: 'Email Marketing Tools' },
  'website development': { url: '/services/creative', text: 'Web Development' },
  'mobile app': { url: '/services/business-tools/custom-applications', text: 'Mobile App Development' },
  'e-commerce': { url: '/services/business-tools', text: 'E-commerce Solutions' },
  'cloud migration': { url: '/services/cloud-solutions', text: 'Cloud Migration' },
  'disaster recovery': { url: '/services/cloud-solutions', text: 'Disaster Recovery' },
  'cybersecurity': { url: '/services/cloud-solutions', text: 'Cybersecurity Solutions' }
};

/**
 * Get internal linking suggestions for a specific page type
 * @param {string} pageType - The type of page (homepage, services, blog, etc.)
 * @param {string} content - The content to analyze for contextual links
 * @returns {Array} Array of internal linking suggestions
 */
export const getInternalLinkingSuggestions = (pageType, content = '') => {
  const suggestions = internalLinkingSuggestions[pageType] || [];
  const contextualSuggestions = getContextualSuggestions(content);
  
  return [...suggestions, ...contextualSuggestions];
};

/**
 * Get contextual internal linking suggestions based on content
 * @param {string} content - The content to analyze
 * @returns {Array} Array of contextual linking suggestions
 */
export const getContextualSuggestions = (content) => {
  const suggestions = [];
  const lowerContent = content.toLowerCase();
  
  Object.entries(contextualLinks).forEach(([keyword, link]) => {
    if (lowerContent.includes(keyword)) {
      suggestions.push({
        ...link,
        keyword,
        context: `mentioned "${keyword}"`
      });
    }
  });
  
  return suggestions;
};

/**
 * Get keyword-based internal linking suggestions
 * @param {Array} keywords - Array of keywords to find links for
 * @returns {Array} Array of keyword-based linking suggestions
 */
export const getKeywordBasedSuggestions = (keywords) => {
  const suggestions = [];
  
  keywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase();
    if (keywordBasedLinks[keywordLower]) {
      suggestions.push(...keywordBasedLinks[keywordLower].map(link => ({
        ...link,
        keyword: keywordLower
      })));
    }
  });
  
  return suggestions;
};

/**
 * Generate internal linking HTML for a given text
 * @param {string} text - The text to add links to
 * @param {Array} suggestions - Array of linking suggestions
 * @returns {string} HTML with internal links
 */
export const generateInternalLinks = (text, suggestions) => {
  let linkedText = text;
  
  suggestions.forEach(suggestion => {
    const regex = new RegExp(`\\b${suggestion.keyword}\\b`, 'gi');
    linkedText = linkedText.replace(regex, `<a href="${suggestion.url}" class="text-blue-600 hover:text-blue-800 underline">${suggestion.text}</a>`);
  });
  
  return linkedText;
};

/**
 * Get related content suggestions for internal linking
 * @param {string} currentPage - Current page URL
 * @param {string} category - Content category
 * @returns {Array} Array of related content suggestions
 */
export const getRelatedContentSuggestions = (currentPage, category) => {
  const relatedContent = {
    'digital-marketing': [
      { url: '/blog/digital-marketing-trends-2024', title: 'Digital Marketing Trends 2024' },
      { url: '/case-studies/social-media-success', title: 'Social Media Success Story' },
      { url: '/services/paid-media', title: 'Paid Media Services' }
    ],
    'cloud-solutions': [
      { url: '/blog/cloud-migration-guide', title: 'Cloud Migration Guide' },
      { url: '/case-studies/cloud-transformation', title: 'Cloud Transformation Case Study' },
      { url: '/services/cloud-solutions', title: 'Cloud Solutions' }
    ],
    'creative-services': [
      { url: '/blog/ui-ux-design-principles', title: 'UI/UX Design Principles' },
      { url: '/case-studies/brand-redesign', title: 'Brand Redesign Success' },
      { url: '/services/creative', title: 'Creative Services' }
    ],
    'business-tools': [
      { url: '/blog/automation-tools-guide', title: 'Business Automation Tools' },
      { url: '/case-studies/process-optimization', title: 'Process Optimization Success' },
      { url: '/services/business-tools', title: 'Business Tools' }
    ]
  };
  
  return relatedContent[category] || [];
};

/**
 * Validate internal links
 * @param {Array} links - Array of links to validate
 * @returns {Object} Validation results
 */
export const validateInternalLinks = (links) => {
  const results = {
    valid: [],
    invalid: [],
    suggestions: []
  };
  
  links.forEach(link => {
    // Basic validation - check if URL starts with /
    if (link.url && link.url.startsWith('/')) {
      results.valid.push(link);
    } else {
      results.invalid.push(link);
      results.suggestions.push({
        link,
        suggestion: 'Internal links should start with /'
      });
    }
  });
  
  return results;
};

export default {
  getInternalLinkingSuggestions,
  getContextualSuggestions,
  getKeywordBasedSuggestions,
  generateInternalLinks,
  getRelatedContentSuggestions,
  validateInternalLinks
};
