import { expect } from '@playwright/test';
import { test } from './browser-diagnostics.fixture';
import { AdditionalCoveragePage } from './additional-coverage.po';

test.describe('additional CommonLib component coverage', () => {
  test('renders the page wrapper content and follows its back link', async ({ page }) => {
    const coverage = new AdditionalCoveragePage(page);
    await coverage.openStandalone();

    await expect(coverage.pageTitle).toContainText('Standalone wrapper title');
    await expect(coverage.pageCaption).toBeVisible();
    await expect(coverage.backLink).toHaveAttribute('href', '/coverage');
    await expect(coverage.wrapperContent).toHaveText('Projected wrapper content');

    await coverage.backLink.click();
    await expect(page).toHaveURL(/\/coverage$/);
    await expect(page.getByRole('heading', { name: 'CommonLib component coverage examples', exact: true })).toBeVisible();
  });

  test('removes the page wrapper heading, caption and back link when inputs are cleared', async ({ page }) => {
    const coverage = new AdditionalCoveragePage(page);
    await coverage.openStandalone();

    await coverage.toggleTitle.click();
    await coverage.toggleBackLink.click();
    await coverage.toggleCaption.click();

    await expect(coverage.pageTitle).toHaveCount(0);
    await expect(coverage.pageCaption).toHaveCount(0);
    await expect(coverage.backLink).toHaveCount(0);
    await expect(coverage.wrapperContent).toHaveText('Projected wrapper content');
  });

  test('selects each radio option and updates the parent form value', async ({ page }) => {
    const coverage = new AdditionalCoveragePage(page);
    await coverage.openStandalone();

    await expect(coverage.radio('First route')).toBeChecked();
    await coverage.radio('Second route').check();
    await expect(coverage.radio('Second route')).toBeChecked();
    await expect.poll(async () => JSON.parse(await coverage.formValue.innerText())).toEqual({ choice: 'second', consent: false });
  });

  test('renders and clears the radio group error with its fieldset association', async ({ page }) => {
    const coverage = new AdditionalCoveragePage(page);
    await coverage.openStandalone();

    await coverage.toggleRadioError.click();
    await expect(coverage.radiosGroup).toHaveClass(/govuk-form-group--error/);
    await expect(page.locator('#choices-error')).toContainText('Choose a route');
    await expect(page.locator('fieldset').filter({ hasText: 'Preferred route' })).toHaveAttribute('aria-describedby', /choices-error/);

    await coverage.toggleRadioError.click();
    await expect(coverage.radiosGroup).not.toHaveClass(/govuk-form-group--error/);
    await expect(page.locator('#choices-error')).toHaveCount(0);
  });

  test('renders the standalone checkbox label and returns its parent value to false with Space', async ({ page }) => {
    const coverage = new AdditionalCoveragePage(page);

    await coverage.openStandalone();

    await expect(coverage.checkbox).toHaveAttribute('id', 'consent-checkbox');
    await expect(page.locator('label[for="consent-checkbox"]')).toContainText('Email updates');
    await expect(page.locator('.govuk-label__optional')).toHaveText('(optional)');
    await expect(page.getByText('Receive status updates.', { exact: true })).toBeVisible();
    await coverage.checkbox.check();
    await expect.poll(async () => JSON.parse(await coverage.formValue.innerText())).toEqual({ choice: 'first', consent: true });
    await coverage.checkbox.press('Space');
    await expect(coverage.checkbox).not.toBeChecked();
    await expect.poll(async () => JSON.parse(await coverage.formValue.innerText())).toEqual({ choice: 'first', consent: false });
  });

  test('preserves disabled checkbox and radio values and allows edits after re-enabling', async ({ page }) => {
    const coverage = new AdditionalCoveragePage(page);
    await coverage.openStandalone();
    await coverage.checkbox.check();
    await coverage.radio('Second route').check();
    await expect.poll(async () => JSON.parse(await coverage.formValue.innerText())).toEqual({ choice: 'second', consent: true });

    await coverage.disableControls.click();
    await expect(coverage.checkbox).toBeDisabled();
    await expect(coverage.radio('First route')).toBeDisabled();
    await expect(coverage.radio('Second route')).toBeDisabled();
    await expect(coverage.checkbox).toBeChecked();
    await expect(coverage.radio('Second route')).toBeChecked();
    await expect.poll(async () => JSON.parse(await coverage.formValue.innerText())).toEqual({ choice: 'second', consent: true });

    await coverage.enableControls.click();
    await expect(coverage.checkbox).toBeEnabled();
    await expect(coverage.radio('First route')).toBeEnabled();
    await expect(coverage.radio('Second route')).toBeEnabled();
    await expect.poll(async () => JSON.parse(await coverage.formValue.innerText())).toEqual({ choice: 'second', consent: true });
    await coverage.checkbox.press('Space');
    await coverage.radio('First route').press('Space');
    await expect(coverage.checkbox).not.toBeChecked();
    await expect(coverage.radio('First route')).toBeChecked();
    await expect(coverage.radio('Second route')).not.toBeChecked();
    await expect.poll(async () => JSON.parse(await coverage.formValue.innerText())).toEqual({ choice: 'first', consent: false });
  });

  test('renders the organisation accessibility statement with service links and contact details', async ({ page }) => {
    const coverage = new AdditionalCoveragePage(page);
    await coverage.openAccessibility();

    await expect(page.getByRole('heading', { name: 'Accessibility statement for MyHMCTS Manage Organisation', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Immigration and Asylum', exact: true })).toHaveAttribute('href', 'accessibility#immigration');
    await expect(page.getByRole('link', { name: 'HMCTSforms@justice.gov.uk', exact: true })).toHaveAttribute('href', 'mailto:HMCTSforms@justice.gov.uk');
    await expect(page.getByRole('heading', { name: 'Adoption', exact: true })).toBeVisible();
    await expect(page.getByText('If you are member of HMCTS staff or the Judiciary speak to your line manager or equivalent in the first instance.', { exact: true })).toHaveCount(1);
  });

  test('renders the Manage Cases accessibility variant with the staff guidance', async ({ page }) => {
    const coverage = new AdditionalCoveragePage(page);
    await coverage.openAccessibility('cases');

    await expect(page.getByRole('heading', { name: 'Accessibility statement for MyHMCTS Manage Cases', exact: true })).toBeVisible();
    await expect(page.getByText('If you are member of HMCTS staff or the Judiciary speak to your line manager or equivalent in the first instance.', { exact: true })).toHaveCount(2);
    await expect(page.getByRole('link', { name: /Equality Advisory and Support Service \(EASS\)/ })).toHaveAttribute('target', '_blank');
  });
});
