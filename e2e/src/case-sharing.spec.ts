import { expect } from '@playwright/test';
import { test } from './browser-diagnostics.fixture';
import { CaseSharingPage } from './case-sharing.po';
import { expectedDeselectedCases, expectedSharedCases } from './case-sharing.data';

test.beforeEach(async ({ page }) => {
  await page.goto('/coverage/case-sharing');
});

test('case sharing blocks continuation without changes', async ({ page }) => {
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('You have not requested any changes to case sharing');
  await expect(page).toHaveURL(/\/coverage\/case-sharing$/);
});

test('adding a user synchronizes both cases without duplicate assignments', async ({ page }) => {
  const sharing = new CaseSharingPage(page);
  await sharing.addSam();
  for (const id of ['DEMO-001', 'DEMO-002']) {
    await sharing.openCaseDetails(id);
    await expect(sharing.case(id).getByRole('row', { name: /Sam Morgan/ })).toContainText('To be added');
  }
  await expect.poll(() => sharing.synchronized()).toEqual(expectedSharedCases);
  await expect.poll(() => sharing.state()).toEqual(expectedSharedCases);
  await sharing.addSam();
  await expect.poll(() => sharing.synchronized()).toEqual(expectedSharedCases);
  await expect.poll(() => sharing.state()).toEqual(expectedSharedCases);
  await expect(page.locator('#add-user-input input')).toHaveValue('');
});

test('canceling one pending share preserves the other and canceling both blocks continue', async ({ page }) => {
  const sharing = new CaseSharingPage(page);
  await sharing.addSam();
  await sharing.openCaseDetails('DEMO-001');
  await sharing.openCaseDetails('DEMO-002');
  await sharing.case('DEMO-001').getByRole('link', { name: 'Cancel adding Sam Morgan to case' }).click();
  await expect(sharing.case('DEMO-001').getByRole('row', { name: /Sam Morgan/ })).toHaveCount(0);
  await expect(sharing.case('DEMO-002').getByRole('row', { name: /Sam Morgan/ })).toContainText('To be added');
  await expect.poll(async () => (await sharing.state()).map((item) => ({ id: item.caseId, pending: item.pendingShares.map((user) => user.idamId) })))
    .toEqual([{ id: 'DEMO-001', pending: [] }, { id: 'DEMO-002', pending: ['demo-sam'] }]);
  await sharing.case('DEMO-002').getByRole('link', { name: 'Cancel adding Sam Morgan to case' }).click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('You have not requested any changes to case sharing');
  await expect.poll(async () => (await sharing.state()).map((item) => item.pendingShares)).toEqual([[], []]);
  await expect(page).toHaveURL(/\/coverage\/case-sharing$/);
});

test('deselect emits the removed case and protects the final selected case', async ({ page }) => {
  const sharing = new CaseSharingPage(page);
  await sharing.case('DEMO-001').getByRole('button', { name: 'Deselect case', exact: true }).click();
  await expect(sharing.case('DEMO-001')).toHaveCount(0);
  await expect(sharing.case('DEMO-002')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Deselect case', exact: true })).toHaveCount(0);
  await expect.poll(async () => JSON.parse(await page.getByTestId('sharing-unselected').innerText())).toEqual(expectedDeselectedCases);
  await expect.poll(async () => (await sharing.state()).map((item) => item.caseId)).toEqual(['DEMO-002']);
});

test('removing the only assignee blocks continue until a replacement reaches confirmation', async ({ page }) => {
  const sharing = new CaseSharingPage(page);
  await sharing.openCaseDetails('DEMO-001');
  await sharing.case('DEMO-001').getByRole('link', { name: 'Remove Alex Taylor from case' }).click();
  await expect(sharing.case('DEMO-001').getByRole('row', { name: /Alex Taylor/ })).toContainText('To be removed');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('At least one person must be assigned to each case');
  await expect(page).toHaveURL(/\/coverage\/case-sharing$/);
  await sharing.addSam();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page).toHaveURL(/\/coverage\/case-sharing\/confirmation$/);
  await expect(sharing.confirmation('DEMO-001').getByRole('cell')).toHaveText([
    'Sam Morgan', 'sam@example.test', 'To be added', 'Alex Taylor', 'alex@example.test', 'To be removed'
  ]);
  await expect(sharing.confirmation('DEMO-002').getByRole('cell')).toHaveText([
    'Sam Morgan', 'sam@example.test', 'To be added'
  ]);
  await sharing.confirmation('DEMO-001').getByRole('link', { name: 'Change selected case' }).click();
  await expect(page).toHaveURL(/\/coverage\/case-sharing$/);
  await sharing.openCaseDetails('DEMO-001');
  await sharing.openCaseDetails('DEMO-002');
  await expect(sharing.case('DEMO-001').getByRole('row', { name: /Alex Taylor/ })).toContainText('To be removed');
  await expect(sharing.case('DEMO-002').getByRole('row', { name: /Sam Morgan/ })).toContainText('To be added');
});

test('cancel confirmation preserves pending additions on return', async ({ page }) => {
  const sharing = new CaseSharingPage(page);
  await sharing.addSam();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(sharing.confirmation('DEMO-001').getByRole('row', { name: /Sam Morgan/ })).toContainText('To be added');
  await page.getByRole('link', { name: 'Cancel confirmation', exact: true }).click();
  await expect.poll(async () => (await sharing.state()).map((item) => item.pendingShares.map((user) => user.idamId)))
    .toEqual([['demo-sam'], ['demo-sam']]);
});
