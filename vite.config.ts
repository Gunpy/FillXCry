import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const srcDir = fileURLToPath(new URL('./src', import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': srcDir },
  },
  css: {
    preprocessorOptions: {
      // Modern Sass API so `loadPaths` is honoured; absolute path lets
      // `@use 'shared/config/styles/...'` resolve from src in any file.
      scss: { api: 'modern', loadPaths: [srcDir] },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
});
