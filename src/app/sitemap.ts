import type { MetadataRoute } from "next";

import { appCatalog } from "@/data/appCatalog";

const publicPaths = [...new Set([
  "/",
  "/quem-somos",
  "/apps",
  "/design",
  "/marketing",
  "/lojas-virtuais",
  "/templates",
  "/templates/cyber-oregon",
  "/privacidade",
  ...appCatalog.map(app => app.path),
])];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPaths.map((path) => ({
    url: `https://nexusync.online${path}`,
    changeFrequency: path === "/" ? "monthly" : "yearly",
    priority: path === "/" ? 1 : 0.6,
  }));
}
