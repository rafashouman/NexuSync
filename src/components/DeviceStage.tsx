"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowUpRight, Maximize2 } from "lucide-react";

type Device = "laptop" | "tablet" | "phone";

const deviceLabels: Record<Device, string> = {
  laptop: "Desktop",
  tablet: "Tablet",
  phone: "Celular",
};

const queries = ["(min-width: 1024px)", "(min-width: 768px)"];

function subscribe(callback: () => void) {
  const lists = queries.map((query) => window.matchMedia(query));
  lists.forEach((list) => list.addEventListener("change", callback));
  return () =>
    lists.forEach((list) => list.removeEventListener("change", callback));
}

// Desktop screens can test every version, tablets test tablet and phone, phones only phone.
function getAvailable(): string {
  if (window.matchMedia(queries[0]).matches) return "laptop,tablet,phone";
  if (window.matchMedia(queries[1]).matches) return "tablet,phone";
  return "phone";
}

function ScaledFrame({
  href,
  title,
  width,
  height,
  interactive,
}: {
  href: string;
  title: string;
  width: number;
  height: number;
  interactive: boolean;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const observer = new ResizeObserver(([entry]) =>
      setScale(entry.contentRect.width / width),
    );
    observer.observe(box);
    return () => observer.disconnect();
  }, [width]);

  return (
    <div
      ref={boxRef}
      className="relative w-full overflow-hidden bg-ocean"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {scale > 0 && (
        <iframe
          src={href}
          title={title}
          loading="lazy"
          scrolling={interactive ? "yes" : "no"}
          tabIndex={interactive ? 0 : -1}
          className={`absolute left-0 top-0 origin-top-left border-0 ${
            interactive ? "" : "pointer-events-none"
          }`}
          style={{ width, height, transform: `scale(${scale})` }}
        />
      )}
    </div>
  );
}

export function DeviceStage({
  href,
  title,
  onFullscreen,
}: {
  href: string;
  title: string;
  onFullscreen: () => void;
}) {
  const available = useSyncExternalStore(subscribe, getAvailable, () => "")
    .split(",")
    .filter(Boolean) as Device[];
  const [chosen, setChosen] = useState<Device>("laptop");
  const [interactive, setInteractive] = useState(true);

  // Falls back to the largest device allowed by the current screen.
  const device = available.includes(chosen) ? chosen : available[0];
  if (!device) return <div className="h-[420px]" />;

  const frameTitle = `${title} (${deviceLabels[device]})`;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="order-last mt-2 flex w-full flex-wrap items-center justify-center gap-2">
        {available.length > 1 && (
          <div
            role="group"
            aria-label="Versão do site"
            className="inline-flex rounded-xl border border-turquoise/25 bg-abyss/50 p-1"
          >
            {available.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setChosen(id)}
                aria-pressed={device === id}
                className={`rounded-lg px-3 py-1.5 font-mono text-[10px] font-bold uppercase transition-all ${
                  device === id
                    ? "bg-champagne text-abyss shadow"
                    : "text-ivory/50 hover:text-ivory"
                }`}
              >
                {deviceLabels[id]}
              </button>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => setInteractive((value) => !value)}
          aria-pressed={interactive}
          className={`rounded-xl border px-3 py-2 font-mono text-[10px] font-bold uppercase transition-colors ${
            interactive
              ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-300"
              : "border-turquoise/25 bg-ocean/65 text-ivory/50"
          }`}
        >
          {interactive ? "● Interação ativa" : "Interação pausada"}
        </button>
        <button
          type="button"
          onClick={onFullscreen}
          className="inline-flex items-center gap-1.5 rounded-xl border border-turquoise/25 bg-ocean/65 px-3 py-2 font-mono text-[10px] font-bold uppercase text-ivory transition-colors hover:border-turquoise hover:text-ice"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          Tela cheia
        </button>
        <Link
          href={href}
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-xl bg-ice px-4 py-2 text-xs font-black uppercase text-abyss transition-colors hover:bg-turquoise"
        >
          Abrir template
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {device === "laptop" && (
        <div className="w-full max-w-[980px]">
          <div className="rounded-t-2xl border border-turquoise/25 bg-ocean p-[3px] pb-[3px] shadow-2xl">
            <div className="overflow-hidden rounded-lg">
              <div className="flex h-8 items-center gap-1.5 border-b border-turquoise/25 bg-ocean px-4">
                <span aria-hidden className="h-2 w-2 rounded-full bg-[#ff6b61]" />
                <span aria-hidden className="h-2 w-2 rounded-full bg-[#ffc14f]" />
                <span aria-hidden className="h-2 w-2 rounded-full bg-[#49c781]" />
                <span className="ml-3 min-w-0 truncate rounded-full border border-turquoise/25 bg-ocean/65 px-3 py-0.5 font-mono text-[10px] text-ivory/50">
                  nexusync.online{href}
                </span>
              </div>
              <ScaledFrame
                href={href}
                title={frameTitle}
                width={1280}
                height={760}
                interactive={interactive}
              />
            </div>
          </div>
          <div
            aria-hidden
            className="mx-auto h-3 w-[108%] -translate-x-[3.7%] rounded-b-[1.2rem] border border-t-0 border-turquoise/25 bg-gradient-to-b from-ocean to-petroleum"
          />
        </div>
      )}

      {device === "tablet" && (
        <div className="w-full max-w-[520px] rounded-[2rem] border border-turquoise/25 bg-ocean p-1.5 shadow-2xl">
          <div className="overflow-hidden rounded-xl">
            <ScaledFrame
              href={href}
              title={frameTitle}
              width={820}
              height={1100}
              interactive={interactive}
            />
          </div>
        </div>
      )}

      {device === "phone" && (
        <div className="relative w-[min(100%,300px)] rounded-[2.75rem] border border-turquoise/25 bg-ocean p-1.5 shadow-2xl">
          <div className="relative overflow-hidden rounded-[2.35rem]">
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-abyss"
            />
            <ScaledFrame
              href={href}
              title={frameTitle}
              width={390}
              height={844}
              interactive={interactive}
            />
          </div>
        </div>
      )}
    </div>
  );
}
