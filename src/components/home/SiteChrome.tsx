"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// The inner-page chrome pulls in framer-motion and the animated header, so it loads as its own chunk.
const loadInnerChrome = () => import("./InnerChrome");
const InnerChrome = dynamic(loadInnerChrome);

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const isHome = usePathname() === "/";

  // From the home, fetch the inner chrome on the first interaction so the first click on a link does not wait for it.
  useEffect(() => {
    if (!isHome) return;
    const events = ["pointerdown", "keydown", "touchstart", "wheel"] as const;
    const warm = () => {
      events.forEach((name) => window.removeEventListener(name, warm));
      void loadInnerChrome();
    };
    events.forEach((name) => window.addEventListener(name, warm, { passive: true, once: true }));
    return () => events.forEach((name) => window.removeEventListener(name, warm));
  }, [isHome]);

  if (isHome) return <main id="conteudo">{children}</main>;
  return <InnerChrome>{children}</InnerChrome>;
}
