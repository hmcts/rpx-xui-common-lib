import { Page } from '@playwright/test';

export class InvitationPage {
  constructor(private readonly page: Page) {}

  readonly firstName = this.page.getByRole('textbox', { name: 'First name', exact: true });
  readonly lastName = this.page.getByRole('textbox', { name: 'Last name', exact: true });
  readonly email = this.page.getByRole('textbox', { name: 'Email address', exact: true });
  readonly cases = this.page.getByRole('checkbox', { name: 'Manage Cases', exact: true });
  readonly users = this.page.getByRole('checkbox', { name: 'Manage Users', exact: true });
  readonly submit = this.page.getByRole('button', { name: 'Send invitation' });
  readonly value = this.page.getByTestId('invitation-value');
  readonly submissions = this.page.getByTestId('invitation-submissions');
  readonly valid = this.page.getByTestId('invitation-valid');

  async fillDetails() {
    await this.firstName.fill('Alex');
    await this.lastName.fill('Taylor');
    await this.email.fill('alex.taylor@example.test');
  }
}
