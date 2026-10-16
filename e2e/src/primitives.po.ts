import { Locator, Page } from '@playwright/test';

export class PrimitivesPage {
  constructor(private readonly page: Page) {}

  public async open(): Promise<void> {
    await this.page.goto('/coverage/primitives');
  }

  public get formValue(): Locator {
    return this.page.getByTestId('primitives-form-value');
  }

  public get notes(): Locator {
    return this.page.getByRole('textbox', { name: 'Notes', exact: true });
  }

  public get toggleErrors(): Locator {
    return this.page.getByRole('button', { name: 'Toggle supplied errors', exact: true });
  }

  public get errors(): Locator {
    return this.page.getByTestId('supplied-error-messages');
  }

  public checkbox(name: string): Locator {
    return this.page.getByRole('checkbox', { name, exact: true });
  }

  public radio(name: string): Locator {
    return this.page.getByRole('radio', { name, exact: true });
  }

  public get disabledControl(): Locator {
    return this.page.getByRole('textbox', { name: 'Disabled value', exact: true });
  }

  public get toggleDisabled(): Locator {
    return this.page.getByRole('button', { name: 'Toggle disabled control', exact: true });
  }

  public get fieldsets(): Locator {
    return this.page.locator('xuilib-gov-uk-fieldset fieldset');
  }

  public get table(): Locator {
    return this.page.getByTestId('primitives-table');
  }

  public get identity(): Locator {
    return this.page.locator('xuilib-hmcts-identity-bar');
  }

  public get toggleIdentity(): Locator {
    return this.page.getByRole('button', { name: 'Toggle identity', exact: true });
  }

  public get backLink(): Locator {
    return this.page.locator('a.govuk-back-link');
  }

  public get backEvents(): Locator {
    return this.page.getByTestId('back-events');
  }

  public get pageNumber(): Locator {
    return this.page.getByTestId('primitive-page-number');
  }

  public get pagination(): Locator {
    return this.page.locator('xuilib-hmcts-pagination');
  }

  public get nextPage(): Locator {
    return this.pagination.locator('a').filter({ hasText: 'Next' });
  }

  public get previousPage(): Locator {
    return this.pagination.locator('a').filter({ hasText: 'Previous' });
  }

  public pageLink(pageNumber: number): Locator {
    return this.pagination.locator('a').filter({ hasText: String(pageNumber) });
  }

  public get reduceRecords(): Locator {
    return this.page.getByRole('button', { name: 'Reduce records', exact: true });
  }

  public get togglePaginationDisplays(): Locator {
    return this.page.getByRole('button', { name: 'Toggle pagination displays', exact: true });
  }

  public get paginationResults(): Locator {
    return this.pagination.locator('.hmcts-pagination__results');
  }
}
