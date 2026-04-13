import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export default function BasePlanet({
  position = [0, 0, 0],
  radius = 1,
  color = '#ffffff',
  emissive = '#000000',
  emissiveIntensity = 0,
  atmosphereColor = null,
  atmosphereScale = 1.12,
  rotationSpeed = 0.08,
  segments = 32,
  axialTilt = 0,
  map = null,
  bumpMap = null,
  bumpScale = 0.05,
  specularStrength = 0.16,
  roughness = 0.86,
  metalness = 0.04,
  children,
}) {
  const meshRef = useRef(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) {
      return;
    }

    meshRef.current.rotation.y = clock.getElapsedTime() * rotationSpeed;
  });

  return (
    <group position={position} rotation={[0, 0, axialTilt]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, segments, segments]} />
        <meshStandardMaterial
          color={color}
          map={map}
          bumpMap={bumpMap}
          bumpScale={bumpScale}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          roughness={roughness}
          metalness={metalness}
          envMapIntensity={specularStrength}
        />
      </mesh>

      {atmosphereColor && (
        <mesh scale={atmosphereScale}>
          <sphereGeometry args={[radius, segments, segments]} />
          <meshBasicMaterial
            color={atmosphereColor}
            transparent
            opacity={0.13}
            side={THREE.BackSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      )}

      {children}
    </group>
  );
}
