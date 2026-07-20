"use client";

import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text3D, MeshReflectorMaterial, Environment } from "@react-three/drei";
import * as THREE from "three";

const LETTERS = ["A", "M", "I", "S", "T", "R", "I", "E"];
const FONT_URL = "/fonts/helvetiker_bold.typeface.json";
const LETTER_SIZE = 0.62;
const KERNING = 0.1;

const RELATIVE_WIDTH: Record<string, number> = {
  A: 0.66,
  M: 0.82,
  I: 0.26,
  S: 0.6,
  T: 0.58,
  R: 0.62,
  E: 0.58,
};

function smoothstep(t: number) {
  const c = THREE.MathUtils.clamp(t, 0, 1);
  return c * c * (3 - 2 * c);
}

const SCATTER = LETTERS.map((_, i) => {
  const angle = (i / LETTERS.length) * Math.PI * 2 + i * 0.9;
  const radius = 2.6 + ((i * 37) % 5) * 0.24;
  return {
    pos: [Math.cos(angle) * radius, 0.6 + Math.sin(i * 2.1) * 1.7, Math.sin(angle) * radius - 0.6] as [number, number, number],
    rot: [(i * 0.9) % (Math.PI * 2), (i * 1.7) % (Math.PI * 2), (i * 0.5) % (Math.PI * 2)] as [number, number, number],
  };
});

const FINAL_X: number[] = (() => {
  const widths = LETTERS.map((c) => RELATIVE_WIDTH[c] * LETTER_SIZE);
  const centers: number[] = [];
  let running = 0;
  for (const w of widths) {
    centers.push(running + w / 2);
    running += w + KERNING;
  }
  const totalWidth = running - KERNING;
  return centers.map((c) => c - totalWidth / 2);
})();

function Letter({ index, char, progress }: { index: number; char: string; progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const finalX = FINAL_X[index];
  const scatter = SCATTER[index];

  const windowStart = (index / (LETTERS.length - 1)) * 0.45;
  const windowEnd = windowStart + 0.4;
  const localT = smoothstep((progress - windowStart) / (windowEnd - windowStart));

  const material = useMemo(() => {
    if (index === 0) {
      return new THREE.MeshPhysicalMaterial({ color: "#2997ff", metalness: 0.5, roughness: 0.15, clearcoat: 1 });
    }
    if (index === 1) {
      return new THREE.MeshPhysicalMaterial({ color: "#bf5af2", metalness: 0.5, roughness: 0.15, clearcoat: 1 });
    }
    return new THREE.MeshPhysicalMaterial({ color: "#1d1d1f", metalness: 0.3, roughness: 0.25, clearcoat: 0.6 });
  }, [index]);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.x = THREE.MathUtils.lerp(scatter.pos[0], finalX, localT);
    groupRef.current.position.y = THREE.MathUtils.lerp(scatter.pos[1], 0.3, localT);
    groupRef.current.position.z = THREE.MathUtils.lerp(scatter.pos[2], 0, localT);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(scatter.rot[0], 0, localT);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(scatter.rot[1], 0, localT);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(scatter.rot[2], 0, localT);
    const scale = 0.3 + localT * 0.7;
    groupRef.current.scale.setScalar(scale);
  });

  const halfWidth = (RELATIVE_WIDTH[char] * LETTER_SIZE) / 2;

  return (
    <group ref={groupRef}>
      <group position={[-halfWidth, -LETTER_SIZE / 2, 0]}>
        <Text3D font={FONT_URL} size={LETTER_SIZE} height={0.18} curveSegments={8} bevelEnabled bevelThickness={0.02} bevelSize={0.015} bevelSegments={3} castShadow>
          {char}
          <primitive object={material} attach="material" />
        </Text3D>
      </group>
    </group>
  );
}

function IntroLetters({ progress }: { progress: number }) {
  return (
    <>
      {LETTERS.map((char, i) => (
        <Letter key={i} index={i} char={char} progress={progress} />
      ))}
    </>
  );
}

function Rig({ progress }: { progress: number }) {
  useFrame((state) => {
    // A slow, subtle dolly-in as the letters assemble — reads as cinematic
    // without being disorienting in such a short sequence.
    const z = THREE.MathUtils.lerp(6.2, 4.6, smoothstep(progress));
    state.camera.position.set(0, 0.6, z);
    state.camera.lookAt(0, 0.3, 0);
  });
  return null;
}

export function IntroScene() {
  const [progress, setProgress] = useState(0);
  const start = useRef<number | null>(null);

  useEffect(() => {
    let raf: number;
    const DURATION = 1650; // ms — the full scatter-to-assembled animation
    const tick = (t: number) => {
      if (start.current === null) start.current = t;
      const elapsed = t - start.current;
      setProgress(Math.min(1, elapsed / DURATION));
      if (elapsed < DURATION) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.6, 6.2], fov: 40 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <color attach="background" args={["#ffffff"]} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} castShadow />
      <directionalLight position={[-4, 2, -3]} intensity={0.35} color="#bf5af2" />
      <Environment preset="studio" environmentIntensity={0.4} />

      <Rig progress={progress} />
      <Suspense fallback={null}>
        <IntroLetters progress={progress} />
      </Suspense>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[12, 12]} />
        <MeshReflectorMaterial
          blur={[260, 60]}
          resolution={512}
          mixBlur={1}
          mixStrength={20}
          roughness={0.95}
          depthScale={1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.2}
          color="#f5f5f7"
          metalness={0.3}
          mirror={0}
        />
      </mesh>
    </Canvas>
  );
}
