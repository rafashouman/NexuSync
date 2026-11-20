import type { Metadata } from "next";
import MetaPixel from "@/components/MetaPixel";
import "./globals.css"; // Ajuste o caminho se necessário

export const metadata: Metadata = {
  metadataBase: new URL("https://nexusync.online"),
  title: "NexuSync | Soluções Digitais",
  description: "Desenvolvimento de sites institucionais, plataformas digitais e e-commerces de alta performance.",
  icons: {
    icon: [
      { url: "/images/favicon.ico?v=20261120", type: "image/x-icon" },
      { url: "/images/favicon-32x32.png?v=20261120", sizes: "32x32", type: "image/png" },
      { url: "/images/favicon-16x16.png?v=20261120", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/images/favicon.ico?v=20261120",
  },
  other: {
    "p:domain_verify": "3ea911eb961dc25477766381f746866b",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-scroll-behavior="smooth" lang="pt-BR" className="scroll-smooth dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Fonte solicitada via stylesheet externo; carregamento no navegador. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:ital,wght@0,100..900;1,100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="antialiased bg-background text-foreground selection:bg-[#ffb547]/30 selection:text-[#f4f4e9] font-sans"
      >
        <MetaPixel />
        {/* O children aqui vai renderizar ou o SiteLayout ou a página do Template */}
        {children}
      </body>
    </html>
  );
}
