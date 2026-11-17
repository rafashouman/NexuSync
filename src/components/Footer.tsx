import { AccentText } from "@/components/AccentText";

import Link from "next/link";
import Image from "next/image";


export function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8">
      <div className="container-luxe">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          <div className="lg:col-span-2">
            <Link href="/" aria-label="NexuSync — início" className="logo-pulse group flex items-center gap-2 mb-6">
              <Image
                src="/images/logo-text.png"
                alt="NexuSync"
                width={300}
                height={99}
                sizes="110px"
                style={{ height: "auto" }}
                className="w-[110px] transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <p className="text-muted-foreground max-w-sm leading-relaxed text-sm">
              Ajudamos seu cliente a entender sua oferta e dar o próximo passo. Sites, landing pages e hotsites com caminhos claros para pedir orçamento. Atendimento em todo o Brasil.
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Também precisa de divulgação?{" "}
              <Link href="/marketing" className="font-semibold text-ice underline-offset-4 hover:underline">
                Conheça nossos serviços de tráfego pago e SEO.
              </Link>
            </p>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-6 uppercase tracking-widest text-xs"><AccentText text={"Navegação"} /></h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-ice transition-colors">Início</Link></li>
              <li><Link href="/contato" className="hover:text-ice transition-colors">Contato</Link></li>
              <li><Link href="/quem-somos" className="hover:text-ice transition-colors">Quem somos</Link></li>
              <li><Link href="/criacao-de-sites" className="hover:text-ice transition-colors">Criação de sites</Link></li>
              <li><Link href="/criacao-de-sites#lojas-virtuais" className="hover:text-ice transition-colors">Lojas virtuais e catálogos</Link></li>
              <li><Link href="/apps" className="hover:text-ice transition-colors">Sistemas web</Link></li>
              <li><Link href="/criacao-de-sites#templates" className="hover:text-ice transition-colors">Templates e exemplos</Link></li>
              <li><Link href="/marketing" className="hover:text-ice transition-colors">Tráfego e SEO</Link></li>
              <li><Link href="/#planos" className="hover:text-ice transition-colors">Planos & Preços</Link></li>
              <li><Link href="/privacidade" className="hover:text-ice transition-colors">Privacidade</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-6 uppercase tracking-widest text-xs"><AccentText text={"Produtos"} /></h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/arcsync" className="hover:text-ice transition-colors">ArcSync</Link></li>
              <li><Link href="/visionsync" className="hover:text-ice transition-colors">VisionSync</Link></li>
              <li><Link href="/arcade" className="hover:text-ice transition-colors">Arcade</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 NexuSync. Todos os direitos reservados.</p>
          <p>Desenvolvido com foco em performance e experiência do utilizador.</p>
        </div>
      </div>
    </footer>
  );
}
