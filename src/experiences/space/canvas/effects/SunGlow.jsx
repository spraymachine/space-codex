import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export default function SunGlow({ position = [0, 4, 26] }) {
  const coreRef = useRef(null);
  const haloRef = useRef(null);

  useFrame(({ clock }) => {
    const pulse = 1 + Math.sin(clock.getElapsedTime() * 0.5) * 0.04;

    if (coreRef.current) {
      coreRef.current.scale.setScalar(pulse);
    }

    if (haloRef.current) {
      haloRef.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * 0.35) * 0.08);
    }
  });

  return (
    <group position={position}>
      <mesh ref={coreRef}>
        <sphereGeometry args={[5, 32, 32]} />
        <meshBasicMaterial color="#ffd36a" toneMapped={false} />
      </mesh>
      <mesh ref={haloRef}>
        <sphereGeometry args={[8.5, 32, 32]} />
        <meshBasicMaterial
          color="#ff8a33"
          transparent
          opacity={0.16}
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      <pointLight color="#ffd700" intensity={38} distance={220} decay={2} />
    </group>
  );
}
