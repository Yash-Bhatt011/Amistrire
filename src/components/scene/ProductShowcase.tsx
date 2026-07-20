"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useSceneStore, FILAMENTS } from "@/lib/scene-store";
import { useShowcaseStore, type ShowcaseSlot } from "@/lib/store/showcase-store";
import { ProceduralShape, type ProceduralShapeKind } from "./shape-geometry";
import { useDeviceTier } from "@/hooks/use-device-tier";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

function SpinningMesh({
  children,
  speed,
  autoRotate,
  position,
}: {
  children: React.ReactNode;
  speed: number;
  autoRotate: boolean;
  position: [number, number, number];
}) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const currentSpeed = useRef(speed);

  useFrame((_, delta) => {
    const target = !autoRotate ? 0 : hovered ? 0 : speed;
    currentSpeed.current = THREE.MathUtils.lerp(currentSpeed.current, target, delta * 4);
    if (ref.current) ref.current.rotation.y += delta * currentSpeed.current;
  });

  return (
    <group
      ref={ref}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {children}
    </group>
  );
}

function CustomModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

function Products() {
  const filament = useSceneStore((s) => s.filament);
  const { color, roughness, metalness } = FILAMENTS[filament];
  const slots = useShowcaseStore((s) => s.slots ?? []);

  return (
    <>
      {slots.map((slot) => (
        <SpinningMesh key={slot.id} position={slot.position} speed={slot.rotationSpeed} autoRotate={slot.autoRotate}>
          <group scale={slot.scale}>
            {slot.kind === "custom" && slot.customModelUrl ? (
              <Suspense fallback={<ProceduralShape kind="torusKnot" color={color} roughness={roughness} metalness={metalness} />}>
                <CustomModel url={slot.customModelUrl} />
              </Suspense>
            ) : (
              <ProceduralShape kind={slot.kind as ProceduralShapeKind} color={color} roughness={roughness} metalness={metalness} />
            )}
          </group>
        </SpinningMesh>
      ))}
    </>
  );
}

function CursorTilt({ children, mobile, disabled }: { children: React.ReactNode; mobile: boolean; disabled: boolean }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!ref.current || mobile || disabled) return;
    // Subtle parallax tilt toward the cursor — kept small so it reads as
    // "alive" rather than distracting.
    const targetX = state.pointer.y * 0.12;
    const targetY = state.pointer.x * 0.16;
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetX, delta * 2.5);
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetY, delta * 2.5);
  });

  return <group ref={ref}>{children}</group>;
}

export function ProductShowcase() {
  const tier = useDeviceTier();
  const mobile = tier === "mobile";
  const reducedMotion = useReducedMotion();

  return (
    <Canvas
      shadows={!mobile}
      dpr={mobile ? [1, 1.5] : [1, 2]}
      camera={{ position: [0, 1.1, 5.4], fov: 38 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <color attach="background" args={["#ffffff"]} />
      <ambientLight intensity={0.7} />
      <spotLight position={[3, 4, 3]} angle={0.4} penumbra={0.6} intensity={1.4} castShadow={!mobile} />
      <pointLight position={[-3, 1, -2]} intensity={0.5} color="#bf5af2" />
      <Suspense fallback={null}>
        <Environment preset="city" environmentIntensity={0.5} />
        <CursorTilt mobile={mobile} disabled={reducedMotion}>
          <Products />
        </CursorTilt>
        <ContactShadows position={[0, -0.55, 0]} opacity={0.35} scale={10} blur={2.2} resolution={mobile ? 256 : 512} />
      </Suspense>
    </Canvas>
  );
}
