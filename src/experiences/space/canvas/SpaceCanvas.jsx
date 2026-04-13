import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { Suspense } from 'react';
import * as THREE from 'three';
import CameraRig from './CameraRig';
import Starfield from './Starfield';
import { PLANET_POSITIONS } from './constants';
import NebulaFog from './effects/NebulaFog';
import SunGlow from './effects/SunGlow';
import Earth from './planets/Earth';
import Jupiter from './planets/Jupiter';
import Mars from './planets/Mars';
import Neptune from './planets/Neptune';
import Saturn from './planets/Saturn';
import Uranus from './planets/Uranus';

function SceneContent({ gpuTier, scrollProgressRef, orbitState, reducedMotion }) {
  const segments = gpuTier.planetDetail;

  return (
    <>
      <ambientLight intensity={0.18} color="#7f95d8" />
      <hemisphereLight
        skyColor="#8ea4ff"
        groundColor="#0b0a10"
        intensity={0.48}
      />
      <directionalLight position={[10, 8, 16]} intensity={1.25} color="#f6ead3" />
      <directionalLight position={[-18, -6, -24]} intensity={0.3} color="#4c6cff" />

      <Starfield count={gpuTier.starCount} />
      <NebulaFog />
      <SunGlow position={[0, 4, 26]} />

      <Earth position={PLANET_POSITIONS.earth} segments={segments} />
      <Mars position={PLANET_POSITIONS.mars} segments={segments} />
      <Jupiter position={PLANET_POSITIONS.jupiter} segments={segments} />
      <Saturn position={PLANET_POSITIONS.saturn} segments={segments} />
      <Uranus position={PLANET_POSITIONS.uranus} segments={segments} />
      <Neptune position={PLANET_POSITIONS.neptune} segments={segments} />

      <CameraRig
        scrollProgressRef={scrollProgressRef}
        orbitState={orbitState}
        reducedMotion={reducedMotion}
      />

      {gpuTier.bloom && (
        <EffectComposer multisampling={gpuTier.postProcessing ? 4 : 0}>
          <Bloom
            intensity={gpuTier.postProcessing ? 0.9 : 0.45}
            luminanceThreshold={0.22}
            luminanceSmoothing={0.6}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </>
  );
}

export default function SpaceCanvas({
  gpuTier,
  scrollProgressRef,
  orbitState,
  reducedMotion = false,
}) {
  return (
    <Canvas
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
      }}
      camera={{ position: [0, 0.1, 6.2], fov: 48, near: 0.1, far: 500 }}
      dpr={gpuTier.dpr}
      gl={{
        antialias: gpuTier.tier !== 'low',
        powerPreference: 'high-performance',
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color('#02030a'));
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.16;
      }}
      performance={{ min: 0.5 }}
    >
      <Suspense fallback={null}>
        <SceneContent
          gpuTier={gpuTier}
          scrollProgressRef={scrollProgressRef}
          orbitState={orbitState}
          reducedMotion={reducedMotion}
        />
      </Suspense>
    </Canvas>
  );
}
