import { expect } from '@playwright/test';
import { test } from './browser-diagnostics.fixture';
import { AdditionalCoveragePage } from './additional-coverage.po';

test.describe('extended CommonLib component coverage', () => {
  test('binds a GovUK input to the parent form and exposes its supplied error state', async ({ page }) => {
    const coverage = new AdditionalCoveragePage(page);
    await coverage.openExtendedControls();

    await coverage.fullNameInput.fill('Synthetic name');
    await expect.poll(async () => JSON.parse(await coverage.extendedFormValue.innerText())).toMatchObject({ name: 'Synthetic name' });

    await coverage.toggleInputErrorButton.click();
    await expect(coverage.inputGroup).toHaveClass(/govuk-form-group--error/);
    await expect(coverage.fullNameInput).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('.govuk-error-message').filter({ hasText: 'Enter a full name' })).toBeVisible();
    await expect(coverage.fullNameInput).toHaveAttribute('aria-describedby', /full-name-error/);

    await coverage.toggleInputErrorButton.click();
    await expect(coverage.inputGroup).not.toHaveClass(/govuk-form-group--error/);
    await expect(coverage.fullNameInput).not.toHaveAttribute('aria-invalid', 'true');
  });

  test('selects and removes multi-checkbox values while preserving row layout', async ({ page }) => {
    const coverage = new AdditionalCoveragePage(page);
    await coverage.openExtendedControls();

    await expect(coverage.checkboxOption('Alpha service')).toBeChecked();
    await coverage.checkboxOption('Beta service').check();
    await coverage.checkboxOption('Alpha service').uncheck();
    await expect.poll(async () => JSON.parse(await coverage.extendedFormValue.innerText())).toMatchObject({ selections: ['beta'] });
    await expect(coverage.checkboxOption('Beta service')).toBeChecked();
    await expect(page.locator('.govuk-checkboxes-multi-column__single')).toHaveCount(2);

    await coverage.toggleCheckboxErrorButton.click();
    await expect(coverage.checkboxGroup).toHaveClass(/govuk-form-group--error/);
    await expect(page.locator('.govuk-error-message').filter({ hasText: 'Choose at least one service' })).toBeVisible();
    await expect(page.locator('#service-selections-error')).toBeVisible();
  });

  test('filters service autocomplete options and records the selected service', async ({ page }) => {
    const coverage = new AdditionalCoveragePage(page);
    await coverage.openExtendedControls();

    await coverage.serviceSearch.fill('ci');
    await expect(page.getByRole('option', { name: 'Civil Money Claims', exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Alpha service', exact: true })).toHaveCount(0);

    await coverage.serviceSearch.fill('civil');
    await page.getByRole('option', { name: 'Civil Money Claims', exact: true }).click();
    await expect.poll(async () => JSON.parse(await coverage.selectedServices.innerText())).toEqual([
      { key: 'alpha', label: 'Alpha service' },
      { key: 'civil', label: 'Civil Money Claims' }
    ]);
  });

  test('shows the service autocomplete no-results state and restores remaining options', async ({ page }) => {
    const coverage = new AdditionalCoveragePage(page);
    await coverage.openExtendedControls();

    await coverage.serviceSearch.fill('unknown');
    await expect(page.getByRole('option', { name: 'No results found', exact: true })).toBeVisible();
    await coverage.serviceSearch.fill('family');
    await expect(page.getByRole('option', { name: 'Family Public Law', exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: 'No results found', exact: true })).toHaveCount(0);
  });

  test('renders UK address-input validation and switches to the international contract', async ({ page }) => {
    const coverage = new AdditionalCoveragePage(page);
    await coverage.openExtendedControls();

    await expect(coverage.addressInput('country')).toHaveCount(0);
    await expect(page.getByLabel('Postcode', { exact: true })).toBeVisible();

    await coverage.toggleAddressErrorsButton.click();
    await expect(page.locator('.govuk-error-message').filter({ hasText: 'Enter building and street' })).toBeVisible();
    await expect(page.locator('.govuk-error-message').filter({ hasText: 'Enter town or city' })).toBeVisible();
    await expect(page.locator('.govuk-error-message').filter({ hasText: 'Enter a valid postcode' })).toBeVisible();

    await coverage.toggleInternationalButton.click();
    await expect(coverage.addressInput('country')).toBeVisible();
    await expect(page.getByLabel('Postcode (Optional)', { exact: true })).toBeVisible();
    await expect(page.locator('.govuk-error-message').filter({ hasText: 'Enter country' })).toBeVisible();
    await expect(page.locator('.govuk-error-message').filter({ hasText: 'Enter a valid postcode' })).toHaveCount(0);
  });
});
