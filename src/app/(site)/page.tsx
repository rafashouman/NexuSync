import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { SiteSolutions, SiteBenefits, SiteProcess } from "@/components/SiteSections";
import { Plans } from "@/components/Plans";
import { PlansApps } from "@/components/PlansApps";
import { PlansMarketing } from "@/components/PlansMarketing";
import { PlansDG } from "@/components/PlansDG";
import { FAQ } from "@/components/FAQ";
import { Contact } from "@/components/Contact";

const title = "Criação de Sites e Soluções Digitais | NexuSync";
const description =
  "Criação de sites profissionais, lojas virtuais, sistemas web e automações para pequenos negócios. Conheça as soluções da NexuSync.";
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
      <SiteBenefits />
      <SiteProcess />
      <div className="container-luxe pt-16">
        <nav aria-label="Categorias de planos" className="flex flex-wrap justify-center gap-3">
          {[["#planos", "Sites"], ["#aplicacoes", "Aplicativos"], ["#midias-digitais", "Design"], ["#planos-marketing", "Redes sociais, tráfego e SEO"]].map(([href, label]) => <a key={href} href={href} className="inline-flex min-h-11 items-center rounded-full border border-turquoise/40 px-5 py-2 text-sm font-semibold text-ice hover:bg-turquoise/10">{label}</a>)}
        </nav>
      </div>
      <Plans sitesOnly />
      <PlansApps />
      <PlansDG />
      <PlansMarketing />
      <FAQ />
      <Contact />
    </>
  );
}
