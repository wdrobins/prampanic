import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  use: {
    baseURL: 'http://127.0.0.1:4173/prampanic/',
    trace: 'on-first-retry'
  },
  webServer: {
    command: 'npm run dev -- --port 4173',
    url: 'http://127.0.0.1:4173/prampanic/',
    reuseExistingServer: true
  },
  projects: [{ name: 'chromium-phone', use: { ...devices['Pixel 5'] } }]
});
