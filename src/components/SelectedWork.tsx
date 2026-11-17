"use client";

import { AccentText } from "@/components/AccentText";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const projects = [
  {
    number: "01",
    category: "Gastronomia",
    title: "Kobra Burger Lab",
    description:
      "Cardápio digital com personalidade para apresentar opções de uma hamburgueria.",
    objective: "Apresentar o cardápio e direcionar o visitante para fazer um pedido.",
    href: "/templates/cardapio",
    theme: "from-champagne/15 via-ocean to-petroleum",
  },
  {
    number: "02",
    category: "E-commerce & moda",
    title: "Vortex Atelier",
    description:
      "Uma vitrine editorial para destacar uma coleção de moda.",
    objective: "Apresentar produtos e facilitar a exploração da coleção.",
    href: "/templates/streetwear",
    theme: "from-turquoise/20 via-ocean to-petroleum",
  },
  {
    number: "03",
    category: "Automotivo & Seminovos",
    title: "Prime Motors",
    description:
      "Portal automotivo em tema claro com comparativo FIPE, simulador CDC e reserva de visita online.",
    objective: "Apresentar veículos e facilitar pedidos de informação ou visita.",
    href: "/templates/carros",
    theme: "from-turquoise/20 via-ocean to-petroleum",
  },
  {
    number: "04",
    category: "Arte 3D & Colecionáveis",
    title: "Alchemist Voxel",
    description:
      "Estúdio de impressão em resina 12K e pintura de miniaturas, com Raio-X de 3 estágios e calculadora de encomendas.",
    objective: "Apresentar serviços e receber solicitações de encomenda.",
    href: "/templates/miniaturas",
    theme: "from-turquoise/25 via-ocean to-petroleum",
  },
  {
    number: "05",
    category: "Cardápio digital",
    title: "Dog & Açaí",
    description:
      "Cardápio digital para montar cachorro-quente, escolher adicionais do açaí e revisar o pedido.",
    objective: "Facilitar pedidos para entrega ou retirada.",
    href: "/templates/dog-e-acai",
    theme: "from-turquoise/25 via-ocean to-petroleum",
  },
  {
    number: "06",
    category: "Arquitetura residencial",
    title: "Ateliê Vão",
    description:
      "Portfólio de arquitetura residencial com apresentação de projetos e plantas em 3D.",
    objective: "Apresentar projetos e facilitar o contato sobre cada trabalho.",
    href: "/templates/arquitetura",
    theme: "from-champagne/20 to-stone-950",
  },
  {
    number: "07",
    category: "Fitness & bem-estar",
    title: "PulseFit",
    description:
      "Uma apresentação para academias, com informações sobre modalidades e formas de contato.",
    objective: "Apresentar serviços e facilitar pedidos de aula experimental.",
    href: "/templates/academias",
    theme: "from-champagne/20 via-ocean to-petroleum",
  },
];

type Device = "phone" | "tablet" | "laptop";

const deviceQueries = ["(min-width: 1024px)", "(min-width: 768px)"];

function subscribeDevice(callback: () => void) {
  const lists = deviceQueries.map((query) => window.matchMedia(query));
  lists.forEach((list) => list.addEventListener("change", callback));
  return () =>
    lists.forEach((list) => list.removeEventListener("change", callback));
}

function getDevice(): Device {
  if (window.matchMedia(deviceQueries[0]).matches) return "laptop";
  if (window.matchMedia(deviceQueries[1]).matches) return "tablet";
  return "phone";
}

// Renders the page at a virtual viewport and scales it to the frame width.
function ScaledFrame({
  href,
  title,
  width,
  height,
}: {
  href: string;
  title: string;
  width: number;
  height: number;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const observer = new ResizeObserver(([entry]) =>
      setScale(entry.contentRect.width / width),
    );
    observer.observe(box);
    return () => observer.disconnect();
  }, [width]);

  return (
    <div
      ref={boxRef}
      className="relative w-full overflow-hidden bg-ocean"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {scale > 0 && (
        <iframe
          src={href}
          title={title}
          loading="lazy"
          scrolling="no"
          tabIndex={-1}
          className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
          style={{ width, height, transform: `scale(${scale})` }}
        />
      )}
    </div>
  );
}

function DeviceMockup({ href, title }: { href: string; title: string }) {
  const device = useSyncExternalStore<Device | null>(
    subscribeDevice,
    getDevice,
    () => null,
  );

  if (device === "phone") {
    return (
      <div className="relative mx-auto w-[min(100%,260px)] rounded-[2.5rem] border border-turquoise/40 bg-ocean p-2.5 shadow-2xl">
        <div className="relative overflow-hidden rounded-[2rem]">
          <span
            aria-hidden
            className="absolute left-1/2 top-2 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-abyss"
          />
          <ScaledFrame href={href} title={title} width={390} height={844} />
        </div>
      </div>
    );
  }

  if (device === "tablet") {
    return (
      <div className="mx-auto w-full max-w-[440px] rounded-[2rem] border border-turquoise/40 bg-ocean p-3.5 shadow-2xl">
        <div className="relative overflow-hidden rounded-xl">
          <ScaledFrame href={href} title={title} width={820} height={1100} />
        </div>
      </div>
    );
  }

  if (device === "laptop") {
    return (
      <div className="mx-auto w-full max-w-[860px]">
        <div className="rounded-t-2xl border border-turquoise/40 bg-ocean p-2.5 pb-2 shadow-2xl">
          <div className="overflow-hidden rounded-lg">
            <div className="flex h-8 items-center gap-1.5 border-b border-turquoise/40 bg-ocean px-4">
              <span aria-hidden className="h-2 w-2 rounded-full bg-[#ff6b61]" />
              <span aria-hidden className="h-2 w-2 rounded-full bg-[#ffc14f]" />
              <span aria-hidden className="h-2 w-2 rounded-full bg-[#49c781]" />
              <span className="ml-3 min-w-0 truncate rounded-full border border-turquoise/40 bg-ocean/65 px-3 py-0.5 font-mono text-[10px] text-ivory/85">
                nexusync.online{href}
              </span>
            </div>
            <ScaledFrame href={href} title={title} width={1280} height={760} />
          </div>
        </div>
        <div
          aria-hidden
          className="mx-auto h-3 w-[108%] -translate-x-[3.7%] rounded-b-[1.2rem] border border-t-0 border-turquoise/40 bg-gradient-to-b from-ocean to-petroleum"
        />
      </div>
    );
  }

  return <div className="aspect-[16/10] w-full" />;
}

export function SelectedWork() {
  const [active, setActive] = useState(0);

  const next = () => setActive((prev) => (prev + 1) % projects.length);
  const prev = () =>
    setActive((p) => (p - 1 + projects.length) % projects.length);

  const project = projects[active];

  return (
    <section
      id="templates"
      className="relative scroll-mt-24 border-y border-turquoise/40 bg-ocean/65 py-24 backdrop-blur-2xl sm:py-32"
    >
      <div className="container-luxe">
        <div className="mb-12 flex flex-col gap-7 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ice">
              <span className="h-px w-7 bg-turquoise/80" />
              Feito para ser lembrado
            </p>
            <h2 className="text-balance font-display text-4xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-5xl md:text-6xl">
              Veja como seu negócio
              <br />
              <span className="text-brand-gradient">
                pode se apresentar na internet.
              </span>
            </h2>
          </div>
          <p className="max-w-sm text-base leading-7 text-muted-foreground">
            Explore exemplos de páginas para diferentes segmentos. Conheça o
            visual, navegue pelas seções e veja como cada projeto conduz o
            visitante até o contato.
          </p>
        </div>

        <div>
          <div
            className={`relative overflow-hidden rounded-[2rem] border border-turquoise/40 bg-gradient-to-br ${project.theme} p-4 sm:p-8 transition-colors duration-700`}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(255,255,255,.1),transparent_60%)]" />

            <DeviceMockup
              key={project.number}
              href={project.href}
              title={`Demonstração de ${project.title}, ${project.category}`}
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
            <Link href={project.href} className="inline-flex items-center gap-1.5 rounded-full border border-turquoise/35 bg-ocean px-4 py-2 text-xs font-semibold text-ivory transition-colors hover:bg-sea">
              Abrir layout <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              onClick={prev}
              aria-label="Template anterior"
              className="grid h-10 w-10 place-items-center rounded-full border border-turquoise/40 bg-ocean/65 text-ivory/85 transition-colors hover:border-turquoise/40 hover:bg-turquoise/20 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquoise"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              {projects.map((p, index) => (
                <button
                  key={p.number}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Ver ${p.title}`}
                  aria-current={index === active}
                  className={`h-1.5 rounded-full transition-all ${
                    index === active
                      ? "w-8 bg-turquoise"
                      : "w-3 bg-ice/20 hover:bg-ice/40"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              aria-label="Próximo template"
              className="grid h-10 w-10 place-items-center rounded-full border border-turquoise/40 bg-ocean/65 text-ivory/85 transition-colors hover:border-turquoise/40 hover:bg-turquoise/20 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquoise"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ice/60">
                  {project.category}
                </span>
                <span className="font-mono text-xs text-ivory/35">
                  {project.number}/{String(projects.length).padStart(2, "0")}
                </span>
              </div>
              <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground"><AccentText text={project.title} /></h3>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                {project.description}
              </p>
              <p className="mt-3 text-xs leading-5 text-ice/80">
                <span className="font-semibold">Objetivo:</span> {project.objective}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-5 border-t border-turquoise/40 pt-7 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">
            Os exemplos são demonstrativos e podem ser adaptados à sua marca e
            aos objetivos do projeto.
          </p>
          <Link
            href="/templates"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-ice"
          >
            Ver todos os exemplos
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
