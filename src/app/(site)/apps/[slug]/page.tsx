import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ChronosBooking from "@/components/ChronosBooking";
import PulseMetricsDashboard from "@/components/PulseMetricsDashboard";
import SpinToWin from "@/components/games/SpinToWin";
import MemoryMatrix from "@/components/games/MemoryMatrix";
import { ArknoidGame } from "@/components/games/ArknoidGame";
import { ImageBlendPlayground } from "@/components/ImageBlendPlayground";
import ArcadeCabinetHub from "@/components/ArcadeCabinetHub";
import { AppGuide } from "@/components/AppGuide";
import { appCatalog } from "@/data/appCatalog";

const demos = {
  chronos: <ChronosBooking />,
  pulsemetrics: <PulseMetricsDashboard />,
  pulsespin: <SpinToWin />,
  memory: <MemoryMatrix />,
  arknoid: <ArknoidGame />,
  "images-blend": <ImageBlendPlayground />,
  voxelvaders: <ArcadeCabinetHub initialGame="voxelvaders" />,
  "pulse-arkanoid": <ArcadeCabinetHub initialGame="arkanoid" />,
  "cyber-tarot": <ArcadeCabinetHub initialGame="tarot" />,
};

export function generateStaticParams() {
  return Object.keys(demos).map(slug => ({ slug }));
}

async function resolveApp(params: Promise<{ slug: string }>) {
  const { slug } = await params;
  const app = appCatalog.find(entry => entry.path === `/apps/${slug}`);
  if (!app || !(app.slug in demos)) notFound();
  return app;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const app = await resolveApp(params);
  const title = `${app.name} | NexuSync`;
  return { title, description: app.description, openGraph: { title, description: app.description, url: `https://nexusync.online${app.path}` } };
}

export default async function AppPage({ params }: { params: Promise<{ slug: string }> }) {
  const app = await resolveApp(params);
  return <section className="container-luxe py-28 sm:py-36">
    <Link href="/apps" className="text-sm text-cyan-300">← Todos os aplicativos</Link>
    <h1 className="mt-5 font-display text-4xl font-bold sm:text-6xl">{app.name}</h1>
    <p className="mb-8 mt-3 max-w-2xl text-muted-foreground">{app.description}</p>
    <AppGuide key={app.slug} app={app} />
    {demos[app.slug as keyof typeof demos]}
  </section>;
}
