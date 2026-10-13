import { test, expect } from '@playwright/test';
import { collectAccessibilityEvidence } from '../accessibilityAudit';
import { ASSERTION_MARKER } from '../report.cjs';
import { scannerFixture } from './scanner.fixture';

test('controlled axe fixture', async ({ page }, testInfo) => {
  await page.setContent(scannerFixture(process.env.A11Y_SELF_CHECK_FAULT === '1'));
  await expect(page.getByRole('heading', { name: 'Scanner self-check' })).toBeVisible();
  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});
