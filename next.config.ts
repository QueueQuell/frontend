import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://queuequell-backend.onrender.com/api/:path*',
      },
    ];
  },
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
