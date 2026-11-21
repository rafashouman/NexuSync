"use client";

import { useLayoutEffect, useMemo, useRef, type ReactNode, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { ROUTE_LENGTH, STOPS, clamp, createSky, dwellOf, lerp, skyAt, smooth, type SkyState } from "./litoral-route";

export type RouteState = { t: number };
type V3 = [number, number, number];
type Motion = { t: number; s: number; speed: number; lateral: number; time: number; ready: boolean };

/* ------------------------------------------------------------------ */
/* Trajeto: uma estrada sinuosa ao longo de -z, com o mar à esquerda.   */
/* lateral > 0 é o lado direito de quem dirige.                         */
/* ------------------------------------------------------------------ */

const centerX = (s: number) => 10 * Math.sin(s / 90) + 4 * Math.sin(s / 37);
const slope = (s: number) => (10 / 90) * Math.cos(s / 90) + (4 / 37) * Math.cos(s / 37);
const yawAt = (s: number) => Math.atan2(slope(s), -1);

function frame(s: number, lateral = 0, y = 0, out = new THREE.Vector3()) {
  const m = slope(s);
  const len = Math.hypot(1, m);
  return out.set(centerX(s) + lateral / len, y, -s + (lateral * m) / len);
}

function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function ribbon(s0: number, s1: number, step: number, latA: (s: number) => number, latB: (s: number) => number, y: number) {
  const count = Math.ceil((s1 - s0) / step);
  const positions: number[] = [];
  const index: number[] = [];
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  for (let i = 0; i <= count; i++) {
    const s = s0 + i * step;
    frame(s, latA(s), y, a);
    frame(s, latB(s), y, b);
    positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
    if (i < count) {
      const k = i * 2;
      index.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(index);
  geometry.computeVertexNormals();
  return geometry;
}

const constant = (value: number) => () => value;

/* ------------------------------------------------------------------ */
/* Geometrias e materiais compartilhados                                */
/* ------------------------------------------------------------------ */

const BOX = new THREE.BoxGeometry(1, 1, 1);
const SPHERE = new THREE.SphereGeometry(1, 10, 8);
const CYL = new THREE.CylinderGeometry(1, 1, 1, 10);
const CONE = new THREE.ConeGeometry(1, 1, 8);

function makeRoof() {
  const shape = new THREE.Shape();
  shape.moveTo(-3.6, 0);
  shape.lineTo(3.6, 0);
  shape.lineTo(0, 2.1);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 5.8, bevelEnabled: false });
  geometry.translate(0, 0, -2.9);
  return geometry;
}
const ROOF = makeRoof();

const solid = (color: string) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 1 });
const MAT = {
  wall: solid("#f3e5c8"),
  roof: solid("#c4553b"),
  wood: solid("#a37243"),
  woodDark: solid("#6e4a2b"),
  thatch: solid("#c79a52"),
  door: solid("#2f8f88"),
  white: solid("#f4f1ea"),
  red: solid("#d64a3b"),
  teal: solid("#2fa39a"),
  coral: solid("#ef6c4a"),
  amber: solid("#f5a93d"),
  cream: solid("#efe2c2"),
  rock: solid("#7d8590"),
  tyre: solid("#1f2328"),
  chrome: solid("#e8e4da"),
  glass: new THREE.MeshStandardMaterial({ color: "#9fd6e6", flatShading: true, roughness: 0.2, transparent: true, opacity: 0.7 }),
  glow: new THREE.MeshStandardMaterial({ color: "#ffe1a8", emissive: new THREE.Color("#ffb347"), emissiveIntensity: 0, flatShading: true }),
  beam: new THREE.MeshBasicMaterial({ color: "#ffe9b0", transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
  foam: new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.55, depthWrite: false, side: THREE.DoubleSide }),
  tree: new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1 }),
  puff: new THREE.MeshStandardMaterial({ color: "#ffffff", flatShading: true, roughness: 1 }),
  hill: new THREE.MeshStandardMaterial({ color: "#ffffff", flatShading: true, roughness: 1 }),
};

function paint(geometry: THREE.BufferGeometry, color: string) {
  const c = new THREE.Color(color);
  const count = geometry.attributes.position.count;
  const data = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) data.set([c.r, c.g, c.b], i * 3);
  geometry.setAttribute("color", new THREE.BufferAttribute(data, 3));
  return geometry;
}

function makePalm() {
  const parts: THREE.BufferGeometry[] = [];
  const trunk = new THREE.CylinderGeometry(0.16, 0.3, 6.2, 5, 4);
  trunk.translate(0, 3.1, 0);
  const pos = trunk.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    pos.setX(i, pos.getX(i) + Math.pow(y / 6.2, 2) * 0.9);
  }
  parts.push(paint(trunk, "#7a5a3a"));
  const greens = ["#4f8f55", "#5aa05a", "#437f4d"];
  for (let i = 0; i < 7; i++) {
    const leaf = new THREE.ConeGeometry(0.55, 4.4, 4, 3);
    leaf.translate(0, 2.2, 0);
    leaf.scale(1, 1, 0.25);
    leaf.rotateZ(1.1);
    const p = leaf.attributes.position;
    for (let v = 0; v < p.count; v++) p.setY(v, p.getY(v) - 0.05 * (p.getX(v) ** 2 + p.getZ(v) ** 2));
    leaf.rotateY((i / 7) * Math.PI * 2 + (i % 2) * 0.2);
    leaf.translate(0.9, 6.2, 0);
    parts.push(paint(leaf, greens[i % 3]));
  }
  return mergeGeometries(parts)!;
}

function makeCloud() {
  const puffs: THREE.BufferGeometry[] = [];
  const specs: [number, number, number, number][] = [[0, 0, 0, 6], [6, -1, 1, 4.6], [-6, -1.2, 0, 4.2], [2.4, 2.2, -1, 4]];
  for (const [x, y, z, r] of specs) {
    const g = new THREE.IcosahedronGeometry(r, 1);
    g.scale(1, 0.62, 0.8);
    g.translate(x, y, z);
    puffs.push(g);
  }
  return mergeGeometries(puffs)!;
}

/* ------------------------------------------------------------------ */
/* Cenário espalhado (palmeiras, morros, arbustos, nuvens, tracejado)    */
/* ------------------------------------------------------------------ */

type Inst = { p: V3; ry?: number; s: number; sy?: number; c?: string };

function Scatter({ geometry, material, items }: { geometry: THREE.BufferGeometry; material: THREE.Material; items: Inst[] }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const o = new THREE.Object3D();
    const color = new THREE.Color();
    items.forEach((item, i) => {
      o.position.set(...item.p);
      o.rotation.set(0, item.ry ?? 0, 0);
      o.scale.set(item.s, item.sy ?? item.s, item.s);
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
      if (item.c) mesh.setColorAt(i, color.set(item.c));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [items]);
  return <instancedMesh ref={ref} args={[geometry, material, items.length]} frustumCulled={false} />;
}

function Box({ p, s, m, r }: { p: V3; s: V3; m: THREE.Material; r?: V3 }) {
  return <mesh geometry={BOX} material={m} position={p} scale={s} rotation={r} />;
}

/* ------------------------------------------------------------------ */
/* Atmosfera: céu, sol, lua, estrelas, luz e neblina seguem o trajeto    */
/* ------------------------------------------------------------------ */

const DOME_VERT = `varying float vH; void main(){ vH = normalize(position).y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const DOME_FRAG = `uniform vec3 top; uniform vec3 bottom; varying float vH;
void main(){ float f = smoothstep(0.0, 0.6, vH); gl_FragColor = vec4(mix(bottom, top, pow(f, 0.85)), 1.0);
#include <colorspace_fragment>
}`;

type AtmoScratch = { sky: SkyState; sunDir: THREE.Vector3; moonDir: THREE.Vector3; dir: THREE.Vector3 };
type AtmoParts = {
  dome: THREE.Mesh | null;
  sun: THREE.Mesh | null;
  moon: THREE.Mesh | null;
  stars: THREE.Points | null;
  light: THREE.DirectionalLight | null;
  hemi: THREE.HemisphereLight | null;
};

/** Atualiza céu, luz, sol e lua. Fica fora do componente: é código imperativo do three, rodando a cada frame. */
function stepAtmosphere(
  scratch: AtmoScratch,
  material: THREE.ShaderMaterial,
  parts: AtmoParts,
  state: { scene: THREE.Scene; camera: THREE.Camera },
  m: Motion,
  still: boolean,
) {
  const { sky, sunDir, moonDir, dir } = scratch;
  skyAt(m.t, sky);
  const fog = state.scene.fog as THREE.Fog | null;
  fog?.color.setRGB(...sky.horizon, THREE.SRGBColorSpace);
  (material.uniforms.top.value as THREE.Color).setRGB(...sky.top, THREE.SRGBColorSpace);
  (material.uniforms.bottom.value as THREE.Color).setRGB(...sky.horizon, THREE.SRGBColorSpace);

  const elevation = Math.sin(((sky.hour - 6) / 12) * Math.PI);
  sunDir.set(-0.45, elevation * 0.9 + 0.02, -1).normalize();
  moonDir.set(-0.5, 0.4 + 0.2 * sky.night, -1).normalize();
  const moonMix = smooth(clamp((sky.night - 0.3) / 0.5));
  dir.copy(sunDir).lerp(moonDir, moonMix);
  if (dir.y < 0.05) dir.y = 0.05;
  dir.normalize();

  const cam = state.camera.position;
  parts.dome?.position.copy(cam);
  if (parts.sun) {
    parts.sun.position.copy(cam).addScaledVector(sunDir, 380);
    parts.sun.visible = elevation > -0.02;
    (parts.sun.material as THREE.MeshBasicMaterial).color.setRGB(...sky.sun, THREE.SRGBColorSpace);
  }
  if (parts.moon) {
    parts.moon.position.copy(cam).addScaledVector(moonDir, 380);
    parts.moon.visible = sky.night > 0.35;
  }
  if (parts.stars) {
    parts.stars.position.copy(cam);
    (parts.stars.material as THREE.PointsMaterial).opacity = clamp((sky.night - 0.4) / 0.5);
  }
  if (parts.light) {
    parts.light.position.copy(dir).multiplyScalar(100);
    parts.light.color.setRGB(...sky.sun, THREE.SRGBColorSpace);
    parts.light.intensity = sky.sunI;
  }
  if (parts.hemi) {
    parts.hemi.color.setRGB(...sky.amb, THREE.SRGBColorSpace);
    parts.hemi.groundColor.setRGB(...sky.ambG, THREE.SRGBColorSpace);
    parts.hemi.intensity = sky.ambI;
  }
  MAT.glow.emissiveIntensity = clamp((sky.hour - 17) / 2.2) * 2.4;
  MAT.beam.opacity = clamp((sky.hour - 18.4) / 2) * 0.28;
  MAT.foam.opacity = still ? 0.55 : 0.4 + Math.sin(m.time * 1.3) * 0.15;
}

function Atmosphere({ motion, still }: { motion: RefObject<Motion>; still: boolean }) {
  const dome = useRef<THREE.Mesh>(null);
  const sun = useRef<THREE.Mesh>(null);
  const moon = useRef<THREE.Mesh>(null);
  const stars = useRef<THREE.Points>(null);
  const light = useRef<THREE.DirectionalLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const scratch = useMemo<AtmoScratch>(
    () => ({ sky: createSky(), sunDir: new THREE.Vector3(), moonDir: new THREE.Vector3(), dir: new THREE.Vector3() }),
    [],
  );

  const domeMaterial = useMemo(
    () => new THREE.ShaderMaterial({
      uniforms: { top: { value: new THREE.Color() }, bottom: { value: new THREE.Color() } },
      vertexShader: DOME_VERT,
      fragmentShader: DOME_FRAG,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      toneMapped: false,
    }),
    [],
  );

  const starPositions = useMemo(() => {
    const rand = rng(7);
    const data = new Float32Array(380 * 3);
    for (let i = 0; i < 380; i++) {
      const a = rand() * Math.PI * 2;
      const e = 0.12 + rand() * 0.85;
      const r = 440;
      data.set([Math.cos(a) * Math.cos(e) * r, Math.sin(e) * r, Math.sin(a) * Math.cos(e) * r], i * 3);
    }
    return data;
  }, []);

  useFrame((state) => {
    stepAtmosphere(
      scratch,
      domeMaterial,
      { dome: dome.current, sun: sun.current, moon: moon.current, stars: stars.current, light: light.current, hemi: hemi.current },
      state,
      motion.current,
      still,
    );
  });

  return (
    <>
      <fog attach="fog" args={["#cde9f4", 70, 330]} />
      <hemisphereLight ref={hemi} />
      <directionalLight ref={light} />
      <mesh ref={dome} material={domeMaterial} renderOrder={-10}>
        <sphereGeometry args={[500, 24, 16]} />
      </mesh>
      <mesh ref={sun} renderOrder={-9}>
        <sphereGeometry args={[17, 20, 14]} />
        <meshBasicMaterial fog={false} toneMapped={false} />
      </mesh>
      <mesh ref={moon} renderOrder={-9}>
        <sphereGeometry args={[11, 18, 12]} />
        <meshBasicMaterial color="#f2ecd8" fog={false} toneMapped={false} />
      </mesh>
      <points ref={stars} renderOrder={-9}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={2.2} sizeAttenuation={false} color="#fff6dd" transparent opacity={0} fog={false} depthWrite={false} />
      </points>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Terreno                                                              */
/* ------------------------------------------------------------------ */

const START = -40;
const END = ROUTE_LENGTH + 150;

function stepWater(geometry: THREE.BufferGeometry, base: Float32Array, t: number) {
  const pos = geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = base[i * 3];
    const z = base[i * 3 + 2];
    pos.setY(i, Math.sin(x * 0.12 + t * 0.9) * 0.32 + Math.sin(z * 0.09 + t * 0.6) * 0.28);
  }
  pos.needsUpdate = true;
}

function Ground({ motion }: { motion: RefObject<Motion> }) {
  const geo = useMemo(() => {
    const sandEdge = (s: number) => -26 + Math.sin(s * 0.06) * 1.4;
    return {
      road: ribbon(START, END, 4, constant(-4), constant(4), 0.03),
      lineL: ribbon(START, END, 4, constant(-3.85), constant(-3.62), 0.045),
      lineR: ribbon(START, END, 4, constant(3.62), constant(3.85), 0.045),
      shoulder: ribbon(START, END, 4, constant(4), constant(7.2), 0.02),
      shoulderL: ribbon(START, END, 4, constant(-7.2), constant(-4), 0.02),
      sand: ribbon(START, END, 4, sandEdge, constant(-7), 0),
      foam: ribbon(START, END, 4, (s) => sandEdge(s) - 1.9, (s) => sandEdge(s) - 0.4, 0.015),
      grass: ribbon(START, END, 6, constant(7), constant(220), -0.03),
      pad: ribbon(ROUTE_LENGTH - 24, ROUTE_LENGTH + 20, 4, constant(6.5), constant(14), 0.035),
    };
  }, []);

  const water = useMemo(() => {
    const g = new THREE.PlaneGeometry(260, 720, 26, 72);
    g.rotateX(-Math.PI / 2);
    return { geometry: g, base: Float32Array.from(g.attributes.position.array) };
  }, []);

  const dashes = useMemo<Inst[]>(() => {
    const items: Inst[] = [];
    for (let s = START; s < END; s += 7) items.push({ p: frame(s, 0, 0.06).toArray() as V3, ry: yawAt(s), s: 1 });
    return items;
  }, []);

  const mat = useMemo(
    () => ({
      road: new THREE.MeshStandardMaterial({ color: "#363c46", flatShading: true, roughness: 1, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }),
      line: new THREE.MeshStandardMaterial({ color: "#f0ece0", flatShading: true, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 }),
      dash: new THREE.MeshStandardMaterial({ color: "#f3c653", flatShading: true, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 }),
      shoulder: new THREE.MeshStandardMaterial({ color: "#c9b58a", flatShading: true, roughness: 1, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1, side: THREE.DoubleSide }),
      sand: new THREE.MeshStandardMaterial({ color: "#ead7a8", flatShading: true, roughness: 1, side: THREE.DoubleSide }),
      grass: new THREE.MeshStandardMaterial({ color: "#6f9b62", flatShading: true, roughness: 1, side: THREE.DoubleSide }),
      water: new THREE.MeshStandardMaterial({ color: "#2f9aa8", flatShading: true, roughness: 0.55, metalness: 0.1 }),
    }),
    [],
  );

  const dashGeo = useMemo(() => new THREE.BoxGeometry(0.22, 0.02, 2.4), []);

  useFrame(() => stepWater(water.geometry, water.base, motion.current.time));

  return (
    <group>
      <mesh geometry={geo.grass} material={mat.grass} />
      <mesh geometry={geo.sand} material={mat.sand} />
      <mesh geometry={geo.shoulder} material={mat.shoulder} />
      <mesh geometry={geo.shoulderL} material={mat.shoulder} />
      <mesh geometry={geo.pad} material={mat.shoulder} />
      <mesh geometry={geo.road} material={mat.road} />
      <mesh geometry={geo.lineL} material={mat.line} />
      <mesh geometry={geo.lineR} material={mat.line} />
      <Scatter geometry={dashGeo} material={mat.dash} items={dashes} />
      <mesh geometry={water.geometry} material={mat.water} position={[-130, -0.4, -290]} />
      <mesh geometry={geo.foam} material={MAT.foam} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Vegetação, morros e nuvens                                           */
/* ------------------------------------------------------------------ */

function Scenery({ low, still, motion }: { low: boolean; still: boolean; motion: RefObject<Motion> }) {
  const palm = useMemo(() => makePalm(), []);
  const cloud = useMemo(() => makeCloud(), []);
  const hillGeo = useMemo(() => new THREE.ConeGeometry(1, 1, 7, 1).translate(0, 0.5, 0), []);
  const bushGeo = useMemo(() => new THREE.IcosahedronGeometry(1, 0), []);
  const cloudGroup = useRef<THREE.Group>(null);

  const data = useMemo(() => {
    const rand = rng(11);
    const palms: Inst[] = [];
    const stride = low ? 2 : 1;
    for (let s = START; s < END; s += (10 + rand() * 8) * stride) {
      const right = rand() > 0.45;
      const lateral = right ? 8.5 + rand() * 3 : -(10 + rand() * 4);
      palms.push({ p: frame(s, lateral, 0).toArray() as V3, ry: rand() * 6, s: 0.8 + rand() * 0.55 });
      if (rand() > 0.55) {
        const l2 = right ? 13 + rand() * 6 : -(13 + rand() * 5);
        palms.push({ p: frame(s + 5, l2, 0).toArray() as V3, ry: rand() * 6, s: 0.7 + rand() * 0.5 });
      }
    }
    const hills: Inst[] = [];
    const greens = ["#6f9b62", "#5f8f5a", "#7fa56a", "#58865a"];
    for (let s = START - 20; s < END + 40; s += 16 * stride) {
      const lateral = 34 + rand() * 80;
      const height = 8 + rand() * 18;
      hills.push({ p: frame(s + rand() * 10, lateral, -0.5).toArray() as V3, ry: rand() * 3, s: 14 + rand() * 22, sy: height, c: greens[Math.floor(rand() * greens.length)] });
    }
    const far: Inst[] = [];
    for (let s = START - 40; s < END + 120; s += 40 * stride) {
      far.push({ p: frame(s, 190 + rand() * 90, -1).toArray() as V3, ry: rand() * 3, s: 70 + rand() * 60, sy: 50 + rand() * 60, c: rand() > 0.5 ? "#7d9bb3" : "#8aa9b8" });
    }
    const bushes: Inst[] = [];
    const bushColors = ["#5f8f5a", "#7b9a52", "#4f7f55"];
    for (let s = START; s < END; s += 11 * stride) {
      const right = rand() > 0.35;
      bushes.push({ p: frame(s + rand() * 6, right ? 8 + rand() * 20 : -(8.5 + rand() * 4), 0.2).toArray() as V3, s: 0.7 + rand() * 0.9, sy: 0.5 + rand() * 0.6, c: bushColors[Math.floor(rand() * 3)] });
    }
    const clouds: Inst[] = [];
    const count = low ? 7 : 12;
    for (let i = 0; i < count; i++) {
      clouds.push({ p: [-150 + rand() * 230, 50 + rand() * 30, -rand() * (ROUTE_LENGTH + 120)], ry: rand() * 3, s: 1.2 + rand() * 1.3, sy: 1.1 + rand() * 0.5 });
    }
    return { palms, hills, far, bushes, clouds };
  }, [low]);

  useFrame(() => {
    if (cloudGroup.current && !still) cloudGroup.current.position.x = Math.sin(motion.current.time * 0.02) * 40;
  });

  return (
    <group>
      <Scatter geometry={palm} material={MAT.tree} items={data.palms} />
      <Scatter geometry={hillGeo} material={MAT.hill} items={data.hills} />
      <Scatter geometry={hillGeo} material={MAT.hill} items={data.far} />
      <Scatter geometry={bushGeo} material={MAT.hill} items={data.bushes} />
      <group ref={cloudGroup}>
        <Scatter geometry={cloud} material={MAT.puff} items={data.clouds} />
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* As paradas: cada uma tem um cenário próprio ao lado da estrada       */
/* ------------------------------------------------------------------ */

/** Posiciona o grupo na estrada. Dentro dele, +z é o sentido da viagem, -x é a direita. */
function Spot({ s, lateral, children }: { s: number; lateral: number; children: ReactNode }) {
  const p = frame(s, lateral, 0);
  return <group position={p} rotation={[0, yawAt(s), 0]}>{children}</group>;
}

/** Casinha com a frente para a estrada (side: 1 = estrada à esquerda de quem dirige, -1 = à direita). */
function Cabin({ p, side, scale = 1, door = MAT.door }: { p: V3; side: 1 | -1; scale?: number; door?: THREE.Material }) {
  return (
    <group position={p} rotation={[0, side * (Math.PI / 2), 0]} scale={scale}>
      <Box p={[0, 1.5, 0]} s={[6, 3, 5]} m={MAT.wall} />
      <mesh geometry={ROOF} material={MAT.roof} position={[0, 3, 0]} />
      <Box p={[0, 1.05, 2.53]} s={[1.1, 2.1, 0.1]} m={door} />
      <Box p={[-1.9, 1.7, 2.53]} s={[1, 1, 0.1]} m={MAT.glow} />
      <Box p={[1.9, 1.7, 2.53]} s={[1, 1, 0.1]} m={MAT.glow} />
      <Box p={[0, 0.18, 3.2]} s={[5, 0.2, 1.6]} m={MAT.wood} />
      <Box p={[0, 0.9, 3.9]} s={[5, 0.1, 0.1]} m={MAT.woodDark} />
    </group>
  );
}

function Hut({ p, side }: { p: V3; side: 1 | -1 }) {
  return (
    <group position={p} rotation={[0, side * (Math.PI / 2), 0]}>
      <Box p={[0, 1.3, 0]} s={[5, 2.6, 4]} m={MAT.wood} />
      <mesh geometry={ROOF} material={MAT.thatch} position={[0, 2.6, 0]} scale={[0.85, 0.9, 0.78]} />
      <Box p={[0, 0.95, 2.03]} s={[1.2, 1.9, 0.1]} m={MAT.woodDark} />
      <Box p={[-1.6, 1.6, 2.03]} s={[1, 0.9, 0.1]} m={MAT.glow} />
      <Box p={[0, 0.2, 3]} s={[5.4, 0.2, 2]} m={MAT.woodDark} />
    </group>
  );
}

function Umbrella({ p, color }: { p: V3; color: THREE.Material }) {
  return (
    <group position={p}>
      <mesh geometry={CYL} material={MAT.woodDark} scale={[0.07, 2.4, 0.07]} position={[0, 1.2, 0]} />
      <mesh geometry={CONE} material={color} scale={[1.9, 0.8, 1.9]} position={[0, 2.6, 0]} />
    </group>
  );
}

function Palm({ p, s = 1, ry = 0 }: { p: V3; s?: number; ry?: number }) {
  const palm = useMemo(() => makePalm(), []);
  return <mesh geometry={palm} material={MAT.tree} position={p} scale={s} rotation={[0, ry, 0]} />;
}

function Sailboat({ s, lateral, motion }: { s: number; lateral: number; motion: RefObject<Motion> }) {
  const ref = useRef<THREE.Group>(null);
  const sail = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, 4.6);
    shape.lineTo(2.2, 0.3);
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, []);
  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const t = motion.current.time;
    g.position.y = -0.1 + Math.sin(t * 0.9) * 0.18;
    g.rotation.z = Math.sin(t * 0.7) * 0.05;
  });
  const p = frame(s, lateral, 0);
  return (
    <group position={[p.x, 0, p.z]} rotation={[0, 0.5, 0]}>
      <group ref={ref}>
        <Box p={[0, 0.4, 0]} s={[4.2, 0.8, 1.5]} m={MAT.white} />
        <Box p={[0, 0.55, 0]} s={[4.3, 0.18, 1.55]} m={MAT.coral} />
        <mesh geometry={CYL} material={MAT.woodDark} scale={[0.07, 5, 0.07]} position={[0, 3, 0]} />
        <mesh geometry={sail} position={[0.1, 1, 0]}>
          <meshStandardMaterial color="#fbf3e4" flatShading side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

function Quartos() {
  const s = STOPS[1].t * ROUTE_LENGTH;
  return (
    <>
      <Spot s={s - 13} lateral={17}>
        <Cabin p={[0, 0, 0]} side={1} />
      </Spot>
      <Spot s={s + 1} lateral={20}>
        <Cabin p={[0, 0, 0]} side={1} door={MAT.coral} />
        <Palm p={[-6, 0, 3]} s={1.1} ry={1} />
      </Spot>
      <Spot s={s + 15} lateral={17.5}>
        <Cabin p={[0, 0, 0]} side={1} door={MAT.amber} />
        <Palm p={[-5.5, 0, -4]} s={0.95} ry={2} />
      </Spot>
    </>
  );
}

function Passeios({ motion }: { motion: RefObject<Motion> }) {
  const s = STOPS[2].t * ROUTE_LENGTH;
  const boards: [string, THREE.Material][] = [["", MAT.coral], ["", MAT.teal], ["", MAT.cream], ["", MAT.amber], ["", MAT.red]];
  return (
    <>
      <Spot s={s + 4} lateral={-15}>
        <Hut p={[0, 0, 0]} side={-1} />
        {boards.map(([, material], i) => (
          <group key={i} position={[-3.2 - i * 0.55, 0, -4.8]} rotation={[0, 0, -0.1]}>
            <mesh geometry={SPHERE} material={material} scale={[0.26, 1.8, 0.06]} position={[0, 1.7, 0]} />
          </group>
        ))}
      </Spot>
      <Spot s={s - 9} lateral={-17.5}>
        <Umbrella p={[0, 0, 0]} color={MAT.coral} />
      </Spot>
      <Spot s={s - 15} lateral={-20}>
        <Umbrella p={[0, 0, 0]} color={MAT.amber} />
      </Spot>
      <Spot s={s + 14} lateral={-19}>
        <Umbrella p={[0, 0, 0]} color={MAT.teal} />
      </Spot>
      <Sailboat s={s + 30} lateral={-46} motion={motion} />
    </>
  );
}

function Mesa() {
  const s = STOPS[3].t * ROUTE_LENGTH;
  const bulbs = useMemo<V3[]>(() => Array.from({ length: 15 }, (_, i) => {
    const f = i / 14;
    return [lerp(-5.5, 5.5, f), 3.5 - Math.sin(f * Math.PI) * 0.55, 3.8];
  }), []);
  return (
    <Spot s={s + 2} lateral={21}>
      <group rotation={[0, Math.PI / 2, 0]}>
        <Box p={[0, 0.15, 0]} s={[13, 0.3, 9]} m={MAT.wood} />
        {([[-6, -4], [6, -4], [-6, 4], [6, 4]] as [number, number][]).map(([x, z], i) => (
          <Box key={i} p={[x, 1.8, z]} s={[0.25, 3.3, 0.25]} m={MAT.woodDark} />
        ))}
        <Box p={[0, 3.55, 0]} s={[13.4, 0.2, 9.4]} m={MAT.thatch} />
        <Box p={[0, 3.3, 4.2]} s={[13, 0.12, 0.12]} m={MAT.woodDark} />
        {bulbs.map((p, i) => (
          <mesh key={i} geometry={SPHERE} material={MAT.glow} position={p} scale={0.13} />
        ))}
        {([[-3.5, 0.5], [0, -1.5], [3.5, 1]] as [number, number][]).map(([x, z], i) => (
          <group key={i} position={[x, 0.3, z]}>
            <mesh geometry={CYL} material={MAT.woodDark} scale={[0.07, 0.9, 0.07]} position={[0, 0.45, 0]} />
            <mesh geometry={CYL} material={MAT.cream} scale={[0.75, 0.07, 0.75]} position={[0, 0.95, 0]} />
            <mesh geometry={SPHERE} material={MAT.glow} scale={0.12} position={[0, 1.1, 0]} />
          </group>
        ))}
        <Box p={[0, 0.7, -3.6]} s={[9, 0.9, 0.9]} m={MAT.woodDark} />
      </group>
      <Palm p={[-9, 0, 8]} s={1.15} ry={0.5} />
      <Palm p={[-9, 0, -9]} s={1.05} ry={1.5} />
    </Spot>
  );
}

function Lighthouse({ motion }: { motion: RefObject<Motion> }) {
  const beam = useRef<THREE.Group>(null);
  const beamGeo = useMemo(() => {
    const g = new THREE.ConeGeometry(2, 46, 12, 1, true);
    g.rotateZ(Math.PI / 2);
    g.translate(23, 0, 0);
    return g;
  }, []);
  useFrame(() => {
    if (beam.current) beam.current.rotation.y = motion.current.time * 0.7 + 1.2;
  });
  const rings: [number, number, THREE.Material][] = [
    [3.2, 3.0, MAT.white],
    [2.9, 3.0, MAT.red],
    [2.6, 3.0, MAT.white],
    [2.3, 3.0, MAT.red],
  ];
  let y = 0;
  const p = frame(ROUTE_LENGTH + 30, -35, 0);
  return (
    <group position={[p.x, 0, p.z]}>
      <mesh geometry={SPHERE} material={MAT.rock} scale={[9, 3.6, 8]} position={[0, -0.8, 0]} />
      <mesh geometry={SPHERE} material={MAT.rock} scale={[5, 2.4, 5]} position={[5, -0.4, 2]} />
      {rings.map(([r, h, m], i) => {
        const cy = y + h / 2 + 1.6;
        y += h;
        return <mesh key={i} geometry={CYL} material={m} scale={[r, h, r]} position={[0, cy, 0]} />;
      })}
      <mesh geometry={CYL} material={MAT.woodDark} scale={[2.6, 0.3, 2.6]} position={[0, y + 1.75, 0]} />
      <mesh geometry={CYL} material={MAT.glow} scale={[1.4, 1.6, 1.4]} position={[0, y + 2.7, 0]} />
      <mesh geometry={CONE} material={MAT.red} scale={[1.9, 1.5, 1.9]} position={[0, y + 4.25, 0]} />
      <group ref={beam} position={[0, y + 2.7, 0]}>
        <mesh geometry={beamGeo} material={MAT.beam} />
        <mesh geometry={beamGeo} material={MAT.beam} rotation={[0, Math.PI, 0]} />
      </group>
    </group>
  );
}

function Pousada() {
  const s = STOPS[4].t * ROUTE_LENGTH;
  const windows = useMemo(() => {
    const out: V3[] = [];
    for (let row = 0; row < 2; row++) for (let col = 0; col < 5; col++) out.push([-5.6 + col * 2.8, 1.7 + row * 3.1, 3.55]);
    return out;
  }, []);
  return (
    <Spot s={s + 6} lateral={24}>
      <group rotation={[0, Math.PI / 2, 0]}>
        <Box p={[0, 3.2, 0]} s={[15, 6.4, 7]} m={MAT.wall} />
        <mesh geometry={ROOF} material={MAT.roof} position={[0, 6.4, 0]} scale={[2.15, 1.15, 1.3]} />
        {windows.map((p, i) => (
          <Box key={i} p={p} s={[1.2, 1.5, 0.12]} m={MAT.glow} />
        ))}
        <Box p={[0, 1.2, 3.58]} s={[1.9, 2.4, 0.14]} m={MAT.door} />
        <Box p={[0, 3.1, 4.3]} s={[3.4, 0.18, 1.6]} m={MAT.woodDark} />
        <Box p={[0, 0.2, 4.4]} s={[6, 0.3, 2]} m={MAT.wood} />
      </group>
      <Palm p={[-3, 0, 12]} s={1.3} ry={0.8} />
      <Palm p={[-3, 0, -12]} s={1.2} ry={2.2} />
    </Spot>
  );
}

/* ------------------------------------------------------------------ */
/* Carro (conversível retrô) e câmera                                   */
/* ------------------------------------------------------------------ */

const LANE = 2.3;
const SHOULDER = 5.6;
const PAD = 9.6;

const BEAM_GEO = (() => {
  const g = new THREE.ConeGeometry(1.5, 11, 10, 1, true);
  g.rotateX(-Math.PI / 2);
  g.translate(0, 0, 5.5);
  return g;
})();

function Car({ motion }: { motion: RefObject<Motion> }) {
  const group = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const wheels = useRef<(THREE.Group | null)[]>([]);

  useFrame((_, dt) => {
    const m = motion.current;
    const g = group.current;
    if (!g || !body.current) return;
    frame(m.s, m.lateral, 0, g.position);
    g.rotation.y = yawAt(m.s);
    const speedN = Math.min(1, Math.abs(m.speed) / 40);
    body.current.position.y = 0.05 + Math.sin(m.time * 13) * 0.02 * speedN + Math.sin(m.time * 3) * 0.006;
    body.current.rotation.z = Math.sin(m.time * 9) * 0.008 * speedN;
    const spin = (m.speed * Math.min(dt, 0.05)) / 0.42;
    for (const wheel of wheels.current) if (wheel) wheel.rotation.x += spin;
  });

  const wheelAt: V3[] = [[-1, 0.42, 1.45], [1, 0.42, 1.45], [-1, 0.42, -1.45], [1, 0.42, -1.45]];
  return (
    <group ref={group}>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.5, 2.6, 1]}>
        <circleGeometry args={[1, 18]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.28} depthWrite={false} polygonOffset polygonOffsetFactor={-6} polygonOffsetUnits={-6} />
      </mesh>
      <group ref={body}>
        <Box p={[0, 0.62, 0]} s={[2, 0.62, 4.5]} m={MAT.coral} />
        <Box p={[0, 0.98, 1.55]} s={[1.9, 0.18, 1.3]} m={MAT.coral} />
        <Box p={[0, 0.98, -1.6]} s={[1.9, 0.18, 1.1]} m={MAT.coral} />
        <Box p={[0, 0.95, 0.1]} s={[1.7, 0.1, 1.9]} m={MAT.cream} />
        <Box p={[-0.8, 1.05, -1.95]} s={[0.16, 0.5, 0.9]} m={MAT.coral} r={[0.25, 0, 0]} />
        <Box p={[0.8, 1.05, -1.95]} s={[0.16, 0.5, 0.9]} m={MAT.coral} r={[0.25, 0, 0]} />
        <Box p={[0, 1.28, 0.75]} s={[1.85, 0.62, 0.07]} m={MAT.glass} r={[-0.42, 0, 0]} />
        <Box p={[-0.5, 1.2, -0.45]} s={[0.7, 0.55, 0.7]} m={MAT.cream} />
        <Box p={[0.5, 1.2, -0.45]} s={[0.7, 0.55, 0.7]} m={MAT.cream} />
        <Box p={[0, 0.42, 2.28]} s={[2.1, 0.2, 0.2]} m={MAT.chrome} />
        <Box p={[0, 0.42, -2.28]} s={[2.1, 0.2, 0.2]} m={MAT.chrome} />
        <mesh geometry={SPHERE} material={MAT.glow} position={[-0.7, 0.82, 2.25]} scale={0.17} />
        <mesh geometry={SPHERE} material={MAT.glow} position={[0.7, 0.82, 2.25]} scale={0.17} />
        <mesh geometry={BEAM_GEO} material={MAT.beam} position={[-0.7, 0.82, 2.3]} />
        <mesh geometry={BEAM_GEO} material={MAT.beam} position={[0.7, 0.82, 2.3]} />
        <group position={[0.35, 1.35, -1.6]} rotation={[-0.35, 0, 0.06]}>
          <mesh geometry={SPHERE} material={MAT.teal} scale={[0.2, 0.04, 1.4]} />
        </group>
      </group>
      {wheelAt.map((p, i) => (
        <group key={i} position={p}>
          <group ref={(node) => { wheels.current[i] = node; }}>
            <mesh geometry={CYL} material={MAT.tyre} rotation={[0, 0, Math.PI / 2]} scale={[0.42, 0.32, 0.42]} />
            <mesh geometry={CYL} material={MAT.chrome} rotation={[0, 0, Math.PI / 2]} scale={[0.22, 0.34, 0.22]} />
            <Box p={[0, 0.32, 0]} s={[0.36, 0.1, 0.1]} m={MAT.tyre} />
          </group>
        </group>
      ))}
    </group>
  );
}

type CamView = { behind: number; lat: number; y: number; ahead: number; lookLat: number; lookY: number };
const MOVE: CamView = { behind: 10.5, lat: -0.5, y: 3.8, ahead: 14, lookLat: 1.5, lookY: 1.3 };
const VIEWS: (CamView | null)[] = [
  null,
  { behind: 3, lat: -9, y: 3.4, ahead: 7, lookLat: 17, lookY: 2.2 },
  { behind: 3, lat: 13, y: 3.4, ahead: 6, lookLat: -17, lookY: 1.6 },
  { behind: 3, lat: -9, y: 3.2, ahead: 8, lookLat: 19, lookY: 2.2 },
  { behind: 12, lat: -4, y: 4.4, ahead: 12, lookLat: 9, lookY: 3 },
];

type RigScratch = { pos: THREE.Vector3; look: THREE.Vector3; smooth: THREE.Vector3; started: boolean };

function stepRig(tmp: RigScratch, camera: THREE.Camera, m: Motion, dt: number) {
  const v = { ...MOVE };
  for (let i = 1; i < VIEWS.length; i++) {
    const view = VIEWS[i];
    const d = dwellOf(m.t, i);
    if (!view || d <= 0) continue;
    v.behind += (view.behind - MOVE.behind) * d;
    v.lat += (view.lat - MOVE.lat) * d;
    v.y += (view.y - MOVE.y) * d;
    v.ahead += (view.ahead - MOVE.ahead) * d;
    v.lookLat += (view.lookLat - MOVE.lookLat) * d;
    v.lookY += (view.lookY - MOVE.lookY) * d;
  }
  frame(m.s - v.behind, v.lat, v.y, tmp.pos);
  frame(m.s + v.ahead, v.lookLat, v.lookY, tmp.look);
  const k = tmp.started ? 1 - Math.exp(-Math.min(dt, 0.05) * 4.5) : 1;
  camera.position.lerp(tmp.pos, k);
  if (!tmp.started) tmp.smooth.copy(tmp.look);
  tmp.smooth.lerp(tmp.look, k);
  camera.lookAt(tmp.smooth);
  tmp.started = true;
}

function Rig({ motion }: { motion: RefObject<Motion> }) {
  const tmp = useMemo<RigScratch>(() => ({ pos: new THREE.Vector3(), look: new THREE.Vector3(), smooth: new THREE.Vector3(), started: false }), []);
  useFrame((state, dt) => stepRig(tmp, state.camera, motion.current, dt));
  return null;
}

/* ------------------------------------------------------------------ */

function Scene({ route, still, low }: { route: RefObject<RouteState>; still: boolean; low: boolean }) {
  const motion = useRef<Motion>({ t: 0, s: 0, speed: 0, lateral: LANE, time: 0, ready: false });

  useFrame((_, dt) => {
    const m = motion.current;
    const delta = Math.min(dt, 0.05);
    const target = route.current.t;
    if (!m.ready) {
      m.t = target;
      m.ready = true;
    }
    if (!still) m.time += delta;
    const before = m.s;
    m.t += (target - m.t) * (1 - Math.exp(-delta * 5));
    m.s = m.t * ROUTE_LENGTH;
    const velocity = delta > 0 ? (m.s - before) / delta : 0;
    m.speed += (velocity - m.speed) * (1 - Math.exp(-delta * 8));
    let pull = 0;
    for (let i = 1; i < STOPS.length; i++) pull = Math.max(pull, dwellOf(m.t, i));
    m.lateral = LANE + (SHOULDER - LANE) * pull + (PAD - SHOULDER) * dwellOf(m.t, STOPS.length - 1);
  }, -1);

  return (
    <>
      <Atmosphere motion={motion} still={still} />
      <Ground motion={motion} />
      <Scenery low={low} still={still} motion={motion} />
      <Quartos />
      <Passeios motion={motion} />
      <Mesa />
      <Pousada />
      <Lighthouse motion={motion} />
      <Car motion={motion} />
      <Rig motion={motion} />
    </>
  );
}

export default function LitoralScene({ route, still, low }: { route: RefObject<RouteState>; still: boolean; low: boolean }) {
  return (
    <Canvas
      flat
      dpr={low ? 1 : [1, 1.75]}
      camera={{ fov: 52, near: 0.5, far: 760, position: [0, 4, 8] }}
      gl={{ antialias: !low, powerPreference: "high-performance" }}
    >
      <Scene route={route} still={still} low={low} />
    </Canvas>
  );
}
