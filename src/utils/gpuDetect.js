import { getGPUTier } from 'detect-gpu';

const TIER_CONFIG = {
  0: {
    tier: 'low',
    starCount: 2000,
    planetDetail: 20,
    dpr: [1, 1],
    bloom: false,
    postProcessing: false,
    shaderComplexity: 'low',
  },
  1: {
    tier: 'mid',
    starCount: 4000,
    planetDetail: 32,
    dpr: [1, 1.5],
    bloom: true,
    postProcessing: false,
    shaderComplexity: 'mid',
  },
  2: {
    tier: 'high',
    starCount: 8000,
    planetDetail: 56,
    dpr: [1, 2],
    bloom: true,
    postProcessing: true,
    shaderComplexity: 'high',
  },
};

let cachedResult = null;
let cachedPromise = null;

export const DEFAULT_GPU_TIER = TIER_CONFIG[0];

export async function detectGpuTier() {
  if (cachedResult) {
    return cachedResult;
  }

  if (cachedPromise) {
    return cachedPromise;
  }

  cachedPromise = getGPUTier({ mobileTiers: true })
    .then((gpu) => {
      const normalizedTier =
        gpu && Number.isFinite(gpu.tier) ? Math.min(Math.max(gpu.tier, 0), 2) : 0;

      cachedResult = {
        ...TIER_CONFIG[normalizedTier],
        raw: gpu,
      };

      return cachedResult;
    })
    .catch(() => {
      cachedResult = {
        ...DEFAULT_GPU_TIER,
        raw: null,
      };

      return cachedResult;
    });

  return cachedPromise;
}
