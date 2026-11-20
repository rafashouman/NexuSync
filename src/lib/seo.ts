export const SITE_URL = "https://nexusync.online";
const ORGANIZATION_ID = `${SITE_URL}/#organization`;

/** BreadcrumbList for an inner page: the home is always the first item. */
export function breadcrumbs(...trail: readonly (readonly [name: string, path: string])[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [["NexuSync", "/"] as const, ...trail].map(([name, path], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: `${SITE_URL}${path}`,
    })),
  };
}

/** Service entity without invented offers: price only appears when the page really shows one. */
export function serviceSchema({ name, path, serviceType, description }: { name: string; path: string; serviceType: string; description: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}${path}#service`,
    name,
    serviceType,
    description,
    url: `${SITE_URL}${path}`,
    provider: { "@id": ORGANIZATION_ID },
    areaServed: { "@type": "Country", name: "Brasil" },
  };
}

export function faqSchema(items: readonly (readonly [question: string, answer: string])[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}
