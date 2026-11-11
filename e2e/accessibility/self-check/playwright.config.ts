import { defineConfig, devices } from '@playwright/test';
import { join } from 'node:path';
import { createRunDirectory } from '../run-directory.cjs';

const runDir = createRunDirectory('test-results/accessibility-self-check');
export default defineConfig({
  testDir: '.', testMatch: 'scanner.spec.ts', retries: 0, workers: 1,
  outputDir: join(runDir, 'browser'),
  reporter: [['list'], ['../accessibility.reporter.ts', { runDir }]],
  use: { ...devices['Desktop Chrome'], trace: 'retain-on-failure' }
});
