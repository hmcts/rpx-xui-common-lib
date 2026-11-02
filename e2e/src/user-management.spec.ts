import { expect } from '@playwright/test';
import { test } from './browser-diagnostics.fixture';
import { UserManagementPage } from './user-management.po';
import { expectedFirstUser, expectedInvitedUser, expectedSelectedUser } from './user-management.data';

test.beforeEach(async ({ page }) => {
  await page.goto('/coverage/users');
});

test('user list pages to the fifty-first user with exact bounds', async ({ page }) => {
  const users = new UserManagementPage(page);
  await expect(users.userLink(1)).toBeVisible();
  await expect(users.userLink(51)).toHaveCount(0);
  await expect(users.previous).toHaveCount(0);
  await expect(users.bounds).toHaveText('Showing 1 to 50 of 51 results');
  await users.next.click();
  await expect(users.userLink(51)).toBeVisible();
  await expect(users.userLink(1)).toHaveCount(0);
  await expect(users.bounds).toHaveText('Showing 51 to 51 of 51 results');
  await expect.poll(async () => JSON.parse(await page.getByTestId('user-page-events').innerText())).toEqual([2]);
  await expect(users.next).toHaveCount(0);
  await users.previous.click();
  await expect(users.userLink(1)).toBeVisible();
  await expect(users.userLink(51)).toHaveCount(0);
  await expect(users.bounds).toHaveText('Showing 1 to 50 of 51 results');
  await expect.poll(async () => JSON.parse(await page.getByTestId('user-page-events').innerText())).toEqual([2, 1]);
});

test('selecting a user emits its exact record and navigates to its demo route', async ({ page }) => {
  const users = new UserManagementPage(page);
  await users.next.click();
  await users.userLink(51).click();
  await expect(page).toHaveURL(/\/coverage\/users\/user-51$/);
  await expect(users.selectedDetails).toContainText('Demo User 51');
  await expect(users.selectedDetails).toContainText('user51@example.test');
  await expect.poll(async () => JSON.parse(await page.getByTestId('user-click-events').innerText())).toEqual([expectedSelectedUser]);
});

test('selecting the first user updates the detail view and emits the selected record', async ({ page }) => {
  const users = new UserManagementPage(page);

  await users.userLink(1).click();

  await expect(page).toHaveURL(/\/coverage\/users\/user-1$/);
  await expect(users.selectedDetails).toContainText('Demo User 1');
  await expect(users.selectedDetails).toContainText('user1@example.test');
  await expect.poll(async () => JSON.parse(await page.getByTestId('user-click-events').innerText())).toEqual([expectedFirstUser]);
});

test('details show only granted permissions and respect action visibility inputs', async ({ page }) => {
  const users = new UserManagementPage(page);
  await expect(users.selectedDetails.locator('dd').filter({ hasText: 'Manage users' }).locator('div')).toHaveText(['Manage users', 'Manage cases', 'Case access administrator']);
  await expect(users.selectedDetails).not.toContainText('Manage organisations');
  await expect(users.selectedDetails).not.toContainText('Manage fee accounts');
  await expect(users.selectedDetails.getByRole('link', { name: 'Change roles', exact: true })).toBeVisible();
  await expect(users.suspend).toBeVisible();
  await page.getByRole('button', { name: 'Toggle account actions', exact: true }).click();
  await expect(users.selectedDetails.getByRole('link', { name: 'Change roles', exact: true })).toHaveCount(0);
  await expect(users.suspend).toHaveCount(0);
  await expect(page.getByTestId('user-suspend-events')).toHaveText('[]');
});

test('pending invitation explains resend restrictions and hides permissions', async ({ page }) => {
  const users = new UserManagementPage(page);
  await expect(users.invitedDetails).toContainText('This user has already been invited but has not activated their account.');
  await expect(users.invitedDetails).toContainText('You can\'t invite the same user more than once an hour.');
  await expect(users.invitedDetails.getByText('Permissions', { exact: true })).toHaveCount(0);
  await expect(users.reinvite).toBeVisible();
});

for (const activation of ['click', 'Enter', 'Space'] as const) {
  test(`suspend emits the exact user once on ${activation}`, async ({ page }) => {
    const users = new UserManagementPage(page);
    await expect(page.getByTestId('user-suspend-events')).toHaveText('[]');
    if (activation === 'click') {
      await users.suspend.click();
    } else {
      await users.suspend.press(activation);
    }
    await expect.poll(async () => JSON.parse(await page.getByTestId('user-suspend-events').innerText())).toEqual([expectedFirstUser]);
  });

  test(`reinvite emits the exact user once on ${activation}`, async ({ page }) => {
    const users = new UserManagementPage(page);
    await expect(page.getByTestId('user-reinvite-events')).toHaveText('[]');
    if (activation === 'click') {
      await users.reinvite.click();
    } else {
      await users.reinvite.press(activation);
    }
    await expect.poll(async () => JSON.parse(await page.getByTestId('user-reinvite-events').innerText())).toEqual([expectedInvitedUser]);
  });
}
