import { useMemo } from 'react';
import BasePlanet from './BasePlanet';
import { createIceGiantMaps } from './planetTextures';

export default function Neptune({ position = [0, 0, 0], segments = 32 }) {
  const { map, bumpMap } = useMemo(
    () => createIceGiantMaps('#7394ff', '#2f49ad'),
    []
  );

  return (
    <BasePlanet
      position={position}
      radius={1.02}
      color="#9fb5ff"
      emissive="#22306d"
      emissiveIntensity={0.05}
      atmosphereColor="#6a87ff"
      atmosphereScale={1.12}
      rotationSpeed={0.05}
      segments={segments}
      map={map}
      bumpMap={bumpMap}
      bumpScale={0.04}
      roughness={0.74}
    />
  );
}
