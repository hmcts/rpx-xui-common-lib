import { expect } from '@playwright/test';
import { test } from './browser-diagnostics.fixture';
import { InvitationPage } from './invitation.po';

test.beforeEach(async ({ page }) => {
  await page.goto('/coverage/invitation');
});

test('S1.1 submits exact details and selected and unselected permissions once', async ({ page }) => {
  const invitation = new InvitationPage(page);
  await invitation.fillDetails();
  await invitation.cases.check();
  await invitation.users.check();
  await invitation.submit.click();
  await expect(invitation.submissions).toHaveText('1');
  await expect(invitation.valid).toHaveText('true');
  await expect.poll(async () => JSON.parse(await invitation.value.innerText())).toEqual({
    firstName: 'Alex', lastName: 'Taylor', email: 'alex.taylor@example.test',
    roles: { 'pui-case-manager': true, 'pui-user-manager': true, 'pui-organisation-manager': false }
  });
});

test('S1.1 unchecking a permission removes it from the submitted form', async ({ page }) => {
  const invitation = new InvitationPage(page);
  await invitation.fillDetails();
  await invitation.cases.check();
  await invitation.users.check();
  await invitation.users.uncheck();
  await invitation.submit.press('Enter');
  await expect(invitation.submissions).toHaveText('1');
  await expect.poll(async () => JSON.parse(await invitation.value.innerText())).toEqual({
    firstName: 'Alex', lastName: 'Taylor', email: 'alex.taylor@example.test',
    roles: { 'pui-case-manager': true, 'pui-user-manager': false, 'pui-organisation-manager': false }
  });
});

test('S1.2 renders parent validation errors and clears them on corrected submission', async ({ page }) => {
  const invitation = new InvitationPage(page);
  await invitation.submit.click();
  await expect(invitation.valid).toHaveText('false');
  await expect(page.locator('#firstName-error')).toHaveText('Error:Enter a first name');
  await expect(page.locator('#lastName-error')).toHaveText('Error:Enter a last name');
  await expect(page.locator('#email-error')).toHaveText('Error:Enter a valid email address');
  await expect(invitation.firstName).toHaveAttribute('aria-describedby', 'firstName-hint firstName-error');
  await expect(page.locator('#firstName-hint')).toHaveText('Include all middle names.');
  await expect(invitation.lastName).toHaveAttribute('aria-describedby', 'lastName-error');
  await expect(invitation.email).toHaveAttribute('aria-describedby', 'email-error');
  await invitation.fillDetails();
  await invitation.submit.click();
  await expect(invitation.valid).toHaveText('true');
  await expect(page.locator('.govuk-error-message')).toHaveCount(0);
  await expect(invitation.firstName).toHaveAttribute('aria-describedby', 'firstName-hint');
  await expect(invitation.submissions).toHaveText('2');
  await expect.poll(async () => JSON.parse(await invitation.value.innerText())).toEqual({
    firstName: 'Alex', lastName: 'Taylor', email: 'alex.taylor@example.test',
    roles: { 'pui-case-manager': false, 'pui-user-manager': false, 'pui-organisation-manager': false }
  });
});
