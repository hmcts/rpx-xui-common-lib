# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: lighthouse.spec.ts >> Lighthouse /home — representative stable page
- Location: e2e/accessibility/lighthouse.spec.ts:9:7

# Error details

```
Error: A11Y_VIOLATIONS

expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 1
```

# Page snapshot

```yaml
- main [ref=e4]:
  - heading "ExUI Common Lib Test Page" [level=1] [ref=e5]
  - generic [ref=e7]:
    - img "hmcts-warning-icon" [ref=e8]
    - generic [ref=e10]:
      - text: Warning
      - heading "This is a test xuilib-service-message for the ExUI Common Lib Test Page. For demo purposes it can not be hidden." [level=2] [ref=e11]
      - text: Hide message
  - generic [ref=e12]: Test Document Content
  - generic [ref=e16]:
    - heading "HTML Test" [level=1] [ref=e17]
    - paragraph [ref=e18]: Document to test HTML content
  - heading "Contact details example" [level=2] [ref=e19]
  - generic [ref=e21]:
    - heading "Contact Details Component" [level=3] [ref=e22]
    - paragraph [ref=e23]: PRIVATE BETA
    - generic [ref=e24]:
      - text: "Email:"
      - link "test@justice.gov.uk" [ref=e25] [cursor=pointer]:
        - /url: mailto:test@justice.gov.uk
    - generic [ref=e26]: "Phone: 1111111"
    - generic [ref=e27]: "Opening times: bla bla bla"
  - list [ref=e28]:
    - listitem [ref=e29]: this
    - listitem [ref=e30]: is
    - listitem [ref=e31]: a
    - listitem [ref=e32]: test
  - heading "Tab items component:" [level=2] [ref=e33]
  - generic [ref=e35]:
    - tablist [ref=e38]:
      - generic [ref=e39]:
        - tab "Tab1" [selected] [ref=e40] [cursor=pointer]
        - tab "Tab2" [ref=e42] [cursor=pointer]
    - generic:
      - tabpanel "Tab1"
      - tabpanel "Tab2"
  - 'heading "Due date component: This task is due to be completed today" [level=2] [ref=e45]':
    - text: "Due date component:"
    - generic [ref=e46]: TODAY
  - table [ref=e47]:
    - row [ref=e48]:
      - cell "Due date" [ref=e49]
      - cell "Red threshold" [ref=e50]
      - cell "Orange threshold" [ref=e51]
    - row [ref=e52]:
      - cell [ref=e53]:
        - textbox "Due date" [ref=e54]: 10/14/2026
      - cell [ref=e55]:
        - spinbutton "Red threshold" [ref=e56]: "0"
      - cell [ref=e57]:
        - spinbutton "Orange threshold" [ref=e58]: "2"
  - heading "Checkbox list component:" [level=2] [ref=e59]
  - text: "List height:"
  - combobox "List height:" [ref=e60]:
    - option "Default (no limt)" [selected]
    - option "100px"
    - option "80px"
    - option "50px"
  - button "Add Wimbledon option" [ref=e61]
  - button "Add Golders Green option" [ref=e62]
  - button "Use borough for label" [ref=e63]
  - generic [ref=e65]:
    - generic [ref=e66]:
      - checkbox "Select all / Deselect all" [ref=e67] [cursor=pointer]
      - generic [ref=e68] [cursor=pointer]: Select all / Deselect all
    - generic [ref=e69]:
      - generic [ref=e70]:
        - checkbox "Baker Street" [ref=e71] [cursor=pointer]
        - generic [ref=e72] [cursor=pointer]: Baker Street
      - generic [ref=e73]:
        - checkbox "Clapham Junction" [ref=e74] [cursor=pointer]
        - generic [ref=e75] [cursor=pointer]: Clapham Junction
      - generic [ref=e76]:
        - checkbox "King's Cross" [ref=e77] [cursor=pointer]
        - generic [ref=e78] [cursor=pointer]: King's Cross
      - generic [ref=e79]:
        - checkbox "Shoreditch High Street" [ref=e80] [cursor=pointer]
        - generic [ref=e81] [cursor=pointer]: Shoreditch High Street
      - generic [ref=e82]:
        - checkbox "South Woodford" [ref=e83] [cursor=pointer]
        - generic [ref=e84] [cursor=pointer]: South Woodford
      - generic [ref=e85]:
        - checkbox "Twickenham" [checked] [ref=e86] [cursor=pointer]
        - generic [ref=e87] [cursor=pointer]: Twickenham
      - generic [ref=e88]:
        - checkbox "West Brompton" [ref=e89] [cursor=pointer]
        - generic [ref=e90] [cursor=pointer]: West Brompton
  - generic [ref=e91]: "Selection changed to: * Twickenham"
  - button "Start Spinner" [ref=e92]
```

# Test source

```ts
  1  | import { expect } from '@playwright/test';
  2  | import { test } from './lighthouse.fixture';
  3  | import { collectLighthouseEvidence } from './lighthouseEvidence';
  4  | import { ASSERTION_MARKER } from './report.cjs';
  5  | import { AccessibilityDemoPage } from './demo.po';
  6  | 
  7  | test.setTimeout(90_000); // Lighthouse launches a separate CDP audit, bounded to 60 seconds.
  8  | for (const route of ['/home', '/coverage?feature=filter']) {
  9  |   test(`Lighthouse ${route} — representative stable page`, async ({ lighthousePage: page, lighthousePort, baseURL }, testInfo) => {
  10 |     await page.goto(new URL(route, baseURL).href);
  11 |     await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  12 |     if (route === '/home') {
  13 |       await expect(page.locator('xuilib-checkbox-list')).toBeVisible();
  14 |     } else {
  15 |       await expect(new AccessibilityDemoPage(page).applyFilter).toBeVisible();
  16 |     }
  17 |     const outcome = await collectLighthouseEvidence(page, lighthousePort, testInfo);
> 18 |     expect(outcome.issueCount, ASSERTION_MARKER).toBe(0);
     |                                                  ^ Error: A11Y_VIOLATIONS
  19 |   });
  20 | }
  21 | 
```