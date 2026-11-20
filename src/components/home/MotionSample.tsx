"use client";

import { useRef } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics";
import s from "./CreativeExperience.module.css";

/** Real motion graphics sample. The video only downloads when the visitor presses play. */
export function MotionSample() {
  const played = useRef(false);
  return (
    <figure className={s.motionSample}>
      <video
        controls
        playsInline
        preload="none"
        poster="/images/motion-pedido-online-poster.jpg"
        src="/videos/pedido-online.mp4"
        aria-label="Exemplo de motion graphics: um anúncio de hambúrguer e um pedido online, em 21 segundos"
        onPlay={() => {
          if (played.current) return;
          played.current = true;
          trackAnalyticsEvent({ eventName: "design_video_play" });
        }}
      />
      <figcaption>Exemplo de motion graphics · vídeo vertical, 21 segundos</figcaption>
    </figure>
  );
}
