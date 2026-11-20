"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";

export const DEMO_CONTENT_ID = "conteudo";

type DemoTheme = "claro" | "escuro";

const DemoThemeContext = createContext<DemoTheme>("escuro");

function subscribeToTheme(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

function getThemeSnapshot(): DemoTheme {
  return new URLSearchParams(window.location.search).get("tema") === "claro"
    ? "claro"
    : "escuro";
}

function getServerThemeSnapshot(): DemoTheme {
  return "escuro";
}

export function useDemoTheme() {
  return useContext(DemoThemeContext);
}

/** Theme context and skip link without animation code, so pages that do not animate (the home) stay light. */
export function DemoFrame({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  return (
    <DemoThemeContext.Provider value={theme}>
      <div className="demo-shell" data-theme={theme}>
        <a href={`#${DEMO_CONTENT_ID}`} className="skip-link">
          Pular para o conteúdo
        </a>
        {children}
      </div>
    </DemoThemeContext.Provider>
  );
}
