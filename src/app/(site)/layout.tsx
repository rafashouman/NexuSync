import type { Metadata } from "next";
import { SiteChrome } from "@/components/home/SiteChrome";


import { DemoFrame } from "@/components/ui/DemoFrame";


export const metadata: Metadata = {
  title: "NexuSync | Sites, Design e Presença Online",
  description: "Sites marcantes com SEO orgânico, design com motion graphics, gestão de redes sociais e, por último, tráfego pago. Soluções digitais para pequenos negócios.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "NexuSync",
    title: "NexuSync | Sites e soluções digitais para empresas",
    description:
      "Criação de sites, aplicativos, design e marketing para empresas que querem apresentar melhor seus serviços e facilitar o contato.",
    images: [
      {
        url: "/images/site-preview-desktop.webp",
        width: 1440,
        height: 1000,
        alt: "Exemplo de site desenvolvido pela NexuSync",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NexuSync | Sites e soluções digitais para empresas",
    description:
      "Criação de sites, aplicativos, design e marketing para empresas que querem apresentar melhor seus serviços e facilitar o contato.",
    images: ["/images/site-preview-desktop.webp"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://nexusync.online/#organization",
      name: "NexuSync",
      url: "https://nexusync.online/",
      logo: "https://nexusync.online/images/logo-text.png",
      email: "contato@nexusync.online",
      description: "Agência digital que cria sites marcantes com SEO orgânico, design com motion graphics, gestão de redes sociais e tráfego pago para negócios locais.",
      areaServed: { "@type": "Country", name: "Brasil" },
      knowsAbout: ["Criação de sites", "SEO orgânico", "Motion graphics", "Gestão de redes sociais", "Tráfego pago"],
      sameAs: ["https://www.instagram.com/nexusync_company/"],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+5551993583936",
        contactType: "customer service",
        availableLanguage: ["Portuguese"],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://nexusync.online/#website",
      url: "https://nexusync.online/",
      name: "NexuSync",
      inLanguage: "pt-BR",
      publisher: { "@id": "https://nexusync.online/#organization" },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <div className="nexusync-site">
      <DemoFrame>
        <SiteChrome>{children}</SiteChrome>
      </DemoFrame>
      </div>
    </>
  );
}
