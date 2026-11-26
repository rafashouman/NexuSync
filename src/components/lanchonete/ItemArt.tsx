import Image from "next/image";
import { Beef, Croissant, CupSoda, Flame, IceCreamBowl, Sandwich, type LucideIcon } from "lucide-react";
import { getCategory, type IconKey, type MenuItem } from "./menu-data";
import s from "./lanchonete.module.css";

export const ICONS: Record<IconKey, LucideIcon> = {
  espeto: Flame,
  sanduiche: Sandwich,
  pastel: Beef,
  salgado: Croissant,
  bebida: CupSoda,
  sobremesa: IceCreamBowl,
};

/** Foto do item ou, sem foto, o ícone da categoria. */
export function ItemArt({ item, large = false }: { item: MenuItem; large?: boolean }) {
  const Icon = ICONS[getCategory(item.category)!.icon];
  return (
    <div className={large ? s.artLarge : s.art}>
      {item.image ? (
        <Image
          src={item.image}
          alt={large ? item.name : ""}
          fill
          sizes={large ? "(min-width: 860px) 460px, 100vw" : "112px"}
          {...(large ? { loading: "eager" as const, fetchPriority: "high" as const } : {})}
        />
      ) : (
        <Icon size={large ? 96 : 40} strokeWidth={1.5} aria-hidden="true" />
      )}
    </div>
  );
}
