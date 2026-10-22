# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility-shell.spec.ts >> skip link moves focus to the main-content target for /coverage/case-sharing
- Location: e2e/accessibility/accessibility-shell.spec.ts:54:7

# Error details

```
Error: A11Y_VIOLATIONS

expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 24

- Array []
+ Array [
+   Object {
+     "engine": "axe",
+     "issueCount": 1,
+     "reviewCount": 3,
+     "reviewRules": Array [
+       "aria-prohibited-attr",
+       "color-contrast",
+     ],
+     "rules": Array [
+       "heading-order",
+     ],
+     "status": "issues-found",
+   },
+   Object {
+     "engine": "wave-like",
+     "issueCount": 3,
+     "rules": Array [
+       "heading-order",
+       "duplicate-id",
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
    - generic [ref=e6]:
      - generic "Share synthetic cases" [ref=e7]:
        - heading "Share synthetic cases" [level=1] [ref=e8]
        - generic [ref=e9]:
          - generic [ref=e10]:
            - generic [ref=e11]: Add a person to all cases
            - text: Search by name or email address. You can share access with as many people as you need.
            - generic [ref=e12]:
              - combobox "Search by name or email address. You can share access with as many people as you need." [ref=e15]
              - button "Add user" [ref=e17] [cursor=pointer]:
                - text: Add
                - generic [ref=e18]: user
            - group [ref=e19]:
              - generic "Can't find an email address?" [ref=e20] [cursor=pointer]
          - generic [ref=e21]:
            - generic [ref=e22]: Remove a person from all cases
            - text: Select a person to remove them from all selected cases.
            - generic [ref=e23]:
              - combobox "Remove a person from all cases" [ref=e25]:
                - option "Select a person" [selected]
                - option "Alex Taylor - alex@example.test"
              - button "Remove user" [ref=e27] [cursor=pointer]:
                - text: Remove
                - generic [ref=e28]: user
        - generic [ref=e29]:
          - heading "Selected cases" [level=3] [ref=e30]
          - generic [ref=e32]:
            - generic [ref=e34]:
              - generic [ref=e35]:
                - generic [ref=e36]:
                  - heading "Synthetic case Alpha" [level=3] [ref=e37]
                  - heading "DEMO-001" [level=3] [ref=e38]
                - button "Deselect case" [ref=e40] [cursor=pointer]
                - button "Expand or Collapse" [ref=e43]
              - generic "Expand or Collapse" [ref=e44]:
                - generic [ref=e45]: Users from your organisation with access to this case.
                - table [ref=e46]:
                  - rowgroup [ref=e47]:
                    - row [ref=e48]:
                      - columnheader "Name" [ref=e49]
                      - columnheader "Email address" [ref=e50]
                      - columnheader "Actions" [ref=e51]
                      - columnheader "Status" [ref=e52]
                  - rowgroup [ref=e53]:
                    - row [ref=e54]:
                      - cell "Alex Taylor" [ref=e55]
                      - cell "alex@example.test" [ref=e56]
                      - cell [ref=e57]:
                        - link "Remove Alex Taylor from case" [ref=e58] [cursor=pointer]:
                          - /url: "#"
                          - text: Remove
                          - generic [ref=e59]: Alex Taylor from case
                      - cell [ref=e60]
            - generic [ref=e62]:
              - generic [ref=e63]:
                - generic [ref=e64]:
                  - heading "Synthetic case Beta" [level=3] [ref=e65]
                  - heading "DEMO-002" [level=3] [ref=e66]
                - button "Deselect case" [ref=e68] [cursor=pointer]
                - button "Expand or Collapse" [ref=e71]
              - generic "Expand or Collapse" [ref=e72]:
                - generic [ref=e73]: Users from your organisation with access to this case.
                - table [ref=e74]:
                  - rowgroup [ref=e75]:
                    - row [ref=e76]:
                      - columnheader "Name" [ref=e77]
                      - columnheader "Email address" [ref=e78]
                      - columnheader "Actions" [ref=e79]
                      - columnheader "Status" [ref=e80]
                  - rowgroup [ref=e81]:
                    - row [ref=e82]:
                      - cell "Alex Taylor" [ref=e83]
                      - cell "alex@example.test" [ref=e84]
                      - cell [ref=e85]:
                        - link "Remove Alex Taylor from case" [ref=e86] [cursor=pointer]:
                          - /url: "#"
                          - text: Remove
                          - generic [ref=e87]: Alex Taylor from case
                      - cell [ref=e88]
        - generic [ref=e89]:
          - button "Continue" [ref=e90] [cursor=pointer]
          - button "Cancel" [ref=e91] [cursor=pointer]
      - heading "Demo event outputs" [level=2] [ref=e92]
      - generic [ref=e93]: "[]"
      - generic [ref=e94]: "[]"
      - generic [ref=e95]: "[ { \"caseId\": \"DEMO-001\", \"caseTitle\": \"Synthetic case Alpha\", \"sharedWith\": [ { \"idamId\": \"demo-alex\", \"firstName\": \"Alex\", \"lastName\": \"Taylor\", \"email\": \"alex@example.test\" } ], \"pendingShares\": [], \"pendingUnshares\": [] }, { \"caseId\": \"DEMO-002\", \"caseTitle\": \"Synthetic case Beta\", \"sharedWith\": [ { \"idamId\": \"demo-alex\", \"firstName\": \"Alex\", \"lastName\": \"Taylor\", \"email\": \"alex@example.test\" } ], \"pendingShares\": [], \"pendingUnshares\": [] } ]"
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
  48 |   { path: '/coverage/remaining', marker: heading('Remaining CommonLib coverage') },
  49 |   { path: '/coverage/users', marker: heading('User management demo') },
  50 |   { path: '/coverage/users/user-1', marker: heading('User management demo') }
  51 | ];
  52 | 
  53 | for (const route of routes) {
  54 |   test(`skip link moves focus to the main-content target for ${route.path}`, async ({ page }, testInfo) => {
  55 |     await page.goto(route.path);
  56 |     const actualRoute = new URL(page.url()).pathname + new URL(page.url()).search;
  57 |     expect(actualRoute).toBe(route.path);
  58 | 
  59 |     const skipLink = page.getByRole('link', { name: 'Skip to main content', exact: true });
  60 |     const mainContent = page.locator('#main-content');
  61 |     const marker = page.locator(route.marker.selector);
  62 |     await expect(skipLink).toBeVisible();
  63 |     if (route.marker.text) {
  64 |       const matchingMarker = marker.filter({ hasText: route.marker.text });
  65 |       await expect(matchingMarker).toHaveCount(1);
  66 |     }
  67 |     else {
  68 |       await expect(marker).toHaveCount(1);
  69 |     }
  70 |     await expect(mainContent).toHaveCount(1);
  71 |     await expect(mainContent).toHaveAttribute('tabindex', '-1');
  72 |     expect(await mainContent.evaluate((element) =>
  73 |       element.matches('main, [role="main"]') || Boolean(element.querySelector('main, [role="main"]'))
  74 |     )).toBe(true);
  75 | 
  76 |     await page.keyboard.press('Tab');
  77 |     await expect(skipLink).toBeFocused();
  78 |     await page.keyboard.press('Enter');
  79 |     await expect(mainContent).toBeFocused();
  80 | 
  81 |     const outcomes = await collectAccessibilityEvidence(page, testInfo);
> 82 |     expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
     |                                                                                    ^ Error: A11Y_VIOLATIONS
  83 |   });
  84 | }
  85 | 
```