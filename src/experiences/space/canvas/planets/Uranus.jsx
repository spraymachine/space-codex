import { useMemo } from 'react';
import BasePlanet from './BasePlanet';
import { createIceGiantMaps } from './planetTextures';

export default function Uranus({ position = [0, 0, 0], segments = 32 }) {
  const { map, bumpMap } = useMemo(
    () => createIceGiantMaps('#9fe7e3', '#69b8ba'),
    []
  );

  return (
    <BasePlanet
      position={position}
      radius={1.08}
      color="#b5ffff"
      emissive="#437a77"
      emissiveIntensity={0.04}
      atmosphereColor="#8ee5df"
      atmosphereScale={1.11}
      rotationSpeed={0.04}
      segments={segments}
      axialTilt={1.71}
      map={map}
      bumpMap={bumpMap}
      bumpScale={0.03}
      roughness={0.72}
    />
  );
}
