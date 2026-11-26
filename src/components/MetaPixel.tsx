"use client";

import { useEffect, useRef, useState, useSyncExternalStore, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { readConsent, saveConsent, subscribeConsent, type Consent } from "@/lib/consent";
import { pixelForEvent } from "@/lib/meta";
import { isQuoteSection } from "@/lib/quote";

const initializedPixels = new Set<string>();

function initializePixel(pixelId: string) {
  if (!initializedPixels.has(pixelId) && window.fbq) {
    window.fbq("init", pixelId);
    initializedPixels.add(pixelId);
  }
}
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-S1X5J5VQXK";

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { disablePushState?: boolean };
    _fbq?: unknown;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

// Helper global para disparar eventos de qualquer componente/botão. Em demos e apps
// de exemplo o evento é descartado (ver `pixelForEvent`).
// `eventId` casa o evento do navegador com o enviado pela API de Conversões.
export const trackMetaEvent = (
  eventName: string,
  params?: Record<string, unknown>,
  eventId?: string
) => {
  if (typeof window !== "undefined" && readConsent() === "granted" && typeof window.fbq === "function") {
    const pixelId = pixelForEvent(window.location.pathname, eventName);
    if (!pixelId) return;
    initializePixel(pixelId);
    window.fbq("trackSingle", pixelId, eventName, params, eventId ? { eventID: eventId } : undefined);
  }
};

export const openTrackedWhatsApp = (
  url: string,
  eventName: "Contact" = "Contact",
  params?: Record<string, unknown>
) => {
  trackMetaEvent(eventName, {
    ...params,
    contact_channel: "whatsapp",
    action: "open_whatsapp",
  });
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
};

function MetaPixelRouteTracker({ ready }: { ready: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const lastPage = useRef<string | null>(null);

  // Um PageView por navegação, somente depois de inicializar a fila do Pixel.
  useEffect(() => {
    if (!ready || readConsent() !== "granted") return;
    const page = `${pathname}?${searchParams.toString()}`;
    if (lastPage.current === page) return;
    lastPage.current = page;
    if (typeof window.gtag === "function") {
      const query = searchParams.toString();
      window.gtag("event", "page_view", {
        page_path: `${pathname}${query ? `?${query}` : ""}`,
      });
    }
    const pixelId = pixelForEvent(pathname, "PageView");
    if (pixelId && typeof window.fbq === "function") {
      initializePixel(pixelId);
      window.fbq("trackSingle", pixelId, "PageView");
    }
  }, [pathname, searchParams, ready]);

  // Qualquer clique em link do WhatsApp conta como evento Contact.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      const href = link?.getAttribute("href") ?? "";
      if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) {
        trackMetaEvent("Contact", {
          content_name: link?.dataset.metaContentName || "whatsapp",
          contact_channel: "whatsapp",
          action: "open_whatsapp",
        });
        const section = link?.dataset.analyticsSection;
        const interest = link?.dataset.analyticsInterest;
        if (isQuoteSection(section) && interest) {
          trackAnalyticsEvent({
            eventName: "quote_whatsapp_click",
            interest,
            section,
          });
        }
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}

function ConsentBanner({ onChoose }: { onChoose: (value: Consent) => void }) {
  return (
    <div
      role="dialog"
      aria-label="Consentimento de cookies"
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-xl rounded-2xl border border-[#96b0ff]/20 bg-[#0c1428]/95 p-4 text-sm text-[#edf0f7]/80 shadow-2xl backdrop-blur-md sm:p-5"
    >
      <p className="leading-6">
        Usamos cookies, Google Analytics e o Pixel da Meta para medir audiência,
        interações e anúncios. Se você enviar um orçamento, a Meta também recebe
        seu nome e contato protegidos por código (hash). Só ativamos com a sua
        permissão. Saiba mais no{" "}
        <Link
          href="/privacidade"
          className="font-semibold text-[#5b97ff] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b97ff]"
        >
          Aviso de Privacidade
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChoose("granted")}
          className="rounded-full bg-[#ffb547] px-5 py-2 text-xs font-semibold text-[#1a1100] transition hover:bg-[#ffc56f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b97ff]"
        >
          Aceitar
        </button>
        <button
          type="button"
          onClick={() => onChoose("denied")}
          className="rounded-full border border-[#96b0ff]/25 px-5 py-2 text-xs font-semibold text-[#edf0f7]/80 transition hover:bg-[#96b0ff]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b97ff]"
        >
          Recusar
        </button>
      </div>
    </div>
  );
}

export default function MetaPixel() {
  const [ready, setReady] = useState(false);
  // undefined = renderização no servidor / antes da hidratação.
  const consent = useSyncExternalStore<Consent | null | undefined>(
    subscribeConsent,
    readConsent,
    () => undefined
  );

  // Sem consentimento nada é carregado.
  if (consent === undefined) return null;
  if (consent === null) return <ConsentBanner onChoose={saveConsent} />;
  if (consent === "denied") return null;

  return (
    <>
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            window.gtag = function(){window.dataLayer.push(arguments);};
            window.gtag('js', new Date());
            window.gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
          `,
        }}
      />
      <Script
        id="google-analytics"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="meta-pixel-base"
        strategy="afterInteractive"
        onReady={() => setReady(true)}
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            // O PageView por navegação é nosso; sem isto a Meta manda outro a cada troca de URL.
            window.fbq.disablePushState = true;
          `,
        }}
      />
      <Suspense fallback={null}>
        <MetaPixelRouteTracker ready={ready} />
      </Suspense>
    </>
  );
}
