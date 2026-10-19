import { expect } from '@playwright/test';
import { test } from './browser-diagnostics.fixture';

test.describe('CommonLib coverage', () => {
  test.describe('generic filter', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/coverage?feature=filter');
    });

    test('requires a service before persisting a filter', async ({ page }) => {
      await page.getByRole('button', { name: 'Apply filters' }).click();

      await expect(page.getByTestId('filter-result')).toHaveText('null');
      expect(await page.evaluate(() => sessionStorage.getItem('commonlib-coverage-filter'))).toBeNull();
    });

    test('persists the selected checkbox, radio and region', async ({ page }) => {
      await page.getByRole('checkbox', { name: 'Civil' }).check();
      await page.getByRole('radio', { name: 'Urgent' }).check();
      await page.locator('#select_region').selectOption('london');
      await page.getByRole('button', { name: 'Apply filters' }).click();

      await expect(page.getByTestId('filter-result')).toContainText('civil');
      await expect(page.getByTestId('filter-result')).toContainText('urgent');
      await expect(page.getByTestId('filter-result')).toContainText('london');
      await expect.poll(() => page.evaluate(() => sessionStorage.getItem('commonlib-coverage-filter')))
        .toContain('civil');
    });

    test('cancel restores the last applied filter', async ({ page }) => {
      await page.getByRole('checkbox', { name: 'Family' }).check();
      await page.getByRole('button', { name: 'Apply filters' }).click();
      await expect(page.getByTestId('filter-result')).toContainText('family');

      await page.getByRole('checkbox', { name: 'Civil' }).check();
      await page.getByRole('button', { name: 'Cancel changes' }).click();
      await expect(page.getByRole('checkbox', { name: 'Family' })).toBeChecked();
      await expect(page.getByRole('checkbox', { name: 'Civil' })).not.toBeChecked();
      await expect(page.getByTestId('filter-result')).toContainText('family');
    });
  });

  test.describe('pagination', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/coverage?feature=pagination');
    });

    test('starts at the first page with no previous link', async ({ page }) => {
      await expect(page.getByTestId('page-number')).toHaveText('Page 1');
      await expect(page.getByRole('link', { name: 'Previous page' })).toHaveCount(0);
      await expect(page.getByRole('link', { name: 'Next page' })).toBeVisible();
    });

    test('moves forward and back through emitted page events', async ({ page }) => {
      await page.getByRole('link', { name: 'Next page' }).click();
      await expect(page.getByTestId('page-number')).toHaveText('Page 2');
      await page.getByRole('link', { name: 'Previous page' }).click();
      await expect(page.getByTestId('page-number')).toHaveText('Page 1');
    });

    test('removes the next link at the last page', async ({ page }) => {
      await page.getByRole('link', { name: 'Next page' }).click();
      await page.getByRole('link', { name: 'Next page' }).click();

      await expect(page.getByTestId('page-number')).toHaveText('Page 3');
      await expect(page.getByRole('link', { name: 'Next page' })).toHaveCount(0);
    });
  });

  test.describe('cookie banner', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/coverage?feature=cookie');
    });

    test('accepts analytics cookies and hides the banner after reload', async ({ page, context }) => {
      await page.getByRole('button', { name: 'Accept analytics cookies' }).click();

      await page.reload();
      await expect(page.getByRole('button', { name: 'Accept analytics cookies' })).toHaveCount(0);
      expect((await context.cookies()).find((cookie) => cookie.name === 'commonlib-coverage-cookie')?.value).toBe('true');
    });

    test('rejects analytics cookies and hides the banner after reload', async ({ page, context }) => {
      await page.getByRole('button', { name: 'Reject analytics cookies' }).click();

      await page.reload();
      await expect(page.getByRole('button', { name: 'Reject analytics cookies' })).toHaveCount(0);
      expect((await context.cookies()).find((cookie) => cookie.name === 'commonlib-coverage-cookie')?.value).toBe('false');
    });
  });

  test.describe('user selection', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/coverage?feature=users');
    });

    test('filters and selects a user by name', async ({ page }) => {
      await page.getByRole('combobox', { name: 'Select a user' }).fill('Alex');
      await page.getByRole('option', { name: /Alex Taylor/ }).click();

      await expect(page.getByTestId('selected-user')).toHaveText('alex@example.test');
    });

    test('clears the selection when the input is emptied', async ({ page }) => {
      const userInput = page.getByRole('combobox', { name: 'Select a user' });
      await userInput.fill('Sam');
      await page.getByRole('option', { name: /Sam Morgan/ }).click();
      await expect(page.getByTestId('selected-user')).toHaveText('sam@example.test');

      await userInput.fill('');
      await expect(page.getByTestId('selected-user')).toHaveText('No user selected');
    });

    test('does not offer unrelated users for an unmatched query', async ({ page }) => {
      await page.getByRole('combobox', { name: 'Select a user' }).fill('nobody');
      await expect(page.getByRole('option')).toHaveCount(0);
      await expect(page.getByTestId('selected-user')).toHaveText('No user selected');
    });
  });

  test.describe('terms confirmation', () => {
    test('emits confirmation when the user accepts the terms', async ({ page }) => {
      await page.goto('/coverage?feature=terms');

      await expect(page.getByTestId('terms-result')).toHaveText('Terms not accepted');
      await page.getByRole('button', { name: 'Accept terms' }).click();
      await expect(page.getByTestId('terms-result')).toHaveText('Terms accepted');
    });
  });

  test.describe('navigation components', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/coverage?feature=navigation');
    });

    test('shows the active primary and secondary destinations', async ({ page }) => {
      const primary = page.getByRole('navigation', { name: 'Primary demo navigation' });
      const secondary = page.getByRole('navigation', { name: 'Secondary demo navigation' });

      await expect(primary.getByRole('link', { name: 'Coverage examples' })).toHaveAttribute('aria-current', 'true');
      await expect(secondary.getByRole('link', { name: /Current section/ })).toHaveAttribute('aria-current', 'page');
      await expect(secondary.getByText('2')).toBeVisible();
    });

    test('navigates to the existing home demo', async ({ page }) => {
      await page.getByRole('navigation', { name: 'Primary demo navigation' })
        .getByRole('link', { name: 'Home demo' }).click();

      await expect(page).toHaveURL(/\/home$/);
      await expect(page.getByRole('heading', { name: 'ExUI Common Lib Test Page', exact: true })).toBeVisible();
    });
  });

  test.describe('feedback components', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/coverage?feature=feedback');
    });

    test('renders success and warning banners with distinct messages', async ({ page }) => {
      await expect(page.locator('.hmcts-banner--success')).toContainText('The action was saved');
      await expect(page.locator('.hmcts-banner--warning')).toContainText('Action needs attention');
      await expect(page.locator('.hmcts-banner-title--success')).toHaveText('Completed');
    });

    test('links the error summary to its field and prefixes the page title', async ({ page }) => {
      await page.getByRole('button', { name: 'Show validation errors' }).click();
      const summary = page.getByRole('alert');
      await expect(summary).toContainText('Enter an email address');
      await expect(summary).toContainText('Check your details');
      await expect(page).toHaveTitle(/^Error:/);

      await summary.locator('a', { hasText: 'Enter an email address' }).click();
      await expect(page.getByRole('textbox', { name: 'Email address' })).toBeFocused();
      await expect(summary.locator('a', { hasText: 'Check your details' })).toHaveCount(0);
    });
  });

  test.describe('session dialog', () => {
    test('presents the dialog and projected timeout content', async ({ page }) => {
      await page.goto('/coverage?feature=dialog');

      const dialog = page.getByRole('dialog');
      await expect(dialog).toHaveAttribute('aria-modal', 'true');
      await expect(dialog).toContainText('We are about to sign you out');
      await expect(dialog).toContainText('Your session will end soon.');
    });
  });
});
