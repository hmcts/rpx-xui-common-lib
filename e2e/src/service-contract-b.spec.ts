import { expect } from '@playwright/test';
import { test } from './browser-diagnostics.fixture';
import {
  serviceContractBFirstTaskNames,
  serviceContractBLocations,
  serviceContractBRegions,
  serviceContractBSecondLocations,
  serviceContractBSecondTaskNames,
  serviceContractBServices,
  serviceContractBWorkTypes
} from './service-contract-b.mock';
import { ServiceContractBPage } from './service-contract-b.po';

test('reference-data services render the intercepted response bodies', async ({ page }) => {
  await page.route('**/api/ref-data/regions', (route) => route.fulfill({ status: 200, json: serviceContractBRegions }));
  await page.route('**/api/ref-data/services', (route) => route.fulfill({ status: 200, json: serviceContractBServices }));
  await page.route('**/api/ref-data/locations', (route) => route.fulfill({ status: 200, json: serviceContractBLocations }));

  const demo = new ServiceContractBPage(page);
  await demo.open();
  const responses = Promise.all([
    page.waitForResponse((response) => new URL(response.url()).pathname === '/api/ref-data/regions'),
    page.waitForResponse((response) => new URL(response.url()).pathname === '/api/ref-data/services'),
    page.waitForResponse((response) => new URL(response.url()).pathname === '/api/ref-data/locations')
  ]);

  await demo.loadReferenceData();
  const [regionsResponse, servicesResponse, locationsResponse] = await responses;
  expect(regionsResponse.status()).toBe(200);
  expect(await regionsResponse.json()).toEqual(serviceContractBRegions);
  expect(servicesResponse.status()).toBe(200);
  expect(await servicesResponse.json()).toEqual(serviceContractBServices);
  expect(locationsResponse.status()).toBe(200);
  expect(await locationsResponse.json()).toEqual(serviceContractBLocations);
  await expect(demo.referenceDataState).toHaveText('ready');
  await expect(demo.referenceDataRegions).toHaveText('London, North West');
  await expect(demo.referenceDataServices).toHaveText('Civil service');
  await expect(demo.referenceDataLocations).toHaveText('London Civil Centre');
});

test('malformed 4xx reference-data payloads produce an explicit error state', async ({ page, allowBrowserDiagnostic }) => {
  allowBrowserDiagnostic({
    message: 'Failed to load resource: the server responded with a status of 422',
    url: '/api/ref-data/regions'
  });
  const malformedPayload = { error: 'invalid reference-data response' };
  await page.route('**/api/ref-data/regions', (route) => route.fulfill({ status: 422, json: malformedPayload }));
  await page.route('**/api/ref-data/services', (route) => route.fulfill({ status: 200, json: serviceContractBServices }));
  await page.route('**/api/ref-data/locations', (route) => route.fulfill({ status: 200, json: serviceContractBLocations }));

  const demo = new ServiceContractBPage(page);
  await demo.open();
  const responsePromise = page.waitForResponse((response) => new URL(response.url()).pathname === '/api/ref-data/regions');
  await demo.loadReferenceData();
  const response = await responsePromise;
  expect(response.status()).toBe(422);
  expect(await response.json()).toEqual(malformedPayload);
  await expect(demo.referenceDataState).toHaveText('error');
  await expect(demo.referenceDataError).toHaveText('Reference data request failed');
});

test('reference-data location cache is reused and resets for a new service instance', async ({ page }) => {
  let requestCount = 0;
  await page.route('**/api/ref-data/locations-by-service-code*', (route) => {
    requestCount += 1;
    return route.fulfill({
      status: 200,
      json: requestCount === 1 ? { court_venues: serviceContractBLocations } : { court_venues: serviceContractBSecondLocations }
    });
  });

  const demo = new ServiceContractBPage(page);
  await demo.open();
  let responsePromise = page.waitForResponse((response) => new URL(response.url()).pathname === '/api/ref-data/locations-by-service-code');
  await demo.loadLocations();
  let response = await responsePromise;
  expect(response.status()).toBe(200);
  expect(new URL(response.url()).searchParams.get('service_code')).toBe('IA');
  expect(await response.json()).toEqual({ court_venues: serviceContractBLocations });
  await expect(demo.locationsState).toHaveText('ready');
  await expect(demo.locations).toHaveText('London Civil Centre');
  expect(requestCount).toBe(1);

  await demo.loadLocations();
  await expect(demo.locations).toHaveText('London Civil Centre');
  expect(requestCount).toBe(1);

  await page.reload();
  responsePromise = page.waitForResponse((candidate) => new URL(candidate.url()).pathname === '/api/ref-data/locations-by-service-code');
  await demo.loadLocations();
  response = await responsePromise;
  expect(await response.json()).toEqual({ court_venues: serviceContractBSecondLocations });
  await expect(demo.locations).toHaveText('Manchester Civil Centre');
  expect(requestCount).toBe(2);
});

test('reference-data location fallback preserves successful results when one service code returns 4xx', async ({ page, allowBrowserDiagnostic }) => {
  let requestCount = 0;
  allowBrowserDiagnostic({
    message: 'Failed to load resource: the server responded with a status of 404',
    url: '/api/ref-data/locations-by-service-code'
  });
  await page.route('**/api/ref-data/locations-by-service-code*', (route) => {
    requestCount += 1;
    const serviceCode = new URL(route.request().url()).searchParams.get('service_code');
    if (serviceCode === 'UNKNOWN') {
      return route.fulfill({ status: 404, json: { message: 'Unknown service code' } });
    }
    return route.fulfill({ status: 200, json: { court_venues: serviceContractBLocations } });
  });

  const demo = new ServiceContractBPage(page);
  await demo.open();
  await demo.loadLocationsForMultipleServices();
  await expect(demo.locationsState).toHaveText('ready');
  await expect(demo.multiCodeLocations).toHaveText('London Civil Centre');
  expect(requestCount).toBe(2);

  await demo.loadLocationsForMultipleServices();
  await expect(demo.multiCodeLocations).toHaveText('London Civil Centre');
  expect(requestCount).toBe(2);
});

test('task-name cache invalidation requests and renders fresh data', async ({ page }) => {
  let requestCount = 0;
  await page.route('**/workallocation/taskNames', (route) => {
    requestCount += 1;
    return route.fulfill({
      status: 200,
      json: requestCount === 1 ? serviceContractBFirstTaskNames : serviceContractBSecondTaskNames
    });
  });

  const demo = new ServiceContractBPage(page);
  await demo.open();
  let responsePromise = page.waitForResponse((response) => new URL(response.url()).pathname === '/workallocation/taskNames');
  await demo.loadTaskNames();
  let response = await responsePromise;
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual(serviceContractBFirstTaskNames);
  await expect(demo.taskNamesState).toHaveText('ready');
  await expect(demo.taskNames).toHaveText('Review bundle');
  expect(requestCount).toBe(1);

  await demo.clearTaskCache();
  responsePromise = page.waitForResponse((candidate) => new URL(candidate.url()).pathname === '/workallocation/taskNames');
  await demo.loadTaskNames();
  response = await responsePromise;
  expect(await response.json()).toEqual(serviceContractBSecondTaskNames);
  await expect(demo.taskNames).toHaveText('Create order');
  expect(requestCount).toBe(2);
});

test('task-name timeout response preserves status and exposes the interceptor message', async ({ page, allowBrowserDiagnostic }) => {
  allowBrowserDiagnostic({
    message: 'Failed to load resource: the server responded with a status of 408',
    url: '/workallocation/taskNames'
  });
  const timeoutPayload = { message: 'Task-name lookup timed out' };
  await page.route('**/workallocation/taskNames', (route) => route.fulfill({ status: 408, json: timeoutPayload }));

  const demo = new ServiceContractBPage(page);
  await demo.open();
  const responsePromise = page.waitForResponse((response) => new URL(response.url()).pathname === '/workallocation/taskNames');
  await demo.loadTaskNames();
  const response = await responsePromise;
  expect(response.status()).toBe(408);
  expect(await response.json()).toEqual(timeoutPayload);
  await expect(demo.taskNamesState).toHaveText('error');
  await expect(demo.taskNamesError).toHaveText('Task-name lookup timed out');
});

test('work-type search keeps the latest response when the earlier request is cancelled', async ({ page }) => {
  let fulfillOldResponse: (() => Promise<void>) | undefined;
  let oldResponseAttempted = false;
  await page.route('**/workallocation/task/search-types-of-work', async (route) => {
    const term = route.request().postDataJSON().searchTerm as string;
    if (term === 'old') {
      // Keep the stale response pending while allowing the newer request through this route.
      fulfillOldResponse = async () => {
        oldResponseAttempted = true;
        try {
          await route.fulfill({ status: 200, json: [{ key: 'old', label: 'Old result' }] });
        } catch {
          // The browser may abort the old request when the latest search replaces it.
        }
      };
      return;
    }
    await route.fulfill({ status: 200, json: serviceContractBWorkTypes });
  });

  await page.goto('/coverage/lookups?feature=work-type&mode=single');
  const input = page.locator('#inputWorkTypeSearch');
  const oldRequest = page.waitForRequest((request) =>
    new URL(request.url()).pathname === '/workallocation/task/search-types-of-work' &&
    request.postDataJSON()?.searchTerm === 'old');
  await input.fill('old');
  await oldRequest;
  const latestResponse = page.waitForResponse((response) =>
    new URL(response.url()).pathname === '/workallocation/task/search-types-of-work' &&
    response.request().postDataJSON()?.searchTerm === 'new');
  await input.fill('new');
  await latestResponse;
  await expect(page.getByRole('option')).toHaveText(['Review case']);
  await expect(page.getByRole('option', { name: 'Old result', exact: true })).toHaveCount(0);

  await fulfillOldResponse?.();
  await expect.poll(() => oldResponseAttempted).toBe(true);
  await expect(page.getByRole('option')).toHaveText(['Review case']);
  await expect(page.getByRole('option', { name: 'Old result', exact: true })).toHaveCount(0);
});

test('HTTP interceptor exposes a message payload from a 4xx response', async ({ page, allowBrowserDiagnostic }) => {
  allowBrowserDiagnostic({
    message: 'Failed to load resource: the server responded with a status of 400',
    url: '/service-contract-b/interceptor'
  });
  const payload = { message: 'Client request was rejected' };
  await page.route('**/service-contract-b/interceptor', (route) => route.fulfill({ status: 400, json: payload }));

  const demo = new ServiceContractBPage(page);
  await demo.open();
  const responsePromise = page.waitForResponse((response) => new URL(response.url()).pathname === '/service-contract-b/interceptor');
  await demo.requestInterceptorError();
  const response = await responsePromise;
  expect(response.status()).toBe(400);
  expect(await response.json()).toEqual(payload);
  await expect(demo.interceptorState).toHaveText('error');
  await expect(demo.interceptorError).toHaveText('Client request was rejected');
});

test('HTTP interceptor falls back to a stable state for a malformed 4xx payload', async ({ page, allowBrowserDiagnostic }) => {
  allowBrowserDiagnostic({
    message: 'Failed to load resource: the server responded with a status of 422',
    url: '/service-contract-b/interceptor'
  });
  const malformedPayload = { error: 'no message field' };
  await page.route('**/service-contract-b/interceptor', (route) => route.fulfill({ status: 422, json: malformedPayload }));

  const demo = new ServiceContractBPage(page);
  await demo.open();
  const responsePromise = page.waitForResponse((response) => new URL(response.url()).pathname === '/service-contract-b/interceptor');
  await demo.requestInterceptorError();
  const response = await responsePromise;
  expect(response.status()).toBe(422);
  expect(await response.json()).toEqual(malformedPayload);
  await expect(demo.interceptorState).toHaveText('error');
  await expect(demo.interceptorError).toHaveText('Request failed');
});
