import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.nexusync.online" }],
        destination: "https://nexusync.online/:path*",
        permanent: true,
      },
      ...["chronos", "pulsemetrics", "pulsespin", "memory", "arknoid", "images-blend", "voxelvaders", "pulse-arkanoid", "cyber-tarot"].map(slug => ({
        source: `/apps/${slug}`,
        destination: `/${slug}`,
        permanent: true,
      })),
      { source: "/sistemas-e-automacoes", destination: "/apps", permanent: true },
    ];
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
