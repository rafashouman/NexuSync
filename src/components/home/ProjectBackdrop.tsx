import Image from "next/image";
import s from "./ProjectBackdrop.module.css";

/** Decorative project imagery stays below the original artwork and controls. */
export function ProjectBackdrop({ src, sizes = "(max-width: 760px) 100vw, 50vw" }: { src: string; sizes?: string }) {
  return <div className={s.backdrop} aria-hidden="true">
    <Image src={src} alt="" fill sizes={sizes} className={s.image} />
    <div className={s.veil} />
  </div>;
}
