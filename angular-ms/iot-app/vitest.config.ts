/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vitest-angular';

export default defineConfig(({ mode }) => ({
  plugins: [angular()],
  test: {
    globals: true,
    setupFiles: ['src/test-setup.ts'],
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    css: true,
  },
}));
