import { expect } from '@playwright/test';
import { test } from './browser-diagnostics.fixture';
import { AddressPage } from './address.po';

test('blank postcode shows an error without issuing a lookup', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('/external/addresses')) {
      requests.push(request.url());
    }
  });
  await page.goto('/coverage/address');
  await page.getByRole('button', { name: 'Find address', exact: true }).click();
  await expect(page.locator('#addressLookup')).toContainText('Enter a valid postcode');
  expect(requests).toEqual([]);
  await expect(page.getByTestId('address-selected-count')).toHaveText('0');
});

test('lookup normalizes postcode and emits the parsed selected address once', async ({ page }) => {
  await page.goto('/coverage/address');
  const address = new AddressPage(page);
  const request = page.waitForRequest((candidate) => candidate.url().includes('/external/addresses?'));
  await address.lookup();
  expect(new URL((await request).url()).searchParams.get('postcode')).toBe('AB12CD');
  await expect(page.locator('#addressList option')).toHaveText(['2 addresses found', '10 Demo Street, Testville', '12 Demo Street, Testville']);
  await page.getByLabel('Select an address', { exact: true }).selectOption({ label: '12 Demo Street, Testville' });
  await expect(page.getByLabel('Building and Street', { exact: true })).toHaveValue('12 Demo Street');
  await expect.poll(() => address.value()).toEqual({ address: { addressLine1: '12 Demo Street', addressLine2: '', addressLine3: '', postTown: 'Testville', county: null, postCode: 'AB1 2CD', country: 'United Kingdom' } });
  await expect(page.getByTestId('address-selected-count')).toHaveText('1');
});

test('successful lookup marks the address list selectable and maps the first result', async ({ page }) => {
  await page.goto('/coverage/address');
  const address = new AddressPage(page);
  await address.lookup();

  await expect(page.getByTestId('address-selectable')).toHaveText('true');
  await page.getByLabel('Select an address', { exact: true }).selectOption({ label: '10 Demo Street, Testville' });
  await expect.poll(() => address.value()).toEqual({ address: {
    addressLine1: '10 Demo Street', addressLine2: '', addressLine3: '', postTown: 'Testville',
    county: null, postCode: 'AB1 2CD', country: 'United Kingdom'
  } });
  await expect(page.getByTestId('address-selected-count')).toHaveText('1');
});

test('empty lookup has no selectable address and emits no selection', async ({ page }) => {
  await page.goto('/coverage/address');
  const address = new AddressPage(page);
  await address.lookup(true);
  await expect(page.locator('#addressList option')).toHaveText(['No address found']);
  await expect(page.getByTestId('address-selectable')).toHaveText('false');
  await expect(page.getByTestId('address-selected-count')).toHaveText('0');
  await expect.poll(() => address.value()).toEqual({ address: { addressLine1: null, addressLine2: null, addressLine3: null, postTown: null, county: null, postCode: null, country: null } });
});

test('HTTP 500 lookup clears address options and preserves the empty contract', async ({ page, allowBrowserDiagnostic }) => {
  allowBrowserDiagnostic({ message: 'Failed to load resource: the server responded with a status of 500', url: '/external/addresses' });
  await page.goto('/coverage/address');
  const address = new AddressPage(page);
  await address.lookup();
  await expect(page.locator('#addressList option')).toHaveText(['2 addresses found', '10 Demo Street, Testville', '12 Demo Street, Testville']);
  const response = page.waitForResponse((candidate) => candidate.url().includes('/external/addresses?'));
  await address.lookupFailure();
  expect((await response).status()).toBe(500);
  await expect(page.locator('#addressList option')).toHaveText(['No address found']);
  await expect(page.getByTestId('address-selectable')).toHaveText('false');
  await expect(page.getByTestId('address-selected-count')).toHaveText('0');
  await expect.poll(() => address.value()).toEqual({ address: { addressLine1: null, addressLine2: null, addressLine3: null, postTown: null, county: null, postCode: null, country: null } });
});

test('manual international entry updates real nested controls and toggles country and postcode labels', async ({ page }) => {
  await page.goto('/coverage/address');
  const address = new AddressPage(page);
  await page.getByRole('link', { name: 'I can\'t enter a UK postcode', exact: true }).click();
  await page.getByRole('radio', { name: 'No', exact: true }).check();
  await page.getByLabel('Building and Street', { exact: true }).fill('20 Example Avenue');
  await page.getByLabel('Town or City', { exact: true }).fill('Paris');
  await page.getByLabel('Country', { exact: true }).fill('France');
  await expect(page.getByLabel('Postcode (Optional)', { exact: true })).toBeVisible();
  await expect.poll(() => address.value()).toEqual({ address: { addressLine1: '20 Example Avenue', addressLine2: '', addressLine3: '', postTown: 'Paris', county: '', postCode: '', country: 'France' } });
  await page.getByRole('radio', { name: 'Yes', exact: true }).check();
  await expect(page.getByLabel('Country', { exact: true })).toHaveCount(0);
  await expect(page.getByLabel('Postcode', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Building and Street', { exact: true })).toHaveValue('20 Example Avenue');
  await expect(page.getByTestId('address-selected-count')).toHaveText('0');
});
