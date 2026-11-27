// Regras do Pixel da Meta compartilhadas entre navegador e servidor.

export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || "1587285682708459";
const CYBEROREGON_PIXEL_ID = process.env.NEXT_PUBLIC_CYBEROREGON_META_PIXEL_ID;

// Páginas da agência (grupo `(site)`). Só elas geram eventos de conversão no Pixel
// da NexuSync; demos e apps de exemplo contam apenas PageView.
// Página nova da agência precisa entrar aqui (o teste de orçamento confere a lista).
export const AGENCY_PATHS: readonly string[] = [
  "/",
  "/apps",
  "/arcade",
  "/arcsync",
  "/calculadora-cpa",
  "/contato",
  "/criacao-de-sites",
  "/design",
  "/lojas-virtuais",
  "/marketing",
  "/privacidade",
  "/quem-somos",
  "/redes-sociais",
  "/seo-para-negocios-locais",
  "/templates",
  "/visionsync",
];

const isUnder = (pathname: string, base: string) =>
  pathname === base || pathname.startsWith(`${base}/`);

export function isAgencyPath(pathname: string) {
  return AGENCY_PATHS.includes(pathname) || pathname.startsWith("/sites-para/");
}

/** Pixel que deve receber o evento nesta página, ou null quando não deve ser enviado. */
export function pixelForEvent(pathname: string, eventName: string): string | null {
  if (CYBEROREGON_PIXEL_ID && isUnder(pathname, "/templates/cyber-oregon")) {
    return CYBEROREGON_PIXEL_ID;
  }
  // Painéis mostram dados de clientes: nada vai para o Pixel.
  if (isUnder(pathname, "/admin") || isUnder(pathname, "/templates/cardapio-lancheria/painel")) return null;
  // Terapia é dado sensível de saúde: o site da terapeuta não conta nem PageView.
  if (isUnder(pathname, "/templates/luzinete-terapeuta")) return null;
  if (eventName === "PageView") return META_PIXEL_ID;
  return isAgencyPath(pathname) ? META_PIXEL_ID : null;
}
