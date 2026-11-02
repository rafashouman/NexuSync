import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { SelectedWork } from "@/components/SelectedWork";
import { SiteSolutions, SiteBenefits, SiteProcess } from "@/components/SiteSections";
import { Plans } from "@/components/Plans";
import { PlansApps } from "@/components/PlansApps";
import { PlansDG } from "@/components/PlansDG";
import { FAQ } from "@/components/FAQ";
import { Contact } from "@/components/Contact";

const title = "Criação de Sites, Landing Pages e Hotsites | NexuSync";
const description = "Sites profissionais, landing pages e hotsites para apresentar seu negócio e facilitar pedidos de orçamento. Conheça os projetos da NexuSync.";
export const metadata: Metadata = {
  title, description,
  alternates: { canonical: "https://nexusync.online/" },
  openGraph: { title, description, url: "https://nexusync.online/", siteName: "NexuSync", locale: "pt_BR", type: "website", images: [{ url: "https://nexusync.online/images/site-preview-desktop.webp", width: 1440, height: 1000, alt: "Exemplo demonstrativo de site desenvolvido pela NexuSync" }] },
  twitter: { card: "summary_large_image", title, description, images: ["https://nexusync.online/images/site-preview-desktop.webp"] },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <SiteSolutions />
      <SelectedWork />
      <SiteBenefits />
      <SiteProcess />
      <Plans sitesOnly />
      <PlansApps />
      <PlansDG />
      <FAQ />
      <Contact homeOffersOnly />
    </>
  );
}
