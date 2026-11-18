import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Plans } from "@/components/Plans";
import { PlansMarketing } from "@/components/PlansMarketing";
import { PlansDG } from "@/components/PlansDG";
import { PlansApps } from "@/components/PlansApps";
import s from "./HomePlans.module.css";

export function HomePlans() {
  return <section className={s.plans} id="planos" aria-labelledby="home-plans-title">
    <div className={s.intro}>
      <div className={s.eyebrow}><span>03 / SEU PROJETO, NA MEDIDA CERTA.</span><span>ESCOLHA SEU PRÓXIMO PASSO <ArrowDown size={13} /></span></div>
      <div className={s.introHeading}>
        <h2 id="home-plans-title">Uma ideia.<br /><em>Vários caminhos.</em></h2>
        <p>Um site para começar. Uma marca para ser lembrada. Uma campanha para alcançar mais pessoas. Encontre o plano que faz sentido para o seu momento.</p>
      </div>
      <nav className={s.serviceNav} aria-label="Planos por serviço">
        {[
          ["01", "Sites & lojas", "#planos-sites", "sites"],
          ["02", "Tráfego, SEO & Social", "#planos-marketing", "marketing"],
          ["03", "Design & identidade", "#midias-digitais", "design"],
          ["04", "Apps & sistemas", "#aplicacoes", "apps"],
        ].map(([n, label, href, kind]) => <a key={href} href={href} data-kind={kind}><small>{n}</small><span>{label}</span><ArrowUpRight size={18} /></a>)}
      </nav>
    </div>
    <Plans />
    <PlansMarketing />
    <PlansDG />
    <PlansApps />
  </section>;
}
