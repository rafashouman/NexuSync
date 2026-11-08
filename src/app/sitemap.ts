import type { MetadataRoute } from "next";

import { appCatalog } from "@/data/appCatalog";

const publicPaths = [
  "/",
  "/apps",
  "/design",
  "/marketing",
  "/lojas-virtuais",
  "/templates",
  "/privacidade",
  ...appCatalog.map(app => app.path),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPaths.map((path) => ({
    url: `https://nexusync.online${path}`,
    changeFrequency: path === "/" ? "monthly" : "yearly",
    priority: path === "/" ? 1 : 0.6,
  }));
}
