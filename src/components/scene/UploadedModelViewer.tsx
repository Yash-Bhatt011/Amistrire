"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, Center, Bounds } from "@react-three/drei";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { ThreeMFLoader } from "three/examples/jsm/loaders/3MFLoader.js";

export type GeometryStats = {
  widthMm: number;
  depthMm: number;
  heightMm: number;
  volumeCm3: number;
  supported: boolean;
};

// Signed tetrahedron-volume summation over every triangle — the standard
// way to get a real, watertight-mesh volume from raw triangle data.
function computeVolumeMm3(geometry: THREE.BufferGeometry): number {
  const pos = geometry.attributes.position;
  if (!pos) return 0;
  let volume = 0;
  const p1 = new THREE.Vector3();
  const p2 = new THREE.Vector3();
  const p3 = new THREE.Vector3();

  const index = geometry.index;
  const triCount = index ? index.count / 3 : pos.count / 3;

  for (let i = 0; i < triCount; i++) {
    const a = index ? index.getX(i * 3) : i * 3;
    const b = index ? index.getX(i * 3 + 1) : i * 3 + 1;
    const c = index ? index.getX(i * 3 + 2) : i * 3 + 2;
    p1.fromBufferAttribute(pos, a);
    p2.fromBufferAttribute(pos, b);
    p3.fromBufferAttribute(pos, c);
    volume += p1.dot(p2.clone().cross(p3)) / 6;
  }
  return Math.abs(volume);
}

export function analyzeGeometry(geometry: THREE.BufferGeometry): GeometryStats {
  geometry.computeBoundingBox();
  const box = geometry.boundingBox ?? new THREE.Box3();
  const size = new THREE.Vector3();
  box.getSize(size);
  const volumeMm3 = computeVolumeMm3(geometry);
  return {
    widthMm: Math.round(size.x),
    depthMm: Math.round(size.z),
    heightMm: Math.round(size.y),
    volumeCm3: Math.round((volumeMm3 / 1000) * 10) / 10,
    supported: true,
  };
}

function LoadedMesh({ file, onStats }: { file: File; onStats: (stats: GeometryStats | null) => void }) {
  const [object, setObject] = useState<THREE.Object3D | null>(null);
  const { invalidate } = useThree();

  useEffect(() => {
    let cancelled = false;
    const url = URL.createObjectURL(file);
    const ext = file.name.split(".").pop()?.toLowerCase();

    async function load() {
      try {
        if (ext === "stl") {
          const loader = new STLLoader();
          const geometry = await loader.loadAsync(url);
          if (cancelled) return;
          const mesh = new THREE.Mesh(geometry, new THREE.MeshPhysicalMaterial({ color: "#2997ff", roughness: 0.3, metalness: 0.2, clearcoat: 0.4 }));
          setObject(mesh);
          onStats(analyzeGeometry(geometry));
        } else if (ext === "obj") {
          const loader = new OBJLoader();
          const group = await loader.loadAsync(url);
          if (cancelled) return;
          group.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = new THREE.MeshPhysicalMaterial({ color: "#2997ff", roughness: 0.3, metalness: 0.2, clearcoat: 0.4 });
            }
          });
          setObject(group);
          const firstMesh = group.children.find((c): c is THREE.Mesh => c instanceof THREE.Mesh);
          onStats(firstMesh ? analyzeGeometry(firstMesh.geometry) : { widthMm: 0, depthMm: 0, heightMm: 0, volumeCm3: 0, supported: false });
        } else if (ext === "3mf") {
          const loader = new ThreeMFLoader();
          const group = await loader.loadAsync(url);
          if (cancelled) return;
          setObject(group);
          const firstMesh = group.children.find((c): c is THREE.Mesh => c instanceof THREE.Mesh);
          onStats(firstMesh ? analyzeGeometry(firstMesh.geometry) : { widthMm: 0, depthMm: 0, heightMm: 0, volumeCm3: 0, supported: false });
        }
        invalidate();
      } catch {
        if (!cancelled) onStats(null);
      }
    }
    load();

    return () => {
      cancelled = true;
      URL.revokeObjectURL(url);
    };
  }, [file, onStats, invalidate]);

  if (!object) return null;
  return (
    <Bounds fit clip observe margin={1.4}>
      <Center>
        <primitive object={object} />
      </Center>
    </Bounds>
  );
}

export function UploadedModelViewer({
  file,
  onStats,
  className,
}: {
  file: File;
  onStats: (stats: GeometryStats | null) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        style={{ width: "100%", height: "100%", display: "block" }}
        frameloop="demand"
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 4, 3]} intensity={1.2} />
        <Suspense fallback={null}>
          <Environment preset="studio" environmentIntensity={0.5} />
          <LoadedMesh file={file} onStats={onStats} />
        </Suspense>
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
}
