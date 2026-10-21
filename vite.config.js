import { defineConfig } from 'vite';

export default defineConfig({
  base: '/macaco/',
  esbuild: {
    jsx: 'automatic',
  },
});
