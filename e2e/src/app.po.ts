import { Page } from '@playwright/test';

export class AppPage {
  constructor(private page: Page) {}

  public async navigateTo() {
    await this.page.goto('/');
  }

  public async getTitleText(): Promise<string> {
    const titleElement = this.page.locator('app-root h1').first();
    return await titleElement.textContent() || '';
  }
}
