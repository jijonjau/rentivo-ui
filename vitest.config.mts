import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': resolve(rootDir),
    },
  },

  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],

    include: ['**/*.{test,spec}.{ts,tsx}'],

    exclude: ['node_modules', '.next', 'out', 'build'],

    clearMocks: true,
    restoreMocks: true,

    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/components/shared/FormInput.tsx'],
    },
  },
});
