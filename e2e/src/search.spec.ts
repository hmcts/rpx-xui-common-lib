import { expect } from '@playwright/test';
import { test } from './browser-diagnostics.fixture';
import { SearchPage, type PersonDomain } from './search.po';
import { judicialPeople, judicialUsers } from '../../src/app/coverage-demo/search-demo.data';

const searchTerm = 'Alex';
const findPersonRequest = (userRole: string) => ({
  searchOptions: {
    searchTerm,
    userRole,
    services: ['IA'],
    userIncluded: false,
    assignedUser: 'demo-assigned'
  }
});
const caseworkerRequest = { services: ['IA'], term: searchTerm };

test('person — Judicial maps the exact request, excludes selected and assigned people, and emits one keyboard selection', async ({ page }) => {
  const search = new SearchPage(page);
  await search.openPerson('judicial', true);
  await expect(search.heading).toBeVisible();

  const request = page.waitForRequest('**/workallocation/findPerson');
  await search.search(searchTerm);
  expect((await request).postDataJSON()).toEqual(findPersonRequest('Judicial'));
  await expect(search.options).toHaveText(['Judge Alex Taylor (alex@example.test)']);

  await search.selectFirstWithKeyboard();
  await expect.poll(async () => JSON.parse(await search.personSelections.innerText())).toEqual([judicialPeople[0]]);
  expect(await search.value()).toBe('Judge Alex Taylor (alex@example.test)');
});

test('person — All maps both exact requests and combines the consumer domains', async ({ page }) => {
  const search = new SearchPage(page);
  await search.openPerson('all');

  const judicialRequest = page.waitForRequest('**/workallocation/findPerson');
  const caseworkerHttpRequest = page.waitForRequest('**/workallocation/caseworker/getUsersByServiceName');
  await search.search(searchTerm);
  expect((await judicialRequest).postDataJSON()).toEqual(findPersonRequest('All'));
  expect((await caseworkerHttpRequest).postDataJSON()).toEqual(caseworkerRequest);
  await expect(search.options).toHaveText([
    'Judge Alex Taylor (alex@example.test)',
    'Judge Alex Selected (selected@example.test)',
    'Alex Legal (legal@example.test)',
    'Alex Admin (admin@example.test)',
    'Alex CTSC (ctsc@example.test)'
  ]);
});

const caseworkerDomains: Array<{ domain: PersonDomain; role: string; option: string }> = [
  { domain: 'legal', role: 'Legal Ops', option: 'Alex Legal (legal@example.test)' },
  { domain: 'admin', role: 'Admin', option: 'Alex Admin (admin@example.test)' },
  { domain: 'ctsc', role: 'CTSC', option: 'Alex CTSC (ctsc@example.test)' }
];

for (const { domain, role, option } of caseworkerDomains) {
  test(`person — ${role} maps the exact caseworker request and role-filtered result`, async ({ page }) => {
    const search = new SearchPage(page);
    await search.openPerson(domain);

    const request = page.waitForRequest('**/workallocation/caseworker/getUsersByServiceName');
    await search.search(searchTerm);
    expect((await request).postDataJSON()).toEqual(caseworkerRequest);
    await expect(search.options).toHaveText([option]);
  });
}

test('judicials — maps the exact request, excludes selected idamId, and emits one keyboard-selected control record', async ({ page }) => {
  const search = new SearchPage(page);
  await search.openJudicials();

  const request = page.waitForRequest('**/api/prd/judicial/getJudicialUsersSearch');
  await search.search(searchTerm);
  expect((await request).postDataJSON()).toEqual({ searchString: searchTerm, serviceCode: 'IA' });
  await expect(search.options).toHaveText(['Judge Alex Taylor (alex@example.test)']);

  await search.selectFirstWithKeyboard();
  await expect.poll(async () => JSON.parse(await search.judicialControl.innerText())).toEqual(judicialUsers[0]);
  await expect.poll(async () => JSON.parse(await search.judicialSelections.innerText())).toEqual([judicialUsers[0]]);
  expect(await search.value()).toBe('Judge Alex Taylor (alex@example.test)');
});
