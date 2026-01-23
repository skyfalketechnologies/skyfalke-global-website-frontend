// API Configuration and Utilities
import axios from 'axios';
import logger from './logger';

// Request throttling to prevent rate limiting
const requestQueue = new Map();
const REQUEST_DELAY = 100; // 100ms delay between requests

// Get API base URL from environment variable
const getApiBaseUrl = () => {
  // In Next.js, use NEXT_PUBLIC_ prefix for client-side env vars
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.REACT_APP_API_BASE_URL;
  
  // If environment variable is set, use it
  if (apiBaseUrl) {
    if (process.env.NODE_ENV !== 'production') {
      logger.log('Using API Base URL:', apiBaseUrl);
    }
    return apiBaseUrl;
  }
  
  // Fallback URLs based on environment
  // In production build, always use production URL
  if (process.env.NODE_ENV === 'production') {
    const productionUrl = 'https://apis.mwangikinyanjuiadvocates.com';
    if (typeof window !== 'undefined') {
      // Only log in browser console if needed for debugging
      console.warn('Using production API URL fallback:', productionUrl);
    }
    return productionUrl;
  }
  
  // Development fallback
  return 'http://localhost:5000';
};

// Create axios instance with default configuration
const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  // Disable axios internal logging
  validateStatus: function (status) {
    return status >= 200 && status < 300;
  },
});

// Note: Axios adapter override removed - console logging is already suppressed in index.js

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle SSL Certificate Errors
    if (error.code === 'ERR_CERT_DATE_INVALID' || error.code === 'ERR_CERT_AUTHORITY_INVALID' || error.code === 'ERR_CERT_INVALID') {
      logger.error('SSL Certificate Error:', {
        code: error.code,
        message: error.message,
        apiUrl: error.config?.baseURL || getApiBaseUrl()
      });
      // Don't redirect on SSL errors, let the calling component handle it
    }
    
    // Handle Network Errors
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error') || !error.response) {
      // Extract all available error information
      const errorCode = error.code || 'ERR_NETWORK';
      const errorMessage = error.message || 'Network request failed - API server may be unavailable';
      const apiUrl = error.config?.baseURL || getApiBaseUrl();
      const endpoint = error.config?.url || 'Unknown';
      const method = error.config?.method?.toUpperCase() || 'GET';
      const fullUrl = error.config ? `${error.config.baseURL || ''}${error.config.url || ''}` : 'Unknown';
      
      const errorDetails = {
        type: 'Network Error',
        code: errorCode,
        message: errorMessage,
        apiUrl: apiUrl,
        endpoint: endpoint,
        method: method,
        fullUrl: fullUrl,
        timestamp: new Date().toISOString(),
        suggestion: 'Please ensure the API server is running and accessible',
        // Include additional error properties if available
        ...(error.name && { errorName: error.name }),
        ...(error.stack && { stack: error.stack.split('\n').slice(0, 3).join('\n') })
      };
      
      // Only log if in development to avoid console spam
      // Use console.warn instead of console.error for network errors as they're often expected
      // (e.g., when API server is not running during development)
      if (process.env.NODE_ENV === 'development') {
        // Log with explicit structure but use warn level (less alarming)
        console.warn('Network Error (API may be unavailable):', {
          endpoint: errorDetails.endpoint,
          method: errorDetails.method,
          suggestion: errorDetails.suggestion
        });
        // Skip logger.error for network errors since we already logged to console.warn
        // This prevents duplicate/empty error logs
      }
      
      // Don't throw for network errors in production - let components handle gracefully
      // This prevents the app from breaking when API is temporarily unavailable
    }
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Only access localStorage and window on client side
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Check if we're in an admin context, otherwise redirect to portal access
        const currentPath = window.location.pathname;
        if (currentPath.startsWith('/system') || currentPath.startsWith('/admin')) {
          window.location.href = '/system/portal/access';
        } else {
          // For non-admin routes, redirect to home or appropriate login
          window.location.href = '/';
        }
      }
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      // Access forbidden
    }
    
    // Handle 429 Too Many Requests
    if (error.response?.status === 429) {
      logger.warn('Rate limit exceeded. Please wait before making more requests.');
      // You could implement retry logic here with exponential backoff
    }
    
    // Handle 404 Not Found
    if (error.response?.status === 404) {
      logger.warn('API endpoint not found:', error.config?.url);
    }
    
    return Promise.reject(error);
  }
);

// Throttled request function
const throttledRequest = async (url, method = 'get', data = null, config = {}) => {
  // Ensure we're not trying to make API calls during SSR
  if (typeof window === 'undefined') {
    throw new Error('API calls cannot be made during server-side rendering');
  }
  
  const requestKey = `${method}:${url}`;
  const now = Date.now();
  
  // Check if we need to throttle this request
  if (requestQueue.has(requestKey)) {
    const lastRequest = requestQueue.get(requestKey);
    const timeSinceLastRequest = now - lastRequest;
    
    if (timeSinceLastRequest < REQUEST_DELAY) {
      await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY - timeSinceLastRequest));
    }
  }
  
  // Update the last request time
  requestQueue.set(requestKey, now);
  
  // Make the actual request
  try {
    let response;
    switch (method.toLowerCase()) {
      case 'get':
        response = await api.get(url, config);
        break;
      case 'post':
        response = await api.post(url, data, config);
        break;
      case 'put':
        response = await api.put(url, data, config);
        break;
      case 'patch':
        response = await api.patch(url, data, config);
        break;
      case 'delete':
        response = await api.delete(url, config);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
    return response;
  } catch (error) {
    // Remove from queue on error to allow retry
    requestQueue.delete(requestKey);
    
    // For network errors, the interceptor has already logged them appropriately
    // Just re-throw to let components handle gracefully
    throw error;
  }
};

// API helper functions
export const apiGet = (url, config = {}) => {
  return throttledRequest(url, 'get', null, config);
};

export const apiPost = (url, data = {}, config = {}) => {
  return throttledRequest(url, 'post', data, config);
};

export const apiPut = (url, data = {}, config = {}) => {
  return throttledRequest(url, 'put', data, config);
};

export const apiPatch = (url, data = {}, config = {}) => {
  return throttledRequest(url, 'patch', data, config);
};

export const apiDelete = (url, config = {}) => {
  return throttledRequest(url, 'delete', null, config);
};

// Health check function
export const checkApiHealth = async () => {
  try {
    const response = await apiGet('/api/health');
    return response.data;
  } catch (error) {
    // API health check failed
    throw error;
  }
};

// Export the API base URL for use in other parts of the application
export const API_BASE_URL = getApiBaseUrl();

// Export the configured axios instance
export default api;
