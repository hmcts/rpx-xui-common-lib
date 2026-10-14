import { Page } from '@playwright/test';

export class UserManagementPage {
  constructor(private readonly page: Page) {}

  public get selectedDetails() {
    return this.page.getByRole('region', { name: 'Selected user details', exact: true });
  }

  public get invitedDetails() {
    return this.page.getByRole('region', { name: 'Invited user details', exact: true });
  }

  public get suspend() {
    return this.selectedDetails.getByRole('button', { name: 'Suspend account', exact: true });
  }

  public get reinvite() {
    return this.invitedDetails.getByRole('button', { name: 'Resend invitation', exact: true });
  }

  public get bounds() {
    return this.page.locator('.hmcts-pagination__results');
  }

  public userLink(number: number) {
    return this.page.getByRole('link', { name: `Demo User ${number}`, exact: true });
  }

  public get next() {
    return this.page.getByRole('button', { name: 'Next page', exact: true });
  }

  public get previous() {
    return this.page.getByRole('button', { name: 'Previous set of pages', exact: true });
  }
}
