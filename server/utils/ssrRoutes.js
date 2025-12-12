/**
 * SSR Route Handlers
 * Maps routes to data fetching functions and components
 */

const {
  fetchBlogPost,
  fetchCaseStudy,
  fetchProduct,
  fetchCourse,
  fetchEvent,
  fetchJob,
  fetchBlogsList,
  fetchCaseStudiesList,
  fetchProductsList
} = require('./ssrDataFetcher');

/**
 * Route configuration for SSR
 * Maps URL patterns to data fetching functions
 */
const SSR_ROUTES = {
  // Blog routes
  '/blog/:slug': {
    dataFetcher: async (params) => {
      const data = await fetchBlogPost(params.slug);
      if (!data || !data.post) {
        return null;
      }
      return {
        post: data.post,
        relatedPosts: data.relatedPosts || []
      };
    },
    componentPath: '../client/src/pages/BlogPost'
  },
  '/blog': {
    dataFetcher: async (params, query) => {
      return await fetchBlogsList({
        page: query.page || 1,
        limit: query.limit || 6,
        category: query.category,
        search: query.search
      });
    },
    componentPath: '../client/src/pages/Blog'
  },
  
  // Case study routes
  '/case-studies/:slug': {
    dataFetcher: async (params) => {
      const data = await fetchCaseStudy(params.slug);
      if (!data || !data.caseStudy) {
        return null;
      }
      return {
        caseStudy: data.caseStudy,
        relatedCaseStudies: data.relatedCaseStudies || []
      };
    },
    componentPath: '../client/src/pages/CaseStudyDetail'
  },
  '/case-studies': {
    dataFetcher: async (params, query) => {
      return await fetchCaseStudiesList({
        page: query.page || 1,
        limit: query.limit || 12,
        industry: query.industry,
        service: query.service,
        search: query.search
      });
    },
    componentPath: '../client/src/pages/CaseStudies'
  },
  
  // Product routes
  '/shop/product/:slug': {
    dataFetcher: async (params) => {
      const data = await fetchProduct(params.slug);
      if (!data || !data.product) {
        return null;
      }
      return {
        product: data.product,
        relatedProducts: data.relatedProducts || []
      };
    },
    componentPath: '../client/src/pages/ProductDetail'
  },
  '/shop': {
    dataFetcher: async (params, query) => {
      return await fetchProductsList({
        page: query.page || 1,
        limit: query.limit || 12,
        category: query.category,
        search: query.search,
        minPrice: query.minPrice,
        maxPrice: query.maxPrice,
        inStock: query.inStock
      });
    },
    componentPath: '../client/src/pages/Shop'
  },
  
  // Course routes
  '/academy/courses/:slug': {
    dataFetcher: async (params) => {
      const data = await fetchCourse(params.slug);
      if (!data || !data.course) {
        return null;
      }
      return {
        course: data.course,
        relatedCourses: data.relatedCourses || []
      };
    },
    componentPath: '../client/src/pages/CourseDetail'
  },
  
  // Event routes
  '/events/:slug': {
    dataFetcher: async (params) => {
      const data = await fetchEvent(params.slug);
      if (!data || !data.event) {
        return null;
      }
      return data;
    },
    componentPath: '../client/src/pages/EventDetail'
  },
  
  // Job routes
  '/careers/:id': {
    dataFetcher: async (params) => {
      // Note: This route uses :id, but we'll try to fetch by slug first
      const data = await fetchJob(params.id);
      if (!data || !data.job) {
        return null;
      }
      return {
        job: data.job,
        relatedJobs: data.relatedJobs || []
      };
    },
    componentPath: '../client/src/pages/JobDetail'
  }
};

/**
 * Match URL to SSR route
 */
function matchSSRRoute(url) {
  // Remove query string
  const pathname = url.split('?')[0];
  
  // Try exact match first
  if (SSR_ROUTES[pathname]) {
    return {
      route: SSR_ROUTES[pathname],
      params: {},
      query: parseQueryString(url)
    };
  }
  
  // Try pattern matching
  for (const [pattern, config] of Object.entries(SSR_ROUTES)) {
    const params = matchPattern(pattern, pathname);
    if (params !== null) {
      return {
        route: config,
        params,
        query: parseQueryString(url)
      };
    }
  }
  
  return null;
}

/**
 * Match URL pattern with parameters
 */
function matchPattern(pattern, pathname) {
  const patternParts = pattern.split('/');
  const pathParts = pathname.split('/');
  
  if (patternParts.length !== pathParts.length) {
    return null;
  }
  
  const params = {};
  
  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];
    
    if (patternPart.startsWith(':')) {
      const paramName = patternPart.slice(1);
      params[paramName] = pathPart;
    } else if (patternPart !== pathPart) {
      return null;
    }
  }
  
  return params;
}

/**
 * Parse query string
 */
function parseQueryString(url) {
  const query = {};
  const queryString = url.split('?')[1];
  
  if (!queryString) {
    return query;
  }
  
  queryString.split('&').forEach(param => {
    const [key, value] = param.split('=');
    if (key) {
      query[decodeURIComponent(key)] = decodeURIComponent(value || '');
    }
  });
  
  return query;
}

module.exports = {
  SSR_ROUTES,
  matchSSRRoute
};


