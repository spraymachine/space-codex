import { useMemo } from 'react';
import BasePlanet from './BasePlanet';
import { createMarsMaps } from './planetTextures';

export default function Mars({ position = [0, 0, 0], segments = 32 }) {
  const { map, bumpMap } = useMemo(() => createMarsMaps(), []);

  return (
    <BasePlanet
      position={position}
      radius={0.92}
      color="#f09a71"
      emissive="#662002"
      emissiveIntensity={0.04}
      atmosphereColor="#ef7a4f"
      atmosphereScale={1.08}
      rotationSpeed={0.045}
      segments={segments}
      map={map}
      bumpMap={bumpMap}
      bumpScale={0.09}
      roughness={0.94}
    />
  );
}
