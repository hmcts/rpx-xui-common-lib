import { defineConfig, devices } from '@playwright/test';
import { join } from 'node:path';
import { createRunDirectory } from './e2e/accessibility/run-directory.cjs';

// Inherited by workers; each invocation owns its reports and never reads old runs.
const runDir = createRunDirectory('test-results/accessibility');
const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL;

export default defineConfig({
  testDir: './e2e/accessibility',
  testMatch: ['demo.spec.ts', 'feature-states.spec.ts', 'lighthouse.spec.ts'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 2,
  outputDir: join(runDir, 'browser'),
  reporter: [
    ['list'],
    ['./e2e/accessibility/accessibility.reporter.ts', { runDir }],
    ['html', { outputFolder: join(runDir, 'playwright-report'), open: 'never' }],
    ['junit', { outputFile: join(runDir, 'junit.xml') }]
  ],
  use: {
    baseURL: baseURL ?? 'http://localhost:4200',
    trace: 'retain-on-failure', screenshot: 'only-on-failure', video: 'off'
  },
  webServer: baseURL ? undefined : {
    command: 'yarn start:no-open', url: 'http://localhost:4200', reuseExistingServer: true, timeout: 180_000
  },
  projects: [{ name: 'chromium-a11y', use: { ...devices['Desktop Chrome'] } }]
});
