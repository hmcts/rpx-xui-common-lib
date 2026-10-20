import { expect } from '@playwright/test';
import { test } from './browser-diagnostics.fixture';
import { postcodeResponse } from './address.data';
import { caseworkers } from '../../src/app/coverage-demo/search-demo.data';

const route = '/coverage/remaining';

test.describe('remaining CommonLib browser contracts', () => {
  test('mounts the remaining composed components directly', async ({ page }) => {
    await page.goto(route);

    await expect(page.locator('xuilib-tc-display-html')).toHaveCount(1);
    await expect(page.getByRole('heading', { name: 'Direct HTML terms' })).toBeVisible();
    await expect(page.locator('xuilib-tc-display-plain')).toHaveCount(1);
    await expect(page.getByText('Projected plain terms.', { exact: true })).toBeVisible();
    await expect(page.locator('xuilib-share-case-confirm')).toHaveCount(1);
    await expect(page.getByRole('button', { name: 'Confirm', exact: true })).toBeVisible();
  });

  test('address service formats a successful postcode response', async ({ page }) => {
    await page.route('**/external/addresses?postcode=*', (request) => request.fulfill({ json: postcodeResponse }));
    await page.goto(route);

    const request = page.waitForRequest((candidate) => new URL(candidate.url()).pathname === '/external/addresses');
    const response = page.waitForResponse((candidate) => new URL(candidate.url()).pathname === '/external/addresses');
    await page.getByRole('button', { name: 'Lookup address', exact: true }).click();
    const submitted = await request;
    expect(submitted.method()).toBe('GET');
    expect(new URL(submitted.url()).searchParams.get('postcode')).toBe('AB12CD');
    expect((await response).status()).toBe(200);
    await expect(page.getByTestId('remaining-address-state')).toHaveText('ready');
    await expect(page.getByTestId('remaining-address-value')).toContainText('10 Demo Street');
    await expect(page.getByTestId('remaining-address-value')).toContainText('Testville');
  });

  test('address service exposes a controlled 5xx failure', async ({ page, allowBrowserDiagnostic }) => {
    allowBrowserDiagnostic({ message: 'Failed to load resource', url: '/external/addresses' });
    await page.route('**/external/addresses?postcode=*', (request) => request.fulfill({ status: 503, body: 'address service unavailable' }));
    await page.goto(route);

    const response = page.waitForResponse((candidate) => new URL(candidate.url()).pathname === '/external/addresses');
    await page.getByRole('button', { name: 'Lookup address', exact: true }).click();
    expect((await response).status()).toBe(503);
    await expect(page.getByTestId('remaining-address-state')).toHaveText('error');
    await expect(page.getByTestId('remaining-address-value')).toHaveText('null');
  });

  test('find-person service applies the assigned-user exclusion', async ({ page }) => {
    await page.route('**/workallocation/caseworker/getUsersByServiceName', (request) => request.fulfill({ json: caseworkers }));
    await page.goto(route);

    const request = page.waitForRequest((candidate) => new URL(candidate.url()).pathname === '/workallocation/caseworker/getUsersByServiceName');
    const response = page.waitForResponse((candidate) => new URL(candidate.url()).pathname === '/workallocation/caseworker/getUsersByServiceName');
    await page.getByRole('button', { name: 'Find people', exact: true }).click();
    const submitted = await request;
    expect(submitted.method()).toBe('POST');
    expect(submitted.postDataJSON()).toEqual({ services: ['CIVIL'], term: 'Alex' });
    expect((await response).status()).toBe(200);
    await expect(page.getByTestId('remaining-person-state')).toHaveText('ready');
    await expect(page.getByTestId('remaining-person-value')).toContainText('Alex Legal');
    await expect(page.getByTestId('remaining-person-value')).not.toContainText('Alex Assigned');
  });

  test('find-person service exposes a network failure without retaining stale results', async ({ page, allowBrowserDiagnostic }) => {
    allowBrowserDiagnostic({ message: 'Failed to load resource', url: '/workallocation/caseworker/getUsersByServiceName' });
    let requestCount = 0;
    await page.route('**/workallocation/caseworker/getUsersByServiceName', (request) => {
      requestCount += 1;
      if (requestCount === 1) {
        return request.fulfill({ json: caseworkers });
      }
      return request.abort('failed');
    });
    await page.goto(route);

    await page.getByRole('button', { name: 'Find people', exact: true }).click();
    await expect(page.getByTestId('remaining-person-value')).toContainText('Alex Legal');
    await page.getByRole('button', { name: 'Find people', exact: true }).click();
    await expect(page.getByTestId('remaining-person-state')).toHaveText('error');
    await expect(page.getByTestId('remaining-person-value')).toHaveText('[]');
  });

  test('location service maps a successful search response', async ({ page }) => {
    await page.route('**/api/prd/location/getLocations?*', (request) => request.fulfill({
      json: [{ site_name: 'London Hearing Centre', epimms_id: 'location-1' }]
    }));
    await page.goto(route);

    const request = page.waitForRequest((candidate) => new URL(candidate.url()).pathname === '/api/prd/location/getLocations');
    const response = page.waitForResponse((candidate) => new URL(candidate.url()).pathname === '/api/prd/location/getLocations');
    await page.getByRole('button', { name: 'Search locations', exact: true }).click();
    const submitted = await request;
    expect(submitted.method()).toBe('GET');
    const submittedUrl = new URL(submitted.url());
    expect(submittedUrl.searchParams.get('serviceIds')).toBe('CIVIL');
    expect(submittedUrl.searchParams.get('locationType')).toBe('hearing');
    expect(submittedUrl.searchParams.get('searchTerm')).toBe('London');
    expect((await response).status()).toBe(200);
    await expect(page.getByTestId('remaining-location-state')).toHaveText('ready');
    await expect(page.getByTestId('remaining-location-value')).toContainText('London Hearing Centre');
  });

  test('location service exposes a controlled 5xx failure', async ({ page, allowBrowserDiagnostic }) => {
    allowBrowserDiagnostic({ message: 'Failed to load resource', url: '/api/prd/location/getLocations' });
    await page.route('**/api/prd/location/getLocations?*', (request) => request.fulfill({ status: 502, body: 'location service unavailable' }));
    await page.goto(route);

    const response = page.waitForResponse((candidate) => new URL(candidate.url()).pathname === '/api/prd/location/getLocations');
    await page.getByRole('button', { name: 'Search locations', exact: true }).click();
    expect((await response).status()).toBe(502);
    await expect(page.getByTestId('remaining-location-state')).toHaveText('error');
    await expect(page.getByTestId('remaining-location-value')).toHaveText('[]');
  });

  test('cookie, loading and case-sharing state preserve their transitions', async ({ page }) => {
    await page.goto(route);

    await page.getByRole('button', { name: 'Set cookie', exact: true }).click();
    await expect(page.getByTestId('remaining-cookie-state')).toHaveText('present');
    await page.getByRole('button', { name: 'Delete cookie', exact: true }).click();
    await expect(page.getByTestId('remaining-cookie-state')).toHaveText('deleted');

    await page.getByRole('button', { name: 'Register loading', exact: true }).click();
    await page.getByRole('button', { name: 'Register loading', exact: true }).click();
    await expect(page.getByTestId('remaining-loading-token-count')).toHaveText('2');
    await expect(page.getByTestId('remaining-loading-state')).toHaveText('true');
    await page.getByRole('button', { name: 'Unregister loading', exact: true }).click();
    await expect(page.getByTestId('remaining-loading-token-count')).toHaveText('1');
    await expect(page.getByTestId('remaining-loading-state')).toHaveText('true');
    await page.getByRole('button', { name: 'Unregister loading', exact: true }).click();
    await expect(page.getByTestId('remaining-loading-token-count')).toHaveText('0');
    await expect(page.getByTestId('remaining-loading-state')).toHaveText('false');

    await page.getByRole('button', { name: 'Set cases', exact: true }).click();
    await page.getByRole('button', { name: 'Request share', exact: true }).click();
    await expect(page.getByTestId('remaining-case-state')).toContainText('share-user@example.test');
    await page.getByRole('button', { name: 'Request share', exact: true }).click();
    expect((await page.getByTestId('remaining-case-state').innerText()).match(/share-user@example\.test/g)).toHaveLength(1);
    await page.getByRole('button', { name: 'Request unshare', exact: true }).click();
    await expect(page.getByTestId('remaining-case-state')).toContainText('follow-up@example.test');
  });

  test('filter service persists across reload and clears its stream', async ({ page }) => {
    await page.goto(route);
    await expect(page.getByTestId('remaining-filter-state')).toHaveText('null');

    await page.getByRole('button', { name: 'Persist filter', exact: true }).click();
    await expect(page.getByTestId('remaining-filter-state')).toContainText('commonlib-follow-up-filter');
    await page.reload();
    await expect(page.getByTestId('remaining-filter-state')).toContainText('civil');

    await page.getByRole('button', { name: 'Clear filter', exact: true }).click();
    await expect(page.getByTestId('remaining-filter-state')).toHaveText('null');
  });

  test('LetDirective updates projected context and CapitalizePipe normalises case', async ({ page }) => {
    await page.goto(route);
    await expect(page.getByTestId('remaining-let-value')).toHaveText('initial value|initial value');
    await expect(page.getByTestId('remaining-capitalize-value')).toHaveText('Mixed case');

    await page.getByRole('button', { name: 'Update let value', exact: true }).click();
    await expect(page.getByTestId('remaining-let-value')).toHaveText('updated value|updated value');
  });

  test('validator edge states cover calendar, empty and disabled groups, and non-boolean values', async ({ page }) => {
    await page.goto(route);

    await expect(page.getByTestId('remaining-date-state')).toHaveText('invalid');
    await page.getByRole('button', { name: 'Set valid date', exact: true }).click();
    await expect(page.getByTestId('remaining-date-state')).toHaveText('valid');
    await page.getByRole('button', { name: 'Set malformed date', exact: true }).click();
    await expect(page.getByTestId('remaining-date-state')).toHaveText('invalid');
    await page.getByRole('button', { name: 'Set valid date', exact: true }).click();
    await expect(page.getByTestId('remaining-date-state')).toHaveText('valid');
    // The invalid calendar date is characterised here; correcting it is outside this test-only change.
    await page.getByRole('button', { name: 'Set calendar-invalid date', exact: true }).click();
    await expect(page.getByTestId('remaining-date-state')).toHaveText('valid');

    await expect(page.getByTestId('remaining-empty-radio-state')).toHaveText('valid');
    await expect(page.getByTestId('remaining-radio-errors')).toContainText('"isRadioGroupInvalid": true');
    await page.getByRole('button', { name: 'Disable radio controls', exact: true }).click();
    await expect(page.getByTestId('remaining-disabled-radio-state')).toHaveText('disabled');

    await expect(page.getByTestId('remaining-checkbox-state')).toHaveText('invalid');
    await page.getByRole('button', { name: 'Set non-boolean checkbox value', exact: true }).click();
    await expect(page.getByTestId('remaining-checkbox-state')).toHaveText('invalid');
    await page.getByRole('button', { name: 'Check two checkboxes', exact: true }).click();
    await expect(page.getByTestId('remaining-checkbox-state')).toHaveText('valid');
    await page.getByRole('button', { name: 'Set non-boolean checkbox value', exact: true }).click();
    await expect(page.getByTestId('remaining-checkbox-state')).toHaveText('invalid');
    await page.getByRole('button', { name: 'Check two checkboxes', exact: true }).click();
    await expect(page.getByTestId('remaining-checkbox-state')).toHaveText('valid');
  });
});
