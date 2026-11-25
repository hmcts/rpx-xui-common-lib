import { expect } from '@playwright/test';
import { test } from './browser-diagnostics.fixture';
import { AdvancedFilterPage } from './advanced-filter.po';

test('conditional detail is shown only while its controlling radio enables it', async ({ page }) => {
  const filter = new AdvancedFilterPage(page);
  await filter.openConditional();

  await expect(filter.heading).toBeVisible();
  await expect(filter.detail).toBeHidden();

  await filter.enableDetail();
  await expect(filter.detail).toBeVisible();

  await filter.disableDetail();
  await expect(filter.detail).toBeHidden();
});

test('conditional detail persists with its controlling value after submission', async ({ page }) => {
  const filter = new AdvancedFilterPage(page);
  await filter.openConditional();

  await filter.enableDetail();
  await filter.detail.fill('Additional case detail');
  await filter.applyFilters();
  await expect.poll(async () => JSON.parse(await filter.settings.innerText()).fields).toEqual([
    { name: 'include', value: ['yes'] },
    { name: 'detail', value: ['Additional case detail'] }
  ]);
});

test('session settings reload while another session or key inherits nothing', async ({ page, browser }) => {
  const filter = new AdvancedFilterPage(page);
  await filter.openPersistence('synthetic-owner', 'primary');
  await filter.selectFamilyPreference();
  await filter.applyFilters();
  await expect.poll(async () => JSON.parse(await filter.settings.innerText()).fields)
    .toEqual(expect.arrayContaining([{ name: 'categories', value: ['family'] }]));

  await filter.reload();
  await expect(filter.familyPreference).toBeChecked();

  await filter.openPersistence('synthetic-owner', 'alternate');
  await expect(filter.familyPreference).not.toBeChecked();

  const otherContext = await browser.newContext({ baseURL: new URL(page.url()).origin });
  try {
    const otherFilter = new AdvancedFilterPage(await otherContext.newPage());
    await otherFilter.openPersistence('synthetic-other', 'primary');
    await expect(otherFilter.familyPreference).not.toBeChecked();
  } finally {
    await otherContext.close();
  }
});

test('advanced filter — conditional requiredness emits an error and blocks persistence until corrected or hidden', async ({ page }) => {
  const filter = new AdvancedFilterPage(page);
  await filter.openConditional();
  await filter.applyFilters();
  await expect.poll(async () => JSON.parse(await filter.settings.innerText()).fields).toEqual([
    { name: 'include', value: ['no'] }, { name: 'detail', value: [''] }
  ]);

  await filter.enableDetail();
  await expect(filter.detail).toBeVisible();
  await filter.applyFilters();
  await expect.poll(async () => JSON.parse(await filter.errors.innerText()))
    .toEqual([{ name: 'detail', error: 'Enter a detail' }]);
  await expect.poll(async () => JSON.parse(await filter.settings.innerText()).fields).toEqual([
    { name: 'include', value: ['no'] }, { name: 'detail', value: [''] }
  ]);

  await filter.detail.fill('Synthetic hearing detail');
  await filter.applyFilters();
  await expect.poll(async () => JSON.parse(await filter.settings.innerText()).fields).toEqual([
    { name: 'include', value: ['yes'] }, { name: 'detail', value: ['Synthetic hearing detail'] }
  ]);
  await expect(filter.errors).toHaveText('null');
  await filter.detail.fill('');
  await filter.disableDetail();
  await expect(filter.detail).toBeHidden();
  await filter.applyFilters();
  await expect(filter.errors).toHaveText('null');
  await expect.poll(async () => JSON.parse(await filter.settings.innerText()).fields).toEqual([
    { name: 'include', value: ['no'] }, { name: 'detail', value: [''] }
  ]);
});

test('advanced filter — local settings reload for the same owner hash and reject another owner in the same context', async ({ page }) => {
  const filter = new AdvancedFilterPage(page);
  const ownerHash = 'a'.repeat(64);
  await filter.openOwnedPersistence(ownerHash);
  await filter.selectFamilyPreference();
  await filter.applyFilters();
  await expect.poll(async () => JSON.parse(await filter.settings.innerText()))
    .toEqual({ id: 'commonlib-advanced-persistence-primary', fields: [{ name: 'categories', value: ['family'] }], reset: false, ownerHash });
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('commonlib-advanced-persistence-primary'))))
    .toEqual({ id: 'commonlib-advanced-persistence-primary', fields: [{ name: 'categories', value: ['family'] }], reset: false, ownerHash });
  expect(await page.evaluate(() => sessionStorage.getItem('commonlib-advanced-persistence-primary'))).toBeNull();

  await filter.reload();
  await expect(filter.familyPreference).toBeChecked();
  await expect.poll(async () => JSON.parse(await filter.settings.innerText()).ownerHash).toBe(ownerHash);
  await filter.setOwnerHash('b'.repeat(64));
  await filter.reload();
  await expect(filter.familyPreference).not.toBeChecked();
  await expect(filter.settings).toHaveText('null');
  expect(await page.evaluate(() => localStorage.getItem('commonlib-advanced-persistence-primary'))).toBeNull();
  expect(await page.evaluate(() => sessionStorage.getItem('commonlib-advanced-persistence-primary'))).toBeNull();
});

test('advanced filter — select all persists its aggregate key and deselection leaves only the selected category', async ({ page }) => {
  const filter = new AdvancedFilterPage(page);
  await filter.open('choices');
  await filter.allCategories.check();
  await expect(filter.civilPreference).toBeChecked();
  await expect(filter.familyPreference).toBeChecked();
  await filter.applyFilters();
  await expect.poll(async () => JSON.parse(await filter.settings.innerText()).fields)
    .toEqual([{ name: 'categories', value: ['all', 'civil', 'family'] }]);

  await filter.familyPreference.uncheck();
  await expect(filter.allCategories).not.toBeChecked();
  await expect(filter.civilPreference).toBeChecked();
  await filter.applyFilters();
  await expect.poll(async () => JSON.parse(await filter.settings.innerText()).fields)
    .toEqual([{ name: 'categories', value: ['civil'] }]);
});

test('advanced filter — exceeding one selected category displays an error and blocks persistence until corrected', async ({ page }) => {
  const filter = new AdvancedFilterPage(page);
  await filter.open('limits');
  await filter.civilPreference.check();
  await filter.familyPreference.check();
  await filter.applyFilters();
  await expect(filter.categoriesError).toHaveText('Error: Choose at most one category');
  await expect(filter.settings).toHaveText('null');
  expect(await page.evaluate(() => sessionStorage.getItem('commonlib-advanced-limits'))).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem('commonlib-advanced-limits'))).toBeNull();

  await filter.familyPreference.uncheck();
  await filter.applyFilters();
  await expect(filter.categoriesError).toHaveCount(0);
  await expect(filter.errors).toHaveText('null');
  await expect.poll(async () => JSON.parse(await filter.settings.innerText()).fields)
    .toEqual([{ name: 'categories', value: ['civil'] }]);
});

test('advanced filter — required text and email reject empty and malformed values before persisting valid input', async ({ page }) => {
  const filter = new AdvancedFilterPage(page);
  await filter.open('text');
  await filter.applyFilters();
  await expect(filter.nameError).toHaveText('Error: Enter at least three characters');
  await expect(filter.emailError).toHaveText('Error: Enter an email');
  await expect(filter.settings).toHaveText('null');

  await filter.name.fill('Al');
  await filter.email.fill('not-an-email');
  await filter.applyFilters();
  await expect(filter.nameError).toHaveText('Error: Enter at least three characters');
  await expect(filter.emailError).toHaveText('Error: Enter a valid email');
  await expect(filter.settings).toHaveText('null');
  expect(await page.evaluate(() => sessionStorage.getItem('commonlib-advanced-text'))).toBeNull();

  await filter.name.fill('Alex');
  await filter.applyFilters();
  await expect(filter.nameError).toHaveCount(0);
  await expect(filter.emailError).toHaveText('Error: Enter a valid email');
  await expect(filter.settings).toHaveText('null');
  await filter.email.fill('alex@example.test');
  await filter.applyFilters();
  await expect(filter.nameError).toHaveCount(0);
  await expect(filter.emailError).toHaveCount(0);
  await expect(filter.errors).toHaveText('null');
  await expect.poll(async () => JSON.parse(await filter.settings.innerText()).fields).toEqual([
    { name: 'name', value: ['Alex'] }, { name: 'email', value: ['alex@example.test'] }
  ]);
  await filter.reload();
  await expect(filter.name).toHaveValue('Alex');
  await expect(filter.email).toHaveValue('alex@example.test');
});

test('advanced filter — grouped skills are sorted and filtered by the selected service', async ({ page }) => {
  const filter = new AdvancedFilterPage(page);
  await filter.open('groups');
  await expect(filter.skills.locator('optgroup')).toHaveCount(2);
  await expect(filter.skills.locator('optgroup').nth(0)).toHaveAttribute('label', 'Civil');
  await expect(filter.skills.locator('optgroup').nth(1)).toHaveAttribute('label', 'Family');
  await expect(filter.skills.locator('optgroup option')).toHaveText(['Appeals', 'Case preparation', 'Hearings']);
  await filter.familyService.check();
  await expect(filter.skills.locator('optgroup')).toHaveCount(1);
  await expect(filter.skills.locator('optgroup')).toHaveAttribute('label', 'Family');
  await expect(filter.skills.locator('optgroup option')).toHaveText(['Hearings']);
  await filter.skills.selectOption('201');
  await filter.applyFilters();
  await expect.poll(async () => JSON.parse(await filter.settings.innerText()).fields).toEqual([
    { name: 'user-services', value: ['family'] }, { name: 'user-skills', value: ['201'] }
  ]);
});

test('advanced filter — nested selected skill survives adding a service and reloading', async ({ page }) => {
  const filter = new AdvancedFilterPage(page);
  await filter.open('nested');
  await filter.civilService.check();
  await filter.appeals.check();
  await filter.familyService.check();
  await expect(filter.appeals).toBeChecked();
  await expect(filter.hearings).not.toBeChecked();
  await filter.applyFilters();
  await expect.poll(async () => JSON.parse(await filter.settings.innerText()).fields).toEqual([
    { name: 'user-services', value: ['civil', 'family'] }, { name: 'user-skills', value: ['101'] }
  ]);

  await filter.reload();
  await expect(filter.civilService).toBeChecked();
  await expect(filter.familyService).toBeChecked();
  await expect(filter.appeals).toBeChecked();
  await expect(filter.hearings).not.toBeChecked();
  await expect.poll(async () => JSON.parse(await filter.settings.innerText()).fields).toEqual([
    { name: 'user-services', value: ['civil', 'family'] }, { name: 'user-skills', value: ['101'] }
  ]);
});

test('advanced filter — memory settings update the current host and expire on reload', async ({ page }) => {
  const filter = new AdvancedFilterPage(page);
  await filter.open('choices', 'memory');
  await filter.civilPreference.uncheck();
  await filter.familyPreference.check();
  await filter.applyFilters();
  await expect.poll(async () => JSON.parse(await filter.settings.innerText()).fields)
    .toEqual([{ name: 'categories', value: ['family'] }]);
  expect(await page.evaluate(() => sessionStorage.getItem('commonlib-advanced-choices'))).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem('commonlib-advanced-choices'))).toBeNull();

  await filter.reload();
  await expect(filter.familyPreference).not.toBeChecked();
  await expect(filter.civilPreference).toBeChecked();
  await expect(filter.settings).toHaveText('null');
});

test('advanced filter — explicit cancel restores configured text defaults after applying different values', async ({ page }) => {
  const filter = new AdvancedFilterPage(page);
  await filter.openTextDefaults();
  await expect(filter.name).toHaveValue('Default reviewer');
  await expect(filter.email).toHaveValue('default@example.test');
  await filter.name.fill('Alex');
  await filter.email.fill('alex@example.test');
  await filter.applyFilters();
  await expect.poll(async () => JSON.parse(await filter.settings.innerText()).fields).toEqual([
    { name: 'name', value: ['Alex'] }, { name: 'email', value: ['alex@example.test'] }
  ]);

  await filter.name.fill('Unapplied edit');
  await filter.email.fill('draft@example.test');
  await filter.restoreDefaults.click();
  await expect(filter.name).toHaveValue('Default reviewer');
  await expect(filter.email).toHaveValue('default@example.test');
  await expect(filter.errors).toHaveText('null');
  await expect.poll(async () => JSON.parse(await filter.settings.innerText())).toEqual({
    id: 'commonlib-advanced-text',
    fields: [{ name: 'name', value: ['Default reviewer'] }, { name: 'email', value: ['default@example.test'] }],
    reset: true
  });
  await filter.reload();
  await expect(filter.name).toHaveValue('Default reviewer');
  await expect(filter.email).toHaveValue('default@example.test');
});
