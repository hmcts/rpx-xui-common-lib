import { expect } from '@playwright/test';
import { test } from './lighthouse.fixture';
import { collectLighthouseEvidence } from './lighthouseEvidence';
import { ASSERTION_MARKER } from './report.cjs';
import { AccessibilityDemoPage } from './demo.po';

test.setTimeout(90_000); // Lighthouse launches a separate CDP audit, bounded to 60 seconds.
for (const route of ['/home', '/coverage?feature=filter']) {
  test(`Lighthouse ${route} — representative stable page`, async ({ lighthousePage: page, lighthousePort, baseURL }, testInfo) => {
    await page.goto(new URL(route, baseURL).href);
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
    if (route === '/home') {
      await expect(page.locator('xuilib-checkbox-list')).toBeVisible();
    } else {
      await expect(new AccessibilityDemoPage(page).applyFilter).toBeVisible();
    }
    const outcome = await collectLighthouseEvidence(page, lighthousePort, testInfo);
    expect(outcome.issueCount, ASSERTION_MARKER).toBe(0);
  });
}
