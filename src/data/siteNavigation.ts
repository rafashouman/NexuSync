type NavLink = readonly [label: string, href: string];
type NavGroup = { title: string; links: readonly NavLink[] };

/** Services in the agency's pillar order: online presence first, paid traffic always last. */
export const solutionPillars: readonly { pillar: string; links: readonly NavLink[] }[] = [
  { pillar: "Presença online", links: [
    ["Criação de sites", "/criacao-de-sites"], ["Lojas virtuais e catálogos", "/lojas-virtuais"],
    ["Aplicativos e automações", "/apps"], ["SEO e presença no Google", "/seo-para-negocios-locais"],
  ] },
  { pillar: "Design", links: [["Design e motion graphics", "/design"]] },
  { pillar: "Redes sociais", links: [["Gestão de redes sociais", "/redes-sociais"]] },
  { pillar: "Tráfego pago", links: [["Tráfego pago", "/marketing#marketing-aquisicao-local"]] },
];

export const siteNavigation: readonly NavGroup[] = [
  { title: "Soluções", links: solutionPillars.flatMap((group) => group.links) },
  { title: "Produtos e experiências", links: [
    ["ArcSync · Publicações", "/arcsync"], ["VisionSync · Atendimento", "/visionsync"],
    ["Templates e demonstrações", "/templates"], ["Aplicativos para experimentar", "/apps#todos-os-aplicativos"], ["Arcade · Jogos", "/arcade"],
  ] },
  { title: "NexuSync", links: [
    ["Quem somos", "/quem-somos"], ["Como funciona", "/#metodo"], ["Planos de sites", "/criacao-de-sites#planos"],
    ["Contato e orçamento", "/contato"], ["Privacidade", "/privacidade"],
  ] },
];
