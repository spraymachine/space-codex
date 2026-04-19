import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { PLANET_POSITIONS } from './constants';
import { sampleCameraPath } from './cameraPath';

export default function CameraRig({
  scrollProgressRef,
  orbitState,
  reducedMotion = false,
}) {
  const lookTarget = useRef(new THREE.Vector3());
  const positionTarget = useRef(new THREE.Vector3());
  const upTarget = useRef(new THREE.Vector3(0, 1, 0));
  const lookScratch = useRef(new THREE.Vector3());

  const saturnTarget = useMemo(
    () => new THREE.Vector3(...PLANET_POSITIONS.saturn),
    []
  );

  useFrame((state) => {
    const { camera } = state;

    if (reducedMotion) {
      positionTarget.current.set(0, 0.1, 6.2);
      lookTarget.current.lerp(new THREE.Vector3(...PLANET_POSITIONS.earth), 0.12);
      camera.position.lerp(positionTarget.current, 0.12);
      camera.lookAt(lookTarget.current);
      return;
    }

    if (orbitState?.active) {
      const radius = orbitState.focused ? 6.8 : 10.2;
      const verticalOffset = orbitState.focused ? 1.1 : 1.7;
      const angle = orbitState.angle || 0;

      positionTarget.current.set(
        saturnTarget.x + Math.cos(angle) * radius,
        saturnTarget.y + verticalOffset + Math.sin(angle * 0.6) * 1.4,
        saturnTarget.z + Math.sin(angle) * radius * 0.64
      );
      lookTarget.current.lerp(saturnTarget, 0.14);
      camera.position.lerp(positionTarget.current, 0.09);
      camera.up.lerp(upTarget.current.set(0, 1, 0), 0.12);
      camera.lookAt(lookTarget.current);
      return;
    }

    const progress = scrollProgressRef?.current ?? 0;
    const shot = sampleCameraPath(progress);
    const elapsed = state.clock.getElapsedTime();
    const driftX = Math.sin(elapsed * 0.22 + progress * Math.PI * 5) * 0.12;
    const driftY = Math.cos(elapsed * 0.18 + progress * Math.PI * 3) * 0.08;

    positionTarget.current.set(
      shot.position[0] + driftX,
      shot.position[1] + driftY,
      shot.position[2]
    );
    camera.position.lerp(positionTarget.current, 0.065);

    lookScratch.current.set(...shot.lookAt);
    lookTarget.current.lerp(lookScratch.current, 0.068);
    upTarget.current.set(...shot.up).normalize();
    camera.up.lerp(upTarget.current, 0.08);
    camera.fov += (shot.fov - camera.fov) * 0.08;
    camera.updateProjectionMatrix();
    camera.lookAt(lookTarget.current);
  });

  return null;
}
