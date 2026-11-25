import { expect } from '@playwright/test';
import { test } from './browser-diagnostics.fixture';
import { mockLookupHttp } from './lookups.mock';

test.describe('remaining composed component contracts', () => {
  test('isolates the HTML terms display and sanitises executable markup', async ({ page }) => {
    await page.goto('/coverage?feature=terms-html');

    await expect(page.locator('xuilib-tc-display-html')).toHaveCount(1);
    await expect(page.getByRole('heading', { name: 'HTML terms' })).toBeVisible();
    await expect(page.locator('xuilib-tc-display-html script')).toHaveCount(0);
    await expect(page.locator('body')).not.toContainText('window.__termsScript');
  });

  test('isolates the plain and unsupported terms display variants', async ({ page }) => {
    await page.goto('/coverage?feature=terms-plain');
    await expect(page.locator('xuilib-tc-display-plain')).toHaveCount(1);
    await expect(page.getByText('Plain terms content.', { exact: true })).toBeVisible();

    await page.goto('/coverage?feature=terms-unknown');
    await expect(page.locator('xuilib-tc-display-html, xuilib-tc-display-plain')).toHaveCount(0);
    await expect(page.getByText('An error occured. Please try again.', { exact: true })).toBeVisible();
  });

  test('isolates the GOV.UK form-group wrapper contract', async ({ page }) => {
    await page.goto('/coverage?feature=form-group');

    const group = page.locator('.govuk-form-group');
    await expect(group).toHaveClass(/govuk-form-group--error/);
    await expect(group.getByRole('group', { name: 'Wrapped options' })).toBeVisible();
    await expect(page.getByText('The wrapper owns this hint.', { exact: true })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Wrapped option' })).toBeVisible();
    await expect(page.locator('#wrapped-options-error')).toContainText('Choose at least one option');
  });

  test('exercises SearchWorkType directly rather than only through FindWorkType', async ({ page }) => {
    await mockLookupHttp(page);
    await page.goto('/coverage/lookups?feature=search-work-type');

    await page.locator('#inputWorkTypeSearch').fill('Review');
    await expect(page.getByRole('option', { name: 'Review case', exact: true })).toBeVisible();
    await page.getByRole('option', { name: 'Review case', exact: true }).click();
    await expect(page.getByTestId('direct-work-type-selection')).toContainText('review');

    await page.locator('#inputWorkTypeSearch').fill('@@@');
    await expect(page.getByRole('option', { name: 'No results found', exact: true })).toBeVisible();
  });
});
