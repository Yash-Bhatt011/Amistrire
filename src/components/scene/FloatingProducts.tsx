"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useHeroShowcaseStore, type HeroSlot } from "@/lib/store/hero-showcase-store";

function CustomModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

function ShapeMesh({ kind, color }: { kind: HeroSlot["kind"]; color: string }) {
  const material = (
    <meshPhysicalMaterial color={color} roughness={0.25} metalness={0.2} clearcoat={0.5} clearcoatRoughness={0.3} />
  );

  switch (kind) {
    case "torusKnot":
      return (
        <mesh castShadow>
          <torusKnotGeometry args={[0.32, 0.11, 128, 24]} />
          {material}
        </mesh>
      );
    case "gear":
      return (
        <mesh castShadow rotation={[0.3, 0.2, 0]}>
          <dodecahedronGeometry args={[0.4, 0]} />
          {material}
        </mesh>
      );
    case "vase":
      return (
        <mesh castShadow>
          <coneGeometry args={[0.34, 0.62, 24, 1, true]} />
          {material}
        </mesh>
      );
    case "spool":
      return (
        <group>
          {[-0.16, 0.16].map((x) => (
            <mesh key={x} position={[x, 0, 0]} castShadow rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.32, 0.32, 0.06, 24]} />
              {material}
            </mesh>
          ))}
          <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.16, 0.16, 0.32, 24]} />
            {material}
          </mesh>
        </group>
      );
    case "stackedRings":
      return (
        <group>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[0, i * 0.16 - 0.16, 0]} castShadow>
              <torusGeometry args={[0.32 - i * 0.06, 0.05, 16, 32]} />
              {material}
            </mesh>
          ))}
        </group>
      );
    case "facetedGem":
    default:
      return (
        <mesh castShadow rotation={[0.4, 0.4, 0]}>
          <icosahedronGeometry args={[0.4, 0]} />
          {material}
        </mesh>
      );
  }
}

function Shape({ slot, disabled }: { slot: HeroSlot; disabled: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const phase = useRef(Math.random() * Math.PI * 2);

  useFrame((state, delta) => {
    if (!ref.current || disabled) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = slot.position[1] + Math.sin(t * slot.floatSpeed + phase.current) * slot.floatAmount;
    ref.current.rotation.x += delta * slot.spinSpeed[0];
    ref.current.rotation.y += delta * slot.spinSpeed[1];
  });

  return (
    <group ref={ref} position={slot.position} scale={slot.scale}>
      {slot.kind === "custom" && slot.customModelUrl ? (
        <Suspense fallback={<ShapeMesh kind="torusKnot" color={slot.color} />}>
          <CustomModel url={slot.customModelUrl} />
        </Suspense>
      ) : (
        <ShapeMesh kind={slot.kind} color={slot.color} />
      )}
    </group>
  );
}

export function FloatingProducts({ mobile }: { mobile: boolean }) {
  const reducedMotion = useReducedMotion();
  const allSlots = useHeroShowcaseStore((s) => s.slots ?? []);
  const slots = mobile ? allSlots.filter((_, i) => i % 2 === 0) : allSlots;

  return (
    <Canvas
      dpr={mobile ? [1, 1.5] : [1, 2]}
      camera={{ position: [0, 0, 7], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 5]} intensity={1.2} />
      <directionalLight position={[-4, -2, 3]} intensity={0.4} color="#bf5af2" />
      <Suspense fallback={null}>
       <Environment files="/potsdamer_platz_1k.hdr" />
        {slots.map((slot) => (
          <Shape key={slot.id} slot={slot} disabled={reducedMotion} />
        ))}
      </Suspense>
    </Canvas>
  );
}
