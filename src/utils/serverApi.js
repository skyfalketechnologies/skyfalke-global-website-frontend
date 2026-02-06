/**
 * Server-side API utility for Next.js
 * Use this for metadata generation and server components
 */

const getApiBaseUrl = () => {
  // Check for explicit environment variable first
  if (process.env.NEXT_PUBLIC_API_BASE_URL || process.env.REACT_APP_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL || process.env.REACT_APP_API_BASE_URL;
  }
  
  // In production, use production API URL
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') {
    return 'https://apis.mwangikinyanjuiadvocates.com';
  }
  
  // Development fallback
  return 'http://localhost:5000';
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Server-side fetch function for API calls
 */
export async function serverFetch(url, options = {}) {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  
  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      // Don't throw for 404 errors - return null instead
      // This allows metadata generation to continue with fallback values
      if (response.status === 404) {
        return null;
      }
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // For network errors or other issues, return null instead of throwing
    // This prevents metadata generation from failing completely
    if (error.message?.includes('fetch failed') || error.code === 'ECONNREFUSED') {
      console.warn('Server API fetch error (network issue):', error.message);
      return null;
    }
    console.error('Server API fetch error:', error);
    throw error;
  }
}

/**
 * Get blog post by slug (server-side)
 */
export async function getBlogBySlug(slug) {
  try {
    const response = await serverFetch(`/api/blogs/slug/${slug}`);
    // Handle null response (404 or network error)
    if (!response) {
      return null;
    }
    return response.data || response;
  } catch (error) {
    // Silently handle errors - return null to allow metadata generation with fallbacks
    if (process.env.NODE_ENV === 'development') {
      console.warn('Error fetching blog:', error.message);
    }
    return null;
  }
}

/**
 * Get product by slug (server-side)
 */
export async function getProductBySlug(slug) {
  try {
    // Use the same endpoint shape as the client-side ProductDetail page
    // Client calls: /api/shop/products/:slug and expects { success, data: { product, relatedProducts } }
    const response = await serverFetch(`/api/shop/products/${slug}`);

    // Handle null response (404 or network error)
    if (!response) {
      return null;
    }

    // Normalise to just the product object for metadata generation
    if (response.success && response.data) {
      return response.data.product || response.data;
    }

    return response.data || response;
  } catch (error) {
    // Silently handle errors - return null to allow metadata generation with fallbacks
    if (process.env.NODE_ENV === 'development') {
      console.warn('Error fetching product:', error.message);
    }
    return null;
  }
}

/**
 * Get case study by slug (server-side)
 */
export async function getCaseStudyBySlug(slug) {
  try {
    // The route is /api/case-studies/:slug, not /api/case-studies/slug/:slug
    const response = await serverFetch(`/api/case-studies/${slug}`);
    // Handle null response (404 or network error)
    if (!response) {
      return null;
    }
    // The API returns { success: true, data: { caseStudy, relatedCaseStudies } }
    if (response.success && response.data) {
      return response.data.caseStudy || response.data;
    }
    return response.data || response;
  } catch (error) {
    // Silently handle errors - return null to allow metadata generation with fallbacks
    if (process.env.NODE_ENV === 'development') {
      console.warn('Error fetching case study:', error.message);
    }
    return null;
  }
}

/**
 * Get job by ID (server-side)
 */
export async function getJobById(id) {
  try {
    const response = await serverFetch(`/api/jobs/${id}`);
    return response.data || response;
  } catch (error) {
    console.error('Error fetching job:', error);
    return null;
  }
}

