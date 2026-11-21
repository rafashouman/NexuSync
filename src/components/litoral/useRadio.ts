"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const STATIONS = [
  { id: "mare", freq: "88.1", name: "Rádio Maré", note: "Ondas ao vivo, sem locutor" },
  { id: "brisa", freq: "94.7", name: "Brisa FM", note: "Violão de varanda e vento" },
] as const;

type Dispose = () => void;

function noiseBuffer(ctx: AudioContext, kind: "brown" | "white") {
  const length = ctx.sampleRate * 4;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    if (kind === "white") {
      data[i] = white * 0.5;
    } else {
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
  }
  return buffer;
}

function loopSource(ctx: AudioContext, buffer: AudioBuffer) {
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  return source;
}

function lfo(ctx: AudioContext, rate: number, depth: number, target: AudioParam) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.value = rate;
  gain.gain.value = depth;
  osc.connect(gain).connect(target);
  osc.start();
  return osc;
}

/** Ondas: ruído marrom filtrado, com o volume subindo e descendo devagar, e uma camada de espuma. */
function waves(ctx: AudioContext, destination: AudioNode, level: number): Dispose {
  const out = ctx.createGain();
  out.gain.value = level;
  out.connect(destination);

  const body = loopSource(ctx, noiseBuffer(ctx, "brown"));
  const low = ctx.createBiquadFilter();
  low.type = "lowpass";
  low.frequency.value = 520;
  const swell = ctx.createGain();
  swell.gain.value = 0.5;
  body.connect(low).connect(swell).connect(out);
  const swellLfo = lfo(ctx, 0.11, 0.38, swell.gain);

  const foam = loopSource(ctx, noiseBuffer(ctx, "white"));
  const band = ctx.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 1900;
  band.Q.value = 0.35;
  const foamGain = ctx.createGain();
  foamGain.gain.value = 0.07;
  foam.connect(band).connect(foamGain).connect(out);
  const foamLfo = lfo(ctx, 0.13, 0.055, foamGain.gain);

  body.start();
  foam.start();

  return () => {
    for (const node of [body, foam, swellLfo, foamLfo]) {
      try {
        node.stop();
      } catch {
        /* já parado */
      }
    }
    out.disconnect();
  };
}

const SCALE = [220, 261.63, 293.66, 329.63, 392, 440, 523.25];

/** Violão: notas de uma escala pentatônica, com decaimento longo, sorteadas a cada ~1 segundo. */
function guitar(ctx: AudioContext, destination: AudioNode): Dispose {
  const out = ctx.createGain();
  out.gain.value = 0.55;
  out.connect(destination);
  let timer = 0;
  let index = 3;

  const pluck = (frequency: number, when: number) => {
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const env = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = frequency;
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2600, when);
    filter.frequency.exponentialRampToValueAtTime(500, when + 1.4);
    env.gain.setValueAtTime(0.0001, when);
    env.gain.exponentialRampToValueAtTime(0.22, when + 0.008);
    env.gain.exponentialRampToValueAtTime(0.0001, when + 1.8);
    osc.connect(filter).connect(env).connect(out);
    osc.start(when);
    osc.stop(when + 1.9);
  };

  const step = () => {
    const now = ctx.currentTime + 0.05;
    index = Math.max(0, Math.min(SCALE.length - 1, index + Math.round(Math.random() * 4 - 2)));
    pluck(SCALE[index], now);
    if (Math.random() < 0.28) pluck(SCALE[Math.max(0, index - 2)], now + 0.04);
    timer = window.setTimeout(step, 620 + Math.random() * 900);
  };
  step();

  return () => {
    window.clearTimeout(timer);
    out.disconnect();
  };
}

function buildStation(ctx: AudioContext, destination: AudioNode, id: string): Dispose {
  if (id === "brisa") {
    const base = waves(ctx, destination, 0.3);
    const strings = guitar(ctx, destination);
    return () => {
      base();
      strings();
    };
  }
  return waves(ctx, destination, 1);
}

/** Rádio da pousada. O áudio só nasce depois de um clique, como exigem os navegadores. */
export function useRadio() {
  const [playing, setPlaying] = useState(false);
  const [station, setStation] = useState(0);
  const [volume, setVolumeState] = useState(0.6);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const disposeRef = useRef<Dispose | null>(null);

  const stopSound = useCallback(() => {
    disposeRef.current?.();
    disposeRef.current = null;
  }, []);

  const startSound = useCallback((index: number) => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;
    stopSound();
    disposeRef.current = buildStation(ctx, master, STATIONS[index].id);
  }, [stopSound]);

  const toggle = useCallback(() => {
    if (playing) {
      stopSound();
      void ctxRef.current?.suspend();
      setPlaying(false);
      return;
    }
    if (!ctxRef.current) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      const ctx = new Ctor();
      const master = ctx.createGain();
      master.gain.value = volume * 0.7;
      master.connect(ctx.destination);
      ctxRef.current = ctx;
      masterRef.current = master;
    }
    void ctxRef.current.resume();
    startSound(station);
    setPlaying(true);
  }, [playing, startSound, station, stopSound, volume]);

  const tune = useCallback((direction: 1 | -1) => {
    const next = (station + direction + STATIONS.length) % STATIONS.length;
    setStation(next);
    if (playing) startSound(next);
  }, [playing, startSound, station]);

  const setVolume = useCallback((value: number) => {
    setVolumeState(value);
    const master = masterRef.current;
    if (master) master.gain.value = value * 0.7;
  }, []);

  useEffect(() => () => {
    disposeRef.current?.();
    void ctxRef.current?.close();
  }, []);

  return { playing, station, volume, toggle, tune, setVolume };
}
