import type { Metadata } from "next";
import Link from "next/link";
import { appCatalog } from "@/data/appCatalog";
import { AppGuide } from "./AppGuide";
import { tours } from "@/data/appTours";

type Slug = keyof typeof tours;

function entry(slug: Slug) {
  const app = appCatalog.find(item => item.slug === slug);
  if (!app) throw new Error(`Aplicativo ausente no catálogo: ${slug}`);
  return app;
}

export function demoMetadata(slug: Slug): Metadata {
  const { name, description, path } = entry(slug);
  const title = `${name} | NexuSync`;
  return { title, description, openGraph: { title, description, url: `https://nexusync.online${path}` } };
}

export function DemoPage({ slug, children }: { slug: Slug; children: React.ReactNode }) {
  const app = entry(slug);
  return <section className="container-luxe py-28 sm:py-36">
    <Link href="/apps" className="text-sm text-cyan-300">← Todos os aplicativos</Link>
    <h1 className="mt-5 font-display text-4xl font-bold sm:text-6xl">{app.name}</h1>
    <p className="mb-8 mt-3 max-w-2xl text-muted-foreground">{app.description}</p>
    <AppGuide slug={slug} steps={tours[slug]} />
    {children}
  </section>;
}
