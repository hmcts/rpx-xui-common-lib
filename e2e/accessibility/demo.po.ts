import type { Page } from '@playwright/test';

export class AccessibilityDemoPage {
  constructor(private page: Page) {}
  async open(feature: string) {
    await this.page.goto(`/coverage?feature=${feature}`);
  }

  get heading() {
    return this.page.getByRole('heading', { name: 'CommonLib component coverage examples', exact: true });
  }

  get applyFilter() {
    return this.page.getByRole('button', { name: 'Apply filters' });
  }

  get serviceField() {
    return this.page.locator('#service');
  }

  get civil() {
    return this.page.getByRole('checkbox', { name: 'Civil', exact: true });
  }

  get userInput() {
    return this.page.getByRole('combobox', { name: 'Select a user' });
  }

  get alexOption() {
    return this.page.getByRole('option', { name: /Alex Taylor/ });
  }

  get selectedUser() {
    return this.page.getByTestId('selected-user');
  }

  get acceptTerms() {
    return this.page.getByRole('button', { name: 'Accept terms' });
  }

  get termsResult() {
    return this.page.getByTestId('terms-result');
  }

  get showErrors() {
    return this.page.getByRole('button', { name: 'Show validation errors' });
  }

  cookieChoice(choice: string) {
    return this.page.getByRole('button', { name: `${choice} analytics cookies` });
  }
}
