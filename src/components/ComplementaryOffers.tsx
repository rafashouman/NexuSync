import Link from "next/link";
import {
  CalendarDays,
  ChartNoAxesCombined,
  MousePointerClick,
  Palette,
  Presentation,
  Shapes,
} from "lucide-react";
import { QuoteLink } from "@/components/QuoteLink";
import { waLink } from "@/lib/site-config";

const appSolutions = [
  {
    icon: CalendarDays,
    title: "Agendamentos e reservas",
    description:
      "Facilite a solicitação de horários, apresente seus serviços e organize as informações necessárias ao atendimento.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Painéis e ferramentas de gestão",
    description:
      "Reúna informações e simplifique etapas da operação com uma aplicação definida para a rotina do seu negócio.",
  },
  {
    icon: MousePointerClick,
    title: "Experiências interativas",
    description:
      "Explore mini apps, formulários em etapas e ações interativas para campanhas e apresentações, conforme o escopo.",
  },
];

const mediaDeliverables = [
  {
    icon: Palette,
    title: "Artes para feed e stories",
    description: "Peças visuais para apresentar produtos e serviços nas redes.",
  },
  {
    icon: Presentation,
    title: "Banners e peças promocionais",
    description: "Materiais para divulgar ofertas e campanhas da sua marca.",
  },
  {
    icon: Shapes,
    title: "Adaptações visuais",
    description:
      "Aplicações alinhadas à identidade existente, conforme o pacote contratado.",
  },
];

export function ComplementaryOffers() {
  return (
    <>
      <section
        id="aplicacoes"
        className="scroll-mt-24 border-t border-border py-20 sm:py-28"
      >
        <div className="container-luxe">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-cyan-200">
            Soluções que complementam seu site
          </p>
          <h2 className="max-w-3xl font-display text-3xl sm:text-5xl">
            Seu site também pode facilitar a rotina do seu negócio.
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
            Além de apresentar sua empresa, uma aplicação web pode ajudar a
            receber agendamentos, organizar solicitações e oferecer recursos
            úteis aos seus clientes. Definimos as funcionalidades conforme a
            necessidade do projeto.
          </p>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {appSolutions.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-3xl border border-cyan-300/15 bg-white/[0.025] p-6 sm:p-7"
              >
                <span className="mb-5 grid h-11 w-11 place-items-center rounded-xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-200">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="font-display text-xl font-semibold">{title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">
                  {description}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm leading-6 text-muted-foreground">
            Agendamentos podem ser solicitações sujeitas à confirmação do
            negócio, de acordo com o escopo aprovado.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-5">
            <a
              data-analytics-section="apps"
              data-analytics-interest="aplicacao-web"
              href={waLink(
                "Olá! Quero conversar sobre uma aplicação web para uma necessidade do meu negócio."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-violet-gradient px-5 py-3 font-semibold text-white"
            >
              Conversar sobre meu aplicativo
            </a>
            <Link
              href="/apps"
              className="inline-flex items-center gap-2 font-semibold text-cyan-200 underline-offset-4 hover:underline"
            >
              Ver exemplos de aplicações
            </Link>
          </div>
        </div>
      </section>

      <section
        id="midias-digitais"
        className="scroll-mt-24 border-t border-border bg-violet-500/[0.035] py-20 sm:py-28"
      >
        <div className="container-luxe">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-fuchsia-200">
            Criação visual para sua marca
          </p>
          <h2 className="max-w-3xl font-display text-3xl sm:text-5xl">
            Uma apresentação profissional em cada ponto de contato.
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
            Complemente seu site com peças digitais alinhadas à sua marca.
            Criamos materiais para apresentar serviços, divulgar produtos e
            comunicar campanhas com consistência visual.
          </p>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {mediaDeliverables.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-3xl border border-fuchsia-300/15 bg-white/[0.025] p-6 sm:p-7"
              >
                <span className="mb-5 grid h-11 w-11 place-items-center rounded-xl border border-fuchsia-300/20 bg-fuchsia-400/10 text-fuchsia-200">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="font-display text-xl font-semibold">{title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">
                  {description}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-7 rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-sm leading-6 text-muted-foreground">
            Os pacotes contemplam a criação das peças descritas. Publicação,
            gestão de redes sociais e anúncios são serviços contratados
            separadamente. Identidade visual e design de interfaces têm
            categorias e escopos próprios na página de design.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-5">
            <QuoteLink
              interest="midias-digitais"
              section="media"
              className="rounded-xl bg-violet-gradient px-5 py-3 font-semibold text-white"
            >
              Pedir orçamento de mídias digitais
            </QuoteLink>
            <Link
              href="/design"
              className="inline-flex items-center gap-2 font-semibold text-fuchsia-200 underline-offset-4 hover:underline"
            >
              Ver trabalhos de design
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
