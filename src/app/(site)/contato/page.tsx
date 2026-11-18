import AboutExperience from "@/components/home/AboutExperience";
import ContactExperience from "@/components/home/ContactExperience";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Contato e orçamento | NexuSync",
  description: "Conte seu projeto. Fale com a NexuSync sobre sites, aplicativos, design, redes sociais, tráfego pago e SEO, por formulário ou WhatsApp.",
  path: "/contato",
});

export default function ContactPage() {
  return (
    <>
      <ContactExperience /> 
      <AboutExperience />
    </>
  );

}
