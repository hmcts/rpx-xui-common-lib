import { expect } from '@playwright/test';
import { test } from '../src/browser-diagnostics.fixture';
import { InvitationPage } from '../src/invitation.po';
import { FormControlsPage } from '../src/form-controls.po';
import { ServiceSelectionPage } from '../src/service-selection.po';
import { CaseSharingPage } from '../src/case-sharing.po';
import { AddressPage } from '../src/address.po';
import { UserManagementPage } from '../src/user-management.po';
import { collectAccessibilityEvidence } from './accessibilityAudit';
import { ASSERTION_MARKER } from './report.cjs';

test('invitation — initial form', async ({ page }, testInfo) => {
  await page.goto('/coverage/invitation');
  const invitation = new InvitationPage(page);
  await expect(invitation.firstName).toBeVisible();
  await expect(invitation.submit).toBeEnabled();
  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});

test('invitation — parent validation errors', async ({ page }, testInfo) => {
  await page.goto('/coverage/invitation');
  await new InvitationPage(page).submit.click();
  await expect(page.locator('#firstName-error')).toHaveText('Error:Enter a first name');
  await expect(page.locator('#email-error')).toHaveText('Error:Enter a valid email address');
  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});

test('invitation — submitted details and permissions', async ({ page }, testInfo) => {
  await page.goto('/coverage/invitation');
  const invitation = new InvitationPage(page);
  await invitation.fillDetails();
  await invitation.cases.check();
  await invitation.submit.click();
  await expect(invitation.submissions).toHaveText('1');
  await expect(invitation.valid).toHaveText('true');
  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});

test('form controls — initial fields', async ({ page }, testInfo) => {
  await page.goto('/coverage/form-controls');
  const controls = new FormControlsPage(page);
  await expect(controls.priority).toBeVisible();
  await expect(controls.file).toBeVisible();
  await expect(controls.day).toBeVisible();
  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});

test('form controls — supplied errors and invalid date', async ({ page }, testInfo) => {
  await page.goto('/coverage/form-controls');
  const controls = new FormControlsPage(page);
  await controls.errors.click();
  await controls.fillDate('31', '02', '2024');
  await expect(page.locator('#priority-error')).toHaveText('Error:Choose a priority');
  await expect(page.locator('#case-notes-error')).toHaveText('Error:Enter case notes');
  await expect(controls.dateValid).toHaveText('false');
  await expect(page.locator('xuilib-gov-uk-date .govuk-error-message')).toHaveText('Error:Enter a valid hearing date');
  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});

test('service selection — expanded suggestions', async ({ page }, testInfo) => {
  await page.goto('/coverage/service-selection');
  const services = new ServiceSelectionPage(page);
  await services.search.fill('Civil');
  await expect(services.options).toHaveText(['Civil damages', 'Civil enforcement']);
  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});

test('service selection — selected service', async ({ page }, testInfo) => {
  await page.goto('/coverage/service-selection');
  const services = new ServiceSelectionPage(page);
  await services.choose('Family');
  await services.add.click();
  await expect(services.selected).toHaveText(['Family']);
  await expect(services.search).toHaveValue('');
  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});

test('case sharing — initial assignments', async ({ page }, testInfo) => {
  await page.goto('/coverage/case-sharing');
  const sharing = new CaseSharingPage(page);
  await expect(sharing.case('DEMO-001').getByRole('row', { name: /Alex Taylor/ })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continue', exact: true })).toBeEnabled();
  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});

test('case sharing — no-change validation', async ({ page }, testInfo) => {
  await page.goto('/coverage/case-sharing');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('You have not requested any changes to case sharing');
  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});

test('case sharing — pending addition', async ({ page }, testInfo) => {
  await page.goto('/coverage/case-sharing');
  const sharing = new CaseSharingPage(page);
  await sharing.addSam();
  await expect(sharing.case('DEMO-001').getByRole('row', { name: /Sam Morgan/ })).toContainText('To be added');
  await expect(sharing.case('DEMO-002').getByRole('row', { name: /Sam Morgan/ })).toContainText('To be added');
  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});

test('case sharing — confirmation', async ({ page }, testInfo) => {
  await page.goto('/coverage/case-sharing');
  const sharing = new CaseSharingPage(page);
  await sharing.addSam();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page).toHaveURL(/\/coverage\/case-sharing\/confirmation$/);
  await expect(sharing.confirmation('DEMO-001').getByRole('row', { name: /Sam Morgan/ })).toContainText('To be added');
  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});

test('address — initial lookup', async ({ page }, testInfo) => {
  await page.goto('/coverage/address');
  await expect(page.getByLabel('Enter a UK postcode')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Find address', exact: true })).toBeEnabled();
  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});

test('address — invalid postcode', async ({ page }, testInfo) => {
  await page.goto('/coverage/address');
  await page.getByRole('button', { name: 'Find address', exact: true }).click();
  await expect(page.locator('#addressLookup')).toContainText('Enter a valid postcode');
  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});

test('address — lookup results', async ({ page }, testInfo) => {
  await page.goto('/coverage/address');
  await new AddressPage(page).lookup();
  await expect(page.locator('#addressList option')).toHaveText(['2 addresses found', '10 Demo Street, Testville', '12 Demo Street, Testville']);
  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});

test('address — selected address', async ({ page }, testInfo) => {
  await page.goto('/coverage/address');
  await new AddressPage(page).lookup();
  await page.getByLabel('Select an address', { exact: true }).selectOption({ label: '12 Demo Street, Testville' });
  await expect(page.getByLabel('Building and Street', { exact: true })).toHaveValue('12 Demo Street');
  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});

test('address — manual international entry', async ({ page }, testInfo) => {
  await page.goto('/coverage/address');
  await page.getByRole('link', { name: 'I can\'t enter a UK postcode', exact: true }).click();
  await page.getByRole('radio', { name: 'No', exact: true }).check();
  await expect(page.getByLabel('Country', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Postcode (Optional)', { exact: true })).toBeVisible();
  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});

test('user management — first page and detail panels', async ({ page }, testInfo) => {
  await page.goto('/coverage/users');
  await expect(page.getByRole('link', { name: 'Demo User 1', exact: true })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Selected user details', exact: true })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Invited user details', exact: true })).toBeVisible();
  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});

test('user management — next page', async ({ page }, testInfo) => {
  await page.goto('/coverage/users');
  await new UserManagementPage(page).next.click();
  await expect(page.getByRole('link', { name: 'Demo User 51', exact: true })).toBeVisible();
  await expect(page.locator('.hmcts-pagination__results')).toHaveText('Showing 51 to 51 of 51 results');
  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});
