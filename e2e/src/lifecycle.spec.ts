import { expect } from '@playwright/test';
import { test } from './browser-diagnostics.fixture';
import { LifecyclePage } from './lifecycle.po';

const messageCookie = 'commonlib-lifecycle-hidden-messages';
const firstEnglishMessage = 'English <strong>planned maintenance</strong> is available.<script>window.__unsafeEnglish = true</script>';
const secondEnglishMessage = 'English unaffected service message.';

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

test('L2 disabling removes feature content and re-enabling recreates it once', async ({ page, context }) => {
  const lifecycle = new LifecyclePage(page, context);
  await lifecycle.open();

  await expect(lifecycle.featureContent).toHaveCount(0);
  await lifecycle.enableCurrentFeature();
  await expect(lifecycle.featureContent).toHaveText('Feature content for commonlib-lifecycle-alpha');
  await lifecycle.disableCurrentFeature();
  await expect(lifecycle.featureContent).toHaveCount(0);
  await lifecycle.enableCurrentFeature();
  await expect(lifecycle.featureContent).toHaveCount(1);
});

test('L2 rebinding follows only the new feature key without stale content', async ({ page, context }) => {
  test.skip(true, 'EXUI-5377: FeatureToggle keeps the previous feature-key subscription after rebinding');
  const lifecycle = new LifecyclePage(page, context);
  await lifecycle.open();

  await lifecycle.rebindFeature();
  await expect(lifecycle.activeFeatureKey).toHaveText('commonlib-lifecycle-beta');
  await expect(lifecycle.featureContent).toHaveCount(0);
  await lifecycle.enableOriginalFeature();
  await expect(lifecycle.featureContent).toHaveCount(0);
  await lifecycle.enableCurrentFeature();
  await expect(lifecycle.featureContent).toHaveText('Feature content for commonlib-lifecycle-beta');
  await lifecycle.disableOriginalFeature();
  await expect(lifecycle.featureContent).toHaveText('Feature content for commonlib-lifecycle-beta');
});
