import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      // Admins paste image URLs from arbitrary hosts when creating products/brands/categories.
      // Tighten this to your CDN/bucket hostname before going to production.
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
