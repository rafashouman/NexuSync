import type { Metadata } from "next";
import RuaHome from "@/components/rua/RuaHome";
import { faqs, presence } from "@/components/rua/content";

const title = "Criação de Sites Personalizados e Interativos | NexuSync";
const description =
  "Sites sob medida, landing pages, hotsites e catálogos digitais com interações que fazem o cliente explorar. Leves no celular e com SEO desde a base.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://nexusync.online/" },
  openGraph: {
    title,
    description,
    url: "https://nexusync.online/",
    siteName: "NexuSync",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "https://nexusync.online/images/og-rua-acesa.jpg",
        width: 1200,
        height: 630,
        alt: "Rua à noite com o concorrente em 1º na busca e o seu negócio invisível: NexuSync, sites e SEO orgânico",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["https://nexusync.online/images/og-rua-acesa.jpg"],
  },
};

const toNumber = (brl: string) => brl.replace(/\./g, "").replace(",", ".");

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      "@id": "https://nexusync.online/#faq",
      mainEntity: faqs.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
    {
      "@type": "Service",
      "@id": "https://nexusync.online/#presence",
      name: `Criação de site — plano ${presence.name}`,
      serviceType: "Criação de sites personalizados",
      description: presence.description,
      provider: { "@id": "https://nexusync.online/#organization" },
      areaServed: { "@type": "Country", name: "Brasil" },
      offers: {
        "@type": "Offer",
        price: toNumber(presence.price),
        priceCurrency: "BRL",
        url: "https://nexusync.online/#entregaveis",
        availability: "https://schema.org/InStock",
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <RuaHome />
    </>
  );
}
