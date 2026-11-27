import { SITE, painelPath } from "@/components/luzinete/data";
import { Painel } from "@/components/luzinete/Painel";
import p from "@/components/luzinete/painel.module.css";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Painel de sessões | Luzinete Terapeuta",
  description: "Área restrita da terapeuta para ver e cancelar as sessões agendadas pelo site.",
  path: painelPath,
  noindex: true,
  image: `${SITE.images}/compartilhar.jpg`,
});

export default function LuzinetePainelPage() {
  return (
    <div className={p.wrap}>
      <Painel />
    </div>
  );
}
