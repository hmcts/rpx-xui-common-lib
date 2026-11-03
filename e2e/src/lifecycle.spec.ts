import { expect } from '@playwright/test';
import { test } from './browser-diagnostics.fixture';
import { LifecyclePage } from './lifecycle.po';
import {
  firstEnglishMessage,
  lifecycleClock,
  lifecycleDateErrors,
  lifecycleRoles,
  messageCookie,
  secondEnglishMessage,
  standaloneMessageKey
} from './lifecycle.data';

test('L1 service messages preserve safe bilingual markup and strip unsafe markup', async ({ page, context }) => {
  const lifecycle = new LifecyclePage(page, context);
  await lifecycle.open();

  await expect(lifecycle.serviceMessages).toHaveCount(2);
  await expect(lifecycle.firstEnglishHeading.locator('strong')).toHaveText('planned maintenance');
  await expect(lifecycle.firstWelshHeading.locator('strong')).toHaveText('gwaith cynnal a chadw');
  await expect(lifecycle.unsafeMarkup).toHaveCount(0);
});

test('L1 keyboard dismissal persists only the selected message in the session cookie after reload', async ({ page, context }) => {
  const lifecycle = new LifecyclePage(page, context);
  await lifecycle.open();

  await expect(lifecycle.firstMessage).toHaveCount(1);
  await expect(lifecycle.secondMessage).toHaveCount(1);
  await lifecycle.focusFirstDismissLink();
  await expect(lifecycle.firstDismissLink).toBeFocused();
  await lifecycle.dismissFocusedMessageWithEnter();

  await expect(lifecycle.firstMessage).toHaveCount(0);
  await expect(lifecycle.secondMessage).toHaveCount(1);
  expect(await lifecycle.sessionCookie(messageCookie)).toMatchObject({
    name: messageCookie,
    value: encodeURIComponent(JSON.stringify([firstEnglishMessage])),
    path: '/',
    expires: -1,
    httpOnly: false,
    secure: false,
    sameSite: 'Lax'
  });

  await lifecycle.reload();
  await expect(lifecycle.firstMessage).toHaveCount(0);
  await expect(lifecycle.secondMessage).toHaveCount(1);
  expect(await lifecycle.sessionCookie(messageCookie)).toMatchObject({
    value: encodeURIComponent(JSON.stringify([firstEnglishMessage])),
    expires: -1
  });
});

test('L1 dismissing both service messages leaves no visible banners after reload', async ({ page, context }) => {
  const lifecycle = new LifecyclePage(page, context);
  await lifecycle.open();

  await lifecycle.firstDismissLink.click();
  await expect(lifecycle.firstMessage).toHaveCount(0);
  await lifecycle.secondMessage.getByText('Hide message', { exact: true }).click();
  await expect(lifecycle.serviceMessages).toHaveCount(0);
  expect(await lifecycle.sessionCookie(messageCookie)).toMatchObject({
    value: encodeURIComponent(JSON.stringify([firstEnglishMessage, secondEnglishMessage]))
  });

  await lifecycle.reload();
  await expect(lifecycle.serviceMessages).toHaveCount(0);
});

test('L2 repeated enable retains the feature view and re-enabling after disable recreates it once', async ({ page, context }) => {
  const lifecycle = new LifecyclePage(page, context);
  await lifecycle.open();

  await expect(lifecycle.featureContent).toHaveCount(0);
  await expect(lifecycle.featureActions).toHaveText('0');
  await lifecycle.enableCurrentFeature();
  await expect(lifecycle.featureContent).toHaveCount(1);
  await expect(lifecycle.featureContent).toHaveText('Feature content for commonlib-lifecycle-alpha');
  await lifecycle.featureAction.click();
  await expect(lifecycle.featureActions).toHaveText('1');
  // Retain this verified-present node to distinguish view preservation from replacement.
  const originalView = await lifecycle.featureContent.elementHandle();
  await lifecycle.enableCurrentFeature();
  await expect(lifecycle.featureContent).toHaveCount(1);
  await expect(lifecycle.featureContent).toHaveText('Feature content for commonlib-lifecycle-alpha');
  await expect.poll(() => originalView.evaluate((element) => element.isConnected)).toBe(true);
  await lifecycle.disableCurrentFeature();
  await expect(lifecycle.featureContent).toHaveCount(0);
  await expect(lifecycle.featureAction).toHaveCount(0);
  await expect.poll(() => originalView.evaluate((element) => element.isConnected)).toBe(false);
  await lifecycle.enableCurrentFeature();
  await expect(lifecycle.featureContent).toHaveCount(1);
  await expect(lifecycle.featureContent).toHaveText('Feature content for commonlib-lifecycle-alpha');
  await lifecycle.featureAction.press('Enter');
  await expect(lifecycle.featureActions).toHaveText('2');
  await expect.poll(() => originalView.evaluate((element) => element.isConnected)).toBe(false);
  await originalView.dispose();
});

test('L2 rebinding follows only the new feature key without stale content', async ({ page, context }) => {
  const lifecycle = new LifecyclePage(page, context);
  await lifecycle.open();

  await lifecycle.enableCurrentFeature();
  await expect(lifecycle.featureContent).toHaveCount(1);
  await expect(lifecycle.featureContent).toHaveText('Feature content for commonlib-lifecycle-alpha');
  await lifecycle.rebindFeature();
  await expect(lifecycle.activeFeatureKey).toHaveText('commonlib-lifecycle-beta');
  await expect(lifecycle.featureContent).toHaveCount(0);
  await lifecycle.enableOriginalFeature();
  await expect(lifecycle.featureContent).toHaveCount(0);
  await lifecycle.enableCurrentFeature();
  await expect(lifecycle.featureContent).toHaveCount(1);
  await expect(lifecycle.featureContent).toHaveText('Feature content for commonlib-lifecycle-beta');
  await lifecycle.disableOriginalFeature();
  await expect(lifecycle.featureContent).toHaveCount(1);
  await expect(lifecycle.featureContent).toHaveText('Feature content for commonlib-lifecycle-beta');
  await lifecycle.disableCurrentFeature();
  await expect(lifecycle.featureContent).toHaveCount(0);
  await lifecycle.enableCurrentFeature();
  await expect(lifecycle.featureContent).toHaveCount(1);
  await expect(lifecycle.featureContent).toHaveText('Feature content for commonlib-lifecycle-beta');
});

for (const scenario of lifecycleRoles) {
  test(`L1 role filtering selects only eligible messages for ${scenario.role}`, async ({ page, context }) => {
    const lifecycle = new LifecyclePage(page, context);
    await lifecycle.open({ set: 'roles', role: scenario.role });

    await expect(lifecycle.heading).toBeVisible();
    await expect(lifecycle.messageHeadings).toHaveText(scenario.headings);
    await expect(lifecycle.serviceMessages).toHaveCount(scenario.headings.length);
    await expect(lifecycle.configurationError).toHaveCount(0);
  });
}

test('L1 a single wildcard message is eligible without user roles', async ({ page, context }) => {
  const lifecycle = new LifecyclePage(page, context);
  await lifecycle.open({ set: 'wildcard', role: 'none' });

  await expect(lifecycle.serviceMessages).toHaveCount(1);
  await expect(lifecycle.messageHeadings).toHaveText(['Notice for everyone']);
  await expect(lifecycle.serviceMessages.getByText('Hide message', { exact: true })).toBeVisible();
});

test('L1 date windows exclude future, expired and exact-start messages while including the exact end', async ({ page, context }) => {
  await page.clock.setFixedTime(lifecycleClock);
  const lifecycle = new LifecyclePage(page, context);
  await lifecycle.open({ set: 'dates' });

  await expect(lifecycle.messageHeadings).toHaveText([
    'Active dated notice', 'Undated notice', 'No start date notice', 'No end date notice', 'Ends exactly now'
  ]);
  await expect(lifecycle.serviceMessages).toHaveCount(5);
  await expect(lifecycle.configurationError).toHaveCount(0);
});

for (const scenario of lifecycleDateErrors) {
  test(`L1 ${scenario.set} configuration excludes the banner and shows its exact warning`, async ({ page, context }) => {
    await page.clock.setFixedTime(lifecycleClock);
    const lifecycle = new LifecyclePage(page, context);
    await lifecycle.open({ set: scenario.set });

    await expect(lifecycle.configurationError).toHaveCount(1);
    await expect(lifecycle.configurationErrorText).toHaveText(scenario.message);
    await expect(lifecycle.serviceMessages).toHaveCount(0);
  });
}

test('L1 dismissal cookies isolate message sets even when they contain the same message', async ({ page, context }) => {
  const lifecycle = new LifecyclePage(page, context);
  await lifecycle.open();
  await lifecycle.firstDismissLink.click();
  await expect(lifecycle.firstMessage).toHaveCount(0);
  expect(await lifecycle.sessionCookie(messageCookie)).toMatchObject({
    value: encodeURIComponent(JSON.stringify([firstEnglishMessage]))
  });

  await lifecycle.open({ set: 'isolated' });
  await expect(lifecycle.firstMessage).toHaveCount(1);
  expect(await lifecycle.sessionCookie(`${messageCookie}-isolated`)).toBeUndefined();
  await lifecycle.firstDismissLink.click();
  await expect(lifecycle.serviceMessages).toHaveCount(0);
  expect(await lifecycle.sessionCookie(`${messageCookie}-isolated`)).toMatchObject({
    value: encodeURIComponent(JSON.stringify([firstEnglishMessage]))
  });
  await lifecycle.reload();
  await expect(lifecycle.heading).toBeVisible();
  await expect(lifecycle.serviceMessages).toHaveCount(0);

  await lifecycle.open();
  await expect(lifecycle.secondMessage).toHaveCount(1);
  await expect(lifecycle.firstMessage).toHaveCount(0);
  expect(await lifecycle.sessionCookie(messageCookie)).toMatchObject({
    value: encodeURIComponent(JSON.stringify([firstEnglishMessage]))
  });
});

test('L1 standalone messages retain safe bilingual HTML and sanitize scripts, event handlers and javascript URLs', async ({ page, context }) => {
  const lifecycle = new LifecyclePage(page, context);
  await lifecycle.open({ fixture: 'standalone' });

  await expect(lifecycle.standalone.locator('strong')).toHaveText('Safe English notice');
  await expect(lifecycle.standalone.locator('em')).toHaveText('Hysbysiad Cymraeg');
  await expect(lifecycle.standalone.getByRole('link', { name: 'Read service details', exact: true })).toHaveAttribute('href', '/coverage');
  await expect(lifecycle.standalone.locator('script, [onclick]')).toHaveCount(0);
  await expect(lifecycle.standalone.getByRole('link', { name: 'Unsafe link fixture', exact: true })).not.toHaveAttribute('href', /^javascript:/i);
  await expect(lifecycle.hideEvents).toHaveText('0');
});

test('L1 standalone keyboard dismissal emits the complete supplied key exactly once', async ({ page, context }) => {
  const lifecycle = new LifecyclePage(page, context);
  await lifecycle.open({ fixture: 'standalone' });

  await expect(lifecycle.hiddenMessageKey).toHaveText('null');
  await expect(lifecycle.hideEvents).toHaveText('0');
  await lifecycle.standaloneHide.focus();
  await expect(lifecycle.standaloneHide).toBeFocused();
  await lifecycle.standaloneHide.press('Enter');

  await expect(lifecycle.standalone).toHaveCount(0);
  await expect(lifecycle.hideEvents).toHaveText('1');
  expect(JSON.parse(await lifecycle.hiddenMessageKey.innerText())).toEqual(standaloneMessageKey);
});
