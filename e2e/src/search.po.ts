import type { Locator, Page } from '@playwright/test';
import { mockSearchHttp } from './search.mock';

export type PersonDomain = 'judicial' | 'all' | 'legal' | 'admin' | 'ctsc';

export class SearchPage {
  public readonly heading: Locator;
  public readonly options: Locator;
  public readonly personSelections: Locator;
  public readonly judicialControl: Locator;
  public readonly judicialSelections: Locator;
  private input: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Search component demo' });
    this.options = page.getByRole('option');
    this.personSelections = page.getByTestId('person-selections');
    this.judicialControl = page.getByTestId('judicial-control');
    this.judicialSelections = page.getByTestId('judicial-selections');
  }

  public async openPerson(domain: PersonDomain, excludeSelected = false): Promise<void> {
    await mockSearchHttp(this.page);
    this.input = this.page.locator('#inputSelectPerson');
    await this.page.goto(`/coverage/searches?feature=person&domain=${domain}${excludeSelected ? '&exclude=true' : ''}`);
  }

  public async openJudicials(): Promise<void> {
    await mockSearchHttp(this.page);
    this.input = this.page.locator('#inputSelectPersonjudicials');
    await this.page.goto('/coverage/searches?feature=judicials');
  }

  public async search(term: string): Promise<void> {
    await this.input.pressSequentially(term);
  }

  public async selectFirstWithKeyboard(): Promise<void> {
    await this.input.press('Enter');
  }

  public option(name: string): Locator {
    return this.page.getByRole('option', { name, exact: true });
  }

  public value(): Promise<string> {
    return this.input.inputValue();
  }
}
