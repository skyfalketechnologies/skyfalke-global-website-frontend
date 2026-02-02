import { NextResponse } from 'next/server';

/**
 * Sitemap route handler for Next.js
 * Fetches sitemap from the API backend and serves it
 */
export async function GET() {
  try {
    // Get API base URL
    const getApiBaseUrl = () => {
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

    const apiBaseUrl = getApiBaseUrl();
    const sitemapUrl = `${apiBaseUrl}/api/sitemap.xml`;

    // Fetch sitemap from API
    const response = await fetch(sitemapUrl, {
      headers: {
        'Content-Type': 'application/xml',
      },
      // Revalidate every hour
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error('Failed to fetch sitemap from API:', response.status, response.statusText);
      
      // Return a basic sitemap as fallback
      const baseUrl = 'https://skyfalke.com';
      const currentDate = new Date().toISOString();
      const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/services</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;

      return new NextResponse(fallbackSitemap, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
      });
    }

    const sitemapXml = await response.text();

    return new NextResponse(sitemapXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error fetching sitemap:', error);
    
    // Return a minimal sitemap as fallback
    const baseUrl = 'https://skyfalke.com';
    const currentDate = new Date().toISOString();
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    return new NextResponse(fallbackSitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  }
}

