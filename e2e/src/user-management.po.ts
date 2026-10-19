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
    // The library renders these anchors without href; accessibility is tracked separately.
    return this.page.locator('xuilib-hmcts-pagination a').filter({ hasText: 'Next' });
  }

  public get previous() {
    return this.page.locator('xuilib-hmcts-pagination a').filter({ hasText: 'Previous' });
  }
}
