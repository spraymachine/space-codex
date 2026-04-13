import * as THREE from 'three';

function createCanvas(size = 1024) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size / 2;
  return canvas;
}

function paintNoise(ctx, width, height, count, palette, alpha = 0.3) {
  for (let index = 0; index < count; index += 1) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 42 + 10;
    const color = palette[index % palette.length];
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `${color}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`);
    gradient.addColorStop(1, `${color}00`);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function finalizeTexture(canvas) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

export function createEarthMaps() {
  const colorCanvas = createCanvas();
  const bumpCanvas = createCanvas();
  const colorCtx = colorCanvas.getContext('2d');
  const bumpCtx = bumpCanvas.getContext('2d');
  const { width, height } = colorCanvas;

  const ocean = colorCtx.createLinearGradient(0, 0, width, height);
  ocean.addColorStop(0, '#0f4d77');
  ocean.addColorStop(0.5, '#1e6fa7');
  ocean.addColorStop(1, '#0b3558');
  colorCtx.fillStyle = ocean;
  colorCtx.fillRect(0, 0, width, height);

  for (let index = 0; index < 18; index += 1) {
    colorCtx.fillStyle = index % 2 === 0 ? '#4b8a48' : '#6ca15e';
    colorCtx.beginPath();
    colorCtx.ellipse(
      Math.random() * width,
      Math.random() * height,
      80 + Math.random() * 120,
      26 + Math.random() * 70,
      Math.random() * Math.PI,
      0,
      Math.PI * 2
    );
    colorCtx.fill();
  }

  paintNoise(colorCtx, width, height, 90, ['#ffffff', '#d9ecff'], 0.2);

  bumpCtx.fillStyle = '#202020';
  bumpCtx.fillRect(0, 0, width, height);
  paintNoise(bumpCtx, width, height, 110, ['#808080', '#b0b0b0'], 0.35);

  return {
    map: finalizeTexture(colorCanvas),
    bumpMap: finalizeTexture(bumpCanvas),
  };
}

export function createMarsMaps() {
  const colorCanvas = createCanvas();
  const bumpCanvas = createCanvas();
  const colorCtx = colorCanvas.getContext('2d');
  const bumpCtx = bumpCanvas.getContext('2d');
  const { width, height } = colorCanvas;

  const base = colorCtx.createLinearGradient(0, 0, width, height);
  base.addColorStop(0, '#c96238');
  base.addColorStop(0.55, '#a4431d');
  base.addColorStop(1, '#6f2508');
  colorCtx.fillStyle = base;
  colorCtx.fillRect(0, 0, width, height);
  paintNoise(colorCtx, width, height, 140, ['#d87a4f', '#7f2e11', '#e0a17b'], 0.2);

  bumpCtx.fillStyle = '#3b1f16';
  bumpCtx.fillRect(0, 0, width, height);
  paintNoise(bumpCtx, width, height, 160, ['#878787', '#4b4b4b', '#b9b9b9'], 0.28);

  return {
    map: finalizeTexture(colorCanvas),
    bumpMap: finalizeTexture(bumpCanvas),
  };
}

export function createJupiterMaps() {
  const colorCanvas = createCanvas();
  const bumpCanvas = createCanvas();
  const colorCtx = colorCanvas.getContext('2d');
  const bumpCtx = bumpCanvas.getContext('2d');
  const { width, height } = colorCanvas;
  const stripes = ['#e7c89c', '#bc8a58', '#d8a56e', '#8f6037', '#f3d8ab'];

  for (let band = 0; band < 18; band += 1) {
    colorCtx.fillStyle = stripes[band % stripes.length];
    colorCtx.fillRect(0, (height / 18) * band, width, height / 18 + 2);
  }

  paintNoise(colorCtx, width, height, 100, ['#fff2d0', '#9a6236'], 0.14);

  colorCtx.fillStyle = '#c26b45';
  colorCtx.beginPath();
  colorCtx.ellipse(width * 0.66, height * 0.58, 90, 48, -0.12, 0, Math.PI * 2);
  colorCtx.fill();

  bumpCtx.fillStyle = '#5d4c3e';
  bumpCtx.fillRect(0, 0, width, height);
  for (let band = 0; band < 18; band += 1) {
    bumpCtx.fillStyle = band % 2 === 0 ? '#888888' : '#575757';
    bumpCtx.fillRect(0, (height / 18) * band, width, height / 18 + 2);
  }

  return {
    map: finalizeTexture(colorCanvas),
    bumpMap: finalizeTexture(bumpCanvas),
  };
}

export function createSaturnMaps() {
  const colorCanvas = createCanvas();
  const bumpCanvas = createCanvas();
  const colorCtx = colorCanvas.getContext('2d');
  const bumpCtx = bumpCanvas.getContext('2d');
  const { width, height } = colorCanvas;

  const tones = ['#f0dfb0', '#c8a875', '#e4c894', '#b99362'];
  for (let band = 0; band < 16; band += 1) {
    colorCtx.fillStyle = tones[band % tones.length];
    colorCtx.fillRect(0, (height / 16) * band, width, height / 16 + 2);
  }
  paintNoise(colorCtx, width, height, 70, ['#fff6d7', '#bf9a65'], 0.1);

  bumpCtx.fillStyle = '#787878';
  bumpCtx.fillRect(0, 0, width, height);
  for (let band = 0; band < 16; band += 1) {
    bumpCtx.fillStyle = band % 2 === 0 ? '#898989' : '#5d5d5d';
    bumpCtx.fillRect(0, (height / 16) * band, width, height / 16 + 2);
  }

  return {
    map: finalizeTexture(colorCanvas),
    bumpMap: finalizeTexture(bumpCanvas),
  };
}

export function createIceGiantMaps(baseTop, baseBottom) {
  const colorCanvas = createCanvas();
  const bumpCanvas = createCanvas();
  const colorCtx = colorCanvas.getContext('2d');
  const bumpCtx = bumpCanvas.getContext('2d');
  const { width, height } = colorCanvas;

  const gradient = colorCtx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, baseTop);
  gradient.addColorStop(1, baseBottom);
  colorCtx.fillStyle = gradient;
  colorCtx.fillRect(0, 0, width, height);

  for (let band = 0; band < 10; band += 1) {
    colorCtx.fillStyle = `rgba(255,255,255,${0.02 + (band % 3) * 0.02})`;
    colorCtx.fillRect(0, (height / 10) * band, width, height / 10);
  }

  bumpCtx.fillStyle = '#555555';
  bumpCtx.fillRect(0, 0, width, height);
  paintNoise(bumpCtx, width, height, 80, ['#9f9f9f', '#6f6f6f'], 0.18);

  return {
    map: finalizeTexture(colorCanvas),
    bumpMap: finalizeTexture(bumpCanvas),
  };
}
