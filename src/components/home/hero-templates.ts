export type HeroDeviceMode = "phone" | "notebook";

const phoneTemplates = ["imobiliaria", "cardapio", "academias", "streetwear", "arquitetura", "dog-e-acai", "carros", "miniaturas"];
const notebookTemplates = ["imobiliaria", "academias", "arquitetura", "streetwear", "carros", "cardapio"];

export function heroScreenshots(mode: HeroDeviceMode) {
  return (mode === "phone" ? phoneTemplates : notebookTemplates).map(slug => `/images/hero-templates/${mode === "notebook" ? "desktop/" : ""}${slug}.jpg`);
}
