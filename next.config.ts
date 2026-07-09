import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    formats: ["image/avif", "image/webp"],
  deviceSizes: [640, 720, 750, 828, 960, 1080, 1200, 1920],
  },
};

export default nextConfig;
