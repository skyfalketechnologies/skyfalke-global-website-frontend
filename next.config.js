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
  output: 'standalone',
  // Webpack configuration for react-quill and TipTap compatibility
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ensure react-dom has findDOMNode on default export for react-quill
      config.resolve.alias = {
        ...config.resolve.alias,
      };
      
      // Ensure TipTap packages are properly handled
      config.resolve.fallback = {
        ...config.resolve.fallback,
      };
      
      // Transpile TipTap packages to fix bundling issues
      config.module.rules.push({
        test: /\.(js|jsx|ts|tsx)$/,
        include: /node_modules\/@tiptap/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['next/babel'],
            plugins: [],
          },
        },
      });
    }
    return config;
  },
  
  // Transpile TipTap packages
  transpilePackages: ['@tiptap/react', '@tiptap/core', '@tiptap/starter-kit'],
  // Turbopack configuration (Next.js 16+ uses Turbopack by default)
  // Fonts are handled automatically by Turbopack, no webpack config needed
  turbopack: {},
  // Ensure static files are properly handled in standalone mode
  experimental: {
    outputFileTracingRoot: require('path').join(__dirname),
  },
};

module.exports = nextConfig;

