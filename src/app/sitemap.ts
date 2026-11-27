import type { MetadataRoute } from "next";

import { appCatalog } from "@/data/appCatalog";
import { segments } from "@/data/segments";

/** Pages that sell: priority follows the agency's pillar order (online presence first). */
const servicePaths = ["/seo-para-negocios-locais", "/criacao-de-sites", "/lojas-virtuais", "/design", "/redes-sociais", "/marketing", "/apps"];
const segmentPaths = segments.map((segment) => `/sites-para/${segment.slug}`);

/** Template demos use fictional brands: they stay out of the sitemap so search focuses on the pages that sell.
 *  /templates (the gallery) and /templates/cyber-oregon (indexed on purpose) are listed by hand below. */
const isTemplateDemo = (path: string) => path.startsWith("/templates/");

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
  "/calculadora-cpa",
  "/privacidade",
  ...appCatalog.map(app => app.path).filter((path) => !isTemplateDemo(path)),
])];

function priorityOf(path: string) {
  if (path === "/") return 1;
  if (servicePaths.includes(path)) return 0.9;
  if (segmentPaths.includes(path)) return 0.8;
  if (path === "/contato" || path === "/quem-somos") return 0.7;
  if (path === "/calculadora-cpa") return 0.6;
  return 0.4;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPaths.map((path) => ({
    url: `https://nexusync.online${path}`,
    changeFrequency: "monthly",
    priority: priorityOf(path),
  }));
}
