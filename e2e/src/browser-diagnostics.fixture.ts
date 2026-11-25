import { expect, test as base } from '@playwright/test';

type BrowserDiagnosticMatcher = { message: string; url: string };
type BrowserDiagnosticAllowList = ((matcher: BrowserDiagnosticMatcher) => void) & {
  matches: (message: string, url?: string) => boolean;
};

export const test = base.extend<{
  browserDiagnostics: string[];
  allowBrowserDiagnostic: BrowserDiagnosticAllowList;
}>({
  allowBrowserDiagnostic: async ({}, use) => {
    const allowed: BrowserDiagnosticMatcher[] = [];
    const allow = ((matcher: BrowserDiagnosticMatcher) => { allowed.push(matcher); }) as BrowserDiagnosticAllowList;
    allow.matches = (message: string, url?: string) => allowed.some((matcher) =>
      message.includes(matcher.message) && url?.includes(matcher.url));
    await use(allow);
  },
  browserDiagnostics: [async ({ page, browserName, allowBrowserDiagnostic }, use) => {
    const errors: string[] = [];

    page.on('console', (message) => {
      if (message.type() === 'error' &&
        !isKnownBrowserDiagnostic(message.text(), message.location().url, browserName) &&
        !allowBrowserDiagnostic.matches(message.text(), message.location().url)) {
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
