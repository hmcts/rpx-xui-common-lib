import { expect } from '@playwright/test';
import { test } from './browser-diagnostics.fixture';
import { ServiceSelectionPage } from './service-selection.po';

test('S2.1 mixed case query filters exactly and keyboard selection adds the correct service', async ({ page }) => {
  await page.goto('/coverage/service-selection');
  const services = new ServiceSelectionPage(page);
  await services.search.fill('CiViL');
  await expect(services.options).toHaveText(['Civil damages', 'Civil enforcement']);
  await services.search.press('ArrowDown');
  await services.search.press('Enter');
  await services.add.click();
  await expect.poll(async () => JSON.parse(await services.value.innerText()))
    .toEqual([{ key: 'civil-enforcement', label: 'Civil enforcement' }]);
  await expect(services.selected).toHaveText(['Civil enforcement']);
  await expect(services.search).toHaveValue('');
  await expect(services.changes).toHaveText('1');
});

test('S2.2 excludes selected services and restores removed options without losing the remaining selection', async ({ page }) => {
  await page.goto('/coverage/service-selection');
  const services = new ServiceSelectionPage(page);
  await services.choose('Civil damages');
  await services.add.click();
  await services.choose('Family');
  await services.add.click();
  await services.search.fill('Civil');
  await expect(services.options).toHaveText(['Civil enforcement']);
  await services.search.press('Escape');
  await services.selected.filter({ hasText: 'Civil damages' }).click();
  await expect.poll(async () => JSON.parse(await services.value.innerText()))
    .toEqual([{ key: 'family', label: 'Family' }]);
  await expect(services.selected).toHaveText(['Family']);
  await services.search.fill('Civil');
  await expect(services.options).toHaveText(['Civil damages', 'Civil enforcement']);
  await services.choose('Civil damages');
  await services.add.click();
  await expect.poll(async () => JSON.parse(await services.value.innerText())).toEqual([
    { key: 'family', label: 'Family' }, { key: 'civil-damages', label: 'Civil damages' }
  ]);
});

test('S2.3 select all contains concrete unique keys and a concrete choice replaces all', async ({ page }) => {
  await page.goto('/coverage/service-selection');
  const services = new ServiceSelectionPage(page);
  await services.choose('All services');
  await services.add.click();
  await expect.poll(async () => JSON.parse(await services.value.innerText())).toEqual([
    { key: 'civil-damages', label: 'Civil damages' },
    { key: 'civil-enforcement', label: 'Civil enforcement' },
    { key: 'family', label: 'Family' }
  ]);
  await expect(services.selected).toHaveText(['All services']);
  await services.choose('Family');
  await services.add.click();
  await expect.poll(async () => JSON.parse(await services.value.innerText()))
    .toEqual([{ key: 'family', label: 'Family' }]);
  await expect(services.selected).toHaveText(['Family']);
});

test('S2.3 remove all empties the real form array and restores suggestions', async ({ page }) => {
  await page.goto('/coverage/service-selection');
  const services = new ServiceSelectionPage(page);
  await services.choose('All services');
  await services.add.click();
  await expect(services.selected).toHaveText(['All services']);
  await services.selected.click();
  await expect(services.value).toHaveText('[]');
  await expect(services.selected).toHaveCount(0);
  await services.search.fill('Civil');
  await expect(services.options).toHaveText(['Civil damages', 'Civil enforcement']);
});

test('S2.4 single selection auto replaces the previous value without an Add button', async ({ page }) => {
  await page.goto('/coverage/service-selection?mode=single');
  const services = new ServiceSelectionPage(page);
  await expect(services.add).toHaveCount(0);
  await services.choose('Family');
  await expect.poll(async () => JSON.parse(await services.value.innerText()))
    .toEqual([{ key: 'family', label: 'Family' }]);
  await services.choose('Civil damages');
  await expect.poll(async () => JSON.parse(await services.value.innerText()))
    .toEqual([{ key: 'civil-damages', label: 'Civil damages' }]);
  await expect(services.changes).toHaveText('2');
});

test('S2.4 single selection replacement restores the displaced option', async ({ page }) => {
  await page.goto('/coverage/service-selection?mode=single');
  const services = new ServiceSelectionPage(page);
  await services.choose('Family');
  await services.choose('Civil damages');
  await expect.poll(async () => JSON.parse(await services.value.innerText()))
    .toEqual([{ key: 'civil-damages', label: 'Civil damages' }]);
  await services.search.fill('Family');
  await expect(services.options).toHaveText(['Family']);
});

test('S2.4 disabled input cannot be focused and preserves selection', async ({ page }) => {
  await page.goto('/coverage/service-selection?mode=single');
  const services = new ServiceSelectionPage(page);
  await services.choose('Family');
  await page.getByRole('button', { name: 'Disable service search' }).click();
  await expect(services.search).toBeDisabled();
  await page.keyboard.press('Tab');
  await expect(services.search).not.toBeFocused();
  await expect.poll(async () => JSON.parse(await services.value.innerText()))
    .toEqual([{ key: 'family', label: 'Family' }]);
  await expect(services.changes).toHaveText('1');
});

test('S2.4 explicit disabled false permits service selection', async ({ page }) => {
  test.skip(true, 'EXUI-5359: disabled=false renders the service search as disabled');
  await page.goto('/coverage/service-selection?disabled=false');
  const services = new ServiceSelectionPage(page);
  await expect(services.search).toBeEnabled();
  await services.choose('Family');
  await services.add.click();
  await expect.poll(async () => JSON.parse(await services.value.innerText()))
    .toEqual([{ key: 'family', label: 'Family' }]);
});
