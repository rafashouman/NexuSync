"use client";

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
    category: "Fitness & bem-estar",
    title: "PulseFit",
    description:
      "Uma apresentação para academias, com informações sobre modalidades e formas de contato.",
    objective: "Apresentar serviços e facilitar pedidos de aula experimental.",
    href: "/templates/academias",
    theme: "from-orange-500/20 via-[#181512] to-[#0c0d0f]",
  },
  {
    number: "02",
    category: "Gastronomia",
    title: "Kobra Burger Lab",
    description:
      "Cardápio digital com personalidade para apresentar opções de uma hamburgueria.",
    objective: "Apresentar o cardápio e direcionar o visitante para fazer um pedido.",
    href: "/templates/cardapio",
    theme: "from-amber-200/15 via-[#1c1713] to-[#0c0d0f]",
  },
  {
    number: "03",
    category: "E-commerce & moda",
    title: "Vortex Atelier",
    description:
      "Uma vitrine editorial para destacar uma coleção de moda.",
    objective: "Apresentar produtos e facilitar a exploração da coleção.",
    href: "/templates/streetwear",
    theme: "from-violet-300/20 via-[#17111f] to-[#0c0d0f]",
  },
  {
    number: "04",
    category: "Automotivo & Seminovos",
    title: "Prime Motors",
    description:
      "Portal automotivo em tema claro com comparativo FIPE, simulador CDC e reserva de visita online.",
    objective: "Apresentar veículos e facilitar pedidos de informação ou visita.",
    href: "/templates/carros",
    theme: "from-blue-500/20 via-[#101726] to-[#0c0d0f]",
  },
  {
    number: "05",
    category: "Arte 3D & Colecionáveis",
    title: "Alchemist Voxel",
    description:
      "Estúdio de impressão em resina 12K e pintura de miniaturas, com Raio-X de 3 estágios e calculadora de encomendas.",
    objective: "Apresentar serviços e receber solicitações de encomenda.",
    href: "/templates/miniaturas",
    theme: "from-fuchsia-500/25 via-[#140d1f] to-[#08060c]",
  },
  {
    number: "06",
    category: "Bem-estar & Experiência",
    title: "Oráculo Connection",
    description:
      "Jornada interativa em 3 etapas: escolha do monte, intenção e revelação.",
    objective: "Conduzir o visitante por uma experiência interativa e apresentar o próximo passo.",
    href: "/templates/connection",
    theme: "from-amber-500/20 via-[#14110a] to-[#070709]",
  },
  {
    number: "07",
    category: "Restaurantes & Reservas",
    title: "Kobra Fire Reservas",
    description:
      "Reserva de mesas VIP, comanda digital e pedidos em um único painel para a operação do restaurante.",
    objective: "Apresentar opções de reserva e receber solicitações de atendimento.",
    href: "/templates/reservas",
    theme: "from-red-500/20 via-[#1c0f0e] to-[#0c0807]",
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
      className="relative w-full overflow-hidden bg-[#0b0d10]"
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
      <Link
        href={href}
        className="absolute bottom-3 right-3 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/75 px-3 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur transition-colors hover:border-violet-300/60 hover:bg-violet-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
      >
        Abrir layout
        <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
      </Link>
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
      <div className="relative mx-auto w-[min(100%,260px)] rounded-[2.5rem] border border-white/15 bg-[#05060a] p-2.5 shadow-2xl">
        <div className="relative overflow-hidden rounded-[2rem]">
          <span
            aria-hidden
            className="absolute left-1/2 top-2 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-black"
          />
          <ScaledFrame href={href} title={title} width={390} height={844} />
        </div>
      </div>
    );
  }

  if (device === "tablet") {
    return (
      <div className="mx-auto w-full max-w-[440px] rounded-[2rem] border border-white/15 bg-[#05060a] p-3.5 shadow-2xl">
        <div className="relative overflow-hidden rounded-xl">
          <ScaledFrame href={href} title={title} width={820} height={1100} />
        </div>
      </div>
    );
  }

  if (device === "laptop") {
    return (
      <div className="mx-auto w-full max-w-[860px]">
        <div className="rounded-t-2xl border border-white/15 bg-[#05060a] p-2.5 pb-2 shadow-2xl">
          <div className="overflow-hidden rounded-lg">
            <div className="flex h-8 items-center gap-1.5 border-b border-white/[0.08] bg-[#0b0e13] px-4">
              <span aria-hidden className="h-2 w-2 rounded-full bg-[#ff6b61]" />
              <span aria-hidden className="h-2 w-2 rounded-full bg-[#ffc14f]" />
              <span aria-hidden className="h-2 w-2 rounded-full bg-[#49c781]" />
              <span className="ml-3 min-w-0 truncate rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-0.5 font-mono text-[10px] text-white/50">
                nexusync.online{href}
              </span>
            </div>
            <ScaledFrame href={href} title={title} width={1280} height={760} />
          </div>
        </div>
        <div
          aria-hidden
          className="mx-auto h-3 w-[108%] -translate-x-[3.7%] rounded-b-[1.2rem] border border-t-0 border-white/15 bg-gradient-to-b from-[#2a2b33] to-[#14151a]"
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
      id="trabalhos"
      className="relative scroll-mt-24 border-y border-violet-200/[0.08] bg-[#110d18]/65 py-24 backdrop-blur-2xl sm:py-32"
    >
      <div className="container-luxe">
        <div className="mb-12 flex flex-col gap-7 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-200">
              <span className="h-px w-7 bg-fuchsia-300/80" />
              Feito para ser lembrado
            </p>
            <h2 className="text-balance font-display text-4xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-5xl md:text-6xl">
              Veja como seu negócio
              <br />
              <span className="text-violet-gradient">
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
            className={`relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br ${project.theme} p-4 sm:p-8 transition-colors duration-700`}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(255,255,255,.1),transparent_60%)]" />

            <DeviceMockup
              key={project.number}
              href={project.href}
              title={`Demonstração de ${project.title}, ${project.category}`}
            />
          </div>

          <div className="mt-5 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={prev}
              aria-label="Template anterior"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:border-violet-400/40 hover:bg-violet-500/20 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
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
                      ? "w-8 bg-violet-400"
                      : "w-3 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              aria-label="Próximo template"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:border-violet-400/40 hover:bg-violet-500/20 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-100/60">
                  {project.category}
                </span>
                <span className="font-mono text-xs text-white/35">
                  {project.number}/{String(projects.length).padStart(2, "0")}
                </span>
              </div>
              <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                {project.title}
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                {project.description}
              </p>
              <p className="mt-3 text-xs leading-5 text-violet-100/80">
                <span className="font-semibold">Objetivo:</span> {project.objective}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-5 border-t border-white/10 pt-7 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">
            Os exemplos são demonstrativos e podem ser adaptados à sua marca e
            aos objetivos do projeto.
          </p>
          <Link
            href="/templates"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-violet-200"
          >
            Ver todos os exemplos
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
