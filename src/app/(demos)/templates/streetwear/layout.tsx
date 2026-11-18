import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Loja de roupas e acessórios | Demonstração Vortex Atelier",
  description:
    "Explore uma loja de camisetas, manga longa e acessórios, com cores, tamanhos e pedido pelo WhatsApp. Demonstração NexuSync.",
  path: "/templates/streetwear",
});

export default function StreetwearLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
