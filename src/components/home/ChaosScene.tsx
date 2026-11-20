"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, useTexture } from "@react-three/drei";
import { Suspense, useEffect, useRef, type RefObject } from "react";
import { AdditiveBlending, Shape, SRGBColorSpace, type Group, type Texture } from "three";
import { heroScreenshots, heroTemplates, type HeroDeviceMode } from "./hero-templates";

export type HeroPointer = RefObject<{
  x: number;
  y: number;
  inside: boolean;
  dragging: boolean;
  dragDelta: number;
  throwVelocity: number;
  throwRevision: number;
}>;

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

function OrbitSignal() {
  const logoCore = useRef<Group>(null);
  const innerOrbit = useRef<Group>(null);
  const outerOrbit = useRef<Group>(null);
  const pulse = useRef(0);
  const logo = useTexture("/images/icon.png", texture => {
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 4;
  });
  useFrame(({ pointer }, delta) => {
    if (!logoCore.current || !innerOrbit.current || !outerOrbit.current) return;
    const ease = 1 - Math.exp(-delta * 5);
    logoCore.current.rotation.x += (-.08 + pointer.y * .12 - logoCore.current.rotation.x) * ease;
    logoCore.current.rotation.y += (-.28 - pointer.x * .2 - logoCore.current.rotation.y) * ease;
    logoCore.current.rotation.z += (-.04 + pointer.x * .025 - logoCore.current.rotation.z) * ease;
    innerOrbit.current.rotation.z -= delta * .65;
    outerOrbit.current.rotation.y += delta * .22;
    pulse.current = Math.max(0, pulse.current - delta * 1.9);
    const pulseWave = Math.sin((1 - pulse.current) * Math.PI);
    logoCore.current.scale.setScalar(1.18 + Math.max(0, pulseWave) * .22);
  });
  const particles = Array.from({ length: 12 }, (_, index) => {
    const angle = index / 12 * Math.PI * 2;
    const radius = index % 2 ? .86 : 1.18;
    return <mesh key={index} position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}>
      <sphereGeometry args={[index % 3 ? .018 : .035, 10, 10]} />
      <meshBasicMaterial color={index % 3 ? "#56dfff" : "#ffb547"} transparent opacity={index % 3 ? .72 : .95} toneMapped={false} />
    </mesh>;
  });
  return <group position={[0, .15, .75]}>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[.48, .018, 10, 64]} />
      <meshBasicMaterial color="#ffb547" transparent opacity={.65} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
    </mesh>
    <group ref={innerOrbit} rotation={[.35, .55, 0]}>
      <mesh>
        <torusGeometry args={[.86, .009, 8, 72]} />
        <meshBasicMaterial color="#8be7c5" transparent opacity={.45} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      {particles}
    </group>
    <group ref={outerOrbit} rotation={[1.15, .15, 0]}>
      <mesh>
        <torusGeometry args={[1.18, .008, 8, 80]} />
        <meshBasicMaterial color="#3459ff" transparent opacity={.72} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
    <group
      ref={logoCore}
      rotation={[-.08, -.28, -.04]}
      scale={1.18}
      onClick={(event) => {
        event.stopPropagation();
        pulse.current = 1;
      }}
    >
      {Array.from({ length: 7 }, (_, index) => {
        const depth = 6 - index;
        return <mesh
          key={depth}
          position={[-depth * .026, -depth * .026, -depth * .026]}
        >
          <planeGeometry args={[1.12, 1.12]} />
          <meshBasicMaterial
            map={logo}
            color={index < 3 ? "#086b8a" : "#14b7c8"}
            transparent
            alphaTest={.05}
            toneMapped={false}
          />
        </mesh>;
      })}
      <mesh position={[0, 0, .025]}>
        <planeGeometry args={[1.12, 1.12]} />
        <meshBasicMaterial
          map={logo}
          transparent
          alphaTest={.05}
          toneMapped={false}
        />
      </mesh>
    </group>
  </group>;
}

function OrbitDevice({ texture, mask, mode, position, selected, onSelect }: {
  texture: Texture;
  mask: Texture;
  mode: HeroDeviceMode;
  position: [number, number, number];
  selected: boolean;
  onSelect: (point: { x: number; y: number }) => void;
}) {
  const device = useRef<Group>(null);
  useFrame((_, delta) => {
    if (!device.current) return;
    const targetScale = selected ? 1.45 : 1;
    const ease = 1 - Math.exp(-delta * 8);
    device.current.scale.x += (targetScale - device.current.scale.x) * ease;
    device.current.scale.y += (targetScale - device.current.scale.y) * ease;
    device.current.scale.z += (targetScale - device.current.scale.z) * ease;
  });
  return <group
    ref={device}
    position={position}
    onClick={(event) => {
      event.stopPropagation();
      onSelect({ x: event.nativeEvent.clientX, y: event.nativeEvent.clientY });
    }}
    onPointerOver={() => {
      document.body.style.cursor = "pointer";
    }}
    onPointerOut={() => {
      document.body.style.cursor = "";
    }}
  >
    {mode === "phone" ? <PhoneMockup texture={texture} mask={mask} /> : <NotebookMockup texture={texture} />}
  </group>;
}

function CameraRig({ mode, maximized = false }: { mode: HeroDeviceMode; maximized?: boolean }) {
  const { camera, invalidate, size } = useThree();
  useEffect(() => {
    const fit = Math.max(1, 1.08 / (Math.max(size.width, 1) / Math.max(size.height, 1)));
    const zoom = maximized ? 0.8 : 1;
    camera.position.set(0, (mode === "notebook" ? 4.3 : 3.6) * fit * zoom, (mode === "notebook" ? 11.6 : 9.8) * fit * zoom);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, invalidate, mode, maximized, size.width, size.height]);
  return null;
}

function TemplateRing({ active, mode, maximized = false, onReady, input, selectedTemplate, onSelectTemplate }: {
  active: boolean;
  mode: HeroDeviceMode;
  maximized?: boolean;
  onReady?: (ready: boolean) => void;
  input?: HeroPointer;
  selectedTemplate: string | null;
  onSelectTemplate: (slug: string | null, point?: { x: number; y: number }) => void;
}) {
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
  const mask = useTexture("/images/hero-devices/screen-mask.svg");
  const rotation = useRef(-.28);
  const speed = useRef(.13);
  const follow = useRef({ x: 0, y: 0 });
  const consumedDragDelta = useRef(0);
  const consumedThrowRevision = useRef(0);
  const count = heroTemplates(mode).length;
  const radius = mode === "notebook" ? 3.12 : 2.85;
  useEffect(() => {
    onReady?.(true);
    if (group.current) {
      group.current.updateMatrixWorld();
      for (const child of group.current.children) {
        child.quaternion.copy(group.current.quaternion).invert();
      }
    }
    return () => onReady?.(false);
  }, [onReady, mode]);
  useFrame(({ pointer }, delta) => {
    if (!group.current || !active) return;
    const dt = Math.min(delta, .05);
    const inputState = input?.current;
    const target = inputState ?? pointer;
    const ease = 1 - Math.exp(-dt * 4.5);
    follow.current.x += (target.x - follow.current.x) * ease;
    follow.current.y += (target.y - follow.current.y) * ease;
    if (inputState) {
      const dragDelta = inputState.dragDelta - consumedDragDelta.current;
      if (dragDelta !== 0) {
        rotation.current += dragDelta;
        consumedDragDelta.current = inputState.dragDelta;
      }
      if (inputState.throwRevision !== consumedThrowRevision.current) {
        speed.current = inputState.throwVelocity;
        consumedThrowRevision.current = inputState.throwRevision;
      }
    }
    if (inputState?.dragging || selectedTemplate) {
      speed.current = 0;
    } else {
      const targetSpeed = inputState?.inside ? (Math.abs(target.x) < .06 ? 0 : target.x * .65) : .13;
      const decay = Math.abs(speed.current) > .8 ? 1.65 : 3;
      speed.current += (targetSpeed - speed.current) * (1 - Math.exp(-dt * decay));
      rotation.current += dt * speed.current;
    }
    group.current.rotation.set(follow.current.y * .2, rotation.current + follow.current.x * .18, .025 - follow.current.x * .06);
    group.current.position.set(follow.current.x * .14, follow.current.y * .08, 0);
    for (const child of group.current.children) {
      child.quaternion.copy(group.current.quaternion).invert();
    }
  });
  return <>
    <CameraRig mode={mode} maximized={maximized} />
    <OrbitSignal />
    <group ref={group} rotation={[0, -.28, .025]}>{Array.from({ length: count }, (_, i) => {
      const angle = i / count * Math.PI * 2;
      const template = heroTemplates(mode)[i % textures.length];
      return <OrbitDevice
        key={`${mode}-${template}-${i}`}
        texture={textures[i % textures.length]}
        mask={mask}
        mode={mode}
        position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]}
        selected={selectedTemplate === template}
        onSelect={(point) => onSelectTemplate(selectedTemplate === template ? null : template, point)}
      />;
    })}</group>
  </>;
}

export default function ChaosScene({ active = true, mode = "notebook", maximized = false, onReady, input, selectedTemplate, onSelectTemplate }: {
  active?: boolean;
  mode?: HeroDeviceMode;
  maximized?: boolean;
  onReady?: (ready: boolean) => void;
  input?: HeroPointer;
  selectedTemplate: string | null;
  onSelectTemplate: (slug: string | null, point?: { x: number; y: number }) => void;
}) {
  return <Canvas frameloop={active ? "always" : "demand"} dpr={[1, 1.5]} camera={{ position: [0, 3.6, 9.8], fov: 39 }} gl={{ alpha: true, antialias: true }} onCreated={({ camera }) => camera.lookAt(0, 0, 0)} fallback={<span />}>
    <ambientLight intensity={1.4} />
    <directionalLight position={[3, 5, 5]} intensity={4} color="#d8e5ff" />
    <pointLight position={[-4, 1, -2]} intensity={14} color="#3459ff" />
    <Suspense fallback={null}><TemplateRing active={active} mode={mode} maximized={maximized} onReady={onReady} input={input} selectedTemplate={selectedTemplate} onSelectTemplate={onSelectTemplate} /></Suspense>
  </Canvas>;
}
