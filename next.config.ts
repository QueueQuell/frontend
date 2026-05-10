import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "http://localhost:8000/api/:path*";

    return [
      {
        source: "/api/:path*",
        destination: apiBaseUrl,
      },
    ];
  },
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
