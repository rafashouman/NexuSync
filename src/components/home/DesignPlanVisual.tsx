import Image from "next/image";
import { MousePointer2 } from "lucide-react";
import s from "./DesignPlanVisual.module.css";

function StarterVisual() {
  return <div className={`${s.stage} ${s.starter}`} aria-hidden="true">
    <div className={s.topline}><span>01 / COMUNICAÇÃO</span><span>EXEMPLO VISUAL</span></div>
    <div className={s.starterContent}>
      <div className={s.sectionLabel}><span>3 ARTES</span><span>FEED / STORIES</span></div>
      <div className={s.socialGrid}>{["/images/port-wd/pink-face-divulga-1-big.jpg", "/images/port-wd/pink-face-divulga-3-big.jpg", "/images/port-wd/pink-face-divulga-4-big.jpg"].map((src, i) => <div key={src}><span>0{i + 1} / PEÇA</span><div className={s.socialImage}><Image src={src} alt="" fill sizes="(max-width: 760px) 25vw, 100px" /></div></div>)}</div>
      <div className={s.starterBanner}><span>1 BANNER DIGITAL</span><div><Image src="/images/port-wd/pink-face-(1).jpg" alt="" fill sizes="(max-width: 760px) 80vw, 260px" /></div></div>
      <div className={s.portfolioLabel}>PORTFÓLIO / ESTÉTICA PINK</div>
      <div className={s.guideLine}><span>CORES + FONTES</span><div className={s.swatches}><i /><i /><i /><b>Aa</b></div></div>
    </div>
  </div>;
}

function ProfessionalVisual() {
  return <div className={`${s.stage} ${s.professional}`} aria-hidden="true">
    <div className={s.topline}><span>02 / IDENTIDADE</span><span>EXEMPLO VISUAL</span></div>
    <div className={s.identityContent}>
      <div className={s.identityGrid}>
        <div className={s.logoBlock}><span>LOGOTIPO / VETOR</span><div className={s.logoImage}><Image src="/images/port-iv/bela-juba-com-bg.jpg" alt="" fill sizes="(max-width: 760px) 40vw, 150px" /></div></div>
        <div className={s.manual}><span>MANUAL DA MARCA</span><b>Bela<br />Juba</b><small>CORES / TIPOGRAFIA / USO</small><div className={s.identitySwatches}><i /><i /><i /></div><strong>Aa <small>TIPOGRAFIA</small></strong></div>
      </div>
      <div className={s.applicationLabel}><span>APLICAÇÕES DIGITAIS</span><span>5 ARTES + 1 CAPA</span></div>
      <div className={s.applicationGrid}>{["CUIDADO", "BELEZA", "ESTÉTICA", "BEM-ESTAR", "AUTOESTIMA"].map((item, i) => <div key={item} data-art={i}><i /><span>{item}</span></div>)}</div>
      <div className={s.identityBanner}><span>BELA JUBA / ESTÉTICA</span><b>Um universo. Uma marca.</b></div>
    </div>
  </div>;
}

function InterfaceVisual() {
  return <div className={`${s.stage} ${s.interface}`} aria-hidden="true">
    <div className={s.topline}><span>03 / UI & UX</span><span>EXEMPLO VISUAL</span></div>
    <div className={s.interfaceContent}>
      <div className={s.sectionLabel}><span>DO WIREFRAME</span><span>À INTERFACE ↗</span></div>
      <div className={s.screenGrid}>
        <div className={s.wireframe}><span>ESTRUTURA</span><div className={s.wireNav}><i /><i /></div><div className={s.wireHero}><i /><i /><i /></div><div className={s.wireCards}><i /><i /><i /></div></div>
        <div className={s.desktop}><span>DESKTOP</span><div className={s.desktopNav}><b>vão.</b><i>PROJETOS &nbsp; SOBRE</i></div><div className={s.desktopBody}><small>ARQUITETURA / INTERIORES</small><strong>Espaços<br /><em>para viver.</em></strong><b>VER PROJETOS ↗</b></div><div className={s.desktopCards}><i /><i /><i /></div><MousePointer2 className={s.cursor} size={16} fill="currentColor" /></div>
        <div className={s.phone}><span>MOBILE</span><div className={s.phoneScreen}><b>vão.</b><small>ARQUITETURA</small><strong>Espaços<br />para viver.</strong><i>VER PROJETOS ↗</i></div></div>
      </div>
      <div className={s.interfaceFooter}><div><span>UI KIT</span><div className={s.uiKit}><i /><i /><i /><b>Aa</b></div></div><div className={s.prototype}><i /> PROTÓTIPO<br />ATÉ 3 TELAS</div></div>
    </div>
  </div>;
}

export function DesignPlanVisual({ index }: { index: number }) {
  return index === 0 ? <StarterVisual /> : index === 1 ? <ProfessionalVisual /> : <InterfaceVisual />;
}
