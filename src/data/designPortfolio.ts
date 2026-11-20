export type WorkCategory = "identidade" | "pecas";

export const workCategories: readonly { id: WorkCategory; label: string }[] = [
  { id: "identidade", label: "Identidade visual" },
  { id: "pecas", label: "Peças e papelaria" },
];

export type Work = {
  /** Client or project name exactly as it appears in the artwork. */
  name: string;
  /** What was designed, so the caption says what the viewer is looking at. */
  piece: string;
  category: WorkCategory;
  src: string;
};

/** Curated from the real files in public/images. Remove an entry here to take a client off the page. */
export const works: readonly Work[] = [
  { name: "Bela Juba", piece: "Logotipo e identidade", category: "identidade", src: "/images/port-iv/bela-juba-com-bg.jpg" },
  { name: "Estética Pink", piece: "Logotipo", category: "identidade", src: "/images/port-iv/pink-logo-2.png" },
  { name: "Flavia Martins", piece: "Logotipo", category: "identidade", src: "/images/port-iv/Logo-Flavia.jpg" },
  { name: "Costi Seguros", piece: "Logotipo", category: "identidade", src: "/images/port-iv/especial-logo-1.png" },
  { name: "Mountek", piece: "Logotipo", category: "identidade", src: "/images/port-iv/mountek-logo.png" },
  { name: "Rede Mapas", piece: "Logotipo", category: "identidade", src: "/images/port-iv/logo-redemapas.png" },
  { name: "Flavia Martins", piece: "Cartão de visita", category: "pecas", src: "/images/port-dg/flavia-cartao-vs-bg.jpg" },
  { name: "Estética Pink", piece: "Cartão de visita", category: "pecas", src: "/images/port-dg/cartao-pink-verso-bg.jpg" },
  { name: "Foxtrot Seguros", piece: "Banner", category: "pecas", src: "/images/port-dg/fox-banner-1-bg.jpg" },
  { name: "Estética Pink", piece: "Cardápio impresso", category: "pecas", src: "/images/port-dg/impressao-cardapio-2.jpg" },
  { name: "Aheadworks", piece: "Cartão de visita", category: "pecas", src: "/images/port-dg/aw-cartao.jpg" },
  { name: "Severo Roth", piece: "Panfleto de ofertas", category: "pecas", src: "/images/port-dg/panfleto-severo-3.jpg" },
];
