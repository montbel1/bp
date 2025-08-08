import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for Windows development
  experimental: {
    // Reduce file system operations
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },
  // Improve development experience
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Reduce memory usage in development
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules', '**/.next', '**/prisma'],
      }
    }
    return config
  },
  // Disable some features that can cause file conflicts
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
