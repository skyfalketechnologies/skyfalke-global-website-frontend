/**
 * Generate SEO metadata for blog posts
 */

/**
 * Get SEO title for blog post
 * @param {Object} post - Blog post object
 * @returns {string} SEO title
 */
export const getSEOTitle = (post) => {
  if (!post) return 'Skyfalke Blog';
  return post.seo?.metaTitle || `${post.title} | Skyfalke Blog`;
};

/**
 * Get SEO description for blog post
 * @param {Object} post - Blog post object
 * @returns {string} SEO description
 */
export const getSEODescription = (post) => {
  if (!post) {
    return 'Read the latest insights on digital marketing, cloud solutions, and sustainable technology from Skyfalke.';
  }
  
  const description = post.seo?.metaDescription || post.excerpt;
  if (description && description.length > 0) {
    return description.length > 160 ? description.substring(0, 157) + '...' : description;
  }
  
  // Fallback to content excerpt
  if (post.content) {
    const textContent = post.content.replace(/<[^>]*>/g, '');
    return textContent.length > 160 ? textContent.substring(0, 157) + '...' : textContent;
  }
  
  return 'Read the latest insights on digital marketing, cloud solutions, and sustainable technology from Skyfalke.';
};

/**
 * Get SEO keywords for blog post
 * @param {Object} post - Blog post object
 * @returns {string} Comma-separated keywords
 */
export const getSEOKeywords = (post) => {
  if (!post) {
    return 'digital marketing, cloud solutions, green hosting, sustainable technology, Africa';
  }
  
  const dbKeywords = post.seo?.keywords || [];
  const tagKeywords = post.tags || [];
  const categoryKeywords = post.category ? [post.category] : [];
  const allKeywords = [...new Set([...dbKeywords, ...tagKeywords, ...categoryKeywords])];
  
  return allKeywords.length > 0 
    ? allKeywords.join(', ') 
    : 'digital marketing, cloud solutions, green hosting, sustainable technology';
};

/**
 * Get SEO image URL for blog post
 * @param {Object} post - Blog post object
 * @returns {string} Image URL
 */
export const getSEOImage = (post) => {
  if (!post) return 'https://skyfalke.com/images/logos/logo.svg';
  
  const imageUrl = post.seo?.ogImage?.url || post.featuredImage?.url;
  if (imageUrl && imageUrl.trim() !== '') {
    return imageUrl.startsWith('http') ? imageUrl : `https://skyfalke.com${imageUrl}`;
  }
  
  return 'https://skyfalke.com/images/logos/logo.svg';
};

/**
 * Get canonical URL for blog post
 * @param {Object} post - Blog post object
 * @returns {string} Canonical URL
 */
export const getCanonicalURL = (post) => {
  if (!post) return 'https://skyfalke.com/blog';
  return post.seo?.canonicalUrl || `https://skyfalke.com/blog/${post.slug}`;
};

