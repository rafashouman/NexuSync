import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { io } from "next/cache";

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
                width={202}
                height={24}
                className="h-6 w-auto transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <p className="text-muted-foreground max-w-sm leading-relaxed text-sm">
              Ajudamos seu cliente a entender sua oferta e dar o próximo passo. Sites, landing pages e hotsites com caminhos claros para pedir orçamento. Atendimento em todo o Brasil.
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Também precisa de divulgação?{" "}
              <Link href="/marketing" className="font-semibold text-violet-200 underline-offset-4 hover:underline">
                Conheça nossos serviços de marketing digital.
              </Link>
            </p>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-6 uppercase tracking-widest text-xs">Navegação</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-violet-200 transition-colors">Início</Link></li>
              <li><Link href="/apps" className="hover:text-violet-200 transition-colors">Aplicativos</Link></li>
              <li><Link href="/design" className="hover:text-violet-200 transition-colors">Design</Link></li>
              <li><Link href="/templates" className="hover:text-violet-200 transition-colors">Exemplos de sites</Link></li>
              <li><Link href="/#planos" className="hover:text-violet-200 transition-colors">Planos & Preços</Link></li>
              <li><Link href="/#faq" className="hover:text-violet-200 transition-colors">FAQ</Link></li>
              <li><Link href="/privacidade" className="hover:text-violet-200 transition-colors">Privacidade</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-6 uppercase tracking-widest text-xs">Outras soluções</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/marketing" className="hover:text-violet-200 transition-colors">Marketing digital</Link></li>
              <li><Link href="/lojas-virtuais" className="hover:text-violet-200 transition-colors">Lojas virtuais</Link></li>
              <li><Link href="/arcade" className="hover:text-violet-200 transition-colors">Experiências interativas</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© <Suspense fallback={null}><CurrentYear /></Suspense> NexuSync. Todos os direitos reservados.</p>
          <p>Desenvolvido com foco em performance e experiência do utilizador.</p>
        </div>
      </div>
    </footer>
  );
}

async function CurrentYear() {
  await io();
  return 2026;
}