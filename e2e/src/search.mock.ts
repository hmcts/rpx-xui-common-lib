import type { Page } from '@playwright/test';
import type { Person } from '../../projects/exui-common-lib/src/public-api';
import { caseworkers, judicialPeople, judicialUsers } from '../../src/app/coverage-demo/search-demo.data';
import { recoveryPerson } from './search.data';

export async function mockSearchHttp(page: Page): Promise<void> {
  await page.route('**/workallocation/findPerson', (route) => route.fulfill({ json: judicialPeople }));
  await page.route('**/workallocation/caseworker/getUsersByServiceName', (route) => route.fulfill({ json: caseworkers }));
  await page.route('**/api/prd/judicial/getJudicialUsersSearch', (route) => route.fulfill({ json: judicialUsers }));
}

export async function mockFindPersonRecovery(page: Page): Promise<void> {
  const resultsByTerm: Record<string, Person[]> = {
    Taylor: [judicialPeople[0]],
    Nobody: [],
    Morgan: [recoveryPerson]
  };
  await page.route('**/workallocation/findPerson', (route) => route.fulfill({
    json: resultsByTerm[route.request().postDataJSON().searchOptions.searchTerm]
  }));
}
