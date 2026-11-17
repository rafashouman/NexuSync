"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

function Sculpture() {
  const group = useRef<Group>(null);
  useFrame(({ clock, pointer }, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.16;
    group.current.rotation.x = Math.sin(clock.elapsedTime * 0.3) * 0.18 + pointer.y * 0.18;
    group.current.position.x += (pointer.x * 0.25 - group.current.position.x) * 0.025;
  });
  return <group ref={group} rotation={[0.4, 0, -0.4]}>
    <mesh rotation={[0.6, 0.3, 0]}><torusKnotGeometry args={[1.45, 0.39, 160, 24, 2, 3]} /><meshStandardMaterial color="#3459ff" metalness={0.65} roughness={0.23} /></mesh>
    <mesh rotation={[1.2, 0.4, 0.6]}><torusGeometry args={[2.25, 0.035, 12, 100]} /><meshBasicMaterial color="#d4ff38" /></mesh>
    <mesh position={[1.8, 1.1, 0.6]}><icosahedronGeometry args={[0.32, 0]} /><meshStandardMaterial color="#d4ff38" metalness={0.25} roughness={0.2} /></mesh>
    <mesh position={[-1.75, -1.2, 0]} rotation={[0.5, 0.5, 0]}><boxGeometry args={[0.36, 0.36, 0.36]} /><meshStandardMaterial color="#10b981" /></mesh>
  </group>;
}

export default function ChaosScene({ active = true }: { active?: boolean }) {
  return <Canvas frameloop={active ? "always" : "never"} dpr={[1, 1.5]} camera={{ position: [0, 0, 6.7], fov: 45 }} gl={{ alpha: true, antialias: true }} fallback={<span />}>
    <ambientLight intensity={1.5} /><directionalLight position={[3, 4, 5]} intensity={5} color="#c8d8ff" /><pointLight position={[-4, -2, 2]} intensity={22} color="#10b981" /><Sculpture />
  </Canvas>;
}
