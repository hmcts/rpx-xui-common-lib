import { expect, test as base } from '@playwright/test';

export const test = base.extend<{ browserDiagnostics: string[] }>({
  browserDiagnostics: [async ({ page, browserName }, use) => {
    const errors: string[] = [];

    page.on('console', (message) => {
      if (message.type() === 'error' && !isKnownBrowserDiagnostic(message.text(), message.location().url, browserName)) {
        errors.push(`console: ${message.text()} (${message.location().url})`);
      }
    });
    page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));

    await use(errors);
    expect(errors).toEqual([]);
  }, { auto: true }]
});

function isKnownBrowserDiagnostic(message: string, url: string, browserName: string): boolean {
  return (
    (browserName === 'firefox' && message.startsWith('[JavaScript Error: "downloadable font:')) ||
    (browserName === 'webkit' && url === 'https://www.googletagmanager.com/gtm.js?id=GTM-1234')
  );
}
