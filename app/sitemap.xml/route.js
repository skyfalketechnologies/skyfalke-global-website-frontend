import { NextResponse } from 'next/server';
import { ABOUT_PAGES } from '@/data/aboutPages';
import { CAPABILITY_PAGES } from '@/data/capabilityPages';
import { HOW_WE_WORK_PAGES } from '@/data/howWeWorkPages';
import { INDUSTRY_PAGES } from '@/data/industryPages';
import { SUSTAINABILITY_PAGES } from '@/data/sustainabilityPages';
import { TECH_AI_PAGES } from '@/data/techAiPages';

const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_BASE_URL || process.env.REACT_APP_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL || process.env.REACT_APP_API_BASE_URL;
  }
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') {
    return 'https://apis.mwangikinyanjuiadvocates.com';
  }
  return 'http://localhost:5000';
};

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com').replace(/\/+$/, '');
const API_BASE_URL = getApiBaseUrl().replace(/\/+$/, '');

const STATIC_ROUTES = [
  '/',
  '/about-us',
  '/services',
  '/services/ict-strategy',
  '/capabilities',
  '/how-we-work',
  '/sustainability',
  '/tech-ai',
  '/industries',
  '/site-map',
  '/blog',
  '/case-studies',
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
];

const toSectionRoutes = (pages, basePath) =>
  Object.values(pages).map((page) => `${basePath}/${page.slug}`);

const parseLocUrls = (xmlText) => {
  if (!xmlText) return [];
  const matches = xmlText.match(/<loc>(.*?)<\/loc>/g) || [];
  return matches
    .map((entry) => entry.replace('<loc>', '').replace('</loc>', '').trim())
    .filter(Boolean);
};

const fetchJson = async (url) => {
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) return null;
    return await response.json();
  } catch (_error) {
    return null;
  }
};

const fetchPaginatedSlugs = async (endpoint, arrayResolver) => {
  const slugs = new Set();
  let page = 1;
  let totalPages = 1;

  do {
    const json = await fetchJson(`${API_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}page=${page}&limit=100`);
    if (!json) break;

    const payload = json.data || json;
    const items = arrayResolver(payload) || [];
    items.forEach((item) => {
      const slug = item?.slug || item?.id || item?._id;
      if (slug) slugs.add(String(slug));
    });

    totalPages = payload?.totalPages || payload?.pagination?.totalPages || 1;
    page += 1;
  } while (page <= totalPages);

  return [...slugs];
};

const buildXml = (urls) => {
  const now = new Date().toISOString();
  const unique = [...new Set(urls)];

  const body = unique
    .map(
      (url) => `  <url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url === BASE_URL ? '1.0' : '0.7'}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
};

export async function GET() {
  const localRoutes = [
    ...STATIC_ROUTES,
    ...toSectionRoutes(ABOUT_PAGES, '/about-us'),
    ...toSectionRoutes(CAPABILITY_PAGES, '/capabilities'),
    ...toSectionRoutes(HOW_WE_WORK_PAGES, '/how-we-work'),
    ...toSectionRoutes(SUSTAINABILITY_PAGES, '/sustainability'),
    ...toSectionRoutes(TECH_AI_PAGES, '/tech-ai'),
    ...toSectionRoutes(INDUSTRY_PAGES, '/industries'),
  ].map((route) => `${BASE_URL}${route}`);

  const [backendSitemapUrls, blogSlugs, caseStudySlugs, productSlugs, jobSlugs] = await Promise.all([
    (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/sitemap.xml`, {
          headers: { 'Content-Type': 'application/xml' },
          next: { revalidate: 3600 },
        });
        if (!response.ok) return [];
        return parseLocUrls(await response.text());
      } catch (_error) {
        return [];
      }
    })(),
    fetchPaginatedSlugs('/api/blogs', (payload) => payload?.blogs),
    fetchPaginatedSlugs('/api/case-studies', (payload) => payload?.data?.caseStudies || payload?.caseStudies),
    fetchPaginatedSlugs('/api/shop/products', (payload) => payload?.products || payload?.data?.products),
    fetchPaginatedSlugs('/api/jobs', (payload) => payload?.jobs || payload?.data?.jobs),
  ]);

  const dynamicRoutes = [
    ...blogSlugs.map((slug) => `${BASE_URL}/blog/${slug}`),
    ...caseStudySlugs.map((slug) => `${BASE_URL}/how-we-work/case-studies/${slug}`),
    ...productSlugs.map((slug) => `${BASE_URL}/shop/product/${slug}`),
    ...jobSlugs.map((slug) => `${BASE_URL}/careers/${slug}`),
  ];

  const sitemapXml = buildXml([...backendSitemapUrls, ...localRoutes, ...dynamicRoutes]);

  return new NextResponse(sitemapXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

