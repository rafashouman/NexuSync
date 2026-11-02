"use client";

import { useState } from "react";
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

            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#0b0d10] shadow-2xl">
              <div className="flex h-9 items-center gap-1.5 border-b border-white/[0.08] bg-[#0b0e13] px-4">
                <span className="h-2 w-2 rounded-full bg-[#ff6b61]" />
                <span className="h-2 w-2 rounded-full bg-[#ffc14f]" />
                <span className="h-2 w-2 rounded-full bg-[#49c781]" />
                <span className="ml-3 min-w-0 truncate rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-0.5 font-mono text-[10px] text-white/50">
                  nexusync.online{project.href}
                </span>
              </div>
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <iframe
                  key={project.number}
                  src={project.href}
                  title={`Demonstração de ${project.title}, ${project.category}`}
                  loading="lazy"
                  scrolling="no"
                  tabIndex={-1}
                  className="pointer-events-none absolute inset-0 h-full w-full border-0 bg-[#0b0d10]"
                />
              </div>
            </div>
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
              <Link
                href={project.href}
                className="group mt-4 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-violet-200"
              >
                Explorar demonstração
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="flex shrink-0 items-center gap-4">
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
                onClick={prev}
                aria-label="Template anterior"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:border-violet-400/40 hover:bg-violet-500/20 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Próximo template"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:border-violet-400/40 hover:bg-violet-500/20 hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
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
