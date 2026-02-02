/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'apis.mwangikinyanjuiadvocates.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  // Proxy API requests to backend
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 
      (process.env.NODE_ENV === 'production' 
        ? 'https://apis.mwangikinyanjuiadvocates.com' 
        : 'http://localhost:5000');
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
      // Rewrite sitemap.xml to sitemap route handler
      {
        source: '/sitemap.xml',
        destination: '/sitemap',
      },
    ];
  },
  // Environment variables
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 
      (process.env.NODE_ENV === 'production' 
        ? 'https://apis.mwangikinyanjuiadvocates.com' 
        : 'http://localhost:5000'),
  },
  // Output configuration
  output: 'standalone',
  // Turbopack configuration (Next.js 16+ uses Turbopack by default)
  // Fonts are handled automatically by Turbopack, no webpack config needed
  turbopack: {},
  // Ensure static files are properly handled in standalone mode
  experimental: {
    outputFileTracingRoot: require('path').join(__dirname),
  },
};

module.exports = nextConfig;

