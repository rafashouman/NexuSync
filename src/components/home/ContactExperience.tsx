import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { Contact } from "@/components/Contact";
import s from "./SitesExperience.module.css";
import c from "./StudioExperience.module.css";

export default function ContactExperience() {
  return <div className={`${s.page} ${c.studio}`}><header className={`${s.section} ${c.contactHero}`}><div className={s.eyebrow}><Link href="/">NEXUSYNC</Link><span>/ CONTATO & ORÇAMENTO</span><span>A PRÓXIMA CONEXÃO COMEÇA AQUI.</span></div><div className={s.heading}><h1>Seu próximo projeto<br /><em>começa com uma conversa.</em></h1><div><p>Escolha o assunto, conte o que precisa e fale com a gente pelo canal que preferir.</p><a href="#orcamento" className={s.textLink}>Conte sua ideia<ArrowDown size={16} /></a></div></div><div className={c.contactRibbon} aria-hidden="true"><span>IDEIA</span><i /><span>CONVERSA</span><i /><span>PRÓXIMO PASSO ↗</span></div></header>
    <Contact presentation="chaos" />
  </div>;
}
