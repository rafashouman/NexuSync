import type { MetadataRoute } from "next";

import { appCatalog } from "@/data/appCatalog";
import { segments } from "@/data/segments";

/** Pages that sell: priority follows the agency's pillar order (online presence first). */
const servicePaths = ["/seo-para-negocios-locais", "/criacao-de-sites", "/lojas-virtuais", "/design", "/redes-sociais", "/marketing", "/apps"];
const segmentPaths = segments.map((segment) => `/sites-para/${segment.slug}`);

const publicPaths = [...new Set([
  "/",
  ...servicePaths,
  ...segmentPaths,
  "/quem-somos",
  "/contato",
  "/arcsync",
  "/visionsync",
  "/templates",
  "/templates/cyber-oregon",
  "/privacidade",
  ...appCatalog.map(app => app.path),
])];

function priorityOf(path: string) {
  if (path === "/") return 1;
  if (servicePaths.includes(path)) return 0.9;
  if (segmentPaths.includes(path)) return 0.8;
  if (path === "/contato" || path === "/quem-somos") return 0.7;
  return 0.4;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPaths.map((path) => ({
    url: `https://nexusync.online${path}`,
    changeFrequency: "monthly",
    priority: priorityOf(path),
  }));
}
