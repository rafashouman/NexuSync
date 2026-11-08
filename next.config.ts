import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return ["chronos", "pulsemetrics", "pulsespin", "memory", "arknoid", "images-blend", "voxelvaders", "pulse-arkanoid", "cyber-tarot"].map(slug => ({
      source: `/apps/${slug}`, destination: `/${slug}`, permanent: true,
    }));
  },
  experimental: {
    agentUpgrade: "security",
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
