"use client";

import { Environment, ContactShadows } from "@react-three/drei";

export function StudioLighting({ mobile }: { mobile: boolean }) {
  return (
    <>
      {/* HDRI environment for realistic reflections on metal/plastic/glass */}
      <Environment files="/potsdamer_platz_1k.hdr" environmentIntensity={0.6} />

      {/* Key light */}
      <spotLight
        position={[4, 6, 4]}
        angle={0.4}
        penumbra={0.6}
        intensity={2.2}
        color="#ffffff"
        castShadow={!mobile}
        shadow-mapSize={mobile ? [512, 512] : [1024, 1024]}
      />

      {/* Neon cyan rim light — camera-left */}
      <pointLight position={[-5, 2, -3]} intensity={1.4} color="#2997ff" distance={12} decay={2} />

      {/* Neon purple rim light — camera-right */}
      <pointLight position={[5, 1.5, -2]} intensity={1.4} color="#bf5af2" distance={12} decay={2} />

      {/* Low fill so shadows aren't crushed black */}
      <ambientLight intensity={0.15} />

      {/* Soft contact shadow under the printer, cheaper than full dynamic shadow map */}
      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={0.55}
        scale={12}
        blur={2.4}
        far={4}
        resolution={mobile ? 256 : 512}
      />
    </>
  );
}
