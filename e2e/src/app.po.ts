import { Locator, Page } from '@playwright/test';

export class AppPage {
  constructor(private readonly page: Page) {}

  public async navigateTo(): Promise<void> {
    await this.page.goto('/');
  }

  public get heading(): Locator {
    return this.page.getByRole('heading', { name: 'ExUI Common Lib Test Page', level: 1 });
  }

  public get addWimbledonButton(): Locator {
    return this.page.getByRole('button', { name: 'Add Wimbledon option' });
  }

  public get removeWimbledonButton(): Locator {
    return this.page.getByRole('button', { name: 'Remove Wimbledon option' });
  }

  public get wimbledonCheckbox(): Locator {
    return this.page.getByRole('checkbox', { name: 'Wimbledon', exact: true });
  }
}
