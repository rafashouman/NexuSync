import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Blue Moon: jogo interativo de cartas | NexuSync",
  description:
    "Explore uma experiência demonstrativa de jogo de cartas com combinações e desafios interativos no navegador.",
  path: "/templates/bluemoon",
});

export default function BlueMoonLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
