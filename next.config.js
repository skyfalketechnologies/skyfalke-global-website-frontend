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
  // Note: Vercel handles output automatically, but standalone is fine for both
  output: 'standalone',
  
  // Transpile TipTap packages - this is the recommended way for Next.js 13+
  // This ensures TipTap is properly transpiled during build, fixing _ref errors
  transpilePackages: [
    '@tiptap/react',
    '@tiptap/core',
    '@tiptap/pm',
    '@tiptap/starter-kit',
    '@tiptap/extension-link',
    '@tiptap/extension-text-align',
    '@tiptap/extension-underline',
    '@tiptap/extension-strike',
    '@tiptap/extension-color',
    '@tiptap/extension-text-style',
  ],
  
  // Webpack configuration for react-quill compatibility (minimal changes)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ensure react-dom has findDOMNode on default export for react-quill
      config.resolve.alias = {
        ...config.resolve.alias,
      };
    }
    return config;
  },
  // Turbopack configuration (Next.js 16+ uses Turbopack by default)
  // Fonts are handled automatically by Turbopack, no webpack config needed
  turbopack: {},
  // Ensure static files are properly handled in standalone mode
  experimental: {
    outputFileTracingRoot: require('path').join(__dirname),
  },
};

module.exports = nextConfig;

