import { expect } from '@playwright/test';
import { test } from './browser-diagnostics.fixture';
import { createWorkType, manchesterLocation, taskNames } from './lookups.mock';
import { LookupsPage } from './lookups.po';

test('location empty results recover to a new keyboard selection', async ({ page }) => {
  const lookups = new LookupsPage(page);
  await lookups.openLocation('single');

  await lookups.searchLocation('London');
  await expect(lookups.options).toHaveText(['Central London Hearing Centre']);

  const emptyRequest = page.waitForRequest('**/api/locations/getLocations');
  await lookups.searchLocation('Nobody');
  expect((await emptyRequest).postDataJSON()).toEqual({
    serviceIds: 'SSCS,IA', locationType: 'case-management', searchTerm: 'Nobody'
  });
  await expect(lookups.options).toHaveText(['No results found']);
  await expect(lookups.option('Central London Hearing Centre')).toHaveCount(0);

  await lookups.searchLocation('Manchester');
  await expect(lookups.options).toHaveText(['Manchester Civil Justice Centre']);
  await lookups.selectLocationWithKeyboard();
  await expect.poll(async () => JSON.parse(await lookups.locationValue.innerText())).toEqual([manchesterLocation]);
});

test('location HTTP 500 clears stale results without exposing stale options', async ({ page, allowBrowserDiagnostic }) => {
  allowBrowserDiagnostic({ message: 'Failed to load resource: the server responded with a status of 500', url: '/api/locations/getLocations' });
  const lookups = new LookupsPage(page);
  await lookups.openLocation('single');
  await lookups.searchLocation('London');
  await expect(lookups.options).toHaveText(['Central London Hearing Centre']);
  const response = page.waitForResponse((candidate) => new URL(candidate.url()).pathname === '/api/locations/getLocations');
  await page.unroute('**/api/locations/getLocations');
  await page.route('**/api/locations/getLocations', (route) => route.fulfill({ status: 500, body: 'controlled failure' }));
  await lookups.searchLocation('Nobody');
  expect((await response).status()).toBe(500);
  await expect(lookups.options).toHaveCount(0);
  await expect(lookups.option('Central London Hearing Centre')).toHaveCount(0);
});

test('venue filters selected, duplicate and nameless records, then recovers from empty results', async ({ page }) => {
  const lookups = new LookupsPage(page);
  await lookups.openVenue(true);

  await lookups.searchVenue('Court');
  await expect(lookups.options).toHaveText(['BIRMINGHAM CIVIL JUSTICE CENTRE']);

  await lookups.searchVenue('Nobody');
  await expect(lookups.options).toHaveText(['No results found']);
  await expect(lookups.option('BIRMINGHAM CIVIL JUSTICE CENTRE')).toHaveCount(0);

  await lookups.searchVenue('Manchester');
  await expect(lookups.options).toHaveText(['MANCHESTER CIVIL JUSTICE CENTRE']);
  await lookups.selectVenueWithKeyboard();
  await expect.poll(async () => JSON.parse(await lookups.venueControl.innerText())).toEqual(manchesterLocation);
});

test('work type empty results recover to a new keyboard selection', async ({ page }) => {
  const lookups = new LookupsPage(page);
  await lookups.openWorkType('single');

  await lookups.searchWorkType('Review');
  await expect(lookups.options).toHaveText(['Review case']);

  const emptyRequest = page.waitForRequest('**/workallocation/task/search-types-of-work');
  await lookups.searchWorkType('Nobody');
  expect((await emptyRequest).postDataJSON()).toEqual({ searchTerm: 'Nobody' });
  await expect(lookups.options).toHaveText(['No results found']);
  await expect(lookups.option('Review case')).toHaveCount(0);

  await lookups.searchWorkType('Create');
  await expect(lookups.options).toHaveText(['Create task']);
  await lookups.selectWorkTypeWithKeyboard();
  await expect.poll(async () => JSON.parse(await lookups.workTypeValue.innerText())).toEqual([createWorkType]);
});

test('task name reuses the session cache without a second request', async ({ page }) => {
  const lookups = new LookupsPage(page);
  const requests = await lookups.openTaskName();

  await lookups.searchTaskName('review');
  await expect(lookups.options).toHaveText(['Review Hearing bundle']);
  expect(requests.taskNames).toBe(1);

  await page.reload();
  await lookups.searchTaskName('create');
  await expect(lookups.options).toHaveText(['Create order']);
  expect(requests.taskNames).toBe(1);
});

test('task name empty client-filtered results recover to a new pointer selection', async ({ page }) => {
  const lookups = new LookupsPage(page);
  await lookups.openTaskName();

  await lookups.searchTaskName('unknown');
  await expect(lookups.options).toHaveCount(0);
  await expect(lookups.option('Review Hearing bundle')).toHaveCount(0);
  await expect(lookups.taskNameSelection).toHaveText('"null"');

  await lookups.searchTaskName('review');
  await expect(lookups.options).toHaveText(['Review Hearing bundle']);
  await lookups.selectOption('Review Hearing bundle');
  await expect.poll(async () => JSON.parse(await lookups.taskNameSelection.innerText())).toEqual(taskNames[0]);
});
