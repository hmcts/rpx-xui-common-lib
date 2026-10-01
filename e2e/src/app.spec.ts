import { expect, test } from '@playwright/test';
import { AppPage } from './app.po';

test.describe('workspace-project App', () => {
  let appPage: AppPage;
  let errors: string[] = [];

  test.beforeEach(async ({ page }) => {
    errors = [];
    // Attach before navigation so errors raised during bootstrap are captured.
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(`console: ${msg.text()} (${msg.location().url})`);
      }
    });
    page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));

    appPage = new AppPage(page);
    await appPage.navigateTo();
  });

  test.afterEach(() => {
    expect(errors).toEqual([]);
  });

  test('should display welcome message', async ({ page }) => {
    await expect(page).toHaveTitle(/RpxXuiCommonLib/);
    await expect(appPage.heading).toHaveText('ExUI Common Lib Test Page');
  });

  test('should add and remove the Wimbledon checkbox option', async () => {
    await expect(appPage.wimbledonCheckbox).toHaveCount(0);

    await appPage.addWimbledonButton.click();
    await expect(appPage.wimbledonCheckbox).toBeVisible();

    await appPage.removeWimbledonButton.click();
    await expect(appPage.wimbledonCheckbox).toHaveCount(0);
  });
});
