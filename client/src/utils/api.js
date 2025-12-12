// API Configuration and Utilities
import axios from 'axios';
import logger from './logger';

// Request throttling to prevent rate limiting
const requestQueue = new Map();
const REQUEST_DELAY = 100; // 100ms delay between requests

// Get API base URL from environment variable
const getApiBaseUrl = () => {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  
  if (!apiBaseUrl) {
    logger.warn('REACT_APP_API_BASE_URL not found in environment variables. Using fallback.');
    // Fallback URLs based on environment
    if (process.env.NODE_ENV === 'production') {
      return 'https://apis.mwangikinyanjuiadvocates.com';
    }
    return 'http://localhost:5000';
  }
  
  logger.log('Using API Base URL:', apiBaseUrl);
  return apiBaseUrl;
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

// Suppress axios adapter logging in production
if (process.env.NODE_ENV === 'production') {
  // Override axios adapter to prevent internal logging
  const originalAdapter = api.defaults.adapter || axios.defaults.adapter;
  if (originalAdapter) {
    api.defaults.adapter = function(config) {
      // Suppress any internal axios logging
      return originalAdapter(config);
    };
  }
}

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      logger.error('Network Error:', {
        code: error.code,
        message: error.message,
        apiUrl: error.config?.baseURL || getApiBaseUrl()
      });
    }
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Check if we're in an admin context, otherwise redirect to admin login
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/system') || currentPath.startsWith('/admin')) {
        window.location.href = '/admin/login';
      } else {
        // For non-admin routes, redirect to home or appropriate login
        window.location.href = '/';
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
