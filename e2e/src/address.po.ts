import { Page } from '@playwright/test';
import { postcodeResponse } from './address.data';

export class AddressPage {
  constructor(private readonly page: Page) {}

  public async lookup(empty = false): Promise<void> {
    await this.page.route('**/external/addresses?postcode=*', (route) => route.fulfill({ json: empty ? { results: [] } : postcodeResponse }));
    await this.submitLookup();
  }

  public async lookupFailure(): Promise<void> {
    await this.page.route('**/external/addresses?postcode=*', (route) => route.fulfill({ status: 500, body: 'controlled failure' }));
    await this.submitLookup();
  }

  private async submitLookup(): Promise<void> {
    await this.page.getByLabel('Enter a UK postcode').fill('ab1 2cd');
    await this.page.getByRole('button', { name: 'Find address', exact: true }).click();
  }

  public async value() {
    return JSON.parse(await this.page.getByTestId('address-value').innerText());
  }
}
