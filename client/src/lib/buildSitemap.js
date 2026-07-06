import { ABOUT_PAGES } from '@/data/aboutPages';
import { CAPABILITY_PAGES } from '@/data/capabilityPages';
import { HOW_WE_WORK_PAGES } from '@/data/howWeWorkPages';
import { INDUSTRY_PAGES } from '@/data/industryPages';
import { SUSTAINABILITY_PAGES } from '@/data/sustainabilityPages';
import { TECH_AI_PAGES } from '@/data/techAiPages';
import { siteMapServiceCategories } from '@/data/siteMapSections';

export const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_BASE_URL || process.env.REACT_APP_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL || process.env.REACT_APP_API_BASE_URL;
  }
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') {
    return 'https://apis.mwangikinyanjuiadvocates.com';
  }
  return 'http://localhost:5000';
};

export const getSiteBaseUrl = () =>
  (process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com').replace(/\/+$/, '');

const toSectionPaths = (pages, basePath) =>
  Object.values(pages).map((page) => `${basePath}/${page.slug}`);

/** All static marketing paths (no duplicate /about — use /about-us). */
export const getStaticPaths = () => {
  const servicePaths = siteMapServiceCategories.flatMap((cat) => [
    cat.href,
    ...(cat.links || []).map((link) => link.href),
  ]);

  const paths = [
    '/',
    '/about-us',
    '/services',
    '/capabilities',
    '/how-we-work',
    '/sustainability',
    '/tech-ai',
    '/industries',
    '/site-map',
    '/blog',
    '/shop',
    '/careers',
    '/contact',
    '/cloud',
    '/cloud-solutions',
    '/resources',
    '/support',
    '/academy',
    '/academy/courses',
    '/academy/join',
    '/schedule-consultation',
    '/events',
    '/partners',
    '/privacy',
    '/terms',
    ...servicePaths,
    ...toSectionPaths(ABOUT_PAGES, '/about-us'),
    ...toSectionPaths(CAPABILITY_PAGES, '/capabilities'),
    ...toSectionPaths(HOW_WE_WORK_PAGES, '/how-we-work'),
    ...toSectionPaths(SUSTAINABILITY_PAGES, '/sustainability'),
    ...toSectionPaths(TECH_AI_PAGES, '/tech-ai'),
    ...toSectionPaths(INDUSTRY_PAGES, '/industries'),
  ];

  return [...new Set(paths)];
};

const fetchJson = async (url, options = {}) => {
  try {
    const response = await fetch(url, { cache: 'no-store', ...options });
    if (!response.ok) return null;
    return await response.json();
  } catch (_error) {
    return null;
  }
};

const fetchPaginatedSlugs = async (apiBase, endpoint, arrayResolver) => {
  const slugs = new Set();
  let page = 1;
  let totalPages = 1;

  do {
    const separator = endpoint.includes('?') ? '&' : '?';
    const json = await fetchJson(
      `${apiBase}${endpoint}${separator}page=${page}&limit=100`
    );
    if (!json) break;

    const payload = json.data ?? json;
    const items = Array.isArray(payload)
      ? payload
      : arrayResolver(payload) || [];
    items.forEach((item) => {
      const slug = item?.slug || item?.id || item?._id;
      if (slug) slugs.add(String(slug));
    });

    totalPages =
      json.pagination?.totalPages ||
      json.totalPages ||
      (Array.isArray(payload) ? 1 : payload?.totalPages) ||
      payload?.pagination?.totalPages ||
      1;
    page += 1;
  } while (page <= totalPages);

  return [...slugs];
};

const priorityFor = (url, baseUrl) => {
  if (url === baseUrl || url === `${baseUrl}/`) return '1.0';
  if (url.includes('/blog/') || url.includes('/shop/product/')) return '0.6';
  if (url.includes('/careers/') && !url.endsWith('/careers')) return '0.7';
  if (url.includes('/how-we-work/case-studies/') && !url.endsWith('/case-studies')) return '0.6';
  if (url.includes('/services/') && url.split('/').length > 4) return '0.6';
  return '0.7';
};

const changefreqFor = (url) => {
  if (url.endsWith('/careers') || url.includes('/careers/')) return 'weekly';
  if (url.includes('/shop')) return 'daily';
  if (url === getSiteBaseUrl() || url === `${getSiteBaseUrl()}/`) return 'daily';
  if (url.includes('/blog/')) return 'weekly';
  return 'monthly';
};

// Static pages change infrequently; use a fixed deploy-time date so Google
// doesn't see every page as "just modified" on every crawl.
const STATIC_LASTMOD = '2026-07-06';

const lastmodFor = (url, baseUrl, dynamicDate) => {
  if (url === baseUrl || url === `${baseUrl}/`) return new Date().toISOString().split('T')[0];
  if (dynamicDate) return dynamicDate;
  return STATIC_LASTMOD;
};

export const buildSitemapXml = async () => {
  const baseUrl = getSiteBaseUrl();
  const apiBase = getApiBaseUrl().replace(/\/+$/, '');

  const staticUrls = getStaticPaths().map((path) =>
    path === '/' ? baseUrl : `${baseUrl}${path}`
  );

  const [blogSlugs, caseStudySlugs, productSlugs, jobSlugs, courseSlugs, eventSlugs] =
    await Promise.all([
      fetchPaginatedSlugs(apiBase, '/api/blogs', (p) => p?.blogs),
      fetchPaginatedSlugs(
        apiBase,
        '/api/case-studies',
        (p) => p?.data?.caseStudies || p?.caseStudies
      ),
      fetchPaginatedSlugs(apiBase, '/api/shop/products', (p) => p?.products || p?.data?.products),
      fetchPaginatedSlugs(apiBase, '/api/jobs', (p) => p?.jobs || p?.data?.jobs),
      fetchPaginatedSlugs(apiBase, '/api/academy/courses', (p) => p?.courses || p?.data?.courses || p?.data),
      fetchPaginatedSlugs(apiBase, '/api/events', (p) => p?.events || p?.data?.events),
    ]);

  const dynamicUrls = [
    ...blogSlugs.map((slug) => `${baseUrl}/blog/${slug}`),
    ...caseStudySlugs.map((slug) => `${baseUrl}/how-we-work/case-studies/${slug}`),
    ...productSlugs.map((slug) => `${baseUrl}/shop/product/${slug}`),
    ...jobSlugs.map((slug) => `${baseUrl}/careers/${slug}`),
    ...courseSlugs.map((slug) => `${baseUrl}/academy/courses/${slug}`),
    ...eventSlugs.map((slug) => `${baseUrl}/events/${slug}`),
  ];

  const allUrls = [...new Set([...staticUrls, ...dynamicUrls])];

  const isDynamic = new Set(dynamicUrls);

  const body = allUrls
    .map((url) => {
      const priority = priorityFor(url, baseUrl);
      const changefreq = changefreqFor(url);
      const lastmod = lastmodFor(url, baseUrl, isDynamic.has(url) ? STATIC_LASTMOD : null);
      return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${body}
</urlset>`;

  const stats = {
    totalUrls: allUrls.length,
    staticRoutes: staticUrls.length,
    blogs: blogSlugs.length,
    products: productSlugs.length,
    caseStudies: caseStudySlugs.length,
    jobs: jobSlugs.length,
    courses: courseSlugs.length,
    events: eventSlugs.length,
    trainers: 0,
  };

  return { xml, stats };
};

export const computeStatsFromXml = (xml) => {
  if (!xml) return null;
  const blogMatches = xml.match(/<loc>[^<]*\/blog\/[^<]+<\/loc>/g) || [];
  const productMatches = xml.match(/<loc>[^<]*\/shop\/product\/[^<]+<\/loc>/g) || [];
  const caseStudyMatches =
    xml.match(/<loc>[^<]*\/how-we-work\/case-studies\/[^<]+<\/loc>/g) || [];
  const jobMatches = xml.match(/<loc>[^<]*\/careers\/[^<]+<\/loc>/g) || [];
  const actualJobMatches = jobMatches.filter(
    (url) => url.includes('/careers/') && !url.includes('/careers</loc>')
  );

  return {
    totalUrls: xml.match(/<url>/g)?.length || 0,
    staticPages: (xml.match(/<url>/g)?.length || 0) - blogMatches.length - productMatches.length - caseStudyMatches.length - actualJobMatches.length,
    blogPosts: blogMatches.length,
    products: productMatches.length,
    caseStudies: caseStudyMatches.length,
    jobs: actualJobMatches.length,
  };
};
