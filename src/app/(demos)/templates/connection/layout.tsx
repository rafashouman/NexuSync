import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Tarot interativo online | Demonstração NexuSync",
  description:
    "Experimente uma demonstração interativa de leitura de tarot e veja como uma página temática pode apresentar uma experiência digital.",
  path: "/templates/connection",
});

export default function ConnectionLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
