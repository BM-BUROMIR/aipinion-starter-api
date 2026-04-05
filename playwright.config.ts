import { defineConfig } from '@playwright/test';

const E2E_PORT = Number(process.env.E2E_PORT) || 3111;

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  retries: 1,
  reporter: 'html',
  use: {
    baseURL: process.env.E2E_BASE_URL || `http://127.0.0.1:${E2E_PORT}`,
  },
  webServer: {
    command: `npm run build && PORT=${E2E_PORT} node dist/index.js`,
    url: `http://127.0.0.1:${E2E_PORT}/health`,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
});
