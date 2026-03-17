import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: ['tests/e2e/**', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
      exclude: ['tests/**', '**/*.config.*', 'dist/**', '**/*.d.ts', '**/types/**', 'src/index.ts'],
    },
  },
});
