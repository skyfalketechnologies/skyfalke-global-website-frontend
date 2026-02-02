import { NextResponse } from 'next/server';

/**
 * Middleware to handle sitemap.xml requests
 * This intercepts /sitemap.xml and rewrites it to our route handler
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Handle sitemap.xml requests - rewrite to our sitemap route handler
  if (pathname === '/sitemap.xml') {
    const url = request.nextUrl.clone();
    url.pathname = '/sitemap';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

// Only run middleware for sitemap.xml
export const config = {
  matcher: '/sitemap.xml',
};

