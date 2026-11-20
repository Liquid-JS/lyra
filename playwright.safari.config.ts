import { defineConfig, devices } from '@playwright/test'

import baseConfig from './playwright.config'

/**
 * Checks that need Safari's own behaviour, which Playwright's WebKit has only on macOS with keyboard navigation off:
 * `yarn e2e:safari`. The specs skip themselves where WebKit doesn't follow Safari.
 */
export default defineConfig({
    ...baseConfig,
    testDir: './e2e/safari',
    testMatch: '**/*.safari-spec.ts',
    // A page that renders late on a busy machine gets one more try; Playwright reports it as flaky.
    retries: 1,
    projects: [{ name: 'webkit', use: { ...devices['Desktop Safari'], viewport: { width: 1200, height: 900 } } }]
})
