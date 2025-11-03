import { test, expect, Page } from '@playwright/test';
import { AppPage } from './app.po';

test.describe('workspace-project App', () => {
  let appPage: AppPage;

  test.beforeEach(async ({ page }: { page: Page }) => {
    appPage = new AppPage(page);
  });

  test('should display welcome message', async () => {
    await appPage.navigateTo();
    const titleText = await appPage.getTitleText();
    expect(titleText).toBe('ExUI Common Lib Test Page');
  });

  test.afterEach(async ({ page }: { page: Page }) => {
    // Check for console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    expect(consoleErrors).toHaveLength(0);
  });
});
