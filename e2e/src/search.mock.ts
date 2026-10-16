import type { Page } from '@playwright/test';
import { caseworkers, judicialPeople, judicialUsers } from '../../src/app/coverage-demo/search-demo.data';

export async function mockSearchHttp(page: Page): Promise<void> {
  await page.route('**/workallocation/findPerson', (route) => route.fulfill({ json: judicialPeople }));
  await page.route('**/workallocation/caseworker/getUsersByServiceName', (route) => route.fulfill({ json: caseworkers }));
  await page.route('**/api/prd/judicial/getJudicialUsersSearch', (route) => route.fulfill({ json: judicialUsers }));
}
