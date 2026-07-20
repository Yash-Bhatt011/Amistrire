"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type ShapeKind = "torusKnot" | "stackedRings" | "gear" | "vase" | "spool" | "facetedGem";

type ShapeDef = {
  position: [number, number, number];
  scale: number;
  color: string;
  kind: ShapeKind;
  floatSpeed: number;
  floatAmount: number;
  spinSpeed: [number, number];
};

// Scattered toward the edges (matching the reference composition), leaving
// the center clear for the headline/CTA content. Forms echo the same family
// used in the rotating showcase further down the page, so the hero reads as
// "our products," not generic geometry.
const SHAPES: ShapeDef[] = [
  { position: [-3.5, 1.5, -0.5], scale: 0.85, color: "#2997ff", kind: "torusKnot", floatSpeed: 0.6, floatAmount: 0.18, spinSpeed: [0.25, 0.35] },
  { position: [3.4, 1.7, -0.8], scale: 0.9, color: "#bf5af2", kind: "gear", floatSpeed: 0.5, floatAmount: 0.2, spinSpeed: [0.2, 0.3] },
  { position: [-3.7, -1.4, -1], scale: 0.9, color: "#1d1d1f", kind: "spool", floatSpeed: 0.7, floatAmount: 0.15, spinSpeed: [0.15, 0.25] },
  { position: [3.6, -1.3, -0.6], scale: 0.85, color: "#2997ff", kind: "vase", floatSpeed: 0.55, floatAmount: 0.22, spinSpeed: [0.2, 0.28] },
  { position: [-2.2, -2.2, 0.3], scale: 0.65, color: "#bf5af2", kind: "stackedRings", floatSpeed: 0.8, floatAmount: 0.14, spinSpeed: [0.3, 0.2] },
  { position: [2.3, 2.3, 0.2], scale: 0.6, color: "#1d1d1f", kind: "facetedGem", floatSpeed: 0.65, floatAmount: 0.16, spinSpeed: [0.28, 0.32] },
];

function Shape({ def, disabled }: { def: ShapeDef; disabled: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const phase = useRef(Math.random() * Math.PI * 2);

  useFrame((state, delta) => {
    if (!ref.current || disabled) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = def.position[1] + Math.sin(t * def.floatSpeed + phase.current) * def.floatAmount;
    ref.current.rotation.x += delta * def.spinSpeed[0];
    ref.current.rotation.y += delta * def.spinSpeed[1];
  });

  const material = (
    <meshPhysicalMaterial color={def.color} roughness={0.25} metalness={0.2} clearcoat={0.5} clearcoatRoughness={0.3} />
  );

  return (
    <group ref={ref} position={def.position} scale={def.scale}>
      {def.kind === "torusKnot" && (
        <mesh castShadow>
          <torusKnotGeometry args={[0.32, 0.11, 128, 24]} />
          {material}
        </mesh>
      )}
      {def.kind === "gear" && (
        <mesh castShadow rotation={[0.3, 0.2, 0]}>
          <dodecahedronGeometry args={[0.4, 0]} />
          {material}
        </mesh>
      )}
      {def.kind === "vase" && (
        <mesh castShadow>
          <coneGeometry args={[0.34, 0.62, 24, 1, true]} />
          {material}
        </mesh>
      )}
      {def.kind === "spool" && (
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
      )}
      {def.kind === "stackedRings" && (
        <group>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[0, i * 0.16 - 0.16, 0]} castShadow>
              <torusGeometry args={[0.32 - i * 0.06, 0.05, 16, 32]} />
              {material}
            </mesh>
          ))}
        </group>
      )}
      {def.kind === "facetedGem" && (
        <mesh castShadow rotation={[0.4, 0.4, 0]}>
          <icosahedronGeometry args={[0.4, 0]} />
          {material}
        </mesh>
      )}
    </group>
  );
}

export function FloatingProducts({ mobile }: { mobile: boolean }) {
  const reducedMotion = useReducedMotion();
  const shapes = mobile ? SHAPES.filter((_, i) => i % 2 === 0) : SHAPES;

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
        <Environment preset="city" environmentIntensity={0.4} />
        {shapes.map((def, i) => (
          <Shape key={i} def={def} disabled={reducedMotion} />
        ))}
      </Suspense>
    </Canvas>
  );
}
