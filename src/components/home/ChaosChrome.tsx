"use client";
import Link from "next/link";
import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X, ChevronDown, Mail } from "lucide-react";
import { siteNavigation, solutionPillars } from "@/data/siteNavigation";
import { waLink } from "@/lib/site-config";
import s from "./ControlledChaos.module.css";
import c from "./Navigation.module.css";
const contact = "/contato?interest=nao-sei&source=header#orcamento";
const EMAIL = "contato@nexusync.online";
const WA_DISPLAY = "51 99358-3936";
const WA_HREF = waLink("Olá! Vim pelo site da NexuSync e gostaria de falar sobre um projeto.");

function WhatsAppIcon({ size = 13 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
  );
}

function DropdownLink({ label, href }: { label: string; href: string }) {
  return <Link href={href} onClick={e => e.currentTarget.closest("details")?.removeAttribute("open")}>{label}<ArrowUpRight size={13} /></Link>;
}

export function ChaosHeader() {
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  function close() { setMenu(false); toggle.current?.focus(); }
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className={`${s.home} ${s.chrome}`} data-scrolled={scrolled}>
    <div className={s.chromeFixed} data-scrolled={scrolled}>
      <div className={s.headerTopBar}>
        <div className={s.headerTopInner}>
          <a href={`mailto:${EMAIL}`} className={s.headerContactLink}>
            <Mail size={13} aria-hidden="true" />
            <span>{EMAIL}</span>
          </a>
          <a href={WA_HREF} target="_blank" rel="noopener noreferrer" className={s.headerContactLink}>
            <WhatsAppIcon size={13} />
            <span>{WA_DISPLAY}</span>
          </a>
        </div>
      </div>
      <header className={s.header} onKeyDown={e => { if (e.key === "Escape") { close(); e.currentTarget.querySelectorAll("details[open]").forEach(node => node.removeAttribute("open")); } }}>
        <Link href="/" className={s.logo} aria-label="NexuSync - início"><Image src="/images/logo-text.png" width={517} height={91} sizes="165px" style={{ height: "auto" }} alt="NexuSync" priority /></Link>
        <nav className={s.desktopNav} aria-label="Navegação principal">{siteNavigation.slice(0, 2).map(group => <details className={c.dropdown} key={group.title} name="navigation"><summary>{group.title === "Soluções" ? "Soluções" : "Produtos e exemplos"}<ChevronDown size={13} /></summary><div className={c.dropdownPanel}>{group.title === "Soluções"
          ? solutionPillars.map((pillar, i) => <Fragment key={pillar.pillar}><span className={c.pillarLabel}>{`0${i + 1} · ${pillar.pillar}`}</span>{pillar.links.map(([label, href]) => <DropdownLink key={href} label={label} href={href} />)}</Fragment>)
          : group.links.map(([label, href]) => <DropdownLink key={href} label={label} href={href} />)}</div></details>)}<Link href="/quem-somos">A NexuSync</Link></nav>
        <Link className={s.navCta} href={contact}>Vamos conversar <ArrowUpRight size={18} /></Link>
        <button ref={toggle} className={s.menuButton} onClick={() => setMenu(!menu)} aria-expanded={menu} aria-controls="home-menu" aria-label={menu ? "Fechar menu" : "Abrir menu"}>{menu ? <X /> : <Menu />}</button>
        {menu && <nav id="home-menu" className={`${s.mobileNav} ${c.mobileMenu}`} aria-label="Navegação móvel">{siteNavigation.map(group => <div key={group.title}><span>{group.title}</span>{group.links.map(([label, href]) => <Link key={href} href={href} onClick={() => setMenu(false)}>{label}<ArrowUpRight size={13} /></Link>)}</div>)}<div className={s.mobileContacts}><a href={`mailto:${EMAIL}`} className={s.headerContactLink}><Mail size={14} aria-hidden="true" /><span>{EMAIL}</span></a><a href={WA_HREF} target="_blank" rel="noopener noreferrer" className={s.headerContactLink}><WhatsAppIcon size={14} /><span>{WA_DISPLAY}</span></a></div><Link href={contact} onClick={() => setMenu(false)}>Vamos conversar <ArrowUpRight size={16} /></Link></nav>}
      </header>
    </div>
  </div>;
}
export function ChaosFooter() {
  return <div className={s.home}><footer className={c.footer}><div className={c.footerTop}><div className={c.brand}><Link href="/" aria-label="NexuSync - início"><Image src="/images/logo-text.png" width={517} height={91} sizes="145px" style={{ width: 145, height: "auto" }} alt="NexuSync" /></Link><p>Design, tecnologia e novas possibilidades.<br />Sua próxima conexão começa aqui.</p><a href="mailto:contato@nexusync.online">contato@nexusync.online</a></div>{siteNavigation.map(group => <nav key={group.title} aria-label={group.title}><h2>{group.title}</h2>{group.links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav>)}</div><div className={c.footerBottom}><span>© NexuSync</span><span>Ideias com personalidade. Projetos com direção.</span><Link href="/contato">Vamos criar juntos ↗</Link></div></footer></div>;
}
