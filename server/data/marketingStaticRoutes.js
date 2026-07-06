/**
 * Marketing static routes for sitemap generation.
 * Keep in sync with client/src/data/*Pages.js and siteMapSections.js
 */

const route = (url, priority = '0.7', changefreq = 'monthly') => ({ url, priority, changefreq });

const sectionChildRoutes = (basePath, slugs, priority = '0.7') =>
  slugs.map((slug) => route(`${basePath}/${slug}`, priority));

/** Index + detail pages for data-driven marketing sections */
const MARKETING_SECTIONS = [
  {
    index: '/about-us',
    slugs: ['commitments', 'meritocracy', 'social-responsibility', 'environmental-sustainability'],
  },
  {
    index: '/capabilities',
    slugs: ['ai', 'digital', 'data-technology', 'marketing-sales', 'managed-services'],
  },
  {
    index: '/how-we-work',
    slugs: ['solutions', 'case-studies', 'from-idea-to-impact'],
  },
  {
    index: '/sustainability',
    slugs: ['environmental-stewardship', 'responsible-technology', 'sustainable-operations'],
  },
  {
    index: '/tech-ai',
    slugs: ['ai-strategy', 'data-platforms', 'cloud-modernization'],
  },
  {
    index: '/industries',
    slugs: [
      'agriculture',
      'law-justice',
      'automobile',
      'education',
      'engineering-construction',
      'financial-services',
      'health-care',
      'logistics',
      'public-service',
      'retail',
      'real-estate',
      'media-communications',
    ],
  },
];

const buildMarketingSectionRoutes = () => {
  const routes = [];
  MARKETING_SECTIONS.forEach(({ index, slugs }) => {
    routes.push(route(index, '0.8'));
    routes.push(...sectionChildRoutes(index, slugs));
  });
  return routes;
};

/** Core site pages + service hierarchy */
const CORE_STATIC_ROUTES = [
  route('', '1.0', 'daily'),
  route('/about-us', '0.8'),
  route('/services', '0.8'),
  route('/services/ict-strategy', '0.7'),
  route('/cloud', '0.8'),
  route('/cloud-solutions', '0.7'),
  route('/contact', '0.7'),
  route('/careers', '0.7', 'weekly'),
  route('/shop', '0.8', 'daily'),
  route('/case-studies', '0.8', 'weekly'),
  route('/blog', '0.8', 'weekly'),
  route('/resources', '0.7'),
  route('/support', '0.6'),
  route('/privacy', '0.3', 'yearly'),
  route('/terms', '0.3', 'yearly'),
  route('/partners', '0.6'),
  route('/events', '0.7', 'weekly'),
  route('/academy', '0.8', 'weekly'),
  route('/academy/courses', '0.7', 'weekly'),
  route('/academy/join', '0.7'),
  route('/schedule-consultation', '0.7'),
  route('/site-map', '0.5'),
  route('/services/data-analytics', '0.7'),
  route('/services/earned-media', '0.7'),
  route('/services/paid-media', '0.7'),
  route('/services/creative', '0.7'),
  route('/services/business-tools', '0.7'),
  route('/services/data-analytics/business-intelligence', '0.6'),
  route('/services/data-analytics/data-analytics', '0.6'),
  route('/services/data-analytics/predictive-analytics', '0.6'),
  route('/services/data-analytics/performance-tracking', '0.6'),
  route('/services/data-analytics/custom-dashboards', '0.6'),
  route('/services/earned-media/public-relations', '0.6'),
  route('/services/earned-media/influencer-marketing', '0.6'),
  route('/services/earned-media/content-marketing', '0.6'),
  route('/services/earned-media/social-media-management', '0.6'),
  route('/services/earned-media/brand-awareness', '0.6'),
  route('/services/paid-media/google-ads', '0.6'),
  route('/services/paid-media/social-media-ads', '0.6'),
  route('/services/paid-media/display-advertising', '0.6'),
  route('/services/paid-media/video-advertising', '0.6'),
  route('/services/paid-media/retargeting-campaigns', '0.6'),
  route('/services/creative/brand-design', '0.6'),
  route('/services/creative/ui-ux-design', '0.6'),
  route('/services/creative/graphic-design', '0.6'),
  route('/services/creative/video-production', '0.6'),
  route('/services/creative/content-creation', '0.6'),
  route('/services/business-tools/seo-tools-analytics', '0.6'),
  route('/services/business-tools/process-automation', '0.6'),
  route('/services/business-tools/custom-applications', '0.6'),
  route('/services/business-tools/business-intelligence', '0.6'),
  route('/services/business-tools/performance-optimization', '0.6'),
];

/**
 * All static marketing routes for sitemap.xml (deduplicated by path).
 */
function getMarketingStaticRoutes() {
  const byUrl = new Map();
  [...CORE_STATIC_ROUTES, ...buildMarketingSectionRoutes()].forEach((entry) => {
    if (!byUrl.has(entry.url)) {
      byUrl.set(entry.url, entry);
    }
  });
  return [...byUrl.values()];
}

module.exports = {
  getMarketingStaticRoutes,
};
