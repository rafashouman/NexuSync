"use client";

import { useRef } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics";
import s from "./rua.module.css";

const VIDEO_SRC = "/videos/pedido-online.mp4";

export function VideoModal() {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const played = useRef(false);

  function open() {
    const v = video.current;
    if (v && !v.getAttribute("src")) v.src = VIDEO_SRC;
    dialog.current?.showModal();
    v?.play().catch(() => {});
  }

  return (
    <>
      <button type="button" className={s.playlink} onClick={open}>
        <i aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 1.5v11l9-5.5z" fill="currentColor" /></svg>
        </i>
        <span>Assista ao vídeo<small>21 segundos</small></span>
      </button>
      <dialog ref={dialog} className={s.dialog} aria-label="Vídeo: pedido online" onClose={() => video.current?.pause()}>
        <div className={s.dlgBar}>
          <span>Pedido online · 21 s</span>
          <button type="button" onClick={() => dialog.current?.close()}>Fechar</button>
        </div>
        <video ref={video} controls playsInline preload="none" onPlay={() => {
          if (played.current) return;
          played.current = true;
          trackAnalyticsEvent({ eventName: "home_video_play" });
        }} />
      </dialog>
    </>
  );
}
