export type ProceduralShapeKind =
  | "torusKnot"
  | "icosahedron"
  | "stackedBoxes"
  | "torus"
  | "cone"
  | "octahedron"
  | "cylinderPair"
  | "dodecahedron";

export function ProceduralShape({
  kind,
  color,
  roughness = 0.3,
  metalness = 0.4,
  castShadow = true,
}: {
  kind: ProceduralShapeKind;
  color: string;
  roughness?: number;
  metalness?: number;
  castShadow?: boolean;
}) {
  const material = <meshPhysicalMaterial color={color} roughness={roughness} metalness={metalness} clearcoat={0.2} clearcoatRoughness={0.3} />;

  switch (kind) {
    case "torusKnot":
      return (
        <mesh castShadow={castShadow}>
          <torusKnotGeometry args={[0.32, 0.11, 128, 24]} />
          {material}
        </mesh>
      );
    case "icosahedron":
      return (
        <mesh castShadow={castShadow} rotation={[0.3, 0, 0.1]}>
          <icosahedronGeometry args={[0.42, 0]} />
          {material}
        </mesh>
      );
    case "stackedBoxes":
      return (
        <group>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[0, i * 0.2 - 0.18, 0]} castShadow={castShadow}>
              <boxGeometry args={[0.52 - i * 0.1, 0.16, 0.52 - i * 0.1]} />
              {material}
            </mesh>
          ))}
        </group>
      );
    case "torus":
      return (
        <mesh castShadow={castShadow}>
          <torusGeometry args={[0.3, 0.13, 24, 48]} />
          {material}
        </mesh>
      );
    case "cone":
      return (
        <mesh castShadow={castShadow} rotation={[0, 0, Math.PI / 8]}>
          <coneGeometry args={[0.32, 0.55, 6]} />
          {material}
        </mesh>
      );
    case "octahedron":
      return (
        <mesh castShadow={castShadow}>
          <octahedronGeometry args={[0.38, 0]} />
          {material}
        </mesh>
      );
    case "cylinderPair":
      return (
        <group>
          {[-0.14, 0.14].map((x) => (
            <mesh key={x} position={[x, 0, 0]} castShadow={castShadow}>
              <cylinderGeometry args={[0.14, 0.14, 0.5, 20]} />
              {material}
            </mesh>
          ))}
        </group>
      );
    case "dodecahedron":
    default:
      return (
        <mesh castShadow={castShadow} rotation={[0.4, 0.4, 0]}>
          <dodecahedronGeometry args={[0.34, 0]} />
          {material}
        </mesh>
      );
  }
}
