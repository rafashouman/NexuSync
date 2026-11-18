import type { Metadata } from "next";
import ControlledChaos from "@/components/home/ControlledChaos";
const title = "Criação de Sites e Soluções Digitais | NexuSync";
const description =
  "Criação de sites profissionais, lojas virtuais, sistemas web e automações para pequenos negócios. Conheça as soluções da NexuSync.";
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
        url: "https://nexusync.online/images/site-preview-desktop.webp",
        width: 1440,
        height: 1000,
        alt: "NexuSync — soluções digitais",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["https://nexusync.online/images/site-preview-desktop.webp"],
  },
};
export default function HomePage() {
  return <ControlledChaos />;
}
