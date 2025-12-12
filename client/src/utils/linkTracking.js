/**
 * Link Tracking and Monitoring Utility
 * Provides functions to track, monitor, and analyze backlinks and internal links
 */

// Link tracking configuration
export const linkTrackingConfig = {
  // API endpoints for link tracking
  endpoints: {
    backlinks: '/api/analytics/backlinks',
    internalLinks: '/api/analytics/internal-links',
    linkMetrics: '/api/analytics/link-metrics',
    competitorLinks: '/api/analytics/competitor-links'
  },
  
  // Tracking intervals (in milliseconds)
  intervals: {
    backlinkCheck: 24 * 60 * 60 * 1000, // 24 hours
    internalLinkCheck: 60 * 60 * 1000, // 1 hour
    metricsUpdate: 4 * 60 * 60 * 1000, // 4 hours
    competitorCheck: 7 * 24 * 60 * 60 * 1000 // 7 days
  },
  
  // Link quality thresholds
  thresholds: {
    highQuality: { da: 50, dr: 40, traffic: 10000 },
    mediumQuality: { da: 30, dr: 25, traffic: 5000 },
    lowQuality: { da: 10, dr: 10, traffic: 1000 }
  }
};

// Link data structure
export const createLinkRecord = (linkData) => {
  return {
    id: linkData.id || generateId(),
    url: linkData.url,
    domain: extractDomain(linkData.url),
    anchorText: linkData.anchorText || '',
    targetUrl: linkData.targetUrl || '',
    linkType: linkData.linkType || 'external', // external, internal, nofollow, sponsored
    quality: linkData.quality || 'unknown', // high, medium, low, unknown
    source: linkData.source || 'manual', // manual, outreach, organic, directory
    status: linkData.status || 'active', // active, broken, redirected, removed
    firstSeen: linkData.firstSeen || new Date().toISOString(),
    lastChecked: linkData.lastChecked || new Date().toISOString(),
    metrics: {
      domainAuthority: linkData.domainAuthority || 0,
      domainRating: linkData.domainRating || 0,
      traffic: linkData.traffic || 0,
      spamScore: linkData.spamScore || 0,
      trustFlow: linkData.trustFlow || 0,
      citationFlow: linkData.citationFlow || 0
    },
    context: {
      surroundingText: linkData.surroundingText || '',
      pageTitle: linkData.pageTitle || '',
      pageDescription: linkData.pageDescription || '',
      position: linkData.position || 'body' // header, footer, sidebar, body
    },
    tags: linkData.tags || [],
    notes: linkData.notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// Utility functions
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const extractDomain = (url) => {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch (error) {
    return url;
  }
};

export const classifyLinkQuality = (metrics) => {
  const { domainAuthority, domainRating, traffic, spamScore } = metrics;
  
  if (spamScore > 30) return 'spam';
  if (domainAuthority >= linkTrackingConfig.thresholds.highQuality.da && 
      domainRating >= linkTrackingConfig.thresholds.highQuality.dr) return 'high';
  if (domainAuthority >= linkTrackingConfig.thresholds.mediumQuality.da && 
      domainRating >= linkTrackingConfig.thresholds.mediumQuality.dr) return 'medium';
  if (domainAuthority >= linkTrackingConfig.thresholds.lowQuality.da) return 'low';
  return 'unknown';
};

export const calculateLinkValue = (link) => {
  const { metrics, linkType, status } = link;
  
  if (status !== 'active') return 0;
  if (linkType === 'nofollow') return metrics.domainAuthority * 0.3;
  if (linkType === 'sponsored') return metrics.domainAuthority * 0.1;
  
  let value = metrics.domainAuthority * 0.4;
  value += metrics.domainRating * 0.3;
  value += Math.log(metrics.traffic + 1) * 0.2;
  value -= metrics.spamScore * 0.1;
  
  return Math.max(0, value);
};

// Link tracking functions
export const trackBacklink = async (linkData) => {
  try {
    const linkRecord = createLinkRecord(linkData);
    const response = await fetch(linkTrackingConfig.endpoints.backlinks, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(linkRecord)
    });
    
    if (!response.ok) {
      throw new Error('Failed to track backlink');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error tracking backlink:', error);
    throw error;
  }
};

export const trackInternalLink = async (linkData) => {
  try {
    const linkRecord = createLinkRecord({
      ...linkData,
      linkType: 'internal'
    });
    
    const response = await fetch(linkTrackingConfig.endpoints.internalLinks, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(linkRecord)
    });
    
    if (!response.ok) {
      throw new Error('Failed to track internal link');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error tracking internal link:', error);
    throw error;
  }
};

export const getBacklinks = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(`${linkTrackingConfig.endpoints.backlinks}?${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch backlinks');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching backlinks:', error);
    throw error;
  }
};

export const getInternalLinks = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(`${linkTrackingConfig.endpoints.internalLinks}?${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch internal links');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching internal links:', error);
    throw error;
  }
};

export const updateLinkMetrics = async (linkId, metrics) => {
  try {
    const response = await fetch(`${linkTrackingConfig.endpoints.backlinks}/${linkId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        metrics,
        lastChecked: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update link metrics');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating link metrics:', error);
    throw error;
  }
};

export const checkLinkStatus = async (url) => {
  try {
    const response = await fetch(`/api/analytics/check-link-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url })
    });
    
    if (!response.ok) {
      throw new Error('Failed to check link status');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error checking link status:', error);
    throw error;
  }
};

// Analytics functions
export const getLinkAnalytics = async (timeRange = '30d') => {
  try {
    const response = await fetch(`${linkTrackingConfig.endpoints.linkMetrics}?range=${timeRange}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch link analytics');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching link analytics:', error);
    throw error;
  }
};

export const getCompetitorLinks = async (competitorDomain) => {
  try {
    const response = await fetch(`${linkTrackingConfig.endpoints.competitorLinks}?domain=${competitorDomain}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch competitor links');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching competitor links:', error);
    throw error;
  }
};

// Link monitoring functions
export const startLinkMonitoring = () => {
  // Set up intervals for different monitoring tasks
  const backlinkInterval = setInterval(async () => {
    try {
      await checkAllBacklinks();
    } catch (error) {
      console.error('Error in backlink monitoring:', error);
    }
  }, linkTrackingConfig.intervals.backlinkCheck);

  const internalLinkInterval = setInterval(async () => {
    try {
      await checkAllInternalLinks();
    } catch (error) {
      console.error('Error in internal link monitoring:', error);
    }
  }, linkTrackingConfig.intervals.internalLinkCheck);

  const metricsInterval = setInterval(async () => {
    try {
      await updateAllLinkMetrics();
    } catch (error) {
      console.error('Error in metrics update:', error);
    }
  }, linkTrackingConfig.intervals.metricsUpdate);

  return {
    backlinkInterval,
    internalLinkInterval,
    metricsInterval
  };
};

export const stopLinkMonitoring = (intervals) => {
  Object.values(intervals).forEach(interval => {
    clearInterval(interval);
  });
};

// Helper functions for monitoring
const checkAllBacklinks = async () => {
  try {
    const backlinks = await getBacklinks({ status: 'active' });
    for (const link of backlinks) {
      const status = await checkLinkStatus(link.url);
      if (status.status !== link.status) {
        await updateLinkStatus(link.id, status.status);
      }
    }
  } catch (error) {
    console.error('Error checking backlinks:', error);
  }
};

const checkAllInternalLinks = async () => {
  try {
    const internalLinks = await getInternalLinks({ status: 'active' });
    for (const link of internalLinks) {
      const status = await checkLinkStatus(link.url);
      if (status.status !== link.status) {
        await updateLinkStatus(link.id, status.status);
      }
    }
  } catch (error) {
    console.error('Error checking internal links:', error);
  }
};

const updateAllLinkMetrics = async () => {
  try {
    const backlinks = await getBacklinks({ status: 'active' });
    for (const link of backlinks) {
      // In a real implementation, this would fetch updated metrics from SEO tools
      const updatedMetrics = await fetchLinkMetrics(link.domain);
      await updateLinkMetrics(link.id, updatedMetrics);
    }
  } catch (error) {
    console.error('Error updating link metrics:', error);
  }
};

const fetchLinkMetrics = async (domain) => {
  // This would integrate with SEO tools like Ahrefs, SEMrush, etc.
  // For now, return mock data
  return {
    domainAuthority: Math.floor(Math.random() * 100),
    domainRating: Math.floor(Math.random() * 100),
    traffic: Math.floor(Math.random() * 100000),
    spamScore: Math.floor(Math.random() * 50),
    trustFlow: Math.floor(Math.random() * 100),
    citationFlow: Math.floor(Math.random() * 100)
  };
};

const updateLinkStatus = async (linkId, status) => {
  try {
    const response = await fetch(`${linkTrackingConfig.endpoints.backlinks}/${linkId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update link status');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating link status:', error);
    throw error;
  }
};

export default {
  trackBacklink,
  trackInternalLink,
  getBacklinks,
  getInternalLinks,
  updateLinkMetrics,
  checkLinkStatus,
  getLinkAnalytics,
  getCompetitorLinks,
  startLinkMonitoring,
  stopLinkMonitoring,
  createLinkRecord,
  classifyLinkQuality,
  calculateLinkValue
};
