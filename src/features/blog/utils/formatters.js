/**
 * Format date for blog posts
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export const formatBlogDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  
  // Add ordinal suffix to day
  const ordinal = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return `Published on ${day}${ordinal(day)} ${month}, ${year}`;
};

/**
 * Format date for meta tags (ISO format)
 * @param {string} dateString - ISO date string
 * @returns {string} ISO formatted date string
 */
export const formatMetaDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toISOString();
};

/**
 * Clean HTML content for excerpt/description
 * @param {string} html - HTML content
 * @param {number} maxLength - Maximum length for excerpt
 * @returns {string} Cleaned text excerpt
 */
export const extractExcerpt = (html, maxLength = 160) => {
  if (!html) return '';
  
  // Remove HTML tags
  const text = html.replace(/<[^>]*>/g, '').trim();
  
  // Truncate if needed
  if (text.length <= maxLength) return text;
  
  // Truncate at word boundary
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 
    ? truncated.substring(0, lastSpace) + '...'
    : truncated + '...';
};

/**
 * Get reading time estimate
 * @param {string} content - HTML content
 * @returns {string} Reading time estimate
 */
export const getReadingTime = (content) => {
  if (!content) return '1 min read';
  
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).filter(word => word.length > 0);
  const wordsPerMinute = 200;
  const minutes = Math.ceil(words.length / wordsPerMinute);
  
  return `${minutes} min read`;
};

/**
 * Generate SEO-friendly slug from title
 * @param {string} title - Blog post title
 * @returns {string} SEO-friendly slug
 */
export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

