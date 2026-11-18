"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, useTexture } from "@react-three/drei";
import { Suspense, useEffect, useRef, type RefObject } from "react";
import { AdditiveBlending, Shape, SRGBColorSpace, type Group, type Texture } from "three";
import { heroScreenshots, type HeroDeviceMode } from "./hero-templates";

type HeroPointer = RefObject<{ x: number; y: number; inside: boolean }>;

function roundedShape(width: number, height: number, radius: number) {
  const shape = new Shape();
  const x = -width / 2, y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

const phoneBody = roundedShape(1.35, 2.78, .16);
const phoneBezel = roundedShape(1.29, 2.72, .145);
const phoneExtrusion = { depth: .1, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: .008, bevelThickness: .008, curveSegments: 6 };

function PhoneMockup({ texture, mask }: { texture: Texture; mask: Texture }) {
  return <group>
    <mesh position={[0, 0, -.05]}><extrudeGeometry args={[phoneBody, phoneExtrusion]} /><meshStandardMaterial color="#45566c" metalness={.8} roughness={.28} /></mesh>
    <mesh position={[0, 0, .061]}><shapeGeometry args={[phoneBezel]} /><meshBasicMaterial color="#06090e" /></mesh>
    <mesh position={[0, 0, .068]}><planeGeometry args={[1.23, 2.64]} /><meshBasicMaterial map={texture} alphaMap={mask} alphaTest={.5} toneMapped={false} /></mesh>
    <RoundedBox args={[.34, .09, .014]} radius={.006} smoothness={2} position={[0, 1.23, .08]}><meshBasicMaterial color="#05070b" /></RoundedBox>
    <mesh position={[.11, 1.23, .09]}><circleGeometry args={[.018, 12]} /><meshBasicMaterial color="#19384c" /></mesh>
    <RoundedBox args={[.38, .018, .006]} radius={.002} smoothness={2} position={[0, -1.25, .08]}><meshBasicMaterial color="#e5eaf0" /></RoundedBox>
    <RoundedBox args={[.025, .25, .05]} radius={.01} smoothness={2} position={[-.682, .49, 0]}><meshStandardMaterial color="#8191a5" metalness={.8} roughness={.3} /></RoundedBox>
    {[[-.39, 1.08], [-.17, .94], [-.39, .8]].map(([x, y], i) => <mesh key={i} position={[x, y, -.065]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.085, .085, .025, 16]} /><meshStandardMaterial color="#09111d" metalness={.8} roughness={.15} /></mesh>)}
  </group>;
}

function NotebookMockup({ texture }: { texture: Texture }) {
  return <group>
    <group position={[0, .16, 0]} rotation={[-.1, 0, 0]}>
      <RoundedBox args={[2.94, 1.91, .12]} radius={.045} smoothness={2}><meshStandardMaterial color="#52637a" metalness={.85} roughness={.25} /></RoundedBox>
      <mesh position={[0, 0, .064]}><planeGeometry args={[2.84, 1.81]} /><meshBasicMaterial color="#05090e" /></mesh>
      <mesh position={[0, -.01, .068]}><planeGeometry args={[2.7, 1.6875]} /><meshBasicMaterial map={texture} toneMapped={false} /></mesh>
      <mesh position={[0, .9, .07]}><circleGeometry args={[.018, 12]} /><meshBasicMaterial color="#89afc5" /></mesh>
    </group>
  </group>;
}

function CameraRig({ mode }: { mode: HeroDeviceMode }) {
  const { camera, invalidate, size } = useThree();
  useEffect(() => {
    const fit = Math.max(1, 1.08 / (Math.max(size.width, 1) / Math.max(size.height, 1)));
    camera.position.set(0, (mode === "notebook" ? 4.3 : 3.6) * fit, (mode === "notebook" ? 11.6 : 9.8) * fit);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, invalidate, mode, size.width, size.height]);
  return null;
}

function TemplateRing({ active, mode, onReady, input }: { active: boolean; mode: HeroDeviceMode; onReady?: (ready: boolean) => void; input?: HeroPointer }) {
  const group = useRef<Group>(null);
  const textures = useTexture(heroScreenshots(mode), maps => {
    for (const texture of maps) {
      texture.colorSpace = SRGBColorSpace;
      texture.anisotropy = 4;
      const image = texture.image as HTMLImageElement;
      const aspect = image.width / image.height;
      const screenAspect = mode === "phone" ? 1.23 / 2.64 : 1.6;
      texture.repeat.set(1, 1); texture.offset.set(0, 0);
      if (aspect < screenAspect) {
        texture.repeat.y = aspect / screenAspect;
        texture.offset.y = 1 - texture.repeat.y;
      } else {
        texture.repeat.x = screenAspect / aspect;
        texture.offset.x = (1 - texture.repeat.x) / 2;
      }
    }
  });
  const [mask, glow] = useTexture(["/images/hero-devices/screen-mask.svg", "/images/hero-devices/core-glow.svg"]);
  const rotation = useRef(-.28);
  const speed = useRef(.13);
  const follow = useRef({ x: 0, y: 0 });
  useEffect(() => { onReady?.(true); return () => onReady?.(false); }, [onReady, mode]);
  useFrame(({ pointer }, delta) => {
    if (!group.current || !active) return;
    const dt = Math.min(delta, .05);
    const target = input?.current ?? pointer;
    const ease = 1 - Math.exp(-dt * 4.5);
    follow.current.x += (target.x - follow.current.x) * ease;
    follow.current.y += (target.y - follow.current.y) * ease;
    const targetSpeed = input?.current.inside ? (Math.abs(target.x) < .06 ? 0 : target.x * .65) : .13;
    speed.current += (targetSpeed - speed.current) * (1 - Math.exp(-dt * 3));
    rotation.current += dt * speed.current;
    group.current.rotation.set(follow.current.y * .2, rotation.current + follow.current.x * .18, .025 - follow.current.x * .06);
    group.current.position.set(follow.current.x * .14, follow.current.y * .08, 0);
  });
  const count = mode === "notebook" ? 6 : 10;
  const radius = mode === "notebook" ? 3.12 : 2.85;
  return <>
    <CameraRig mode={mode} />
    <sprite position={[0, 1.02, 0]} scale={[4.5, 4.5, 1]}><spriteMaterial map={glow} blending={AdditiveBlending} transparent depthWrite={false} toneMapped={false} /></sprite>
    <pointLight position={[0, .7, 0]} intensity={22} distance={7} color="#9aeaff" />
    <group ref={group} rotation={[0, -.28, .025]}>{Array.from({ length: count }, (_, i) => {
      const angle = i / count * Math.PI * 2;
      return <group key={`${mode}-${i}`} position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]} rotation={[0, angle, 0]}>
        {mode === "phone" ? <PhoneMockup texture={textures[i % textures.length]} mask={mask} /> : <NotebookMockup texture={textures[i % textures.length]} />}
      </group>;
    })}</group>
  </>;
}

export default function ChaosScene({ active = true, mode = "phone", onReady, input }: { active?: boolean; mode?: HeroDeviceMode; onReady?: (ready: boolean) => void; input?: HeroPointer }) {
  return <Canvas frameloop={active ? "always" : "demand"} dpr={[1, 1.5]} camera={{ position: [0, 3.6, 9.8], fov: 39 }} gl={{ alpha: true, antialias: true }} onCreated={({ camera }) => camera.lookAt(0, 0, 0)} fallback={<span />}>
    <ambientLight intensity={1.4} />
    <directionalLight position={[3, 5, 5]} intensity={4} color="#d8e5ff" />
    <pointLight position={[-4, 1, -2]} intensity={14} color="#3459ff" />
    <Suspense fallback={null}><TemplateRing active={active} mode={mode} onReady={onReady} input={input} /></Suspense>
  </Canvas>;
}
