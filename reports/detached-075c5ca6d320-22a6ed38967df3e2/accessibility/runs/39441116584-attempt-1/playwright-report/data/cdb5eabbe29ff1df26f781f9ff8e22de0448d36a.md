# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility-shell.spec.ts >> skip link moves focus to the main-content target for /coverage?feature=dialog
- Location: e2e/accessibility/accessibility-shell.spec.ts:53:7

# Error details

```
Error: A11Y_VIOLATIONS

expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 12

- Array []
+ Array [
+   Object {
+     "engine": "axe",
+     "issueCount": 1,
+     "reviewCount": 0,
+     "reviewRules": Array [],
+     "rules": Array [
+       "aria-dialog-name",
+     ],
+     "status": "issues-found",
+   },
+ ]
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - link "Skip to main content" [ref=e3] [cursor=pointer]:
    - /url: "#main-content"
  - generic [ref=e4]:
    - banner [ref=e5]:
      - heading "CommonLib component coverage examples" [level=1] [ref=e6]
    - main [active]:
      - dialog [ref=e8]:
        - generic [ref=e9]: We are about to sign you out
        - paragraph [ref=e15]: Your session will end soon.
```

# Test source

```ts
  1  | import { expect } from '@playwright/test';
  2  | import { test } from '../src/browser-diagnostics.fixture';
  3  | import { collectAccessibilityEvidence } from './accessibilityAudit';
  4  | import { ASSERTION_MARKER } from './report.cjs';
  5  | 
  6  | type RouteContract = {
  7  |   path: string;
  8  |   marker: { selector: string; text?: string };
  9  | };
  10 | 
  11 | const heading = (text: string) => ({ selector: 'h1', text });
  12 | 
  13 | const routes: RouteContract[] = [
  14 |   { path: '/home', marker: heading('ExUI Common Lib Test Page') },
  15 |   { path: '/coverage', marker: heading('CommonLib component coverage examples') },
  16 |   { path: '/coverage?feature=filter', marker: { selector: '[data-testid="generic-filter-demo"]' } },
  17 |   { path: '/coverage?feature=pagination', marker: { selector: '[data-testid="pagination-demo"]' } },
  18 |   { path: '/coverage?feature=cookie', marker: { selector: '[data-testid="cookie-demo"]' } },
  19 |   { path: '/coverage?feature=users', marker: { selector: '[data-testid="user-select-demo"]' } },
  20 |   { path: '/coverage?feature=terms', marker: { selector: '[data-testid="terms-confirm-demo"]' } },
  21 |   { path: '/coverage?feature=terms-html', marker: { selector: '[data-testid="terms-html-demo"]' } },
  22 |   { path: '/coverage?feature=terms-plain', marker: { selector: '[data-testid="terms-plain-demo"]' } },
  23 |   { path: '/coverage?feature=terms-unknown', marker: { selector: '[data-testid="terms-unknown-demo"]' } },
  24 |   { path: '/coverage?feature=form-group', marker: { selector: '[data-testid="form-group-demo"]' } },
  25 |   { path: '/coverage?feature=navigation', marker: { selector: '[data-testid="navigation-demo"]' } },
  26 |   { path: '/coverage?feature=feedback', marker: { selector: '[data-testid="feedback-demo"]' } },
  27 |   { path: '/coverage?feature=dialog', marker: { selector: '[data-testid="dialog-demo"]' } },
  28 |   { path: '/coverage/validators', marker: heading('Validator contract demo') },
  29 |   { path: '/coverage/primitives', marker: heading('Primitives coverage demo') },
  30 |   { path: '/coverage/service-contract-a', marker: heading('Service contract A demo') },
  31 |   { path: '/coverage/case-sharing', marker: { selector: 'xuilib-share-case' } },
  32 |   { path: '/coverage/case-sharing/confirmation', marker: heading('Check case sharing changes') },
  33 |   { path: '/coverage/accessibility', marker: { selector: 'xuilib-accessibility' } },
  34 |   { path: '/coverage/accessibility/manage-case', marker: { selector: 'xuilib-accessibility' } },
  35 |   { path: '/coverage/standalone', marker: heading('Standalone component coverage') },
  36 |   { path: '/coverage/extended-controls', marker: heading('Extended control coverage') },
  37 |   { path: '/coverage/lookups', marker: heading('Lookup component demo') },
  38 |   { path: '/coverage/advanced-filter', marker: heading('Advanced filter contracts') },
  39 |   { path: '/coverage/lifecycle', marker: heading('Lifecycle behaviour coverage') },
  40 |   { path: '/coverage/searches', marker: heading('Search component demo') },
  41 |   { path: '/coverage/invitation', marker: heading('Invitation form demo') },
  42 |   { path: '/coverage/form-controls', marker: heading('Form controls demo') },
  43 |   { path: '/coverage/service-selection', marker: heading('Service selection demo') },
  44 |   { path: '/coverage/address', marker: heading('Address demo') },
  45 |   { path: '/coverage/selected-cases', marker: heading('Selected case component demo') },
  46 |   { path: '/coverage/public-contracts', marker: heading('Public component contract demo') },
  47 |   { path: '/coverage/service-contract-b', marker: heading('Service contract B demo') },
  48 |   { path: '/coverage/users', marker: heading('User management demo') },
  49 |   { path: '/coverage/users/user-1', marker: heading('User management demo') }
  50 | ];
  51 | 
  52 | for (const route of routes) {
  53 |   test(`skip link moves focus to the main-content target for ${route.path}`, async ({ page }, testInfo) => {
  54 |     await page.goto(route.path);
  55 |     const actualRoute = new URL(page.url()).pathname + new URL(page.url()).search;
  56 |     expect(actualRoute).toBe(route.path);
  57 | 
  58 |     const skipLink = page.getByRole('link', { name: 'Skip to main content', exact: true });
  59 |     const mainContent = page.locator('#main-content');
  60 |     const marker = page.locator(route.marker.selector);
  61 |     await expect(skipLink).toBeVisible();
  62 |     if (route.marker.text) {
  63 |       const matchingMarker = marker.filter({ hasText: route.marker.text });
  64 |       await expect(matchingMarker).toHaveCount(1);
  65 |     }
  66 |     else {
  67 |       await expect(marker).toHaveCount(1);
  68 |     }
  69 |     await expect(mainContent).toHaveCount(1);
  70 |     await expect(mainContent).toHaveAttribute('tabindex', '-1');
  71 |     expect(await mainContent.evaluate((element) =>
  72 |       element.matches('main, [role="main"]') || Boolean(element.querySelector('main, [role="main"]'))
  73 |     )).toBe(true);
  74 | 
  75 |     await page.keyboard.press('Tab');
  76 |     await expect(skipLink).toBeFocused();
  77 |     await page.keyboard.press('Enter');
  78 |     await expect(mainContent).toBeFocused();
  79 | 
  80 |     const outcomes = await collectAccessibilityEvidence(page, testInfo);
> 81 |     expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
     |                                                                                    ^ Error: A11Y_VIOLATIONS
  82 |   });
  83 | }
  84 | 
```