import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import BasePlanet from './BasePlanet';
import { createSaturnMaps } from './planetTextures';

function createRingTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, 'rgba(242,226,191,0)');
  gradient.addColorStop(0.15, 'rgba(242,226,191,0.42)');
  gradient.addColorStop(0.36, 'rgba(214,184,126,0.86)');
  gradient.addColorStop(0.5, 'rgba(255,245,219,0.95)');
  gradient.addColorStop(0.7, 'rgba(197,164,104,0.72)');
  gradient.addColorStop(1, 'rgba(242,226,191,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function Saturn({ position = [0, 0, 0], segments = 32 }) {
  const ringRef = useRef(null);
  const { map, bumpMap } = useMemo(() => createSaturnMaps(), []);
  const ringTexture = useMemo(() => createRingTexture(), []);

  useFrame(({ clock }) => {
    if (!ringRef.current) {
      return;
    }

    ringRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.12) * 0.03;
  });

  return (
    <BasePlanet
      position={position}
      radius={1.7}
      color="#f5ddb2"
      emissive="#806441"
      emissiveIntensity={0.03}
      atmosphereColor="#ecd7a0"
      atmosphereScale={1.08}
      rotationSpeed={0.05}
      segments={segments}
      axialTilt={0.45}
      map={map}
      bumpMap={bumpMap}
      bumpScale={0.03}
      roughness={0.84}
      specularStrength={0.18}
    >
      <group ref={ringRef} rotation={[Math.PI / 2.05, 0.15, 0]}>
        <mesh>
          <ringGeometry args={[2.05, 2.46, 96]} />
          <meshBasicMaterial
            color="#f2e2bf"
            map={ringTexture}
            transparent
            opacity={0.42}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
        <mesh>
          <ringGeometry args={[2.56, 2.9, 96]} />
          <meshBasicMaterial
            color="#d8b57e"
            map={ringTexture}
            transparent
            opacity={0.24}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
        <mesh>
          <ringGeometry args={[3.0, 3.25, 96]} />
          <meshBasicMaterial
            color="#b58d56"
            map={ringTexture}
            transparent
            opacity={0.12}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      </group>
    </BasePlanet>
  );
}
