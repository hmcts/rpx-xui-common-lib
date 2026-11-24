import { expect } from '@playwright/test';
import { test } from './browser-diagnostics.fixture';

test.describe('component-validator browser contracts', () => {
  test('SearchWorkType waits for the minimum term and prevents numeric input', async ({ page }) => {
    const searchTerms: string[] = [];

    await page.route('**/workallocation/task/search-types-of-work', async (route) => {
      searchTerms.push(route.request().postDataJSON().searchTerm as string);
      await route.fulfill({ json: [{ key: 'review', label: 'Review case' }] });
    });
    await page.goto('/coverage/lookups?feature=search-work-type');

    const input = page.locator('#inputWorkTypeSearch');
    await input.fill('Re');
    // SearchWorkType debounces API calls by 300 ms; wait beyond that boundary before proving no request.
    await page.waitForTimeout(350);
    expect(searchTerms).toEqual([]);

    await input.fill('Review');
    await expect.poll(() => searchTerms).toEqual(['Review']);
    await expect(page.getByRole('option', { name: 'Review case', exact: true })).toBeVisible();

    await input.press('1');
    await expect(input).toHaveValue('Review');
  });

  test('GOV.UK form-group wrapper exposes its group and described-by contract', async ({ page }) => {
    await page.goto('/coverage?feature=form-group');

    const group = page.locator('[data-testid="form-group-demo"] .govuk-form-group');
    await expect(group).toHaveAttribute('formgroupname', 'wrapped-options');
    await expect(group.locator('fieldset')).toHaveAttribute('aria-describedby', /wrapped-options-hint/);
    await expect(group.locator('fieldset')).toHaveAttribute('aria-describedby', /wrapped-options-error/);
  });
});
