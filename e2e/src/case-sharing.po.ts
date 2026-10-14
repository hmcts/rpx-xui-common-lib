import { Page } from '@playwright/test';
import { SharedCase } from '../../projects/exui-common-lib/src/lib/models/case-share.model';

export class CaseSharingPage {
  constructor(private readonly page: Page) {}

  public case(id: string) {
    return this.page.locator(`#govuk-accordion__section-${id}`);
  }

  public confirmation(id: string) {
    return this.page.locator(`#user-access-block-${id}`);
  }

  public async openCaseDetails(id: string): Promise<void> {
    await this.case(id).getByRole('button', { name: /^Expand or collapse details for / }).click();
  }

  public async addSam(): Promise<void> {
    await this.page.locator('#add-user-input input').fill('Sam');
    await this.page.getByRole('listbox').getByRole('option', { name: 'Sam Morgan - sam@example.test', exact: true }).click();
    await this.page.locator('#btn-add-user').click();
  }

  public async state(): Promise<SharedCase[]> {
    return JSON.parse(await this.page.getByTestId('sharing-state').innerText());
  }

  public async synchronized(): Promise<SharedCase[]> {
    return JSON.parse(await this.page.getByTestId('sharing-synchronized').innerText());
  }
}
