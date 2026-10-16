import { expect } from '@playwright/test';
import { test } from './browser-diagnostics.fixture';
import { PrimitivesPage } from './primitives.po';

test.beforeEach(async ({ page }) => {
  const primitives = new PrimitivesPage(page);
  await primitives.open();
});

test('binds parent form values, preserves edits, and selects checkbox and radio options', async ({ page }) => {
  const primitives = new PrimitivesPage(page);
  await primitives.notes.fill('Edited notes');
  await primitives.checkbox('Email alerts').check();
  await primitives.radio('Urgent').check();

  await expect.poll(async () => JSON.parse(await primitives.formValue.innerText())).toEqual({
    notes: 'Edited notes',
    notifications: ['sms', 'email'],
    urgency: 'urgent',
    preserved: 'preserved',
    disabledField: 'Unavailable value'
  });
  await expect(primitives.checkbox('Email alerts')).toBeChecked();
  await expect(primitives.radio('Urgent')).toBeChecked();
});

test('clears supplied errors without losing edits and re-enables a disabled control', async ({ page }) => {
  const primitives = new PrimitivesPage(page);
  await primitives.notes.fill('Keep this edit');
  await primitives.toggleErrors.click();
  await expect(primitives.errors).toContainText('Choose a priority');
  await primitives.toggleErrors.click();
  await expect(primitives.errors).toBeEmpty();
  await expect(primitives.notes).toHaveValue('Keep this edit');

  await expect(primitives.disabledControl).toBeDisabled();
  await primitives.toggleDisabled.click();
  await expect(primitives.disabledControl).toBeEnabled();
  await primitives.disabledControl.fill('Re-enabled value');
  await expect(primitives.formValue).toContainText('Re-enabled value');
});

test('renders projected fieldset content with and without a page-heading variant', async ({ page }) => {
  const primitives = new PrimitivesPage(page);
  await expect(primitives.fieldsets).toHaveCount(2);
  await expect(primitives.fieldsets.nth(0).locator('legend')).toHaveText('Contact details');
  await expect(primitives.fieldsets.nth(0).locator('legend h1')).toHaveCount(0);
  await expect(primitives.fieldsets.nth(1).locator('legend h1')).toHaveText('Choice details');
  await expect(primitives.fieldsets.nth(0)).toContainText('Projected fieldset content');
  await expect(primitives.fieldsets.nth(1)).toContainText('Projected fieldset content');
});

test('renders table headers, router links, and library-formatted dates', async ({ page }) => {
  const primitives = new PrimitivesPage(page);
  await expect(primitives.table.getByRole('columnheader')).toHaveText(['Case', 'Opened', 'Status']);
  await expect(primitives.table.getByRole('link', { name: 'Case 1001', exact: true })).toHaveAttribute('href', '/home');
  await expect(primitives.table).toContainText('07/01/2024');
  await expect(primitives.table).toContainText('Open');
});

test('toggles identity visibility and emits the main-wrapper back event', async ({ page }) => {
  const primitives = new PrimitivesPage(page);
  await expect(primitives.identity).toContainText('Alex Taylor');
  await primitives.toggleIdentity.click();
  await expect(primitives.identity.locator('.hmcts-identity-bar')).toHaveCount(0);
  await primitives.toggleIdentity.click();
  await expect(primitives.identity).toContainText('Alex Taylor');

  await primitives.backLink.click();
  await expect(primitives.backEvents).toHaveText('1');
});

test('supports next, previous, last, bounds correction, and display toggling', async ({ page }) => {
  const primitives = new PrimitivesPage(page);
  await expect(primitives.pageNumber).toHaveText('Page 1');
  await primitives.nextPage.click();
  await expect(primitives.pageNumber).toHaveText('Page 2');
  await primitives.pageLink(3).click();
  await expect(primitives.pageNumber).toHaveText('Page 3');
  await primitives.previousPage.click();
  await expect(primitives.pageNumber).toHaveText('Page 2');
  await primitives.pageLink(3).click();
  await expect(primitives.paginationResults).toBeVisible();
  await primitives.togglePaginationDisplays.click();
  await expect(primitives.paginationResults).toHaveCount(0);
  await expect(primitives.pageLink(2)).toHaveCount(0);
  await primitives.togglePaginationDisplays.click();
  await expect(primitives.paginationResults).toBeVisible();
  await primitives.reduceRecords.click();
  await expect(primitives.pageNumber).toHaveText('Page 1');
  await expect(page.getByTestId('pagination-bounds')).toHaveText('1');
});
