import type { Metadata } from "next";
import AboutExperience from "@/components/home/AboutExperience";

const title = "Quem somos | NexuSync — Sua presença digital com personalidade";
const description = "Conheça o jeito NexuSync de conectar sites, aplicativos, design, tráfego pago e SEO aos objetivos do seu negócio. Criação com identidade e atendimento próximo.";

export const metadata: Metadata = {
  title, description,
  alternates: { canonical: "https://nexusync.online/quem-somos" },
  openGraph: {
    title, description, url: "https://nexusync.online/quem-somos", type: "website", locale: "pt_BR", siteName: "NexuSync",
    images: [{ url: "https://nexusync.online/images/capa-nexusync.png", alt: "NexuSync — Soluções digitais" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["https://nexusync.online/images/capa-nexusync.png"] },
};

export default function AboutPage() { return <AboutExperience />; }
