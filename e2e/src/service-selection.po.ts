import { Page } from '@playwright/test';

export class ServiceSelectionPage {
  constructor(private readonly page: Page) {}

  readonly search = this.page.getByRole('combobox', { name: 'Choose services' });
  readonly options = this.page.getByRole('option');
  readonly add = this.page.getByRole('link', { name: 'Add service' });
  readonly value = this.page.getByTestId('services-value');
  readonly changes = this.page.getByTestId('services-changes');
  readonly selected = this.page.locator('xuilib-find-service .selection-container a');

  async choose(label: string) {
    await this.search.fill(label);
    await this.page.getByRole('option', { name: label, exact: true }).click();
  }
}
