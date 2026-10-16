import { BrowserContext, Page } from '@playwright/test';

export class LifecyclePage {
  public readonly serviceMessages = this.page.locator('xuilib-service-message');
  public readonly firstMessage = this.serviceMessages.filter({ hasText: 'English planned maintenance is available.' });
  public readonly secondMessage = this.serviceMessages.filter({ hasText: 'English unaffected service message.' });
  public readonly firstEnglishHeading = this.firstMessage.getByRole('heading', {
    name: 'English planned maintenance is available.',
    exact: true
  });

  public readonly firstWelshHeading = this.firstMessage.getByRole('heading', {
    name: 'Mae gwaith cynnal a chadw ar gael.',
    exact: true
  });

  public readonly unsafeMarkup = this.serviceMessages.locator('script');
  public readonly firstDismissLink = this.firstMessage.getByText('Hide message', { exact: true });
  public readonly activeFeatureKey = this.page.getByTestId('active-feature-key');
  public readonly featureContent = this.page.getByTestId('feature-toggle-content');

  constructor(private readonly page: Page, private readonly context: BrowserContext) {}

  public async open(): Promise<void> {
    await this.page.goto('/coverage/lifecycle');
  }

  public async focusFirstDismissLink(): Promise<void> {
    await this.firstDismissLink.focus();
  }

  public async dismissFocusedMessageWithEnter(): Promise<void> {
    await this.firstDismissLink.press('Enter');
  }

  public async reload(): Promise<void> {
    await this.page.reload();
  }

  public async sessionCookie(name: string) {
    return (await this.context.cookies()).find((cookie) => cookie.name === name);
  }

  public async enableCurrentFeature(): Promise<void> {
    await this.page.getByRole('button', { name: 'Enable current feature', exact: true }).click();
  }

  public async disableCurrentFeature(): Promise<void> {
    await this.page.getByRole('button', { name: 'Disable current feature', exact: true }).click();
  }

  public async rebindFeature(): Promise<void> {
    await this.page.getByRole('button', { name: 'Rebind feature', exact: true }).click();
  }

  public async enableOriginalFeature(): Promise<void> {
    await this.page.getByRole('button', { name: 'Enable original feature', exact: true }).click();
  }

  public async disableOriginalFeature(): Promise<void> {
    await this.page.getByRole('button', { name: 'Disable original feature', exact: true }).click();
  }
}
