import { Locator, Page } from '@playwright/test';

export class AdditionalCoveragePage {
  constructor(private readonly page: Page) {}

  public async openStandalone(): Promise<void> {
    await this.page.goto('/coverage/standalone');
  }

  public async openAccessibility(endpoint: 'organisation' | 'cases' = 'organisation'): Promise<void> {
    await this.page.goto(endpoint === 'cases' ? '/coverage/accessibility/manage-case' : '/coverage/accessibility');
  }

  public async openExtendedControls(): Promise<void> {
    await this.page.goto('/coverage/extended-controls');
  }

  public get pageTitle(): Locator {
    return this.page.locator('exui-page-wrapper h1.govuk-heading-xl');
  }

  public get pageCaption(): Locator {
    return this.page.getByText('Standalone wrapper caption', { exact: true });
  }

  public get backLink(): Locator {
    return this.page.getByRole('link', { name: 'Back', exact: true });
  }

  public get wrapperContent(): Locator {
    return this.page.getByTestId('wrapper-content');
  }

  public get toggleTitle(): Locator {
    return this.page.getByRole('button', { name: 'Toggle page title', exact: true });
  }

  public get toggleBackLink(): Locator {
    return this.page.getByRole('button', { name: 'Toggle page back link', exact: true });
  }

  public get toggleCaption(): Locator {
    return this.page.getByRole('button', { name: 'Toggle page caption', exact: true });
  }

  public radio(name: string): Locator {
    return this.page.getByRole('radio', { name, exact: true });
  }

  public get toggleRadioError(): Locator {
    return this.page.getByRole('button', { name: 'Toggle radio error', exact: true });
  }

  public get radiosGroup(): Locator {
    return this.page.locator('.govuk-form-group').filter({ has: this.page.locator('legend', { hasText: 'Preferred route' }) });
  }

  public get checkbox(): Locator {
    return this.page.getByRole('checkbox', { name: /Email updates/ });
  }

  public get formValue(): Locator {
    return this.page.getByTestId('standalone-form-value');
  }

  public get extendedFormValue(): Locator {
    return this.page.getByTestId('extended-form-value');
  }

  public get fullNameInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Full name', exact: true });
  }

  public get inputGroup(): Locator {
    return this.page.locator('.govuk-form-group').filter({ has: this.fullNameInput });
  }

  public get toggleInputErrorButton(): Locator {
    return this.page.getByRole('button', { name: 'Toggle input error', exact: true });
  }

  public checkboxOption(label: string): Locator {
    return this.page.getByRole('checkbox', { name: label, exact: true });
  }

  public get checkboxGroup(): Locator {
    return this.page.locator('.gov-uk-input').filter({ has: this.checkboxOption('Beta service') });
  }

  public get toggleCheckboxErrorButton(): Locator {
    return this.page.getByRole('button', { name: 'Toggle checkbox error', exact: true });
  }

  public get serviceSearch(): Locator {
    return this.page.locator('#inputServiceSearch');
  }

  public get selectedServices(): Locator {
    return this.page.getByTestId('selected-services');
  }

  public get toggleAddressErrorsButton(): Locator {
    return this.page.getByRole('button', { name: 'Toggle address errors', exact: true });
  }

  public get toggleInternationalButton(): Locator {
    return this.page.getByRole('button', { name: 'Toggle international address', exact: true });
  }

  public addressInput(id: string): Locator {
    return this.page.locator(`#${id}`);
  }
}
