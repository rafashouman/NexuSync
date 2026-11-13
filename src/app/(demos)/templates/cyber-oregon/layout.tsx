import type { Metadata } from "next";

const url = "https://nexusync.online/templates/cyber-oregon";
const title = "CyberOregon | Pentest, Red Team e Security Review";
const description =
  "Conheça os serviços de Pentest Web e APIs, Red Team e Security Review da CyberOregon. Entenda a metodologia e converse sobre o escopo da sua avaliação.";
const image = "/images/templates/cyber-oregon/cybersecurity-scaled.jpg";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: url },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "CyberOregon",
    title,
    description,
    url,
    images: [{ url: image, alt: "CyberOregon — segurança de aplicações e infraestrutura" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [image],
  },
  icons: {
    icon: "/images/templates/cyber-oregon/logo-cyber-oregon-small.png",
    apple: "/images/templates/cyber-oregon/logo-cyber-oregon-small.png",
  },
};

export default function CyberOregonLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${url}#webpage`,
            url,
            name: title,
            description,
            inLanguage: "pt-BR",
            about: ["Pentest", "Red Team", "Security Review"].map((name) => ({
              "@type": "Thing",
              name,
            })),
          }).replace(/</g, "\\u003c"),
        }}
      />
      {children}
    </>
  );
}
