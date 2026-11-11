import { expect } from '@playwright/test';
import { test } from './browser-diagnostics.fixture';

test('SearchService selects a service and exposes the output', async ({ page }) => {
  await page.goto('/coverage/public-contracts?feature=service');
  await page.getByLabel('Choose a service').fill('Immigration');
  await page.getByRole('option', { name: 'Immigration and Asylum', exact: true }).click();
  await expect(page.getByTestId('service-selection')).toContainText('"IA"');
});

test('InviteUserPermission renders its accessible role choices', async ({ page }) => {
  await page.goto('/coverage/public-contracts?feature=permission');
  await expect(page.getByRole('group', { name: 'Permissions' })).toBeVisible();
  await expect(page.getByRole('checkbox', { name: 'Manage Cases' })).toBeVisible();
  await expect(page.getByRole('checkbox', { name: 'Manage Users' })).toBeVisible();
  await expect(page.getByRole('checkbox', { name: 'Manage Organisation' })).toBeVisible();
  await page.getByRole('checkbox', { name: 'Manage Users' }).check();
  await expect(page.getByTestId('permission-value')).toContainText('pui-user-manager');
});

test('SearchLocation exposes a dedicated selectable location journey', async ({ page }) => {
  await page.route('**/api/locations/getLocations', (route) => route.fulfill({ json: [{
    epimms_id: 'loc-demo', site_name: 'Central London Hearing Centre', court_name: 'CENTRAL LONDON HEARING CENTRE'
  }] }));
  await page.goto('/coverage/public-contracts?feature=location');
  await page.locator('#inputLocationSearch').fill('London');
  await page.getByRole('option', { name: 'Central London Hearing Centre', exact: true }).click();
  await expect(page.getByTestId('location-selection')).toContainText('loc-demo');
});

test('GOV.UK label renders the page-heading and optional branches', async ({ page }) => {
  await page.goto('/coverage/public-contracts?feature=label');
  const label = page.locator('h1 label[for="contract-label"]');
  await expect(label).toContainText('Label contract');
  await expect(label).toContainText('(optional)');
});
