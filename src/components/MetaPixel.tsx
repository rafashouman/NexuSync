"use client";

import { useEffect, useRef, useState, useSyncExternalStore, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { isQuoteSection } from "@/lib/quote";

export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || "1587285682708459";
const CYBEROREGON_PIXEL_ID = process.env.NEXT_PUBLIC_CYBEROREGON_META_PIXEL_ID;
const initializedPixels = new Set<string>();

function pixelForPath(pathname: string) {
  return (pathname === "/templates/cyber-oregon" || pathname.startsWith("/templates/cyber-oregon/"))
    && CYBEROREGON_PIXEL_ID ? CYBEROREGON_PIXEL_ID : META_PIXEL_ID;
}

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
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

// Helper global para disparar eventos customizados de qualquer componente/botão
export const trackMetaEvent = (
  eventName: string,
  params?: Record<string, unknown>
) => {
  if (typeof window !== "undefined" && readConsent() === "granted" && typeof window.fbq === "function") {
    const pixelId = pixelForPath(window.location.pathname);
    initializePixel(pixelId);
    window.fbq("trackSingle", pixelId, eventName, params);
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
    if (typeof window.fbq === "function") {
      const pixelId = pixelForPath(pathname);
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

const CONSENT_KEY = "nexusync-cookie-consent-v2";
type Consent = "granted" | "denied";

function ConsentBanner({ onChoose }: { onChoose: (value: Consent) => void }) {
  return (
    <div
      role="dialog"
      aria-label="Consentimento de cookies"
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-xl rounded-2xl border border-[#96b0ff]/20 bg-[#0c1428]/95 p-4 text-sm text-[#edf0f7]/80 shadow-2xl backdrop-blur-md sm:p-5"
    >
      <p className="leading-6">
        Usamos cookies, Google Analytics e o Pixel da Meta para medir audiência
        e interações. Só ativamos com a sua permissão. Saiba mais no{" "}
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

const consentListeners = new Set<() => void>();

function subscribeConsent(cb: () => void) {
  consentListeners.add(cb);
  return () => {
    consentListeners.delete(cb);
  };
}

function readConsent(): Consent | null {
  try {
    const saved = window.localStorage.getItem(CONSENT_KEY);
    return saved === "granted" || saved === "denied" ? saved : null;
  } catch {
    return null;
  }
}

export default function MetaPixel() {
  const [ready, setReady] = useState(false);
  // undefined = renderização no servidor / antes da hidratação.
  const consent = useSyncExternalStore<Consent | null | undefined>(
    subscribeConsent,
    readConsent,
    () => undefined
  );

  const choose = (value: Consent) => {
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // Se o navegador bloqueia o armazenamento, continuamos sem rastreamento.
      return;
    }
    consentListeners.forEach((cb) => cb());
  };

  // Sem consentimento nada é carregado.
  if (consent === undefined) return null;
  if (consent === null) return <ConsentBanner onChoose={choose} />;
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
          `,
        }}
      />
      <Suspense fallback={null}>
        <MetaPixelRouteTracker ready={ready} />
      </Suspense>
    </>
  );
}
