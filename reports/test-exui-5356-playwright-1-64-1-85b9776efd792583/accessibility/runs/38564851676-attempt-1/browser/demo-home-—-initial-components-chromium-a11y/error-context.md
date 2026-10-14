# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: demo.spec.ts >> home — initial components
- Location: e2e/accessibility/demo.spec.ts:7:5

# Error details

```
Error: A11Y_VIOLATIONS

expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 33

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
+     "issueCount": 3,
+     "rules": Array [
+       "govuk-template-body",
+       "skip-link",
+       "table-headers",
+     ],
+     "status": "issues-found",
+   },
+ ]
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
  1   | import { expect } from '@playwright/test';
  2   | import { AppPage } from '../src/app.po';
  3   | import { test } from './demo.fixture';
  4   | import { collectAccessibilityEvidence } from './accessibilityAudit';
  5   | import { ASSERTION_MARKER } from './report.cjs';
  6   | 
  7   | test('home — initial components', async ({ page }, testInfo) => {
  8   |   await page.goto('/home');
  9   |   await expect(new AppPage(page).heading).toBeVisible();
  10  |   await expect(new AppPage(page).checkboxList).toBeVisible();
  11  |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
> 12  |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
      |                                                                                  ^ Error: A11Y_VIOLATIONS
  13  | });
  14  | 
  15  | test('filter — initial controls', async ({ demo, page }, testInfo) => {
  16  |   await demo.open('filter');
  17  |   await expect(demo.heading).toBeVisible();
  18  |   await expect(demo.civil).toBeVisible();
  19  |   await expect(demo.applyFilter).toBeEnabled();
  20  |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  21  |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  22  | });
  23  | 
  24  | test('filter — required-service error', async ({ demo, page }, testInfo) => {
  25  |   await demo.open('filter');
  26  |   await demo.applyFilter.click();
  27  |   await expect(demo.serviceField).toBeVisible();
  28  |   await expect(demo.serviceField).toHaveClass(/form-group-error/);
  29  |   await expect(page.getByTestId('filter-result')).toHaveText('null');
  30  |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  31  |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  32  | });
  33  | 
  34  | test('filter — applied selection', async ({ demo, page }, testInfo) => {
  35  |   await demo.open('filter');
  36  |   await demo.civil.check();
  37  |   await demo.applyFilter.click();
  38  |   await expect(demo.civil).toBeChecked();
  39  |   await expect(page.getByTestId('filter-result')).toContainText('civil');
  40  |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  41  |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  42  | });
  43  | 
  44  | test('cookies — choice banner', async ({ demo, page }, testInfo) => {
  45  |   await demo.open('cookie');
  46  |   await expect(demo.cookieChoice('Accept')).toBeVisible();
  47  |   await expect(demo.cookieChoice('Reject')).toBeVisible();
  48  |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  49  |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  50  | });
  51  | 
  52  | for (const choice of ['Accept', 'Reject']) {
  53  |   test(`cookies — ${choice.toLowerCase()} persisted after reload`, async ({ demo, page, context }, testInfo) => {
  54  |     await demo.open('cookie');
  55  |     await demo.cookieChoice(choice).click();
  56  |     await page.reload();
  57  |     await expect(demo.heading).toBeVisible();
  58  |     await expect(demo.cookieChoice('Accept')).toHaveCount(0);
  59  |     expect((await context.cookies()).find((cookie) => cookie.name === 'commonlib-coverage-cookie')?.value)
  60  |       .toBe(choice === 'Accept' ? 'true' : 'false');
  61  |     const outcomes = await collectAccessibilityEvidence(page, testInfo);
  62  |     expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  63  |   });
  64  | }
  65  | 
  66  | test('navigation — active destinations', async ({ demo, page }, testInfo) => {
  67  |   await demo.open('navigation');
  68  |   const primary = page.getByRole('navigation', { name: 'Primary demo navigation' });
  69  |   await expect(primary).toBeVisible();
  70  |   await expect(primary.getByRole('link', { name: 'Coverage examples' })).toHaveAttribute('aria-current', 'true');
  71  |   await expect(page.getByRole('navigation', { name: 'Secondary demo navigation' })).toBeVisible();
  72  |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  73  |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  74  | });
  75  | 
  76  | test('users — suggestions expanded', async ({ demo, page }, testInfo) => {
  77  |   await demo.open('users');
  78  |   await demo.userInput.fill('Alex');
  79  |   await expect(demo.alexOption).toBeVisible();
  80  |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  81  |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  82  | });
  83  | 
  84  | test('users — selected user', async ({ demo, page }, testInfo) => {
  85  |   await demo.open('users');
  86  |   await demo.userInput.fill('Alex');
  87  |   await demo.alexOption.click();
  88  |   await expect(demo.selectedUser).toBeVisible();
  89  |   await expect(demo.selectedUser).toHaveText('alex@example.test');
  90  |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  91  |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  92  | });
  93  | 
  94  | for (const accepted of [false, true]) {
  95  |   test(`terms — ${accepted ? 'accepted' : 'awaiting confirmation'}`, async ({ demo, page }, testInfo) => {
  96  |     await demo.open('terms');
  97  |     await expect(demo.acceptTerms).toBeVisible();
  98  |     if (accepted) {
  99  |       await demo.acceptTerms.click();
  100 |     }
  101 |     await expect(demo.termsResult).toHaveText(accepted ? 'Terms accepted' : 'Terms not accepted');
  102 |     const outcomes = await collectAccessibilityEvidence(page, testInfo);
  103 |     expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  104 |   });
  105 | }
  106 | 
  107 | test('feedback — success and warning banners', async ({ demo, page }, testInfo) => {
  108 |   await demo.open('feedback');
  109 |   await expect(page.getByText('The action was saved', { exact: true })).toBeVisible();
  110 |   await expect(page.getByText('Action needs attention', { exact: true })).toBeVisible();
  111 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  112 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
```