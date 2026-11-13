import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingWA } from "@/components/FloatingWA";
import DemoShell from "@/components/ui/DemoShell";
import { ScrollProgress } from "@/components/ui/MotionKit";

export const metadata: Metadata = {
  title: "NexuSync | Marketing Digital, Sites e Automações",
  description: "Sites, tráfego pago, gestão de redes sociais e automações para pequenos e médios negócios. Conheça os serviços e pacotes da NexuSync.",
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
      <DemoShell>
        <ScrollProgress />
        <Navbar />
        <main id="conteudo" className="relative flex min-h-screen flex-col overflow-hidden">
          {children}
        </main>
        <Footer />
        <FloatingWA />
      </DemoShell>
    </>
  );
}