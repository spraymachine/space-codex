import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { PLANET_POSITIONS } from './constants';

const WAYPOINTS = [
  { at: 0.0, pos: [0, 0.1, 6.2], look: PLANET_POSITIONS.earth },
  { at: 0.1, pos: [-0.6, 0.2, 3.2], look: PLANET_POSITIONS.earth },
  { at: 0.16, pos: [0.8, 0.7, -14], look: PLANET_POSITIONS.mars },
  { at: 0.28, pos: [-0.2, 0.1, -28], look: PLANET_POSITIONS.mars },
  { at: 0.36, pos: [-0.8, 0.8, -48], look: PLANET_POSITIONS.jupiter },
  { at: 0.49, pos: [0.4, 0, -72], look: PLANET_POSITIONS.jupiter },
  { at: 0.56, pos: [1.2, 0.85, -90], look: PLANET_POSITIONS.saturn },
  { at: 0.68, pos: [0, 1.1, -104], look: PLANET_POSITIONS.saturn },
  { at: 0.78, pos: [0.8, 0.5, -134], look: PLANET_POSITIONS.uranus },
  { at: 0.86, pos: [-0.6, 0.4, -156], look: PLANET_POSITIONS.uranus },
  { at: 0.92, pos: [-0.5, 0.3, -176], look: PLANET_POSITIONS.neptune },
  { at: 1.0, pos: [0, 0.1, -194], look: PLANET_POSITIONS.neptune },
];

function interpolate(progress) {
  let index = 0;

  while (index < WAYPOINTS.length - 1 && WAYPOINTS[index + 1].at <= progress) {
    index += 1;
  }

  const current = WAYPOINTS[index];
  const next = WAYPOINTS[Math.min(index + 1, WAYPOINTS.length - 1)];

  if (current === next) {
    return current;
  }

  const localT = (progress - current.at) / (next.at - current.at);
  const smoothT = localT * localT * (3 - 2 * localT);

  return {
    pos: current.pos.map((value, axis) => value + (next.pos[axis] - value) * smoothT),
    look: current.look.map(
      (value, axis) => value + (next.look[axis] - value) * smoothT
    ),
  };
}

export default function CameraRig({
  scrollProgressRef,
  orbitState,
  reducedMotion = false,
}) {
  const { camera } = useThree();
  const lookTarget = useRef(new THREE.Vector3());
  const positionTarget = useRef(new THREE.Vector3());

  const saturnTarget = useMemo(
    () => new THREE.Vector3(...PLANET_POSITIONS.saturn),
    []
  );

  useFrame(() => {
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
      camera.lookAt(lookTarget.current);
      return;
    }

    const progress = scrollProgressRef?.current ?? 0;
    const waypoint = interpolate(progress);

    positionTarget.current.set(...waypoint.pos);
    camera.position.lerp(positionTarget.current, 0.08);

    lookTarget.current.lerp(
      new THREE.Vector3(...waypoint.look),
      0.08
    );
    camera.lookAt(lookTarget.current);
  });

  return null;
}
