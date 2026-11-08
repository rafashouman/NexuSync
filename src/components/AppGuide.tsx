"use client";

import { useEffect, useRef } from "react";
import { BookOpen, X } from "lucide-react";
import type { CatalogApp } from "@/data/appCatalog";

export function AppGuide({ app }: { app: CatalogApp }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const storageKey = `nexusync:guia:v1:${app.slug}`;

  useEffect(() => {
    if (window.self !== window.top) return;
    try {
      if (localStorage.getItem(storageKey)) return;
    } catch { /* O guia também funciona sem armazenamento. */ }
    dialog.current?.showModal();
  }, [storageKey]);

  return (
    <>
      <button ref={trigger} type="button" onClick={() => dialog.current?.showModal()}
        className="fixed bottom-20 left-3 z-40 flex items-center gap-2 rounded-full border border-white/20 bg-zinc-950 px-4 py-2 text-sm font-semibold text-white shadow-lg sm:bottom-5">
        <BookOpen size={16} /> Como usar
      </button>
      <dialog ref={dialog} aria-label={`Como usar ${app.name}`}
        onClose={() => {
          try { localStorage.setItem(storageKey, "1"); } catch { /* Armazenamento opcional. */ }
          trigger.current?.focus({ preventScroll: true });
        }}
        className="fixed inset-0 m-auto max-h-[85dvh] w-[min(92vw,30rem)] overflow-y-auto rounded-3xl border border-white/15 bg-zinc-950 p-6 text-white shadow-2xl backdrop:bg-black/70">
        <form method="dialog">
          <div className="flex items-start justify-between gap-3">
            <div><p className="text-sm text-cyan-300">Como usar</p><h2 className="mt-1 text-2xl font-bold">{app.name}</h2></div>
            <button aria-label="Fechar tutorial" className="rounded-lg p-2"><X size={20} /></button>
          </div>
          <ol className="my-6 list-decimal space-y-4 pl-6 text-sm leading-relaxed text-zinc-200 marker:font-bold marker:text-cyan-300">
            {app.steps.map(step => <li key={step} className="pl-1">{step}</li>)}
          </ol>
          <button className="w-full rounded-xl bg-cyan-300 p-3 font-bold text-zinc-950">Começar a usar</button>
        </form>
      </dialog>
    </>
  );
}
