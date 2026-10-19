import type { Locator, Page } from '@playwright/test';
import { mockLookupHttp, type LookupRequestCounts } from './lookups.mock';

export class LookupsPage {
  public readonly heading: Locator;
  public readonly options: Locator;
  public readonly locationValue: Locator;
  public readonly locationApplied: Locator;
  public readonly venueControl: Locator;
  public readonly venueSelection: Locator;
  public readonly workTypeValue: Locator;
  public readonly workTypeApplied: Locator;
  public readonly taskNameSelection: Locator;
  private readonly locationInput: Locator;
  private readonly venueInput: Locator;
  private readonly workTypeInput: Locator;
  private readonly taskNameInput: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Lookup component demo' });
    this.options = page.getByRole('option');
    this.locationValue = page.getByTestId('location-value');
    this.locationApplied = page.getByTestId('location-applied');
    this.venueControl = page.getByTestId('venue-control');
    this.venueSelection = page.getByTestId('venue-selection');
    this.workTypeValue = page.getByTestId('work-type-value');
    this.workTypeApplied = page.getByTestId('work-type-applied');
    this.taskNameSelection = page.getByTestId('task-name-selection');
    this.locationInput = page.locator('#inputLocationSearch');
    this.venueInput = page.locator('#searchVenueLocation');
    this.workTypeInput = page.locator('#inputWorkTypeSearch');
    this.taskNameInput = page.locator('#inputSelectTaskName');
  }

  public async openLocation(mode: 'single' | 'multi'): Promise<void> {
    await mockLookupHttp(this.page);
    await this.page.goto(`/coverage/lookups?feature=location&mode=${mode}`);
  }

  public async openVenue(filtered = false): Promise<void> {
    await mockLookupHttp(this.page);
    await this.page.goto(`/coverage/lookups?feature=venue${filtered ? '&filtered=true' : ''}`);
  }

  public async openWorkType(mode: 'single' | 'multi'): Promise<void> {
    await mockLookupHttp(this.page);
    await this.page.goto(`/coverage/lookups?feature=work-type&mode=${mode}`);
  }

  public async openTaskName(): Promise<LookupRequestCounts> {
    const requests = await mockLookupHttp(this.page);
    await this.page.goto('/coverage/lookups?feature=task-name');
    return requests;
  }

  public async searchLocation(term: string): Promise<void> {
    await this.locationInput.fill(term);
  }

  public async selectLocationWithKeyboard(): Promise<void> {
    await this.locationInput.press('Enter');
  }

  public async addLocation(): Promise<void> {
    await this.page.getByRole('link', { name: 'Add location', exact: true }).click();
  }

  public async removeLocation(name: string): Promise<void> {
    await this.page.getByRole('link', { name, exact: true }).click();
  }

  public async searchVenue(term: string): Promise<void> {
    await this.venueInput.fill('');
    await this.venueInput.pressSequentially(term);
  }

  public async selectVenueWithKeyboard(): Promise<void> {
    await this.venueInput.press('Enter');
  }

  public async searchWorkType(term: string): Promise<void> {
    await this.workTypeInput.fill(term);
  }

  public async selectWorkTypeWithKeyboard(): Promise<void> {
    await this.workTypeInput.press('Enter');
  }

  public async addWorkType(): Promise<void> {
    await this.page.getByRole('link', { name: 'Add work type', exact: true }).click();
  }

  public async removeWorkType(name: string): Promise<void> {
    await this.page.getByRole('link', { name, exact: true }).click();
  }

  public async searchTaskName(term: string): Promise<void> {
    await this.taskNameInput.fill(term);
  }

  public async selectOption(name: string): Promise<void> {
    await this.option(name).click();
  }

  public async applyFilters(): Promise<void> {
    await this.page.getByRole('button', { name: 'Apply filters', exact: true }).click();
  }

  public option(name: string): Locator {
    return this.page.getByRole('option', { name, exact: true });
  }
}
