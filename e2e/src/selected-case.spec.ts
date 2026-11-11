import { expect } from '@playwright/test';
import { test } from './browser-diagnostics.fixture';
import { SelectedCasePage } from './selected-case.po';

test('selected case list exposes no-user state and unselect output', async ({ page }) => {
  const selectedCases = new SelectedCasePage(page);
  await selectedCases.open('no-user');
  await expect(page.getByRole('heading', { name: 'Selected case component demo' })).toBeVisible();
  await selectedCases.case('DEMO-001').getByRole('button', { name: 'Expand or Collapse' }).click();
  await expect(selectedCases.case('DEMO-001')).toContainText('No users from your organisation currently have access to this case.');
  await selectedCases.case('DEMO-001').getByRole('button', { name: 'Deselect case' }).click();
  await expect(selectedCases.case('DEMO-001')).toHaveCount(0);
  await expect(page.getByTestId('selected-case-unselected')).toContainText('DEMO-001');
});

test('selected case confirmation renders pending access and change link', async ({ page }) => {
  const selectedCases = new SelectedCasePage(page);
  await selectedCases.open('confirm');
  await expect(selectedCases.case('DEMO-001')).toHaveCount(0);

  await selectedCases.open('pending');
  await expect(selectedCases.case('DEMO-001')).toContainText('To be added');
  await selectedCases.open('confirm');
  await expect(page.getByRole('link', { name: 'Change selected case' }).first()).toBeVisible();
});

test('selected case component emits the direct unselect contract', async ({ page }) => {
  const selectedCases = new SelectedCasePage(page);
  await selectedCases.open('direct');
  await expect(selectedCases.case('DEMO-001')).toContainText('Synthetic case Alpha');
  await selectedCases.case('DEMO-001').getByRole('button', { name: 'Deselect case' }).click();
  await expect(page.getByTestId('selected-case-unselected')).toContainText('DEMO-001');
});

test('selected case component emits synchronize output when a user is removed', async ({ page }) => {
  const selectedCases = new SelectedCasePage(page);
  await selectedCases.open('direct');
  await selectedCases.case('DEMO-001').getByRole('button', { name: 'Expand or Collapse' }).click();
  await selectedCases.case('DEMO-001').getByRole('link', { name: 'Remove Alex Taylor from case' }).click();
  await expect(page.getByTestId('selected-case-synchronized')).toContainText('demo-alex');
  await expect(page.getByTestId('selected-case-synchronized')).toContainText('pendingUnshares');
});

test('selected case confirmation component renders its direct pending contract', async ({ page }) => {
  const selectedCases = new SelectedCasePage(page);
  await selectedCases.open('confirm-direct');
  await expect(page.getByText('Synthetic case Alpha')).toBeVisible();
  await expect(page.getByText('To be added')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Change selected case' })).toBeVisible();
});
