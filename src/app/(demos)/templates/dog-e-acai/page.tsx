import { MiniCardapio } from "@/components/minicardapio/MiniCardapio";
import s from "@/components/minicardapio/minicardapio.module.css";
import { ruaFonts } from "@/components/rua/fonts";
import { TemplateFx } from "@/components/templates/TemplateFx";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Mini cardápio com pedido no WhatsApp | Demo Dog & Açaí",
  description:
    "Demonstração do Mini Cardápio NexuSync: poucos produtos cadastrados pelo próprio dono, sacola e pedido pronto no WhatsApp da loja.",
  path: "/templates/dog-e-acai",
  noindex: true,
  image: "/images/dog-acai/cardapio.webp",
});

export default function DogAcaiPage() {
  return (
    <div id="mini-root" className={`${s.page} ${ruaFonts}`}>
      <TemplateFx rootId="mini-root" />
      <MiniCardapio />
    </div>
  );
}
