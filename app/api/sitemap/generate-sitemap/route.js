import { NextResponse } from 'next/server';
import { buildSitemapXml, getApiBaseUrl } from '@/lib/buildSitemap';

export const dynamic = 'force-dynamic';

async function verifyAdmin(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return { ok: false, status: 401, message: 'No token, authorization denied' };
  }

  const apiBase = getApiBaseUrl().replace(/\/+$/, '');
  try {
    const res = await fetch(`${apiBase}/api/auth/me`, {
      headers: { Authorization: authHeader },
      cache: 'no-store',
    });
    if (!res.ok) {
      return { ok: false, status: res.status, message: 'Invalid or expired session' };
    }
    const user = await res.json();
    const role = user?.role || user?.data?.role;
    if (role !== 'admin' && role !== 'super_admin') {
      return { ok: false, status: 403, message: 'Access denied. Admin role required.' };
    }
    return { ok: true };
  } catch (_error) {
    return { ok: false, status: 503, message: 'Could not verify admin session with API server' };
  }
}

export async function POST(request) {
  const auth = await verifyAdmin(request);
  if (!auth.ok) {
    return NextResponse.json(
      { success: false, message: auth.message },
      { status: auth.status }
    );
  }

  try {
    const { xml, stats } = await buildSitemapXml();

    return NextResponse.json({
      success: true,
      message: 'Sitemap generated successfully',
      data: stats,
      xml,
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to generate sitemap' },
      { status: 500 }
    );
  }
}
