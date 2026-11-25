import { expect } from '@playwright/test';
import { test } from './browser-diagnostics.fixture';

const serviceContractRoute = '/coverage/service-contract-a';

test('service-contract-a role service and guard expose allow, all-role, and redirect outcomes', async ({ page }) => {
  await page.goto(`${serviceContractRoute}?feature=role`);

  await expect(page.getByTestId('service-contract-a-role-result')).toHaveText('not evaluated');
  await page.getByRole('button', { name: 'Allow any role' }).click();
  await expect(page.getByTestId('service-contract-a-role-result')).toHaveText('allowed');

  await page.getByRole('button', { name: 'Allow all roles' }).click();
  await expect(page.getByTestId('service-contract-a-role-result')).toHaveText('allowed');

  await page.getByRole('button', { name: 'Deny missing role' }).click();
  await expect(page.getByTestId('service-contract-a-role-result')).toHaveText('/service-contract-a/denied');
});

test('service-contract-a session storage persists, removes after read, and clears synthetic state', async ({ page }) => {
  await page.goto(`${serviceContractRoute}?feature=storage`);
  await page.getByRole('button', { name: 'Clear session storage' }).click();
  await page.getByRole('button', { name: 'Write session value' }).click();
  await expect(page.getByTestId('service-contract-a-storage-result')).toHaveText('stored-value');

  await page.reload();
  await expect(page.getByTestId('service-contract-a-storage-result')).toHaveText('stored-value');
  await page.getByRole('button', { name: 'Read and remove session value' }).click();
  await expect(page.getByTestId('service-contract-a-storage-result')).toHaveText('stored-value');

  await page.reload();
  await expect(page.getByTestId('service-contract-a-storage-result')).toHaveText('empty');
  await page.getByRole('button', { name: 'Write session value' }).click();
  await page.getByRole('button', { name: 'Clear session storage' }).click();
  await expect(page.getByTestId('service-contract-a-storage-result')).toHaveText('empty');
});

test('service-contract-a session management maps warnings and preserves event order across failure signals', async ({ page }) => {
  await page.goto(`${serviceContractRoute}?feature=manage-session`);

  await page.getByRole('button', { name: 'Emit 61-second warning' }).click();
  await page.getByRole('button', { name: 'Emit keepalive' }).click();
  await page.getByRole('button', { name: 'Emit timeout' }).click();
  await expect.poll(async () => JSON.parse(await page.getByTestId('service-contract-a-manage-events').innerText())).toEqual([
    { type: 'modal', countdown: '2 minutes', isVisible: true },
    { type: 'keepalive' },
    { type: 'signout' }
  ]);

  await page.getByRole('button', { name: 'End idle state' }).click();
  await expect.poll(async () => JSON.parse(await page.getByTestId('service-contract-a-manage-events').innerText()), { timeout: 1_000 }).toEqual([
    { type: 'modal', countdown: '2 minutes', isVisible: true },
    { type: 'keepalive' },
    { type: 'signout' },
    { type: 'modal', isVisible: false }
  ]);
});

test('service-contract-a timeout notifications expose countdown boundaries and close prevents later events', async ({ page }) => {
  await page.goto(`${serviceContractRoute}?feature=timeout`);

  await page.getByRole('button', { name: 'Emit 61-second warning' }).click();
  await page.getByRole('button', { name: 'Emit 60-second warning' }).click();
  await page.getByRole('button', { name: 'Emit keep-alive' }).click();
  await page.getByRole('button', { name: 'Emit sign-out' }).click();
  await expect.poll(async () => JSON.parse(await page.getByTestId('service-contract-a-timeout-events').innerText())).toEqual([
    { eventType: 'countdown', readableCountdown: '2 minutes' },
    { eventType: 'countdown', readableCountdown: '60 seconds' },
    { eventType: 'keep-alive' },
    { eventType: 'sign-out' }
  ]);

  await page.getByRole('button', { name: 'Close timeout service' }).click();
  const eventsAfterClose = JSON.parse(await page.getByTestId('service-contract-a-timeout-events').innerText());
  await page.getByRole('button', { name: 'Emit 60-second warning' }).click();
  await expect.poll(async () => JSON.parse(await page.getByTestId('service-contract-a-timeout-events').innerText())).toEqual(eventsAfterClose);
  await expect(page.getByTestId('service-contract-a-timeout-status')).toHaveText('closed');
});

test('service-contract-a analytics uses a synthetic gtag and reports unavailable telemetry without throwing', async ({ page }) => {
  const warnings: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'warning') {
      warnings.push(message.text());
    }
  });
  await page.route('**/gtag/js?id=G-SERVICE-CONTRACT-A', (route) => route.fulfill({
    status: 200,
    contentType: 'application/javascript',
    body: ''
  }));
  await page.goto(`${serviceContractRoute}?feature=analytics`);

  await page.getByRole('button', { name: 'Initialise analytics' }).click();
  await expect(page.locator('script[src*="gtag/js?id=G-SERVICE-CONTRACT-A"]')).toHaveCount(1);
  await page.getByRole('button', { name: 'Send analytics event' }).click();
  await expect.poll(async () => JSON.parse(await page.getByTestId('service-contract-a-analytics-events').innerText())).toEqual([
    ['event', 'service-contract-a-event', { synthetic: true }]
  ]);

  await page.getByRole('button', { name: 'Send without analytics stub' }).click();
  await expect(page.getByTestId('service-contract-a-analytics-status')).toHaveText('unavailable');
  expect(warnings).toContain('Google Analytics is not available.');
});

test('service-contract-a tag manager emits page and event payloads and safely no-ops after its layer is cleared', async ({ page }) => {
  await page.route('**/gtm.js?id=GTM-SERVICE-CONTRACT-A', (route) => route.fulfill({
    status: 200,
    contentType: 'application/javascript',
    body: ''
  }));
  await page.goto(`${serviceContractRoute}?feature=tag-manager`);

  await page.getByRole('button', { name: 'Initialise tag manager' }).click();
  await expect(page.locator('script[src*="gtm.js?id=GTM-SERVICE-CONTRACT-A"]')).toHaveCount(1);
  await page.getByRole('button', { name: 'Send tag-manager event' }).click();
  await page.getByRole('button', { name: 'Send virtual pageview' }).click();
  await expect.poll(async () => JSON.parse(await page.getByTestId('service-contract-a-tag-manager-events').innerText())).toEqual([
    { event: 'gtm.js' },
    { event: 'service-contract-a-event', synthetic: true },
    {
      event: 'service-contract-a-pageview',
      page: { path: '/service-contract-a/synthetic', title: 'Service contract A' },
      synthetic: true
    }
  ]);

  await page.getByRole('button', { name: 'Clear data layer' }).click();
  await page.getByRole('button', { name: 'Send tag-manager event' }).click();
  await expect.poll(async () => JSON.parse(await page.getByTestId('service-contract-a-tag-manager-events').innerText())).toEqual([]);
});

test('service-contract-a LaunchDarkly exposes defaults, synthetic variation, and change notifications', async ({ page }) => {
  await page.goto(`${serviceContractRoute}?feature=launchdarkly`);

  await expect.poll(async () => JSON.parse(await page.getByTestId('service-contract-a-launchdarkly-values').innerText())).toEqual([false, true]);
  await expect.poll(async () => JSON.parse(await page.getByTestId('service-contract-a-launchdarkly-array-values').innerText())).toEqual([[], ['alpha', 'beta']]);

  await page.getByRole('button', { name: 'Change enabled flag to false' }).click();
  await expect.poll(async () => JSON.parse(await page.getByTestId('service-contract-a-launchdarkly-values').innerText())).toEqual([false, true, false]);
});
