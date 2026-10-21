import { expect } from '@playwright/test';
import { test } from '../src/browser-diagnostics.fixture';
import { collectAccessibilityEvidence } from './accessibilityAudit';
import { ASSERTION_MARKER } from './report.cjs';

type RouteContract = {
  path: string;
  marker: { selector: string; text?: string };
};

const heading = (text: string) => ({ selector: 'h1', text });

const routes: RouteContract[] = [
  { path: '/home', marker: heading('ExUI Common Lib Test Page') },
  { path: '/coverage', marker: heading('CommonLib component coverage examples') },
  { path: '/coverage?feature=filter', marker: { selector: '[data-testid="generic-filter-demo"]' } },
  { path: '/coverage?feature=pagination', marker: { selector: '[data-testid="pagination-demo"]' } },
  { path: '/coverage?feature=cookie', marker: { selector: '[data-testid="cookie-demo"]' } },
  { path: '/coverage?feature=users', marker: { selector: '[data-testid="user-select-demo"]' } },
  { path: '/coverage?feature=terms', marker: { selector: '[data-testid="terms-confirm-demo"]' } },
  { path: '/coverage?feature=terms-html', marker: { selector: '[data-testid="terms-html-demo"]' } },
  { path: '/coverage?feature=terms-plain', marker: { selector: '[data-testid="terms-plain-demo"]' } },
  { path: '/coverage?feature=terms-unknown', marker: { selector: '[data-testid="terms-unknown-demo"]' } },
  { path: '/coverage?feature=form-group', marker: { selector: '[data-testid="form-group-demo"]' } },
  { path: '/coverage?feature=navigation', marker: { selector: '[data-testid="navigation-demo"]' } },
  { path: '/coverage?feature=feedback', marker: { selector: '[data-testid="feedback-demo"]' } },
  { path: '/coverage?feature=dialog', marker: { selector: '[data-testid="dialog-demo"]' } },
  { path: '/coverage/validators', marker: heading('Validator contract demo') },
  { path: '/coverage/primitives', marker: heading('Primitives coverage demo') },
  { path: '/coverage/service-contract-a', marker: heading('Service contract A demo') },
  { path: '/coverage/case-sharing', marker: { selector: 'xuilib-share-case' } },
  { path: '/coverage/case-sharing/confirmation', marker: heading('Check case sharing changes') },
  { path: '/coverage/accessibility', marker: { selector: 'xuilib-accessibility' } },
  { path: '/coverage/accessibility/manage-case', marker: { selector: 'xuilib-accessibility' } },
  { path: '/coverage/standalone', marker: heading('Standalone component coverage') },
  { path: '/coverage/extended-controls', marker: heading('Extended control coverage') },
  { path: '/coverage/lookups', marker: heading('Lookup component demo') },
  { path: '/coverage/advanced-filter', marker: heading('Advanced filter contracts') },
  { path: '/coverage/lifecycle', marker: heading('Lifecycle behaviour coverage') },
  { path: '/coverage/searches', marker: heading('Search component demo') },
  { path: '/coverage/invitation', marker: heading('Invitation form demo') },
  { path: '/coverage/form-controls', marker: heading('Form controls demo') },
  { path: '/coverage/service-selection', marker: heading('Service selection demo') },
  { path: '/coverage/address', marker: heading('Address demo') },
  { path: '/coverage/selected-cases', marker: heading('Selected case component demo') },
  { path: '/coverage/public-contracts', marker: heading('Public component contract demo') },
  { path: '/coverage/service-contract-b', marker: heading('Service contract B demo') },
  { path: '/coverage/remaining', marker: heading('Remaining CommonLib coverage') },
  { path: '/coverage/users', marker: heading('User management demo') },
  { path: '/coverage/users/user-1', marker: heading('User management demo') }
];

for (const route of routes) {
  test(`skip link moves focus to the main-content target for ${route.path}`, async ({ page }, testInfo) => {
    await page.goto(route.path);
    const actualRoute = new URL(page.url()).pathname + new URL(page.url()).search;
    expect(actualRoute).toBe(route.path);

    const skipLink = page.getByRole('link', { name: 'Skip to main content', exact: true });
    const mainContent = page.locator('#main-content');
    const marker = page.locator(route.marker.selector);
    await expect(skipLink).toBeVisible();
    if (route.marker.text) {
      const matchingMarker = marker.filter({ hasText: route.marker.text });
      await expect(matchingMarker).toHaveCount(1);
    }
    else {
      await expect(marker).toHaveCount(1);
    }
    await expect(mainContent).toHaveCount(1);
    await expect(mainContent).toHaveAttribute('tabindex', '-1');
    expect(await mainContent.evaluate((element) =>
      element.matches('main, [role="main"]') || Boolean(element.querySelector('main, [role="main"]'))
    )).toBe(true);

    await page.keyboard.press('Tab');
    await expect(skipLink).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(mainContent).toBeFocused();

    const outcomes = await collectAccessibilityEvidence(page, testInfo);
    expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  });
}
