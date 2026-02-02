// Admin API utilities with enhanced error handling and retry logic
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from './api';

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
};

// Fallback data for when APIs fail
const FALLBACK_DATA = {
  dashboard: {
    stats: {
      totalVisitors: 0,
      totalBlogs: 0,
      totalContacts: 0,
      totalViews: 0,
      totalSubscriptions: 0,
      totalOrders: 0,
      totalApplications: 0,
      totalPartnerships: 0
    },
    changes: {
      contacts: { value: 0, type: 'increase' },
      visitors: { value: 0, type: 'increase' }
    }
  },
  applications: {
    applications: [],
    pagination: {
      totalPages: 1,
      totalApplications: 0,
      currentPage: 1
    }
  },
  jobs: {
    jobs: [],
    pagination: {
      totalPages: 1,
      totalJobs: 0,
      currentPage: 1
    }
  },
  stats: {
    total: 0,
    pending: 0,
    reviewed: 0,
    shortlisted: 0,
    rejected: 0,
    hired: 0
  }
};

// Exponential backoff retry function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const retryWithBackoff = async (fn, retries = RETRY_CONFIG.maxRetries) => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) {
      throw error;
    }
    
    // Don't retry on certain error types
    const isNetworkError = error.code === 'ERR_NETWORK' || error.message?.includes('Network Error') || !error.response;
    const isServerError = error.response?.status >= 500 && error.response?.status < 600;
    const isClientError = error.response?.status >= 400 && error.response?.status < 500;
    
    // Don't retry network errors or client errors (4xx) - they won't succeed on retry
    if (isNetworkError || isClientError) {
      throw error;
    }
    
    // Only retry server errors (5xx) - they might be transient
    if (isServerError) {
      const delay = Math.min(
        RETRY_CONFIG.baseDelay * Math.pow(2, RETRY_CONFIG.maxRetries - retries),
        RETRY_CONFIG.maxDelay
      );
      console.warn(`Server error (${error.response?.status}), retrying in ${delay}ms... (${retries} retries left)`);
      await sleep(delay);
      return retryWithBackoff(fn, retries - 1);
    }
    
    // For other errors, retry with backoff
    const delay = Math.min(
      RETRY_CONFIG.baseDelay * Math.pow(2, RETRY_CONFIG.maxRetries - retries),
      RETRY_CONFIG.maxDelay
    );
    console.warn(`API call failed, retrying in ${delay}ms... (${retries} retries left)`);
    await sleep(delay);
    return retryWithBackoff(fn, retries - 1);
  }
};

// Enhanced API wrapper with error handling and fallbacks
const adminApiCall = async (apiFunction, endpoint, data = null, config = {}) => {
  try {
    const response = await retryWithBackoff(() => {
      if (data !== null) {
        return apiFunction(endpoint, data, config);
      }
      return apiFunction(endpoint, config);
    });
    
    return {
      success: true,
      data: response.data,
      error: null
    };
  } catch (error) {
    // Don't log network errors as errors - they're already logged by the interceptor
    // Network errors are expected when API server is not running
    const isNetworkError = error.code === 'ERR_NETWORK' || error.message?.includes('Network Error') || !error.response;
    const isServerError = error.response?.status >= 500 && error.response?.status < 600;
    
    // Use console.warn for server errors since they're being handled gracefully
    // Only use console.error for unexpected errors
    if (isNetworkError) {
      // Network errors are already handled by the interceptor
    } else if (isServerError) {
      // Server errors (500-599) are handled gracefully, log as warning
      console.warn(`Server error on ${endpoint} (${error.response?.status}):`, error.response?.data?.message || error.message);
    } else {
      // Other errors (4xx, etc.) - log as error
      console.error(`Admin API Error (${endpoint}):`, error);
    }
    
    // Return fallback data based on endpoint
    let fallbackData = null;
    if (endpoint.includes('/dashboard/overview')) {
      fallbackData = FALLBACK_DATA.dashboard;
    } else if (endpoint.includes('/applications')) {
      fallbackData = FALLBACK_DATA.applications;
    } else if (endpoint.includes('/jobs')) {
      fallbackData = FALLBACK_DATA.jobs;
    } else if (endpoint.includes('/stats')) {
      fallbackData = FALLBACK_DATA.stats;
    }
    
    return {
      success: false,
      data: fallbackData,
      error: {
        message: error.response?.data?.message || error.message || 'API request failed',
        status: error.response?.status || 0,
        endpoint: endpoint
      }
    };
  }
};

// Admin API functions with enhanced error handling
export const adminApiGet = (endpoint, config = {}) => {
  return adminApiCall(apiGet, endpoint, null, config);
};

export const adminApiPost = (endpoint, data = {}, config = {}) => {
  return adminApiCall(apiPost, endpoint, data, config);
};

export const adminApiPut = (endpoint, data = {}, config = {}) => {
  return adminApiCall(apiPut, endpoint, data, config);
};

export const adminApiPatch = (endpoint, data = {}, config = {}) => {
  return adminApiCall(apiPatch, endpoint, data, config);
};

export const adminApiDelete = (endpoint, config = {}) => {
  return adminApiCall(apiDelete, endpoint, null, config);
};

// Specific admin API functions
export const fetchDashboardData = async () => {
  try {
    const [overviewRes, activityRes, contactsRes, blogsRes] = await Promise.allSettled([
      adminApiGet('/api/dashboard/overview'),
      adminApiGet('/api/dashboard/recent-activity?limit=8'),
      adminApiGet('/api/dashboard/recent-contacts?limit=5'),
      adminApiGet('/api/dashboard/recent-blogs?limit=5')
    ]);

    return {
      overview: overviewRes.status === 'fulfilled' ? overviewRes.value : { success: false, data: FALLBACK_DATA.dashboard },
      activity: activityRes.status === 'fulfilled' ? activityRes.value : { success: false, data: [] },
      contacts: contactsRes.status === 'fulfilled' ? contactsRes.value : { success: false, data: [] },
      blogs: blogsRes.status === 'fulfilled' ? blogsRes.value : { success: false, data: [] }
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      overview: { success: false, data: FALLBACK_DATA.dashboard },
      activity: { success: false, data: [] },
      contacts: { success: false, data: [] },
      blogs: { success: false, data: [] }
    };
  }
};

export const fetchApplicationsData = async (params = {}) => {
  const queryParams = new URLSearchParams({
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...params
  });

  return await adminApiGet(`/api/applications/admin?${queryParams}`);
};

export const fetchJobsData = async (params = {}) => {
  // Build query string properly, handling all param types
  const queryParams = new URLSearchParams();
  
  // Set defaults
  queryParams.set('page', params.page || 1);
  queryParams.set('limit', params.limit || 10);
  
  // Add optional params
  if (params.search) {
    queryParams.set('search', params.search);
  }
  if (params.category) {
    queryParams.set('category', params.category);
  }
  if (params.isActive !== undefined) {
    queryParams.set('isActive', params.isActive);
  }
  if (params.sortBy) {
    queryParams.set('sortBy', params.sortBy);
  }
  if (params.sortOrder) {
    queryParams.set('sortOrder', params.sortOrder);
  }

  return await adminApiGet(`/api/jobs?${queryParams.toString()}`);
};

export const fetchJobsStats = async () => {
  return await adminApiGet('/api/jobs/stats/overview');
};

export const fetchApplicationsStats = async () => {
  return await adminApiGet('/api/applications/stats/overview');
};

// Error boundary helper
export const handleAdminApiError = (error, fallbackMessage = 'An error occurred') => {
  console.error('Admin API Error:', error);
  
  if (error.response?.status === 404) {
    return 'The requested resource was not found.';
  } else if (error.response?.status === 429) {
    return 'Too many requests. Please wait a moment and try again.';
  } else if (error.response?.status === 500) {
    return 'Server error. Please try again later.';
  } else if (error.response?.status === 401) {
    return 'Unauthorized. Please log in again.';
  } else if (error.response?.status === 403) {
    return 'Access forbidden. You do not have permission to perform this action.';
  }
  
  return error.message || fallbackMessage;
};

const adminApi = {
  adminApiGet,
  adminApiPost,
  adminApiPut,
  adminApiPatch,
  adminApiDelete,
  fetchDashboardData,
  fetchApplicationsData,
  fetchJobsData,
  fetchJobsStats,
  fetchApplicationsStats,
  handleAdminApiError
};

export default adminApi;
