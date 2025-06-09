/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,
  // Disable source maps in production for better performance
  productionBrowserSourceMaps: false,
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  // Custom webpack config for better tree shaking
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle in production
    if (!dev && !isServer) {
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }
    return config;
  },
  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Experimental features for better hydration handling
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

module.exports = nextConfig; 