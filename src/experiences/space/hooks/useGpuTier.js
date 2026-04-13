import { useEffect, useState } from 'react';
import { DEFAULT_GPU_TIER, detectGpuTier } from '../../../utils/gpuDetect';

export function useGpuTier() {
  const [config, setConfig] = useState(DEFAULT_GPU_TIER);

  useEffect(() => {
    let mounted = true;

    detectGpuTier().then((result) => {
      if (mounted) {
        setConfig(result);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return config;
}
