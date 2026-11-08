"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Link2 } from "lucide-react";
import { appCatalog } from "@/data/appCatalog";

export function AppCatalogDirectory() {
  const [copied, setCopied] = useState("");
  const [manualUrl, setManualUrl] = useState("");

  async function copyLink(path: string) {
    const url = new URL(path, window.location.origin).href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(path);
      setManualUrl("");
    } catch {
      setCopied("");
      setManualUrl(url);
    }
  }

  return (
    <section className="mb-20 scroll-mt-28" id="todos-os-aplicativos">
      <h2 className="mb-6 font-display text-3xl font-bold">Todos os aplicativos e demonstrações</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {appCatalog.map(app => (
          <article key={app.slug} className="flex flex-col rounded-2xl border border-white/15 bg-white/[0.03] p-5 hover:border-cyan-300/60">
            <Link href={app.path} className="grow">
              <span className="text-xs text-cyan-300">{app.category}</span>
              <h3 className="my-2 flex items-center justify-between gap-2 font-bold">{app.name}<ArrowUpRight size={16} /></h3>
              <p className="text-sm text-muted-foreground">{app.description}</p>
            </Link>
            <button type="button" onClick={() => copyLink(app.path)} aria-label={`Copiar link de ${app.name}`}
              className="mt-4 flex w-fit items-center gap-2 rounded-lg py-2 text-xs font-semibold text-cyan-200">
              <Link2 size={14} /><span aria-live="polite">{copied === app.path ? "Link copiado" : "Copiar link"}</span>
            </button>
            {manualUrl.endsWith(app.path) && <label className="text-xs text-zinc-300">Selecione e copie o endereço
              <input readOnly value={manualUrl} onFocus={event => event.target.select()}
                className="mt-2 w-full rounded-lg border border-white/20 bg-black p-2" />
            </label>}
          </article>
        ))}
      </div>
    </section>
  );
}
