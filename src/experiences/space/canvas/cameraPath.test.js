import test from 'node:test';
import assert from 'node:assert/strict';

import {
  CAMERA_KEYFRAMES,
  sampleCameraPath,
} from './cameraPath.js';

test('camera path returns exact values at keyframes', () => {
  const earthApproach = sampleCameraPath(0.12);

  assert.deepEqual(
    earthApproach.position.map((value) => Number(value.toFixed(3))),
    [3.1, 1.55, 1.6]
  );
  assert.deepEqual(
    earthApproach.lookAt.map((value) => Number(value.toFixed(3))),
    [1.95, 0.18, -2.2]
  );
  assert.equal(earthApproach.fov, 36);
});

test('camera path adds banking and lens changes between planets', () => {
  const marsToJupiter = sampleCameraPath(0.39);

  assert.ok(
    Math.abs(marsToJupiter.up[0]) > 0.03 || Math.abs(marsToJupiter.up[2]) > 0.03
  );
  assert.ok(marsToJupiter.fov <= 40);
});

test('camera path keeps cinematic beats ordered through the full voyage', () => {
  assert.equal(CAMERA_KEYFRAMES[0].at, 0);
  assert.equal(CAMERA_KEYFRAMES.at(-1).at, 1);
  assert.ok(CAMERA_KEYFRAMES.length >= 12);

  for (let index = 1; index < CAMERA_KEYFRAMES.length; index += 1) {
    assert.ok(CAMERA_KEYFRAMES[index].at > CAMERA_KEYFRAMES[index - 1].at);
  }
});
