import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

function pseudoRandom(seed) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

export default function Starfield({ count = 2000, spread = 260 }) {
  const meshRef = useRef(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const stars = useMemo(() => {
    return Array.from({ length: count }, (_, index) => {
      const radius = 60 + pseudoRandom(index + 1) * spread;
      const theta = pseudoRandom(index + 2) * Math.PI * 2;
      const phi = Math.acos(2 * pseudoRandom(index + 3) - 1);

      return {
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
        size: pseudoRandom(index + 4) * 0.12 + 0.02,
        speed: pseudoRandom(index + 5) * 0.8 + 0.2,
      };
    });
  }, [count, spread]);

  useLayoutEffect(() => {
    if (!meshRef.current) {
      return;
    }

    stars.forEach((star, index) => {
      dummy.position.set(star.x, star.y, star.z);
      dummy.scale.setScalar(star.size);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(index, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy, stars]);

  useFrame(({ clock }) => {
    if (!meshRef.current) {
      return;
    }

    const time = clock.getElapsedTime();
    const batchCount = 18;
    const segment = Math.max(1, Math.floor(count / batchCount));
    const batchIndex = Math.floor(time * 2.5) % batchCount;
    const start = batchIndex * segment;
    const end = Math.min(count, start + segment);

    for (let index = start; index < end; index += 1) {
      const star = stars[index];
      const twinkle = 0.88 + Math.sin(time * star.speed + index * 0.3) * 0.18;
      dummy.position.set(star.x, star.y, star.z);
      dummy.scale.setScalar(star.size * twinkle);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(index, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#ffffff" toneMapped={false} />
    </instancedMesh>
  );
}
