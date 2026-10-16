import { Page } from '@playwright/test';

export class AdvancedFilterPage {
  constructor(private readonly page: Page) {}

  readonly heading = this.page.getByRole('heading', { name: 'Advanced filter contracts', exact: true });
  private readonly apply = this.page.getByRole('button', { name: 'Apply advanced filters', exact: true });
  readonly settings = this.page.getByTestId('advanced-filter-settings');
  readonly detail = this.page.getByRole('textbox', { name: 'Detail', exact: true });
  private readonly includeDetail = this.page.getByRole('radio', { name: 'Include detail', exact: true });
  private readonly excludeDetail = this.page.getByRole('radio', { name: 'No detail', exact: true });
  readonly familyPreference = this.page.getByRole('checkbox', { name: 'Family category', exact: true });

  async openConditional(): Promise<void> {
    await this.page.goto('/coverage/advanced-filter?contract=conditional');
  }

  async openPersistence(userId: string, key: 'primary' | 'alternate'): Promise<void> {
    await this.page.goto('/home');
    await this.page.evaluate((id) => sessionStorage.setItem('userDetails', JSON.stringify({ id })), userId);
    await this.page.goto(`/coverage/advanced-filter?contract=persistence&key=${key}`);
  }

  async reload(): Promise<void> {
    await this.page.reload();
  }

  async applyFilters(): Promise<void> {
    await this.apply.click();
  }

  async enableDetail(): Promise<void> {
    await this.includeDetail.check();
  }

  async disableDetail(): Promise<void> {
    await this.excludeDetail.check();
  }

  async selectFamilyPreference(): Promise<void> {
    await this.familyPreference.check();
  }
}
