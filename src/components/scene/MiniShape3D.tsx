"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ProceduralShape, type ProceduralShapeKind } from "./shape-geometry";

function SpinningIcon({ kind, color }: { kind: ProceduralShapeKind; color: string }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.4;
  });
  return (
    <group ref={ref}>
      <ProceduralShape kind={kind} color={color} castShadow={false} />
    </group>
  );
}

export function MiniShape3D({ kind, color = "#2997ff" }: { kind: ProceduralShapeKind; color?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full">
      {visible && (
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 2.6], fov: 40 }}
          gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          <ambientLight intensity={0.9} />
          <directionalLight position={[2, 3, 2]} intensity={1} />
          <Suspense fallback={null}>
            <SpinningIcon kind={kind} color={color} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
