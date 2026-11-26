"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { saveQuoteRequest } from "@/app/actions/quotes";
import { ArrowIcon } from "@/components/rua/icons";
import { trackMetaEvent } from "@/components/MetaPixel";
import s from "@/components/servicos/servico.module.css";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { readConsent } from "@/lib/consent";
import {
  INTEREST_EVENT,
  isQuoteSection,
  QUOTE_BUDGETS,
  QUOTE_GOALS,
  QUOTE_INTERESTS,
  type QuoteSection,
} from "@/lib/quote";
import { waLink } from "@/lib/site-config";

/** The quote form. It reads the query string (?interest=&source=), so it renders after hydration inside Suspense. */
export function Contact() {
  return (
    <Suspense fallback={<div className={s.formPanel} role="status"><p className={s.formLead}>Carregando formulário de orçamento…</p></div>}>
      <ContactForm />
    </Suspense>
  );
}

function ContactForm() {
  const queryString = useSearchParams().toString();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [interest, setInterest] = useState<string>(() => {
    const selected = new URLSearchParams(queryString).get("interest");
    return selected && QUOTE_INTERESTS.some(item => item.id === selected) ? selected : "nao-sei";
  });
  const [interestSource, setInterestSource] = useState<QuoteSection>("form");
  const [error, setError] = useState("");
  const [emailDelivered, setEmailDelivered] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const formStarted = useRef(false);

  // The form renders after hydration (it reads the query string), so the browser cannot scroll to #orcamento by itself,
  // and the router may reset the scroll right after mount: keep nudging the panel into place for a moment,
  // unless the visitor already scrolled.
  useEffect(() => {
    if (window.location.hash !== "#orcamento") return;
    let cancelled = false;
    const stop = () => { cancelled = true; };
    window.addEventListener("wheel", stop, { once: true, passive: true });
    window.addEventListener("touchstart", stop, { once: true, passive: true });
    window.addEventListener("keydown", stop, { once: true });
    const go = () => {
      const panel = document.getElementById("contato");
      if (cancelled || !panel) return;
      if (Math.abs(panel.getBoundingClientRect().top - 130) > 6) panel.scrollIntoView({ behavior: "auto", block: "start" });
    };
    go();
    const timer = window.setInterval(go, 150);
    const end = window.setTimeout(() => window.clearInterval(timer), 2500);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(end);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", stop);
    };
  }, []);

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
    // Mesmo ID no Pixel e na API de Conversões. randomUUID não existe em HTTP sem TLS.
    const eventId = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    try {
      const result = await saveQuoteRequest({
        channel,
        name,
        company: field("empresa"),
        segment: field("segmento"),
        contact: field("contato"),
        goal: field("objetivo"),
        interest,
        budget: field("orcamento"),
        message: field("mensagem"),
        consentContact: data.get("consentContact") === "on",
        consentPromo: data.get("consentPromo") === "on",
        website: field("website"),
        // O servidor só informa a Meta quando o visitante aceitou os cookies.
        tracking: readConsent() === "granted" ? { eventId, sourceUrl: window.location.href } : undefined,
      });
      if (result.ok) {
        if (result.recorded) {
          trackMetaEvent("Lead", { content_name: interest }, eventId);
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

  const done = sent !== null;
  return (
    <div className={s.formPanel} id="contato">
      <p className={s.formKicker}>Iniciar projeto</p>
      <h2 className={s.formTitle}>Vamos conversar sobre <span>seu próximo projeto?</span></h2>
      <p className={s.formLead}>Você não precisa saber qual tecnologia contratar. Conte seu objetivo e o que atrapalha hoje. Vamos avaliar a solução e preparar uma proposta com entregas, investimento e prazo.</p>

      {done ? (
        <div role="status" className={s.sent}>
          <p className={s.sentTitle}><i aria-hidden="true">✓</i> Pedido recebido</p>
          <p>
            {emailDelivered
              ? "Pedido registrado e enviado por e-mail à nossa equipe. Se preferir, continue pelo WhatsApp."
              : "Seu pedido está registrado. O aviso por e-mail está indisponível no momento; você pode continuar pelo WhatsApp abaixo."}
          </p>
          <div className={s.fBtns}>
            <a className={s.fBtn} data-kind="main" href={waLink(sent)} target="_blank" rel="noopener noreferrer">Chamar no WhatsApp <ArrowIcon /></a>
            <button type="button" className={s.fBtn} data-kind="line" onClick={() => setSent(null)}>Enviar outro pedido</button>
          </div>
        </div>
      ) : (
        <form id="orcamento" onSubmit={handleSubmit} onFocusCapture={handleFormStart} className={s.form}>
          <div className={s.fRow}>
            <label htmlFor="interesse">1. O que você precisa?</label>
            <select id="interesse" name="interesse" value={interest}
              onChange={(event) => {
                setInterest(event.target.value);
                trackAnalyticsEvent({ eventName: "quote_interest_select", interest: event.target.value, section: "form" });
              }}>
              {QUOTE_INTERESTS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </div>

          <div className={s.fGrid}>
            <div className={s.fRow}>
              <label htmlFor="nome">Seu nome</label>
              <input id="nome" name="nome" type="text" required maxLength={100} autoComplete="name" placeholder="Como podemos te chamar?" />
            </div>
            <div className={s.fRow}>
              <label htmlFor="empresa">Empresa ou marca (opcional)</label>
              <input id="empresa" name="empresa" type="text" maxLength={150} autoComplete="organization" placeholder="Nome do seu negócio" />
            </div>
            <div className={s.fRow}>
              <label htmlFor="segmento">Segmento</label>
              <input id="segmento" name="segmento" type="text" required maxLength={100} placeholder="Ex.: clínica, restaurante, loja" />
            </div>
            <div className={s.fRow}>
              <label htmlFor="contato-info">WhatsApp ou e-mail</label>
              <input id="contato-info" name="contato" type="text" required maxLength={150} autoComplete="email" placeholder="(51) 90000-0000 ou voce@email.com" />
            </div>
            <div className={s.fRow}>
              <label htmlFor="objetivo">Objetivo principal</label>
              <select id="objetivo" name="objetivo" required defaultValue="">
                <option value="" disabled>Selecione</option>
                {QUOTE_GOALS.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}
              </select>
            </div>
            <div className={s.fRow}>
              <label htmlFor="orcamento-faixa">Orçamento (opcional)</label>
              <select id="orcamento-faixa" name="orcamento" defaultValue="">
                <option value="">Prefiro não informar</option>
                {QUOTE_BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>

          <div className={s.fRow}>
            <label htmlFor="mensagem">Mensagem (opcional)</label>
            <textarea id="mensagem" name="mensagem" maxLength={1000} rows={3} placeholder="Ex.: recebo visitas, mas poucos orçamentos. Quero apresentar melhor meus serviços." />
          </div>

          <div aria-hidden className={s.honey}>
            <label htmlFor="website">Não preencha este campo</label>
            <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <label className={s.fCheck}>
            <input type="checkbox" name="consentContact" required />
            <span>
              Autorizo a NexuSync a usar estes dados para entrar em contato sobre este orçamento, conforme o{" "}
              <Link href="/privacidade">Aviso de Privacidade</Link>.
            </span>
          </label>
          <label className={s.fCheck}>
            <input type="checkbox" name="consentPromo" />
            <span>(Opcional) Aceito receber novidades e ofertas da NexuSync.</span>
          </label>

          <div className={s.fBtns}>
            <button type="submit" name="channel" value="email" disabled={isSubmitting} className={s.fBtn} data-kind="main">
              {isSubmitting ? "Enviando..." : "Enviar por e-mail"} <ArrowIcon />
            </button>
            <button type="submit" name="channel" value="whatsapp" disabled={isSubmitting} className={s.fBtn} data-kind="line">
              Chamar no WhatsApp <ArrowIcon />
            </button>
          </div>
          <p className={s.fNote}>Nos dois caminhos, registramos seu pedido para acompanhar o atendimento. No WhatsApp, a mensagem leva o assunto e os detalhes que você preencheu.</p>
          {error && <p role="alert" className={s.fErr}>{error}</p>}
        </form>
      )}
    </div>
  );
}
