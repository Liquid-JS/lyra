import { defineConfig, devices } from '@playwright/test';

const externalBaseURL = process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e-spec.ts',
  timeout: 120_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: externalBaseURL || 'http://127.0.0.1:4200',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  // Playwright's own builds of the three engines, which run the same on Linux, macOS and Windows. WebKit there is not
  // Safari: its Tab order only follows Safari's on macOS, which `yarn e2e:safari` checks.
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'], viewport: { width: 1280, height: 800 } } },
    { name: 'webkit', use: { ...devices['Desktop Safari'], viewport: { width: 1280, height: 800 } } },
  ],
  webServer: externalBaseURL
    ? undefined
    : {
      command: 'yarn start:wp --host 127.0.0.1 --port 4200',
      url: 'http://127.0.0.1:4200',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
});
