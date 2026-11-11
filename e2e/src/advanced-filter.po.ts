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
  readonly civilPreference = this.page.getByRole('checkbox', { name: 'Civil category', exact: true });
  readonly allCategories = this.page.getByRole('checkbox', { name: 'All categories', exact: true });
  readonly civilService = this.page.getByRole('checkbox', { name: 'Civil service', exact: true });
  readonly familyService = this.page.getByRole('checkbox', { name: 'Family service', exact: true });
  readonly appeals = this.page.getByRole('checkbox', { name: 'Appeals', exact: true });
  readonly hearings = this.page.getByRole('checkbox', { name: 'Hearings', exact: true });
  readonly skills = this.page.getByRole('combobox', { name: 'Skills', exact: true });
  readonly name = this.page.getByRole('textbox', { name: 'Name', exact: true });
  readonly email = this.page.getByRole('textbox', { name: 'Email', exact: true });
  readonly nameError = this.page.locator('#name-error');
  readonly emailError = this.page.locator('#email-error');
  readonly categoriesError = this.page.locator('#categories-error');
  readonly errors = this.page.getByTestId('advanced-filter-errors');
  readonly restoreDefaults = this.page.getByRole('button', { name: 'Restore defaults', exact: true });

  async open(contract: 'choices' | 'limits' | 'text' | 'groups' | 'nested', persistence: 'session' | 'memory' = 'session'): Promise<void> {
    await this.page.goto(`/coverage/advanced-filter?contract=${contract}&persistence=${persistence}`);
  }

  async openTextDefaults(): Promise<void> {
    await this.page.goto('/coverage/advanced-filter?contract=text&defaults=configured');
  }

  async openConditional(): Promise<void> {
    await this.page.goto('/coverage/advanced-filter?contract=conditional');
  }

  async openPersistence(userId: string, key: 'primary' | 'alternate'): Promise<void> {
    await this.page.goto('/home');
    await this.page.evaluate((id) => sessionStorage.setItem('userDetails', JSON.stringify({ id })), userId);
    await this.page.goto(`/coverage/advanced-filter?contract=persistence&key=${key}`);
  }

  async openOwnedPersistence(ownerHash: string): Promise<void> {
    await this.page.goto('/home');
    await this.setOwnerHash(ownerHash);
    await this.page.goto('/coverage/advanced-filter?contract=persistence&key=primary');
  }

  async setOwnerHash(ownerHash: string): Promise<void> {
    await this.page.evaluate((filterOwnerHash) => {
      sessionStorage.setItem('userDetails', JSON.stringify({ filterOwnerHash }));
    }, ownerHash);
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
