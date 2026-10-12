import { expect, test as base } from '@playwright/test';
import { AppPage } from './app.po';

const test = base.extend<{ browserDiagnostics: string[] }>({
  browserDiagnostics: async ({ page, browserName }, use) => {
    const errors: string[] = [];

    page.on('console', (message) => {
      if (message.type() === 'error' && !isKnownBrowserDiagnostic(message.text(), message.location().url, browserName)) {
        errors.push(`console: ${message.text()} (${message.location().url})`);
      }
    });
    page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));

    await use(errors);
  },
});

test.describe('workspace-project App', () => {
  test.beforeEach(async ({ page, browserDiagnostics }) => {
    void browserDiagnostics;
    await new AppPage(page).navigateTo();
  });

  test.afterEach(async ({ browserDiagnostics }) => {
    expect(browserDiagnostics).toEqual([]);
  });

  test('should display welcome message', async ({ page }) => {
    const appPage = new AppPage(page);
    await expect(page).toHaveTitle(/RpxXuiCommonLib/);
    await expect(appPage.heading).toHaveText('ExUI Common Lib Test Page');
  });

  test('should add and remove the Wimbledon checkbox option', async ({ page }) => {
    const appPage = new AppPage(page);
    await expect(appPage.wimbledonCheckbox).toHaveCount(0);

    await appPage.addWimbledonButton.click();
    await expect(appPage.wimbledonCheckbox).toBeVisible();

    await appPage.removeWimbledonButton.click();
    await expect(appPage.wimbledonCheckbox).toHaveCount(0);
  });
});

function isKnownBrowserDiagnostic(message: string, url: string, browserName: string): boolean {
  return (
    (browserName === 'firefox' && message.startsWith('[JavaScript Error: "downloadable font:')) ||
    (browserName === 'webkit' && url === 'https://www.googletagmanager.com/gtm.js?id=GTM-1234')
  );
}
