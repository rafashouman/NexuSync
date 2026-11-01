"use client";

import { useEffect, useRef, useSyncExternalStore, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

export const META_PIXEL_ID = "1587285682708459";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

// Helper global para disparar eventos customizados de qualquer componente/botão
export const trackMetaEvent = (
  eventName: string,
  params?: Record<string, unknown>
) => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", eventName, params);
  }
};

export const openTrackedWhatsApp = (
  url: string,
  eventName: "Lead" | "Purchase" | "Schedule" | "Contact" = "Lead",
  params?: Record<string, unknown>
) => {
  trackMetaEvent(eventName, {
    currency: "BRL",
    ...params,
  });
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
};

function MetaPixelRouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isFirstRender = useRef(true);

  // A primeira visualiza??o j? ? registrada pelo script base.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  }, [pathname, searchParams]);

  // Qualquer clique em link do WhatsApp conta como evento Contact.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href]");
      const href = link?.getAttribute("href") ?? "";
      if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) {
        trackMetaEvent("Contact", { content_name: "whatsapp" });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}

const CONSENT_KEY = "nexusync-cookie-consent";
type Consent = "granted" | "denied";

function ConsentBanner({ onChoose }: { onChoose: (value: Consent) => void }) {
  return (
    <div
      role="dialog"
      aria-label="Consentimento de cookies"
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-xl rounded-2xl border border-white/10 bg-[#0b0614]/95 p-4 text-sm text-white/80 shadow-2xl backdrop-blur-md sm:p-5"
    >
      <p className="leading-6">
        Usamos cookies e o Pixel da Meta para medir a audiência e melhorar nossos
        anúncios. Só ativamos com a sua permissão. Saiba mais no{" "}
        <Link
          href="/privacidade"
          className="font-semibold text-violet-200 underline-offset-4 hover:underline"
        >
          Aviso de Privacidade
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChoose("granted")}
          className="rounded-full bg-violet-500 px-5 py-2 text-xs font-semibold text-white transition hover:bg-violet-400"
        >
          Aceitar
        </button>
        <button
          type="button"
          onClick={() => onChoose("denied")}
          className="rounded-full border border-white/20 px-5 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10"
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
  const saved = window.localStorage.getItem(CONSENT_KEY);
  return saved === "granted" || saved === "denied" ? saved : null;
}

export default function MetaPixel() {
  // undefined = renderização no servidor / antes da hidratação.
  const consent = useSyncExternalStore<Consent | null | undefined>(
    subscribeConsent,
    readConsent,
    () => undefined
  );

  const choose = (value: Consent) => {
    window.localStorage.setItem(CONSENT_KEY, value);
    consentListeners.forEach((cb) => cb());
  };

  // Sem consentimento nada é carregado.
  if (consent === undefined) return null;
  if (consent === null) return <ConsentBanner onChoose={choose} />;
  if (consent === "denied") return null;

  return (
    <>
      <Script
        id="meta-pixel-base"
        strategy="afterInteractive"
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
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <Suspense fallback={null}>
        <MetaPixelRouteTracker />
      </Suspense>
    </>
  );
}