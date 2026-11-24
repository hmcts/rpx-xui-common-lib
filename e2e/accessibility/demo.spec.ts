import { expect } from '@playwright/test';
import { AppPage } from '../src/app.po';
import { test } from './demo.fixture';
import { collectAccessibilityEvidence } from './accessibilityAudit';
import { ASSERTION_MARKER } from './report.cjs';

test('home — initial components', async ({ page }, testInfo) => {
  await page.goto('/home');
  await expect(new AppPage(page).heading).toBeVisible();
  await expect(new AppPage(page).checkboxList).toBeVisible();
  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});

test('filter — initial controls', async ({ demo, page }, testInfo) => {
  await demo.open('filter');
  await expect(demo.heading).toBeVisible();
  await expect(demo.civil).toBeVisible();
  await expect(demo.applyFilter).toBeEnabled();
  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});

test('filter — required-service error', async ({ demo, page }, testInfo) => {
  await demo.open('filter');
  await demo.applyFilter.click();
  await expect(demo.serviceField).toBeVisible();
  await expect(demo.serviceField).toHaveClass(/form-group-error/);
  await expect(page.getByTestId('filter-result')).toHaveText('null');
  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});

test('filter — applied selection', async ({ demo, page }, testInfo) => {
  await demo.open('filter');
  await demo.civil.check();
  await demo.applyFilter.click();
  await expect(demo.civil).toBeChecked();
  await expect(page.getByTestId('filter-result')).toContainText('civil');
  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});

test('cookies — choice banner', async ({ demo, page }, testInfo) => {
  await demo.open('cookie');
  await expect(demo.cookieChoice('Accept')).toBeVisible();
  await expect(demo.cookieChoice('Reject')).toBeVisible();
  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});

for (const choice of ['Accept', 'Reject']) {
  test(`cookies — ${choice.toLowerCase()} persisted after reload`, async ({ demo, page, context }, testInfo) => {
    await demo.open('cookie');
    await demo.cookieChoice(choice).click();
    await page.reload();
    await expect(demo.heading).toBeVisible();
    await expect(demo.cookieChoice('Accept')).toHaveCount(0);
    expect((await context.cookies()).find((cookie) => cookie.name === 'commonlib-coverage-cookie')?.value)
      .toBe(choice === 'Accept' ? 'true' : 'false');
    const outcomes = await collectAccessibilityEvidence(page, testInfo);
    expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  });
}

test('navigation — active destinations', async ({ demo, page }, testInfo) => {
  await demo.open('navigation');
  const primary = page.getByRole('navigation', { name: 'Primary demo navigation' });
  await expect(primary).toBeVisible();
  await expect(primary.getByRole('link', { name: 'Coverage examples' })).toHaveAttribute('aria-current', 'true');
  await expect(page.getByRole('navigation', { name: 'Secondary demo navigation' })).toBeVisible();
  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});

test('users — suggestions expanded', async ({ demo, page }, testInfo) => {
  await demo.open('users');
  await demo.userInput.fill('Alex');
  await expect(demo.alexOption).toBeVisible();
  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});

test('users — selected user', async ({ demo, page }, testInfo) => {
  await demo.open('users');
  await demo.userInput.fill('Alex');
  await demo.alexOption.click();
  await expect(demo.selectedUser).toBeVisible();
  await expect(demo.selectedUser).toHaveText('alex@example.test');
  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});

for (const accepted of [false, true]) {
  test(`terms — ${accepted ? 'accepted' : 'awaiting confirmation'}`, async ({ demo, page }, testInfo) => {
    await demo.open('terms');
    await expect(demo.acceptTerms).toBeVisible();
    if (accepted) {
      await demo.acceptTerms.click();
    }
    await expect(demo.termsResult).toHaveText(accepted ? 'Terms accepted' : 'Terms not accepted');
    const outcomes = await collectAccessibilityEvidence(page, testInfo);
    expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  });
}

test('feedback — success and warning banners', async ({ demo, page }, testInfo) => {
  await demo.open('feedback');
  await expect(page.getByText('The action was saved', { exact: true })).toBeVisible();
  await expect(page.getByText('Action needs attention', { exact: true })).toBeVisible();
  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});

test('feedback — validation summary', async ({ demo, page }, testInfo) => {
  await demo.open('feedback');
  await demo.showErrors.click();
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.getByRole('alert')).toContainText('Enter an email address');
  await expect(page).toHaveTitle(/^Error:/);
  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});

test('session — visible timeout dialog', async ({ demo, page }, testInfo) => {
  await demo.open('dialog');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('aria-modal', 'true');
  await expect(dialog).toContainText('We are about to sign you out');
  await expect(dialog).toContainText('Your session will end soon.');
  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});
