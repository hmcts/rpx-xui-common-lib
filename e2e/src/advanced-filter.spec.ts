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
