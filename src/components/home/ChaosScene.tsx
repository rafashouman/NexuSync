"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, useTexture } from "@react-three/drei";
import { Suspense, useEffect, useRef, type RefObject } from "react";
import { SRGBColorSpace, type Group } from "three";

const screenshots = [
  "imobiliaria", "cardapio", "academias", "streetwear",
  "arquitetura", "dog-e-acai", "carros", "miniaturas",
].map(slug => `/images/hero-templates/${slug}.jpg`);

type HeroPointer = RefObject<{ x: number; y: number }>;

function TemplateRing({ onReady, input }: { onReady?: (ready: boolean) => void; input?: HeroPointer }) {
  const group = useRef<Group>(null);
  const textures = useTexture(screenshots, maps => {
    for (const texture of maps) {
      texture.colorSpace = SRGBColorSpace;
      texture.anisotropy = 4;
    }
  });
  const rotation = useRef(-0.28);
  const follow = useRef({ x: 0, y: 0 });
  useEffect(() => { onReady?.(true); return () => onReady?.(false); }, [onReady]);
  useFrame(({ pointer }, delta) => {
    if (!group.current) return;
    const dt = Math.min(delta, 0.05);
    const target = input?.current ?? pointer;
    const ease = 1 - Math.exp(-dt * 4.5);
    follow.current.x += (target.x - follow.current.x) * ease;
    follow.current.y += (target.y - follow.current.y) * ease;
    rotation.current += dt * 0.13;
    group.current.rotation.set(follow.current.y * .26, rotation.current + follow.current.x * .5, .035 - follow.current.x * .08);
    group.current.position.set(follow.current.x * .17, follow.current.y * .1, 0);
  });
  return <group ref={group} rotation={[0, -0.28, 0.035]}>
    {Array.from({ length: 12 }, (_, i) => {
      const angle = i / 12 * Math.PI * 2;
      return <group key={i} position={[Math.sin(angle) * 2.62, 0, Math.cos(angle) * 2.62]} rotation={[0, angle, 0]}>
        <RoundedBox args={[1.025, 2.78, 0.1]} radius={0.035} smoothness={2}>
          <meshStandardMaterial color={i % 3 === 0 ? "#3459ff" : "#1d3158"} metalness={0.65} roughness={0.3} />
        </RoundedBox>
        <mesh position={[0, 0, 0.056]}>
          <planeGeometry args={[0.965, 2.67]} />
          <meshBasicMaterial map={textures[i % textures.length]} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0, -0.056]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.965, 2.67]} />
          <meshBasicMaterial map={textures[i % textures.length]} toneMapped={false} color="#a1aec9" />
        </mesh>
        <mesh position={[0, -1.358, 0.058]}>
          <planeGeometry args={[0.4, 0.018]} />
          <meshBasicMaterial color={i % 3 === 0 ? "#d4ff38" : "#3459ff"} toneMapped={false} />
        </mesh>
      </group>;
    })}
  </group>;
}

export default function ChaosScene({ active = true, onReady, input }: { active?: boolean; onReady?: (ready: boolean) => void; input?: HeroPointer }) {
  return <Canvas frameloop={active ? "always" : "never"} dpr={[1, 1.5]} camera={{ position: [0, 3.6, 9.5], fov: 39 }} gl={{ alpha: true, antialias: true }} onCreated={({ camera }) => camera.lookAt(0, 0, 0)} fallback={<span />}>
    <ambientLight intensity={1.5} />
    <directionalLight position={[3, 5, 5]} intensity={4} color="#c8d8ff" />
    <pointLight position={[-4, 1, -2]} intensity={16} color="#3459ff" />
    <Suspense fallback={null}><TemplateRing onReady={onReady} input={input} /></Suspense>
  </Canvas>;
}
