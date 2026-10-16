import { Page } from '@playwright/test';

export class FormControlsPage {
  constructor(private readonly page: Page) {}

  readonly priority = this.page.getByRole('combobox', { name: 'Priority', exact: true });
  readonly notes = this.page.getByRole('textbox', { name: 'Case notes', exact: true });
  readonly file = this.page.getByLabel('Supporting file', { exact: true });
  readonly day = this.page.getByRole('textbox', { name: 'Day', exact: true });
  readonly month = this.page.getByRole('textbox', { name: 'Month', exact: true });
  readonly year = this.page.getByRole('textbox', { name: 'Year', exact: true });
  readonly value = this.page.getByTestId('controls-value');
  readonly dateValid = this.page.getByTestId('date-valid');
  readonly errors = this.page.getByRole('button', { name: 'Toggle supplied errors' });

  async fillDate(day: string, month: string, year: string) {
    await this.year.fill(year);
    await this.month.fill(month);
    await this.day.fill(day);
    await this.day.press('Tab');
  }
}
