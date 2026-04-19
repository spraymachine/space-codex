const clamp01 = (value) => Math.min(1, Math.max(0, value));

const lerp = (start, end, amount) => start + (end - start) * amount;

const smootherstep = (value) => {
  const t = clamp01(value);
  return t * t * t * (t * (t * 6 - 15) + 10);
};

const lerpVector = (start, end, amount) =>
  start.map((value, index) => lerp(value, end[index], amount));

export const CAMERA_KEYFRAMES = [
  {
    at: 0,
    position: [0.2, 0.35, 7.8],
    lookAt: [1.9, 0.05, -0.4],
    fov: 34,
    up: [0, 1, 0.02],
  },
  {
    at: 0.12,
    position: [3.1, 1.55, 1.6],
    lookAt: [1.95, 0.18, -2.2],
    fov: 36,
    up: [-0.06, 1, 0.05],
  },
  {
    at: 0.18,
    position: [6.4, 2.5, -14],
    lookAt: [-0.4, 0.52, -26],
    fov: 39,
    up: [-0.12, 1, 0.1],
  },
  {
    at: 0.27,
    position: [-5.6, 1.4, -26.8],
    lookAt: [-1.8, 0.35, -32],
    fov: 37,
    up: [0.07, 1, -0.04],
  },
  {
    at: 0.36,
    position: [-8.8, 2.4, -45],
    lookAt: [1.2, 0, -60],
    fov: 40,
    up: [0.12, 1, -0.08],
  },
  {
    at: 0.47,
    position: [7.8, 2.6, -55],
    lookAt: [2.4, -0.1, -67],
    fov: 32,
    up: [-0.08, 1, 0.02],
  },
  {
    at: 0.56,
    position: [11.2, 1.3, -82],
    lookAt: [0.7, 0.24, -99],
    fov: 38,
    up: [-0.14, 1, 0.06],
  },
  {
    at: 0.64,
    position: [7.4, 2.9, -99],
    lookAt: [0.2, 0.42, -114],
    fov: 31,
    up: [0.1, 1, -0.04],
  },
  {
    at: 0.72,
    position: [-6.4, 1.8, -111],
    lookAt: [0, 0.35, -114],
    fov: 34,
    up: [0.16, 1, -0.1],
  },
  {
    at: 0.83,
    position: [-8.2, 2.2, -142],
    lookAt: [-2.25, 0.1, -154],
    fov: 33,
    up: [-0.1, 1, 0.08],
  },
  {
    at: 0.92,
    position: [7.2, 1.4, -182],
    lookAt: [1.7, -0.22, -196],
    fov: 30,
    up: [0.05, 1, -0.06],
  },
  {
    at: 1,
    position: [3.6, 0.4, -188],
    lookAt: [1.7, -0.22, -196],
    fov: 27,
    up: [0, 1, 0],
  },
];

export function sampleCameraPath(progress) {
  const clamped = clamp01(progress);
  let currentIndex = 0;

  while (
    currentIndex < CAMERA_KEYFRAMES.length - 1 &&
    CAMERA_KEYFRAMES[currentIndex + 1].at <= clamped
  ) {
    currentIndex += 1;
  }

  const current = CAMERA_KEYFRAMES[currentIndex];
  const next = CAMERA_KEYFRAMES[Math.min(currentIndex + 1, CAMERA_KEYFRAMES.length - 1)];

  if (current === next) {
    return current;
  }

  const localProgress = (clamped - current.at) / (next.at - current.at);
  const eased = smootherstep(localProgress);

  return {
    at: clamped,
    position: lerpVector(current.position, next.position, eased),
    lookAt: lerpVector(current.lookAt, next.lookAt, eased),
    fov: Number(lerp(current.fov, next.fov, eased).toFixed(3)),
    up: lerpVector(current.up, next.up, eased),
  };
}
