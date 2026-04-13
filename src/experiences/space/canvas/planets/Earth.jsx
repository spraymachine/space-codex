import { useMemo } from 'react';
import BasePlanet from './BasePlanet';
import { createEarthMaps } from './planetTextures';

export default function Earth({ position = [0, 0, 0], segments = 32 }) {
  const { map, bumpMap } = useMemo(() => createEarthMaps(), []);

  return (
    <BasePlanet
      position={position}
      radius={1.24}
      color="#7ebdff"
      emissive="#102e4b"
      emissiveIntensity={0.08}
      atmosphereColor="#65b7ff"
      atmosphereScale={1.16}
      rotationSpeed={0.05}
      segments={segments}
      map={map}
      bumpMap={bumpMap}
      bumpScale={0.08}
      roughness={0.7}
      specularStrength={0.3}
    >
      <mesh rotation={[0.08, 0.3, -0.18]}>
        <sphereGeometry args={[1.27, segments, segments]} />
        <meshStandardMaterial
          color="#f2fbff"
          transparent
          opacity={0.08}
          roughness={0.2}
        />
      </mesh>
    </BasePlanet>
  );
}
