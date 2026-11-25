import { expect } from '@playwright/test';
import { test } from '../src/browser-diagnostics.fixture';
import { mockLookupHttp } from '../src/lookups.mock';
import { collectAccessibilityEvidence } from './accessibilityAudit';
import { ASSERTION_MARKER } from './report.cjs';

test('remaining terms states expose the selected content in the browser accessibility tree', async ({ page }, testInfo) => {
  await page.goto('/coverage?feature=terms-html');
  const main = page.locator('[role="main"]');
  await expect(main.getByRole('heading', { name: 'HTML terms', exact: true })).toBeVisible();
  await expect(await main.ariaSnapshot()).toContain('heading "HTML terms"');
  await expect(main.locator('script')).toHaveCount(0);

  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});

test('form-group wrapper exposes its group name, descriptions and keyboard target', async ({ page }, testInfo) => {
  await page.goto('/coverage?feature=form-group');
  const group = page.getByRole('group', { name: 'Wrapped options', exact: true });
  const checkbox = page.getByRole('checkbox', { name: 'Wrapped option', exact: true });

  await expect(group).toHaveAccessibleName('Wrapped options');
  await expect(group).toHaveAccessibleDescription(/The wrapper owns this hint/);
  await expect(group).toHaveAttribute('aria-describedby', /wrapped-options-hint/);
  await expect(group).toHaveAttribute('aria-describedby', /wrapped-options-error/);
  await checkbox.focus();
  await expect(checkbox).toBeFocused();
  await page.keyboard.press('Space');
  await expect(checkbox).toBeChecked();

  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});

test('direct SearchWorkType exposes options and a keyboard selection contract', async ({ page }, testInfo) => {
  await mockLookupHttp(page);
  await page.goto('/coverage/lookups?feature=search-work-type');
  const input = page.locator('#inputWorkTypeSearch');

  await input.fill('Review');
  const option = page.getByRole('option', { name: 'Review case', exact: true });
  await expect(option).toBeVisible();
  await expect(await page.locator('body').ariaSnapshot()).toContain('option "Review case"');

  await input.press('ArrowDown');
  await input.press('Enter');
  await expect(page.getByTestId('direct-work-type-selection')).toContainText('review');
  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});

test('validator states retain semantic headings and keyboard-accessible transitions', async ({ page }, testInfo) => {
  await page.goto('/coverage/validators');
  await expect(page.getByRole('heading', { name: 'Date validator', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Radio-group validator', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Checkbox validator', exact: true })).toBeVisible();

  const dateStatus = page.getByTestId('date-validator-status');
  await expect(dateStatus).toHaveText('invalid');
  await page.getByRole('button', { name: 'Set valid date' }).focus();
  await expect(page.getByRole('button', { name: 'Set valid date' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(dateStatus).toHaveText('valid');
  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});

test('session dialog exposes a modal dialog and accepts keyboard focus', async ({ page }, testInfo) => {
  await page.goto('/coverage?feature=dialog');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('aria-modal', 'true');
  await expect(dialog).toContainText('We are about to sign you out');
  await dialog.focus();
  await expect(dialog).toBeFocused();
  await expect(await dialog.ariaSnapshot()).toContain('We are about to sign you out');
  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});
