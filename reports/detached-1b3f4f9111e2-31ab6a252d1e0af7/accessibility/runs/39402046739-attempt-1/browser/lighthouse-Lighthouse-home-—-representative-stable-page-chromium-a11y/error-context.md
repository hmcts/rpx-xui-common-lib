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
- generic [active] [ref=e1]:
  - link "Skip to main content" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - main [ref=e5]:
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