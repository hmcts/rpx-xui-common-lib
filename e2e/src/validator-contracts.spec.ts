import { expect } from '@playwright/test';
import { test } from './browser-diagnostics.fixture';

test.describe('validator contracts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/coverage/validators');
  });

  test('date validator reports missing values, accepts a complete date, and rejects non-numeric input', async ({ page }) => {
    await expect(page.getByTestId('date-validator-status')).toHaveText('invalid');
    await expect(page.getByTestId('date-validator-errors')).toContainText('dateIsInvalid');

    await page.getByRole('button', { name: 'Set valid date' }).click();
    await expect(page.getByTestId('date-validator-status')).toHaveText('valid');
    await expect(page.getByTestId('date-validator-errors')).toHaveText('null');

    await page.getByRole('button', { name: 'Set malformed date' }).click();
    await expect(page.getByTestId('date-validator-status')).toHaveText('invalid');
    await expect(page.getByTestId('date-validator-errors')).toContainText('dateIsInvalid');

    await page.getByRole('button', { name: 'Clear date' }).click();
    await expect(page.getByTestId('date-validator-status')).toHaveText('invalid');
  });

  test('date validator exposes the current calendar-overflow normalisation behaviour', async ({ page }) => {
    await page.getByRole('button', { name: 'Set calendar-invalid date' }).click();
    await expect(page.getByTestId('date-validator-status')).toHaveText('valid');
    await expect(page.getByTestId('date-validator-errors')).toHaveText('null');
  });

  test('radio-group validator exposes invalid and valid group states', async ({ page }) => {
    await expect(page.getByTestId('radio-validator-status')).toHaveText('invalid');
    await expect(page.getByTestId('radio-validator-errors')).toContainText('isRadioGroupInvalid');

    await page.getByRole('button', { name: 'Select all radio controls' }).click();
    await expect(page.getByTestId('radio-validator-status')).toHaveText('valid');
    await expect(page.getByTestId('radio-validator-errors')).toHaveText('null');
  });

  test('checkbox validator requires one checked control and accepts a checked control', async ({ page }) => {
    await expect(page.getByTestId('checkbox-validator-status')).toHaveText('invalid');
    await expect(page.getByTestId('checkbox-validator-errors')).toContainText('requireOneCheckboxToBeChecked');

    await page.getByRole('button', { name: 'Check Civil' }).click();
    await expect(page.getByTestId('checkbox-validator-status')).toHaveText('valid');
    await expect(page.getByTestId('checkbox-validator-errors')).toHaveText('null');

    await page.getByRole('button', { name: 'Clear checkboxes' }).click();
    await expect(page.getByTestId('checkbox-validator-status')).toHaveText('invalid');
  });
});
