import { expect } from '@playwright/test';
import { test } from './browser-diagnostics.fixture';
import { SearchPage } from './search.po';
import { mockFindPersonRecovery } from './search.mock';
import { recoveryPerson } from './search.data';

test('FindPerson empty results recover to a new selection', async ({ page }) => {
  const search = new SearchPage(page);
  await search.openPerson('judicial');
  await mockFindPersonRecovery(page);
  await expect(search.heading).toBeVisible();

  await test.step('Show the first identity without selecting it', async () => {
    const request = page.waitForRequest((submitted) =>
      new URL(submitted.url()).pathname === '/workallocation/findPerson' &&
      submitted.method() === 'POST' && submitted.postDataJSON().searchOptions.searchTerm === 'Taylor');
    const response = page.waitForResponse((received) =>
      new URL(received.url()).pathname === '/workallocation/findPerson' &&
      received.request().method() === 'POST' && received.request().postDataJSON().searchOptions.searchTerm === 'Taylor');
    await search.replaceSearch('Taylor');
    const submitted = await request;
    expect(submitted.method()).toBe('POST');
    expect(submitted.postDataJSON()).toEqual({
      searchOptions: {
        searchTerm: 'Taylor',
        userRole: 'Judicial',
        services: ['IA'],
        userIncluded: false,
        assignedUser: 'demo-assigned'
      }
    });
    expect((await response).status()).toBe(200);
    await expect(search.options).toHaveText(['Judge Alex Taylor (alex@example.test)']);
    await expect.poll(async () => JSON.parse(await search.personSelections.innerText())).toEqual([]);
  });

  await test.step('Replace results with the explicit empty state', async () => {
    const request = page.waitForRequest((submitted) =>
      new URL(submitted.url()).pathname === '/workallocation/findPerson' &&
      submitted.method() === 'POST' && submitted.postDataJSON().searchOptions.searchTerm === 'Nobody');
    const response = page.waitForResponse((received) =>
      new URL(received.url()).pathname === '/workallocation/findPerson' &&
      received.request().method() === 'POST' && received.request().postDataJSON().searchOptions.searchTerm === 'Nobody');
    await search.replaceSearch('Nobody');
    const submitted = await request;
    expect(submitted.method()).toBe('POST');
    expect(submitted.postDataJSON()).toEqual({
      searchOptions: {
        searchTerm: 'Nobody',
        userRole: 'Judicial',
        services: ['IA'],
        userIncluded: false,
        assignedUser: 'demo-assigned'
      }
    });
    const emptyResponse = await response;
    expect(emptyResponse.status()).toBe(200);
    await expect(search.option('No results found')).toBeVisible();
    await expect(search.options).toHaveText(['No results found']);
    await expect(search.option('Judge Alex Taylor (alex@example.test)')).toHaveCount(0);
    expect(await emptyResponse.json()).toEqual([]);
    await expect.poll(async () => JSON.parse(await search.personSelections.innerText())).toEqual([]);
  });

  await test.step('Recover without reloading and select the new identity', async () => {
    const request = page.waitForRequest((submitted) =>
      new URL(submitted.url()).pathname === '/workallocation/findPerson' &&
      submitted.method() === 'POST' && submitted.postDataJSON().searchOptions.searchTerm === 'Morgan');
    const response = page.waitForResponse((received) =>
      new URL(received.url()).pathname === '/workallocation/findPerson' &&
      received.request().method() === 'POST' && received.request().postDataJSON().searchOptions.searchTerm === 'Morgan');
    await search.replaceSearch('Morgan');
    const submitted = await request;
    expect(submitted.method()).toBe('POST');
    expect(submitted.postDataJSON()).toEqual({
      searchOptions: {
        searchTerm: 'Morgan',
        userRole: 'Judicial',
        services: ['IA'],
        userIncluded: false,
        assignedUser: 'demo-assigned'
      }
    });
    expect((await response).status()).toBe(200);
    await expect(search.options).toHaveText(['Judge Sam Morgan (sam.morgan@example.test)']);
    await expect(search.option('Judge Alex Taylor (alex@example.test)')).toHaveCount(0);
    await expect.poll(async () => JSON.parse(await search.personSelections.innerText())).toEqual([]);

    await search.selectFirstWithKeyboard();
    await expect.poll(() => search.value()).toBe('Judge Sam Morgan (sam.morgan@example.test)');
    await expect.poll(async () => JSON.parse(await search.personSelections.innerText())).toEqual([recoveryPerson]);
  });
});

test('SearchJudicials selects the visible result with a pointer action and records the exact model', async ({ page }) => {
  const search = new SearchPage(page);
  await search.openJudicials();
  const response = page.waitForResponse('**/api/prd/judicial/getJudicialUsersSearch');
  await search.search('Alex');
  await response;

  const option = search.option('Judge Alex Taylor (alex@example.test)');
  await expect(option).toBeVisible();
  await expect(option).toBeEnabled();
  await option.click();

  await expect.poll(async () => JSON.parse(await search.judicialControl.innerText())).toEqual({
    idamId: 'demo-judge',
    fullName: 'Judge Alex Taylor',
    emailId: 'alex@example.test',
    isJudge: 'Y',
    isMagistrate: 'N',
    isPanelMember: 'N',
    knownAs: 'Alex',
    personalCode: 'demo-code',
    surname: 'Taylor',
    title: 'Judge'
  });
  await expect.poll(async () => JSON.parse(await search.judicialSelections.innerText())).toEqual([{
    idamId: 'demo-judge',
    fullName: 'Judge Alex Taylor',
    emailId: 'alex@example.test',
    isJudge: 'Y',
    isMagistrate: 'N',
    isPanelMember: 'N',
    knownAs: 'Alex',
    personalCode: 'demo-code',
    surname: 'Taylor',
    title: 'Judge'
  }]);
});

test('SearchJudicials does not query or show suggestions below the minimum search length', async ({ page }) => {
  const search = new SearchPage(page);
  await search.openJudicials();
  const requests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('/api/prd/judicial/getJudicialUsersSearch')) {
      requests.push(request.url());
    }
  });

  await search.search('ab');

  // SearchJudicials debounces requests by 500 ms; wait past that boundary before proving no request.
  await page.waitForTimeout(600);
  await expect(search.options).toHaveCount(0);
  await expect.poll(async () => JSON.parse(await search.judicialControl.innerText())).toBeNull();
  expect(requests).toEqual([]);
});
