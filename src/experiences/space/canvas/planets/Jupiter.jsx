import { useMemo } from 'react';
import BasePlanet from './BasePlanet';
import { createJupiterMaps } from './planetTextures';

export default function Jupiter({ position = [0, 0, 0], segments = 32 }) {
  const { map, bumpMap } = useMemo(() => createJupiterMaps(), []);

  return (
    <BasePlanet
      position={position}
      radius={2.18}
      color="#efcd98"
      emissive="#7a5423"
      emissiveIntensity={0.04}
      atmosphereColor="#f1d4a8"
      atmosphereScale={1.04}
      rotationSpeed={0.075}
      segments={segments}
      map={map}
      bumpMap={bumpMap}
      bumpScale={0.04}
      roughness={0.82}
      specularStrength={0.2}
    >
      <mesh rotation={[Math.PI / 2, 0.08, 0]}>
        <torusGeometry args={[2.21, 0.12, 12, 84]} />
        <meshStandardMaterial color="#9e6d37" transparent opacity={0.12} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0.22, 0]}>
        <torusGeometry args={[2.1, 0.08, 12, 84]} />
        <meshStandardMaterial color="#fff2d3" transparent opacity={0.1} />
      </mesh>
    </BasePlanet>
  );
}
