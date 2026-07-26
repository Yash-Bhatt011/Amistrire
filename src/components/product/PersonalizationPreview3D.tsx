"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Center, Text3D, Environment } from "@react-three/drei";
import * as THREE from "three";

const FONT_URL = "/fonts/helvetiker_bold.typeface.json";

function EngravedText({ text, color }: { text: string; color: string }) {
  const material = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color, metalness: 0.4, roughness: 0.2, clearcoat: 0.6 }),
    [color]
  );

  // The offline font only reliably covers basic Latin uppercase/punctuation.
  const safeText = text.toUpperCase().replace(/[^A-Z0-9 .,'!?-]/g, "");

  if (!safeText.trim()) return null;

  return (
    <Center>
      <Text3D font={FONT_URL} size={0.5} height={0.14} curveSegments={6} bevelEnabled bevelThickness={0.015} bevelSize={0.012} bevelSegments={2}>
        {safeText}
        <primitive object={material} attach="material" />
      </Text3D>
    </Center>
  );
}

export function PersonalizationPreview3D({ text, color = "#2997ff" }: { text: string; color?: string }) {
  return (
    <div className="relative h-32 w-full overflow-hidden rounded-xl border border-studio-line bg-studio-concrete">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 3.2], fov: 40 }}
        gl={{ antialias: true, powerPreference: "low-power" }}
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[2, 3, 2]} intensity={1} />
        <Suspense fallback={null}>
          <Environment preset="studio" environmentIntensity={0.4} />
          <EngravedText text={text} color={color} />
        </Suspense>
      </Canvas>
      {!text.trim() && (
        <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-studio-ink/30">
          Type your text to preview it in 3D
        </p>
      )}
    </div>
  );
}
