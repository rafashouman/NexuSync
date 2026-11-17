"use client";

import studio from "@/components/home/StudioExperience.module.css";
import { AccentText } from "@/components/AccentText";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Mail,
  Phone,
  Globe2,
  Sparkles,
  Check,
  Copy,
  MessageSquare,
} from "lucide-react";
import { saveQuoteRequest } from "@/app/actions/quotes";
import { trackMetaEvent } from "@/components/MetaPixel";
import { trackAnalyticsEvent } from "@/lib/analytics";
import {
  HOME_QUOTE_INTERESTS,
  INTEREST_EVENT,
  isQuoteSection,
  QUOTE_BUDGETS,
  QUOTE_GOALS,
  QUOTE_INTERESTS,
  type QuoteSection,
} from "@/lib/quote";
import { WA_NUMBER, waLink } from "@/lib/site-config";

const FIELD =
  "w-full rounded-xl border border-turquoise/40 bg-ocean/65 px-4 py-3.5 text-foreground backdrop-blur-xl transition-all focus:border-turquoise/50 focus:outline-none focus:ring-1 focus:ring-turquoise/30";
const LABEL = "text-xs font-bold uppercase tracking-widest text-muted-foreground";

type ContactProps = { homeOffersOnly?: boolean; presentation?: "default" | "chaos" };
export function Contact(props: ContactProps) {
  return <Suspense fallback={<p role="status" className="p-8">Carregando formulário de orçamento…</p>}><ContactForm {...props} /></Suspense>;
}
function ContactForm({ homeOffersOnly = false, presentation = "default" }: ContactProps) {
  const queryString = useSearchParams().toString();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [interest, setInterest] = useState<string>(() => {
    const selected = new URLSearchParams(queryString).get("interest");
    return selected && QUOTE_INTERESTS.some(item => item.id === selected) ? selected : "nao-sei";
  });
  const visibleInterests = useMemo(() => {
    if (!homeOffersOnly) return QUOTE_INTERESTS;
    const selected = QUOTE_INTERESTS.find(item => item.id === interest);
    return selected && !HOME_QUOTE_INTERESTS.some(item => item.id === selected.id)
      ? [...HOME_QUOTE_INTERESTS, selected]
      : HOME_QUOTE_INTERESTS;
  }, [homeOffersOnly, interest]);
  const [interestSource, setInterestSource] = useState<QuoteSection>("form");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [error, setError] = useState("");
  const [emailDelivered, setEmailDelivered] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const formStarted = useRef(false);

  useEffect(() => {
    const onInterest = (event: Event) => {
      const detail = (event as CustomEvent<{ id?: string | null; source?: unknown }>).detail;
      if (isQuoteSection(detail?.source)) setInterestSource(detail.source);
      if (detail?.id && QUOTE_INTERESTS.some((item) => item.id === detail.id)) {
        const source = isQuoteSection(detail.source) ? detail.source : "form";
        setInterestSource(source);
        trackAnalyticsEvent({
          eventName: "quote_interest_select",
          interest: detail.id,
          section: source,
        });
        setInterest(detail.id);
        setSent(null);
      }
    };
    window.addEventListener(INTEREST_EVENT, onInterest);

    const params = new URLSearchParams(queryString);
    const initialInterest = params.get("interest");
    const initialSource = params.get("source");
    if (isQuoteSection(initialSource)) {
      // Apply the cross-route quote intent after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInterestSource(initialSource);
    }
    if (initialInterest && QUOTE_INTERESTS.some((item) => item.id === initialInterest)) {
      const source = isQuoteSection(initialSource) ? initialSource : "form";
      setInterest(initialInterest);
      setInterestSource(source);
      trackAnalyticsEvent({
        eventName: "quote_interest_select",
        interest: initialInterest,
        section: source,
      });
    }

    return () => window.removeEventListener(INTEREST_EVENT, onInterest);
  }, [queryString]);

  const handleFormStart = () => {
    if (formStarted.current) return;
    formStarted.current = true;
    trackAnalyticsEvent({ eventName: "quote_form_start", section: interestSource });
  };

  const handleCopyEmail = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText("contato@nexusync.online");
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      setError("Copie o e-mail exibido ao lado: contato@nexusync.online");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const form = e.currentTarget;
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const channel = submitter?.value === "whatsapp" ? "whatsapp" : "email";
    // Reserve the window during the user gesture so browsers allow it after saving.
    const popup = channel === "whatsapp" ? window.open("about:blank", "_blank") : null;
    if (popup) popup.opener = null;
    const data = new FormData(form);
    const field = (key: string) => String(data.get(key) ?? "").trim();
    const name = field("nome");
    const interestLabel =
      QUOTE_INTERESTS.find((i) => i.id === interest)?.label ?? interest;

    const whatsMessage = [
      `Olá! Sou ${name}. Tenho interesse em ${interestLabel}.`,
      field("empresa") && `Empresa: ${field("empresa")}`,
      `Contato: ${field("contato")}`,
      `Segmento: ${field("segmento")}`,
      field("mensagem"),
    ].filter(Boolean).join("\n");
    try {
      const result = await saveQuoteRequest({
        channel,
        name,
        company: field("empresa"),
        segment: field("segmento"),
        contact: field("contato"),
        goal: homeOffersOnly ? "projeto" : field("objetivo"),
        interest,
        budget: field("orcamento"),
        message: field("mensagem"),
        consentContact: data.get("consentContact") === "on",
        consentPromo: data.get("consentPromo") === "on",
        website: field("website"),
      });
      if (result.ok) {
        if (result.recorded) {
          trackMetaEvent("Lead", { content_name: interest });
          trackAnalyticsEvent({
            eventName: "contact_submit_success",
            interest,
            section: interestSource,
          });
        }
        setSent(whatsMessage);
        setEmailDelivered(result.emailSent === true);
        if (channel === "whatsapp" && result.recorded) {
          if (popup) popup.location.replace(waLink(whatsMessage));
          else window.location.assign(waLink(whatsMessage));
        } else popup?.close();
        form.reset();
      } else {
        popup?.close();
        setError(result.error);
      }
    } catch (err) {
      popup?.close();
      console.error("Unable to send the quote request.", err);
      setError("Não foi possível enviar agora. Tente novamente ou chame no WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contato"
      className={presentation === "chaos" ? studio.contactForm : "relative overflow-hidden bg-background py-24 sm:py-32"}
    >
      {/* Glow de fundo */}
      <div
        aria-hidden
        data-contact-glow
        className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] -translate-y-12 translate-x-1/3 rounded-full bg-turquoise/10 blur-[130px]"
      />

      <div data-contact-container className="container-luxe relative z-10">
        <div data-contact-layout className="grid min-w-0 grid-cols-1 items-start gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* Coluna da Esquerda: Configurador + Formulário */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            data-contact-panel className="min-w-0 rounded-[2rem] border border-turquoise/40 bg-ocean/80 p-7 shadow-2xl backdrop-blur-2xl sm:p-10"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-turquoise/40 bg-turquoise/[0.06] px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-ice">
              <Sparkles className="h-3.5 w-3.5 text-ice" />
              Iniciar Projeto
            </div>

            <h2 className="mb-4 font-display text-[clamp(1.5rem,7.5vw,3rem)] uppercase tracking-tight sm:text-3xl xl:text-4xl">
              <AccentText text={homeOffersOnly
                ? "Seu negócio pode dar o próximo passo. Vamos conversar?"
                : "Vamos conversar sobre seu próximo projeto?"} />
            </h2>
            <p className="mb-8 text-base text-muted-foreground sm:text-lg">
              {homeOffersOnly
                ? "Não precisa chegar com tudo planejado ou conhecer termos técnicos. Conte sua ideia, explique o que está precisando e vamos avaliar juntos o melhor caminho."
                : "Você não precisa saber qual tecnologia contratar. Conte seu objetivo e o que atrapalha hoje. Vamos avaliar a solução e preparar uma proposta com entregas, investimento e prazo."}
            </p>

            {sent ? (
              <div role="status" className="space-y-5 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 p-6">
                <p className="flex items-center gap-2 font-display text-xl font-bold text-emerald-200">
                  <Check className="h-5 w-5" /> Pedido recebido
                </p>
                <p className="text-sm leading-relaxed text-ivory/75">
                  {emailDelivered
                    ? "Pedido registrado e enviado por e-mail à nossa equipe. Se preferir, continue pelo WhatsApp."
                    : "Seu pedido está registrado. O aviso por e-mail está indisponível no momento; você pode continuar pelo WhatsApp abaixo."}
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={waLink(sent)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-5 py-3 text-sm font-bold text-abyss"
                  >
                    <MessageSquare className="h-4 w-4" /> Chamar no WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => setSent(null)}
                    className="rounded-xl border border-turquoise/40 px-5 py-3 text-sm font-semibold text-ivory/80 hover:text-ivory"
                  >
                    Enviar outro pedido
                  </button>
                </div>
              </div>
            ) : (
            <form id="orcamento" onSubmit={handleSubmit} onFocusCapture={handleFormStart} className="scroll-mt-28 space-y-6">
              <div className="space-y-2.5">
                <label htmlFor="interesse" className={LABEL}>1. O que você precisa?</label>
                <select id="interesse" name="interesse" value={interest} className={FIELD}
                  onChange={(event) => {
                    setInterest(event.target.value);
                    trackAnalyticsEvent({ eventName: "quote_interest_select", interest: event.target.value, section: "form" });
                  }}>
                  {visibleInterests.map((item) => <option key={item.id} value={item.id} className="bg-ocean">{item.label}</option>)}
                </select>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="nome" className={LABEL}>Seu nome</label>
                  <input id="nome" name="nome" type="text" required maxLength={100} className={FIELD} placeholder="Como podemos te chamar?" />
                </div>
                {!homeOffersOnly && <div className="space-y-2">
                  <label htmlFor="empresa" className={LABEL}>Empresa ou marca (opcional)</label>
                  <input id="empresa" name="empresa" type="text" maxLength={150} className={FIELD} placeholder="Nome do seu negócio" />
                </div>}
                <div className="space-y-2">
                  <label htmlFor="segmento" className={LABEL}>{homeOffersOnly ? "O que seu negócio oferece?" : "Segmento"}</label>
                  <input id="segmento" name="segmento" type="text" required maxLength={100} className={FIELD} placeholder={homeOffersOnly ? "Descreva seus produtos ou serviços" : "Ex.: clínica, restaurante, loja"} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contato-info" className={LABEL}>WhatsApp ou e-mail</label>
                  <input id="contato-info" name="contato" type="text" required maxLength={150} className={FIELD} placeholder="(51) 90000-0000 ou voce@email.com" />
                </div>
                {!homeOffersOnly && <div className="space-y-2">
                  <label htmlFor="objetivo" className={LABEL}>Objetivo principal</label>
                  <select id="objetivo" name="objetivo" required defaultValue="" className={FIELD}>
                    <option value="" disabled>Selecione</option>
                    {QUOTE_GOALS.map((g) => (
                      <option key={g.id} value={g.id} className="bg-ocean">{g.label}</option>
                    ))}
                  </select>
                </div>}
                {!homeOffersOnly && <div className="space-y-2">
                  <label htmlFor="orcamento-faixa" className={LABEL}>Orçamento (opcional)</label>
                  <select id="orcamento-faixa" name="orcamento" defaultValue="" className={FIELD}>
                    <option value="">Prefiro não informar</option>
                    {QUOTE_BUDGETS.map((b) => (
                      <option key={b} value={b} className="bg-ocean">{b}</option>
                    ))}
                  </select>
                </div>}
              </div>

              <div className="space-y-2">
                <label htmlFor="mensagem" className={LABEL}>{homeOffersOnly ? "Informações adicionais sobre o projeto (opcional)" : "Mensagem (opcional)"}</label>
                <textarea id="mensagem" name="mensagem" maxLength={1000} rows={3} className={`${FIELD} resize-none`} placeholder="Ex.: recebo visitas, mas poucos orçamentos. Quero apresentar melhor meus serviços." />
              </div>

              <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="website">Não preencha este campo</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <label className="flex items-start gap-3 text-xs leading-relaxed text-muted-foreground">
                <input type="checkbox" name="consentContact" required className="mt-0.5 h-4 w-4 shrink-0 accent-violet-400" />
                <span>
                  Autorizo a NexuSync a usar estes dados para entrar em contato
                  sobre este orçamento, conforme o{" "}
                  <Link href="/privacidade" className="font-semibold text-ice underline-offset-4 hover:underline">
                    Aviso de Privacidade
                  </Link>
                  .
                </span>
              </label>
              <label className="flex items-start gap-3 text-xs leading-relaxed text-muted-foreground">
                <input type="checkbox" name="consentPromo" className="mt-0.5 h-4 w-4 shrink-0 accent-violet-400" />
                <span>(Opcional) Aceito receber novidades e ofertas da NexuSync.</span>
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <button type="submit" name="channel" value="email" disabled={isSubmitting}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-gradient px-4 py-3.5 text-center text-sm font-bold leading-snug text-abyss transition-colors disabled:opacity-60">
                  <Mail className="h-4 w-4 shrink-0" />
                  {isSubmitting ? "Enviando..." : "Enviar por e-mail"}
                </button>
                <button type="submit" name="channel" value="whatsapp" disabled={isSubmitting}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-turquoise/60 bg-turquoise/10 px-4 py-3.5 text-center text-sm font-bold leading-snug text-ice transition-colors hover:bg-turquoise/20 disabled:opacity-60">
                  <MessageSquare className="h-4 w-4 shrink-0" /> Chamar no WhatsApp
                </button>
              </div>
              <p className="text-xs leading-5 text-muted-foreground">Nos dois caminhos, registramos seu pedido para acompanhar o atendimento. No WhatsApp, a mensagem leva o assunto e os detalhes que você preencheu.</p>
              {error && (
                <p role="alert" className="text-sm leading-relaxed text-rose-300">
                  {error}
                </p>
              )}
            </form>
            )}
          </motion.div>

          {/* Coluna da Direita: Painel de Atendimento & Etapas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            data-contact-aside className="flex min-w-0 flex-col gap-6"
          >
            {/* Card de Status Online + Contatos Diretos */}
            <div className="rounded-[2rem] border border-turquoise/40 bg-ocean/65 p-5 backdrop-blur-xl sm:p-8 lg:p-9">
              <div className="mb-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-display text-2xl font-bold text-foreground"><AccentText text={"Contato Direto"} /></h3>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Atendimento pelo WhatsApp
                </span>
              </div>

              <div className="space-y-4">
                <a
                  href={`https://wa.me/${WA_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-turquoise/40 bg-ocean/65 p-3 transition-all hover:border-turquoise/30 hover:bg-ocean/65 sm:gap-4 sm:p-4"
                >
                  <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <div className="rounded-xl bg-turquoise/10 p-3 text-ice transition-colors group-hover:bg-turquoise group-hover:text-abyss">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        WhatsApp Comercial
                      </p>
                      <p className="font-medium text-foreground">
                        (51) 99358-3936
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-ivory/85 transition-transform group-hover:translate-x-1 group-hover:text-ice" />
                </a>

                <div className="group flex flex-col gap-3 rounded-2xl border border-turquoise/40 bg-ocean/65 p-3 transition-all hover:border-turquoise/30 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4">
                  <a
                    href="mailto:contato@nexusync.online"
                    className="flex min-w-0 items-center gap-3 sm:flex-1 sm:gap-4"
                  >
                    <div className="rounded-xl bg-turquoise/10 p-3 text-ice transition-colors group-hover:bg-turquoise group-hover:text-abyss">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        E-mail Oficial
                      </p>
                      <p className="break-words font-medium text-foreground">
                        contato@nexusync.online
                      </p>
                    </div>
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex self-start items-center gap-1.5 rounded-lg border border-turquoise/40 bg-ocean/65 px-2.5 py-1.5 font-mono text-[10px] text-ivory/85 transition-colors hover:border-turquoise/40 hover:text-ivory sm:self-auto"
                    title="Copiar e-mail"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copiar
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-turquoise/40 bg-ocean/65 p-3 sm:gap-4 sm:p-4">
                  <div className="rounded-xl bg-turquoise/10 p-3 text-ice">
                    <Globe2 className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Operação Digital
                    </p>
                    <p className="font-medium text-foreground">
                      100% Remoto para todo o Brasil
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mini Card: Como funciona nosso processo */}
            <div className="rounded-[2rem] border border-turquoise/40 bg-gradient-to-br from-turquoise/10 via-ocean/90 to-petroleum p-7 backdrop-blur-xl">
              <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ice">
                Próximos Passos
              </p>
              <ol className="space-y-3 text-sm text-ivory/75">
                <li className="flex items-center gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-turquoise/30 bg-turquoise/10 font-mono text-[10px] text-ice">
                    01
                  </span>
                  <span>Conversamos sobre seu negócio e sua dificuldade</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-turquoise/30 bg-turquoise/10 font-mono text-[10px] text-ice">
                    02
                  </span>
                  <span>Você recebe escopo, valor e prazo para avaliar</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-turquoise/30 bg-turquoise/10 font-mono text-[10px] text-ice">
                    03
                  </span>
                  <span>Com a proposta aprovada, começamos a criação</span>
                </li>
              </ol>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
