import type { MetadataRoute } from "next";

const publicPaths = [
  "/",
  "/apps",
  "/design",
  "/marketing",
  "/lojas-virtuais",
  "/templates",
  "/arcade",
  "/privacidade",
  "/templates/academias",
  "/templates/bluemoon",
  "/templates/cardapio",
  "/templates/carros",
  "/templates/connection",
  "/templates/miniaturas",
  "/templates/reservas",
  "/templates/seguro-piloto",
  "/templates/streetwear",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPaths.map((path) => ({
    url: `https://nexusync.online${path}`,
    changeFrequency: path === "/" ? "monthly" : "yearly",
    priority: path === "/" ? 1 : 0.6,
  }));
}
