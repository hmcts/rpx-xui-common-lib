import type { Locator, Page } from '@playwright/test';

export class ServiceContractBPage {
  public readonly heading: Locator;
  public readonly referenceDataState: Locator;
  public readonly referenceDataError: Locator;
  public readonly referenceDataRegions: Locator;
  public readonly referenceDataServices: Locator;
  public readonly referenceDataLocations: Locator;
  public readonly locationsState: Locator;
  public readonly locationsError: Locator;
  public readonly locations: Locator;
  public readonly multiCodeLocations: Locator;
  public readonly taskNamesState: Locator;
  public readonly taskNamesError: Locator;
  public readonly taskNames: Locator;
  public readonly interceptorState: Locator;
  public readonly interceptorError: Locator;
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Service contract B demo' });
    this.referenceDataState = page.getByTestId('service-contract-b-reference-data-state');
    this.referenceDataError = page.getByTestId('service-contract-b-reference-data-error');
    this.referenceDataRegions = page.getByTestId('service-contract-b-reference-data-regions');
    this.referenceDataServices = page.getByTestId('service-contract-b-reference-data-services');
    this.referenceDataLocations = page.getByTestId('service-contract-b-reference-data-locations');
    this.locationsState = page.getByTestId('service-contract-b-locations-state');
    this.locationsError = page.getByTestId('service-contract-b-locations-error');
    this.locations = page.getByTestId('service-contract-b-locations');
    this.multiCodeLocations = page.getByTestId('service-contract-b-multi-code-locations');
    this.taskNamesState = page.getByTestId('service-contract-b-task-names-state');
    this.taskNamesError = page.getByTestId('service-contract-b-task-names-error');
    this.taskNames = page.getByTestId('service-contract-b-task-names');
    this.interceptorState = page.getByTestId('service-contract-b-interceptor-state');
    this.interceptorError = page.getByTestId('service-contract-b-interceptor-error');
  }

  public async open(): Promise<void> {
    await this.page.goto('/coverage/service-contract-b');
  }

  public async loadReferenceData(): Promise<void> {
    await this.page.getByRole('button', { name: 'Load reference data', exact: true }).click();
  }

  public async loadLocations(): Promise<void> {
    await this.page.getByRole('button', { name: 'Load locations for IA', exact: true }).click();
  }

  public async loadLocationsForMultipleServices(): Promise<void> {
    await this.page.getByRole('button', { name: 'Load locations for IA and UNKNOWN', exact: true }).click();
  }

  public async loadTaskNames(): Promise<void> {
    await this.page.getByRole('button', { name: 'Load task names', exact: true }).click();
  }

  public async clearTaskCache(): Promise<void> {
    await this.page.getByRole('button', { name: 'Clear task-name cache', exact: true }).click();
  }

  public async requestInterceptorError(): Promise<void> {
    await this.page.getByRole('button', { name: 'Request interceptor error', exact: true }).click();
  }
}
