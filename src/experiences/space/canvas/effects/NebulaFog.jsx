import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function createNebulaTexture(color) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;

  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, `${color}88`);
  gradient.addColorStop(0.45, `${color}22`);
  gradient.addColorStop(1, `${color}00`);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function NebulaFog() {
  const groupRef = useRef(null);
  const purpleTexture = useMemo(() => createNebulaTexture('#b794f6'), []);
  const blueTexture = useMemo(() => createNebulaTexture('#4b9cd3'), []);

  useFrame(({ clock }) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.04) * 0.08;
  });

  return (
    <group ref={groupRef}>
      <sprite position={[-50, 24, -100]} scale={[65, 42, 1]}>
        <spriteMaterial
          map={purpleTexture}
          transparent
          opacity={0.3}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
      <sprite position={[42, -18, -150]} scale={[72, 48, 1]}>
        <spriteMaterial
          map={blueTexture}
          transparent
          opacity={0.18}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
      <sprite position={[0, 26, -220]} scale={[90, 54, 1]}>
        <spriteMaterial
          map={purpleTexture}
          transparent
          opacity={0.12}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  );
}
