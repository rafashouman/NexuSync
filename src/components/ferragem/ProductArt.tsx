import Image from "next/image";
import {
  BrickWall, Brush, Cable, Construction, Container, Drill, Droplets, Fan, Hammer, KeyRound, LampCeiling,
  Layers, Lightbulb, Lock, Nut, PaintBucket, Plug, Ruler, Scissors, Shovel, ShowerHead, SprayCan, Sprout,
  Toolbox, Wrench, Zap, type LucideIcon,
} from "lucide-react";
import { getCategory, type IconKey, type Product } from "./catalog-data";
import s from "./ferragem.module.css";

export const ICONS: Record<IconKey, LucideIcon> = {
  hammer: Hammer, wrench: Wrench, ruler: Ruler, drill: Drill, zap: Zap, plug: Plug, cable: Cable,
  lightbulb: Lightbulb, shower: ShowerHead, droplets: Droplets, paint: PaintBucket, brush: Brush,
  spray: SprayCan, brick: BrickWall, shovel: Shovel, construction: Construction, bolt: Nut, lock: Lock,
  key: KeyRound, sprout: Sprout, scissors: Scissors, toolbox: Toolbox, fan: Fan, lamp: LampCeiling,
  container: Container, layers: Layers,
};

/** Foto do produto ou, sem foto, o ícone sobre a cor da categoria. */
export function ProductArt({ product, size = "card", priority = false }: { product: Product; size?: "card" | "large"; priority?: boolean }) {
  const tone = getCategory(product.category)?.tone ?? "#e8e5df";
  const Icon = ICONS[product.icon];
  return (
    <div className={`${s.art} ${size === "large" ? s.artLarge : ""}`} style={{ background: tone }}>
      {product.image ? (
        <Image src={product.image} alt={product.name} fill sizes={size === "large" ? "(min-width: 900px) 520px, 100vw" : "(min-width: 900px) 260px, 50vw"} priority={priority} />
      ) : (
        <>
          <Icon className={s.artIcon} strokeWidth={1.25} aria-hidden="true" />
          <span className={s.artSku} aria-hidden="true">{product.sku}</span>
        </>
      )}
    </div>
  );
}
