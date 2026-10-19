import { expect } from '@playwright/test';
import { test } from './browser-diagnostics.fixture';
import {
  createWorkType,
  leedsVenue,
  londonLocation,
  manchesterLocation,
  reviewWorkType,
  taskNames
} from './lookups.mock';
import { LookupsPage } from './lookups.po';

test('location single — maps the exact request, supports keyboard selection and updates the parent value', async ({ page }) => {
  const lookups = new LookupsPage(page);
  await lookups.openLocation('single');
  await expect(lookups.heading).toBeVisible();

  const request = page.waitForRequest('**/api/locations/getLocations');
  await lookups.searchLocation('London');
  expect((await request).postDataJSON()).toEqual({
    serviceIds: 'SSCS,IA',
    locationType: 'case-management',
    searchTerm: 'London'
  });
  await expect(lookups.options).toHaveText(['Central London Hearing Centre']);

  await lookups.selectLocationWithKeyboard();
  await expect.poll(async () => JSON.parse(await lookups.locationValue.innerText())).toEqual([londonLocation]);
});

test('location multi — adds two, excludes selected values, removes one and applies the survivor', async ({ page }) => {
  const lookups = new LookupsPage(page);
  await lookups.openLocation('multi');

  await lookups.searchLocation('Centre');
  await expect(lookups.options).toHaveText(['Central London Hearing Centre', 'Manchester Civil Justice Centre']);
  await lookups.selectOption('Central London Hearing Centre');
  await lookups.addLocation();

  const secondRequest = page.waitForRequest('**/api/locations/getLocations');
  await lookups.searchLocation('Centre');
  expect((await secondRequest).postDataJSON()).toEqual({
    serviceIds: 'SSCS,IA', locationType: 'case-management', searchTerm: 'Centre'
  });
  await expect(lookups.option('Central London Hearing Centre')).toHaveCount(0);
  await expect(lookups.options).toHaveText(['Manchester Civil Justice Centre']);
  await lookups.selectOption('Manchester Civil Justice Centre');
  await lookups.addLocation();
  await expect.poll(async () => JSON.parse(await lookups.locationValue.innerText()))
    .toEqual([londonLocation, manchesterLocation]);

  await lookups.removeLocation('Central London Hearing Centre');
  await lookups.applyFilters();
  await expect.poll(async () => JSON.parse(await lookups.locationApplied.innerText())).toEqual([manchesterLocation]);
});

test('venue — sends the exact GET, supports pointer selection and updates control and emitted output', async ({ page }) => {
  const lookups = new LookupsPage(page);
  await lookups.openVenue();

  const request = page.waitForRequest('**/api/prd/location/getLocations?*');
  await lookups.searchVenue('Leeds');
  const submitted = await request;
  expect(submitted.method()).toBe('GET');
  expect(`${new URL(submitted.url()).pathname}${new URL(submitted.url()).search}`)
    .toBe('/api/prd/location/getLocations?serviceIds=IA&locationType=hearing&searchTerm=Leeds');
  await expect(lookups.options).toHaveText(['LEEDS COMBINED COURT CENTRE']);

  await lookups.selectOption('LEEDS COMBINED COURT CENTRE');
  await expect.poll(async () => JSON.parse(await lookups.venueControl.innerText())).toEqual(leedsVenue);
  await expect.poll(async () => JSON.parse(await lookups.venueSelection.innerText())).toEqual(leedsVenue);
});

test('work type single — maps the exact POST, supports keyboard selection and updates the parent value', async ({ page }) => {
  const lookups = new LookupsPage(page);
  await lookups.openWorkType('single');

  const request = page.waitForRequest('**/workallocation/task/search-types-of-work');
  await lookups.searchWorkType('Review');
  expect((await request).postDataJSON()).toEqual({ searchTerm: 'Review' });
  await expect(lookups.options).toHaveText(['Review case']);

  await lookups.selectWorkTypeWithKeyboard();
  await expect.poll(async () => JSON.parse(await lookups.workTypeValue.innerText())).toEqual([reviewWorkType]);
});

test('work type multi — adds two, excludes selected values, removes one and applies the survivor', async ({ page }) => {
  const lookups = new LookupsPage(page);
  await lookups.openWorkType('multi');

  await lookups.searchWorkType('Task');
  await expect(lookups.options).toHaveText(['Review case', 'Create task']);
  await lookups.selectOption('Review case');
  await lookups.addWorkType();

  await lookups.searchWorkType('Task');
  await expect(lookups.option('Review case')).toHaveCount(0);
  await expect(lookups.options).toHaveText(['Create task']);
  await lookups.selectOption('Create task');
  await lookups.addWorkType();
  await expect.poll(async () => JSON.parse(await lookups.workTypeValue.innerText()))
    .toEqual([reviewWorkType, createWorkType]);

  await lookups.removeWorkType('Review case');
  await lookups.applyFilters();
  await expect.poll(async () => JSON.parse(await lookups.workTypeApplied.innerText())).toEqual([createWorkType]);
});

test('task name — maps the exact POST, filters client-side, supports pointer selection and emits the nested record', async ({ page }) => {
  const lookups = new LookupsPage(page);
  await lookups.openTaskName();

  const request = page.waitForRequest('**/workallocation/taskNames');
  await lookups.searchTaskName('hearing');
  expect((await request).postDataJSON()).toEqual({ service: 'IA' });
  await expect(lookups.options).toHaveText(['Review Hearing bundle']);

  await lookups.selectOption('Review Hearing bundle');
  await expect.poll(async () => JSON.parse(await lookups.taskNameSelection.innerText())).toEqual(taskNames[0]);
});
