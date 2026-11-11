"use client";

import { MotionConfig } from "framer-motion";
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

export default function DemoShell({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  return (
    <MotionConfig reducedMotion="user">
      <DemoThemeContext.Provider value={theme}>
        <div className="demo-shell" data-theme={theme}>
          <a href={`#${DEMO_CONTENT_ID}`} className="skip-link">
            Pular para o conteúdo
          </a>
          {children}
        </div>
      </DemoThemeContext.Provider>
    </MotionConfig>
  );
}
