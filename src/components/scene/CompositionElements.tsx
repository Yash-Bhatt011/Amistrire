"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

const CYAN = "#2997ff";
const PURPLE = "#bf5af2";

/** Small mechanical gear built from a ring + radial teeth, fully procedural. */
function Gear({
  position,
  rotation = [0, 0, 0],
  radius = 0.16,
  teeth = 10,
  color = "#3a3f4a",
  speed = 0.4,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  radius?: number;
  teeth?: number;
  color?: string;
  speed?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * speed;
  });
  const toothArr = useMemo(() => Array.from({ length: teeth }, (_, i) => i), [teeth]);
  const toothMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color, metalness: 0.8, roughness: 0.35 }),
    [color]
  );

  return (
    <group position={position} rotation={rotation}>
      <group ref={ref}>
        <mesh castShadow>
          <cylinderGeometry args={[radius * 0.72, radius * 0.72, 0.03, 32]} />
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.35} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[radius * 0.2, radius * 0.2, 0.05, 16]} />
          <meshStandardMaterial color="#1d1d1f" metalness={0.6} roughness={0.4} />
        </mesh>
        {toothArr.map((i) => {
          const a = (i / teeth) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * radius * 0.88, Math.sin(a) * radius * 0.88, 0]}
              rotation={[0, 0, a]}
              material={toothMaterial}
            >
              <boxGeometry args={[radius * 0.22, radius * 0.16, 0.03]} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

/** Print-head nozzle: heater block + brass tip, with a faint heat-glow — a recognizable
 *  printing motif the spec calls out explicitly and the composition was missing. */
function Nozzle({
  position,
  rotation = [0, 0, 0],
  scale = 1,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * 0.45 + position[0]) * 0.04;
  });
  return (
    <group ref={ref} position={position} rotation={rotation} scale={scale}>
      {/* Heater block */}
      <mesh castShadow>
        <boxGeometry args={[0.09, 0.07, 0.09]} />
        <meshStandardMaterial color="#3a3f4a" metalness={0.85} roughness={0.3} />
      </mesh>
      {/* Heat-break */}
      <mesh position={[0, -0.055, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.04, 12]} />
        <meshStandardMaterial color="#8a8f99" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Brass nozzle tip */}
      <mesh position={[0, -0.09, 0]}>
        <coneGeometry args={[0.03, 0.05, 16]} />
        <meshStandardMaterial color="#c9a24b" metalness={0.9} roughness={0.25} emissive="#ff6a1a" emissiveIntensity={0.12} />
      </mesh>
      {/* Faint heat glow */}
      <pointLight position={[0, -0.1, 0]} color="#ff6a1a" intensity={0.35} distance={0.6} decay={2} />
    </group>
  );
}

/** Flat hexagon ring, wireframe — a recurring motif around the composition. */
function HexRing({
  position,
  rotation = [0, 0, 0],
  radius = 0.3,
  color = CYAN,
  speed = 0.06,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  radius?: number;
  color?: string;
  speed?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * speed;
  });
  return (
    <group position={position} rotation={rotation} ref={ref}>
      <mesh>
        <cylinderGeometry args={[radius, radius, 0.008, 6, 1, true]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

/** CAD-style wireframe primitive drifting slowly, evoking a blueprint model. */
function WireframeShape({
  position,
  kind = "box",
  size = 0.22,
  color = "#9aa3b2",
}: {
  position: [number, number, number];
  kind?: "box" | "icosahedron";
  size?: number;
  color?: string;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * 0.08;
    ref.current.rotation.y = t * 0.1;
    ref.current.position.y = position[1] + Math.sin(t * 0.5 + position[0]) * 0.06;
  });
  return (
    <group ref={ref} position={position}>
      <mesh>
        {kind === "box" ? <boxGeometry args={[size, size, size]} /> : <icosahedronGeometry args={[size, 0]} />}
        <meshBasicMaterial color={color} wireframe transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

/** Semi-transparent blueprint grid plane, tilted, drifting in the background. */
function BlueprintGrid({
  position,
  rotation,
  scale = 1.6,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
}) {
  const texture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, size, size);
    ctx.strokeStyle = "rgba(191, 90, 242,0.35)";
    ctx.lineWidth = 1;
    const step = size / 12;
    for (let i = 0; i <= 12; i++) {
      ctx.beginPath();
      ctx.moveTo(i * step, 0);
      ctx.lineTo(i * step, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * step);
      ctx.lineTo(size, i * step);
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[scale, scale]} />
      <meshBasicMaterial map={texture} transparent opacity={0.4} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

/** Broken build-plate fragments, drifting near the base. */
function PlateFragment({ position, rotation, size = [0.22, 0.15] }: { position: [number, number, number]; rotation: [number, number, number]; size?: [number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * 0.4 + position[2]) * 0.03;
  });
  return (
    <mesh ref={ref} position={position} rotation={rotation} castShadow>
      <boxGeometry args={[size[0], 0.01, size[1]]} />
      <meshStandardMaterial color="#1c1f24" metalness={0.2} roughness={0.6} emissive={CYAN} emissiveIntensity={0.08} />
    </mesh>
  );
}

/** Filament strand spiraling gently near the platform. */
function FilamentStrand({ color }: { color: string }) {
  const curve = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const angle = t * Math.PI * 5;
      const r = 1.3 - t * 0.5;
      pts.push(new THREE.Vector3(Math.cos(angle) * r, 0.1 + t * 0.9, Math.sin(angle) * r));
    }
    return new THREE.CatmullRomCurve3(pts);
  }, []);
  const geo = useMemo(() => new THREE.TubeGeometry(curve, 80, 0.006, 6, false), [curve]);
  return (
    <mesh geometry={geo}>
      <meshPhysicalMaterial color={color} roughness={0.3} metalness={0.05} transmission={0.4} transparent opacity={0.55} />
    </mesh>
  );
}

function HoloReadout({
  position,
  label,
  value,
}: {
  position: [number, number, number];
  label: string;
  value: string;
}) {
  return (
    <Html position={position} center distanceFactor={4} occlude={false}>
      <div
        className="glass-panel pointer-events-none select-none whitespace-nowrap rounded-md px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-white/70"
      >

        <span className="text-accent-cyan">{label}</span> {value}
      </div>
    </Html>
  );
}

export function CompositionElements({
  mobile,
  filamentColor,
  filamentLabel,
  printProgress,
}: {
  mobile: boolean;
  filamentColor: string;
  filamentLabel: string;
  printProgress: number;
}) {
  const ringGroupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ringGroupRef.current) ringGroupRef.current.rotation.y += delta * 0.03;
  });

  const layerCount = Math.max(1, Math.round(printProgress * 512));

  return (
    <group>
      {/* Large mechanical rings encircling the composition */}
      <group ref={ringGroupRef}>
        <mesh rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[1.9, 0.006, 8, 64]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.35} />
        </mesh>
        <mesh rotation={[Math.PI / 1.9, 0.4, 0]}>
          <torusGeometry args={[2.15, 0.005, 8, 64]} />
          <meshBasicMaterial color={PURPLE} transparent opacity={0.25} />
        </mesh>
      </group>

      {!mobile && (
        <>
          <Gear position={[-1.2, 0.5, 0.3]} rotation={[Math.PI / 2, 0.2, 0]} radius={0.16} teeth={10} speed={0.5} />
          <Gear position={[-1.05, 0.85, -0.4]} rotation={[Math.PI / 2, -0.3, 0.4]} radius={0.1} teeth={8} color="#4b5160" speed={-0.8} />
          <Gear position={[1.25, 0.35, -0.25]} rotation={[Math.PI / 2, 0, 0.6]} radius={0.13} teeth={9} speed={-0.4} />

          <HexRing position={[1.35, 0.9, 0.2]} radius={0.24} color={CYAN} speed={0.08} />
          <HexRing position={[-1.4, 0.4, -0.5]} radius={0.32} color={PURPLE} speed={-0.05} />
          <HexRing position={[0.9, 1.3, -0.9]} radius={0.18} color={CYAN} speed={0.12} />

          <WireframeShape position={[1.1, 1.1, 0.6]} kind="icosahedron" size={0.13} color="#9aa3b2" />
          <WireframeShape position={[-0.9, 1.4, 0.1]} kind="box" size={0.16} color={CYAN} />

          <BlueprintGrid position={[-1.6, 0.9, -0.6]} rotation={[0.2, 0.9, 0]} scale={1.4} />
          <BlueprintGrid position={[1.7, 0.6, -0.8]} rotation={[-0.15, -0.8, 0.1]} scale={1.2} />

          <PlateFragment position={[-0.7, 0.06, 0.9]} rotation={[0.1, 0.6, 0.05]} />
          <PlateFragment position={[0.75, 0.09, -0.85]} rotation={[-0.08, -0.4, 0.1]} size={[0.18, 0.12]} />

          <FilamentStrand color={filamentColor} />

          <Nozzle position={[-1.3, 1.15, -0.15]} rotation={[0, 0.3, 0.15]} scale={1.15} />
          <Nozzle position={[1.15, 0.75, 0.75]} rotation={[0, -0.5, -0.1]} scale={0.85} />

          <HoloReadout position={[0.85, 1.5, 0.3]} label="MATERIAL" value={filamentLabel} />
          <HoloReadout position={[-0.95, 0.25, 0.6]} label="LAYER" value={`${layerCount.toString().padStart(3, "0")}/512`} />
        </>
      )}
    </group>
  );
}
