import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  distDir: process.env.NEXT_BUILD_DIR || ".next",
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
    cpus: 1,
  },
  webpack(config) {
    config.module.rules.push({ test: /[\\/]globals\.css$/, enforce: "pre", use: ["@tailwindcss/turbopack"] });
    return config;
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      // CSS Modules use the native pipeline; only this file contains Tailwind directives.
      "globals.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
