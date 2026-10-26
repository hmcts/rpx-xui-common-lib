import { Locator, Page } from '@playwright/test';

export class AppPage {
  constructor(private readonly page: Page) {}

  public async navigateTo(): Promise<void> {
    await this.page.goto('/');
  }

  public get heading(): Locator {
    return this.page.getByRole('heading', { name: 'ExUI Common Lib Test Page', level: 1 });
  }

  public get serviceMessage(): Locator {
    return this.page.locator('xuilib-service-message');
  }

  public get hideMessageLink(): Locator {
    return this.serviceMessage.getByRole('button', { name: 'Hide message' });
  }

  public get serviceWarningIcon(): Locator {
    return this.serviceMessage.locator('svg[role="img"]');
  }

  public termsDocument(index: number): Locator {
    return this.page.locator('xuilib-terms-and-conditions').nth(index);
  }

  public get contactDetails(): Locator {
    return this.page.locator('xuilib-contact-details');
  }

  public tab(name: string): Locator {
    return this.page.getByRole('tab', { name, exact: true });
  }

  public get dueDateControls(): Locator {
    return this.page.locator('table').filter({ hasText: 'Red threshold' });
  }

  public get dueDateInput(): Locator {
    return this.dueDateControls.getByRole('textbox');
  }

  public get highUrgencyCutoffInput(): Locator {
    return this.dueDateControls.getByRole('spinbutton').nth(0);
  }

  public get mediumUrgencyCutoffInput(): Locator {
    return this.dueDateControls.getByRole('spinbutton').nth(1);
  }

  public get dueDateBadge(): Locator {
    return this.page.locator('xuilib-due-date .due-date');
  }

  public get checkboxList(): Locator {
    return this.page.locator('xuilib-checkbox-list.checkbox-list-test');
  }

  public checkbox(name: string): Locator {
    return this.checkboxList.getByRole('checkbox', { name, exact: true });
  }

  public get checkboxOptions(): Locator {
    return this.checkboxList.locator('.checkbox-items input[type="checkbox"]');
  }

  public get checkboxEvents(): Locator {
    return this.page.locator('.checkbox-events');
  }

  public get listHeightSelect(): Locator {
    return this.page.locator('#checkbox_list_height');
  }

  public get startSpinnerButton(): Locator {
    return this.page.getByRole('button', { name: 'Start Spinner' });
  }

  public get stopSpinnerButton(): Locator {
    return this.page.getByRole('button', { name: 'Stop Spinner' });
  }

  public get spinner(): Locator {
    return this.page.locator('.spinner-container');
  }

  public get addWimbledonButton(): Locator {
    return this.page.getByRole('button', { name: 'Add Wimbledon option' });
  }

  public get removeWimbledonButton(): Locator {
    return this.page.getByRole('button', { name: 'Remove Wimbledon option' });
  }

  public get wimbledonCheckbox(): Locator {
    return this.page.getByRole('checkbox', { name: 'Wimbledon', exact: true });
  }
}
