import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    base: env.VITE_BASE_PATH || '/',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react';
          }

          if (id.includes('node_modules/gsap') || id.includes('node_modules/lenis')) {
            return 'motion';
          }

          if (id.includes('node_modules/@react-three/fiber')) {
            return 'r3f';
          }

          if (
            id.includes('node_modules/@react-three/drei') ||
            id.includes('node_modules/@react-three/postprocessing') ||
            id.includes('node_modules/postprocessing') ||
            id.includes('node_modules/three-stdlib') ||
            id.includes('node_modules/maath')
          ) {
            return 'r3f-extras';
          }

          if (id.includes('node_modules/three')) {
            return 'three-core';
          }

          return undefined;
        },
      },
    },
  },
  };
});
