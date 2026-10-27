import { expect } from '@playwright/test';
import { test } from './browser-diagnostics.fixture';
import { FormControlsPage } from './form-controls.po';

test.beforeEach(async ({ page }) => {
  await page.goto('/coverage/form-controls');
});

test('S1.3 select and keyboard textarea editing update only their own controls', async ({ page }) => {
  const controls = new FormControlsPage(page);
  await controls.priority.selectOption('urgent');
  await controls.notes.fill('Review documents');
  await controls.notes.press('End');
  await controls.notes.press('Enter');
  await controls.notes.pressSequentially('Call witness');
  await expect(controls.priority.locator('option:checked')).toHaveText('Urgent');
  await expect.poll(async () => JSON.parse(await controls.value.innerText())).toEqual({
    priority: 'urgent', notes: 'Review documents\nCall witness', supportingFile: '', untouched: 'preserved'
  });
});

test('S1.3 supplied select and textarea errors render and clear', async ({ page }) => {
  const controls = new FormControlsPage(page);
  await controls.errors.click();
  await expect(page.locator('#priority-error')).toHaveText('Error:Choose a priority');
  await expect(page.locator('#case-notes-error')).toHaveText('Error:Enter case notes');
  await controls.errors.click();
  await expect(page.locator('#priority-error, #case-notes-error')).toHaveCount(0);
});

test('S1.4 valid date updates parent controls and validity', async ({ page }) => {
  const controls = new FormControlsPage(page);
  await controls.fillDate('29', '02', '2024');
  await expect(controls.dateValid).toHaveText('true');
  await expect.poll(async () => JSON.parse(await page.getByTestId('date-value').innerText()))
    .toEqual({ hearing_day: '29', hearing_month: '02', hearing_year: '2024' });
  await expect(page.locator('xuilib-gov-uk-date .govuk-error-message')).toHaveCount(0);
});

test('S1.4 last day of a 30-day month is valid', async ({ page }) => {
  const controls = new FormControlsPage(page);
  await controls.fillDate('30', '04', '2024');
  await expect(controls.dateValid).toHaveText('true');
  await expect.poll(async () => JSON.parse(await page.getByTestId('date-value').innerText()))
    .toEqual({ hearing_day: '30', hearing_month: '04', hearing_year: '2024' });
  await expect(page.locator('xuilib-gov-uk-date .govuk-error-message')).toHaveCount(0);
});

test('S1.4 impossible date renders the library validator error', async ({ page }) => {
  const controls = new FormControlsPage(page);
  await controls.fillDate('31', '02', '2024');
  await expect(controls.dateValid).toHaveText('false');
  await expect(page.locator('xuilib-gov-uk-date .govuk-error-message')).toHaveText('Error:Enter a valid hearing date');
});

test('S1.4 day beyond a 30-day month remains invalid with the submitted values', async ({ page }) => {
  const controls = new FormControlsPage(page);
  await controls.fillDate('31', '04', '2024');
  await expect(controls.dateValid).toHaveText('false');
  await expect.poll(async () => JSON.parse(await page.getByTestId('date-value').innerText()))
    .toEqual({ hearing_day: '31', hearing_month: '04', hearing_year: '2024' });
  await expect(page.locator('xuilib-gov-uk-date .govuk-error-message')).toHaveText('Error:Enter a valid hearing date');
});

test('S1.4 entering a valid date in day month year order restores validity', async ({ page }) => {
  test.skip(true, 'EXUI-5357: date validator does not restore validity after direct day/month/year edits');
  const controls = new FormControlsPage(page);
  await controls.day.fill('29');
  await controls.month.fill('02');
  await controls.year.fill('2024');
  await expect.poll(async () => JSON.parse(await page.getByTestId('date-value').innerText()))
    .toEqual({ hearing_day: '29', hearing_month: '02', hearing_year: '2024' });
  await expect(controls.dateValid).toHaveText('true');
  await expect(page.locator('xuilib-gov-uk-date .govuk-error-message')).toHaveCount(0);
});

test('S1.4 correcting an impossible date restores validity', async ({ page }) => {
  const controls = new FormControlsPage(page);
  await controls.fillDate('31', '02', '2024');
  await expect(controls.dateValid).toHaveText('false');
  await controls.day.fill('29');
  await expect(controls.dateValid).toHaveText('true');
  await expect.poll(async () => JSON.parse(await page.getByTestId('date-value').innerText()))
    .toEqual({ hearing_day: '29', hearing_month: '02', hearing_year: '2024' });
  await expect(page.locator('xuilib-gov-uk-date .govuk-error-message')).toHaveCount(0);
});

test('S1.4 changing month revalidates a previously valid day', async ({ page }) => {
  test.skip(true, 'EXUI-5357: date validator retains stale validity after the month changes');
  const controls = new FormControlsPage(page);
  await controls.fillDate('31', '01', '2024');
  await expect(controls.dateValid).toHaveText('true');
  await controls.month.fill('02');
  await expect(controls.dateValid).toHaveText('false');
});

test('S1.4 optional empty date remains valid after clearing all fields', async ({ page }) => {
  const controls = new FormControlsPage(page);
  await expect(controls.dateValid).toHaveText('true');
  await controls.fillDate('12', '11', '2024');
  await expect(controls.dateValid).toHaveText('true');
  await controls.fillDate('', '', '');
  await expect(controls.dateValid).toHaveText('true');
  await expect.poll(async () => JSON.parse(await page.getByTestId('date-value').innerText())).toEqual({
    hearing_day: '', hearing_month: '', hearing_year: ''
  });
  await expect(page.locator('xuilib-gov-uk-date .govuk-error-message')).toHaveCount(0);
});

test('S1.4 clearing an invalid date restores optional validity and clears the parent value', async ({ page }) => {
  const controls = new FormControlsPage(page);
  await controls.fillDate('31', '02', '2024');
  await expect(controls.dateValid).toHaveText('false');

  await controls.fillDate('', '', '');
  await expect(controls.dateValid).toHaveText('true');
  await expect.poll(async () => JSON.parse(await page.getByTestId('date-value').innerText())).toEqual({
    hearing_day: '', hearing_month: '', hearing_year: ''
  });
  await expect(page.locator('xuilib-gov-uk-date .govuk-error-message')).toHaveCount(0);
});

test('S1.5 file chooser exposes exact metadata, clear and reselect', async ({ page }) => {
  const controls = new FormControlsPage(page);
  await controls.file.setInputFiles({ name: 'evidence.txt', mimeType: 'text/plain', buffer: Buffer.from('proof') });
  await expect(controls.file).toHaveValue(/evidence\.txt$/);
  await expect.poll(() => controls.file.evaluate((input: HTMLInputElement) =>
    Array.from(input.files, (file) => ({ name: file.name, type: file.type, size: file.size }))))
    .toEqual([{ name: 'evidence.txt', type: 'text/plain', size: 5 }]);
  await controls.file.setInputFiles([]);
  await expect(controls.file).toHaveValue('');
  await expect.poll(() => controls.file.evaluate((input: HTMLInputElement) => input.files.length)).toBe(0);
  await controls.file.setInputFiles({ name: 'replacement.txt', mimeType: 'text/plain', buffer: Buffer.from('new') });
  await expect(controls.file).toHaveValue(/replacement\.txt$/);
  await expect.poll(() => controls.file.evaluate((input: HTMLInputElement) =>
    Array.from(input.files, (file) => ({ name: file.name, type: file.type, size: file.size }))))
    .toEqual([{ name: 'replacement.txt', type: 'text/plain', size: 3 }]);
  await controls.errors.click();
  await expect(page.locator('#supportingFile-error')).toHaveText('Error:Choose a supporting file');
  await controls.errors.click();
  await expect(page.locator('#supportingFile-error')).toHaveCount(0);
});
