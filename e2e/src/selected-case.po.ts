import type { Page } from '@playwright/test';

export class SelectedCasePage {
  constructor(private readonly page: Page) {}

  public async open(mode = 'list'): Promise<void> {
    await this.page.goto(`/coverage/selected-cases?mode=${mode}`);
  }

  public case(id: string) {
    return this.page.locator(`#govuk-accordion__section-${id}`);
  }
}
