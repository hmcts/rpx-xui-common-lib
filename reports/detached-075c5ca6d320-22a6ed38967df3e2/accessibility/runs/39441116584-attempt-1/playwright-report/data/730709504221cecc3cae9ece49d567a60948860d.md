# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility-shell.spec.ts >> skip link moves focus to the main-content target for /home
- Location: e2e/accessibility/accessibility-shell.spec.ts:53:7

# Error details

```
Error: A11Y_VIOLATIONS

expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 31

- Array []
+ Array [
+   Object {
+     "engine": "axe",
+     "issueCount": 1,
+     "reviewCount": 1,
+     "reviewRules": Array [
+       "aria-prohibited-attr",
+     ],
+     "rules": Array [
+       "color-contrast",
+     ],
+     "status": "issues-found",
+   },
+   Object {
+     "engine": "wave-like",
+     "issueCount": 2,
+     "rules": Array [
+       "h1-count",
+       "table-headers",
+     ],
+     "status": "issues-found",
+   },
+   Object {
+     "engine": "screen-reader",
+     "issueCount": 1,
+     "rules": Array [
+       "table-headers",
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
  - main [active] [ref=e5]:
    - heading "ExUI Common Lib Test Page" [level=1] [ref=e6]
    - generic [ref=e8]:
      - img "hmcts-warning-icon" [ref=e9]
      - generic [ref=e11]:
        - text: Warning
        - heading "This is a test xuilib-service-message for the ExUI Common Lib Test Page. For demo purposes it can not be hidden." [level=2] [ref=e12]
        - text: Hide message
    - generic [ref=e13]: Test Document Content
    - generic [ref=e17]:
      - heading "HTML Test" [level=1] [ref=e18]
      - paragraph [ref=e19]: Document to test HTML content
    - heading "Contact details example" [level=2] [ref=e20]
    - generic [ref=e22]:
      - heading "Contact Details Component" [level=3] [ref=e23]
      - paragraph [ref=e24]: PRIVATE BETA
      - generic [ref=e25]:
        - text: "Email:"
        - link "test@justice.gov.uk" [ref=e26] [cursor=pointer]:
          - /url: mailto:test@justice.gov.uk
      - generic [ref=e27]: "Phone: 1111111"
      - generic [ref=e28]: "Opening times: bla bla bla"
    - list [ref=e29]:
      - listitem [ref=e30]: this
      - listitem [ref=e31]: is
      - listitem [ref=e32]: a
      - listitem [ref=e33]: test
    - heading "Tab items component:" [level=2] [ref=e34]
    - generic [ref=e36]:
      - tablist [ref=e39]:
        - generic [ref=e40]:
          - tab "Tab1" [selected] [ref=e41] [cursor=pointer]
          - tab "Tab2" [ref=e43] [cursor=pointer]
      - generic:
        - tabpanel "Tab1"
        - tabpanel "Tab2"
    - 'heading "Due date component: This task is due to be completed today" [level=2] [ref=e46]':
      - text: "Due date component:"
      - generic [ref=e47]: TODAY
    - table [ref=e48]:
      - row [ref=e49]:
        - cell "Due date" [ref=e50]
        - cell "Red threshold" [ref=e51]
        - cell "Orange threshold" [ref=e52]
      - row [ref=e53]:
        - cell [ref=e54]:
          - textbox "Due date" [ref=e55]: 10/20/2026
        - cell [ref=e56]:
          - spinbutton "Red threshold" [ref=e57]: "0"
        - cell [ref=e58]:
          - spinbutton "Orange threshold" [ref=e59]: "2"
    - heading "Checkbox list component:" [level=2] [ref=e60]
    - text: "List height:"
    - combobox "List height:" [ref=e61]:
      - option "Default (no limt)" [selected]
      - option "100px"
      - option "80px"
      - option "50px"
    - button "Add Wimbledon option" [ref=e62]
    - button "Add Golders Green option" [ref=e63]
    - button "Use borough for label" [ref=e64]
    - generic [ref=e66]:
      - generic [ref=e67]:
        - checkbox "Select all / Deselect all" [ref=e68] [cursor=pointer]
        - generic [ref=e69] [cursor=pointer]: Select all / Deselect all
      - generic [ref=e70]:
        - generic [ref=e71]:
          - checkbox "Baker Street" [ref=e72] [cursor=pointer]
          - generic [ref=e73] [cursor=pointer]: Baker Street
        - generic [ref=e74]:
          - checkbox "Clapham Junction" [ref=e75] [cursor=pointer]
          - generic [ref=e76] [cursor=pointer]: Clapham Junction
        - generic [ref=e77]:
          - checkbox "King's Cross" [ref=e78] [cursor=pointer]
          - generic [ref=e79] [cursor=pointer]: King's Cross
        - generic [ref=e80]:
          - checkbox "Shoreditch High Street" [ref=e81] [cursor=pointer]
          - generic [ref=e82] [cursor=pointer]: Shoreditch High Street
        - generic [ref=e83]:
          - checkbox "South Woodford" [ref=e84] [cursor=pointer]
          - generic [ref=e85] [cursor=pointer]: South Woodford
        - generic [ref=e86]:
          - checkbox "Twickenham" [checked] [ref=e87] [cursor=pointer]
          - generic [ref=e88] [cursor=pointer]: Twickenham
        - generic [ref=e89]:
          - checkbox "West Brompton" [ref=e90] [cursor=pointer]
          - generic [ref=e91] [cursor=pointer]: West Brompton
    - generic [ref=e92]: "Selection changed to: * Twickenham"
    - button "Start Spinner" [ref=e93]
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