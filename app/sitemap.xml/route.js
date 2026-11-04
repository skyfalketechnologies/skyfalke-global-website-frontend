import { NextResponse } from 'next/server';
import { buildSitemapXml } from '@/lib/buildSitemap';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { xml } = await buildSitemapXml();

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Sitemap GET error:', error);
    return new NextResponse('Failed to generate sitemap', { status: 500 });
  }
}
