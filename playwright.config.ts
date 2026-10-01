import { defineConfig, devices, ReporterDescription } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL;

/* Comma-separated subset of dot,list,html,junit (e.g. PLAYWRIGHT_REPORTERS=list,html,junit). */
const supportedReporters = ['dot', 'list', 'html', 'junit'];
const defaultReporter = process.env.PLAYWRIGHT_DEFAULT_REPORTER ?? (process.env.CI ? 'dot' : 'list');
const reporterNames = (process.env.PLAYWRIGHT_REPORTERS ?? defaultReporter)
  .split(',')
  .map((name) => name.trim())
  .filter((name) => supportedReporters.includes(name));

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env['CI'],
  /* Retry on CI only */
  retries: process.env['CI'] ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env['CI'] ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: reporterNames.map((name): ReporterDescription => {
    if (name === 'html') {
      return ['html', { open: 'never' }];
    }
    if (name === 'junit') {
      return ['junit', { outputFile: 'test-results/junit.xml' }];
    }
    if (name === 'dot') {
      return ['dot'];
    }
    return ['list'];
  }),
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: baseURL ?? 'http://localhost:4200',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Start the demo app unless a server URL is supplied (e.g. by `ng e2e`, which starts its own). */
  webServer: baseURL ? undefined : {
    command: 'yarn start:no-open',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000
  },

  /* The smoke suite runs in Chromium only. */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
});
