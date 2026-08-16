import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.{ts,tsx,js}', 'tests/**/*.spec.{ts,tsx,js}'],
    exclude: ['node_modules/**', 'tests/e2e/**', '**/*.e2e.{ts,tsx,js}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
