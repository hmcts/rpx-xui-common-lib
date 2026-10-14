# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: demo.spec.ts >> terms — awaiting confirmation
- Location: e2e/accessibility/demo.spec.ts:95:7

# Error details

```
Error: A11Y_VIOLATIONS

expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 19

- Array []
+ Array [
+   Object {
+     "engine": "wave-like",
+     "issueCount": 1,
+     "rules": Array [
+       "h1-count",
+     ],
+     "status": "issues-found",
+   },
+   Object {
+     "engine": "screen-reader",
+     "issueCount": 2,
+     "rules": Array [
+       "govuk-template-body",
+       "skip-link",
+     ],
+     "status": "issues-found",
+   },
+ ]
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - heading "CommonLib component coverage examples" [level=1] [ref=e5]
  - generic [ref=e7]:
    - main [ref=e10]:
      - generic [ref=e13]:
        - heading "Using this service" [level=1] [ref=e14]
        - heading "Terms and conditions" [level=2] [ref=e15]
        - paragraph [ref=e16]:
          - text: We've recently updated the
          - link "terms and conditions" [ref=e17] [cursor=pointer]:
            - /url: /terms-and-conditions
          - text: .
        - paragraph [ref=e18]: You must review and accept them.
        - paragraph [ref=e19]:
          - button "Accept terms" [ref=e20] [cursor=pointer]
    - status [ref=e21]: Terms not accepted
```

# Test source

```ts
  3   | import { test } from './demo.fixture';
  4   | import { collectAccessibilityEvidence } from './accessibilityAudit';
  5   | import { ASSERTION_MARKER } from './report.cjs';
  6   | 
  7   | test('home — initial components', async ({ page }, testInfo) => {
  8   |   await page.goto('/home');
  9   |   await expect(new AppPage(page).heading).toBeVisible();
  10  |   await expect(new AppPage(page).checkboxList).toBeVisible();
  11  |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  12  |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
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
> 103 |     expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
      |                                                                                    ^ Error: A11Y_VIOLATIONS
  104 |   });
  105 | }
  106 | 
  107 | test('feedback — success and warning banners', async ({ demo, page }, testInfo) => {
  108 |   await demo.open('feedback');
  109 |   await expect(page.getByText('The action was saved', { exact: true })).toBeVisible();
  110 |   await expect(page.getByText('Action needs attention', { exact: true })).toBeVisible();
  111 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  112 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  113 | });
  114 | 
  115 | test('feedback — validation summary', async ({ demo, page }, testInfo) => {
  116 |   await demo.open('feedback');
  117 |   await demo.showErrors.click();
  118 |   await expect(page.getByRole('alert')).toBeVisible();
  119 |   await expect(page.getByRole('alert')).toContainText('Enter an email address');
  120 |   await expect(page).toHaveTitle(/^Error:/);
  121 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  122 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  123 | });
  124 | 
  125 | test('session — visible timeout dialog', async ({ demo, page }, testInfo) => {
  126 |   await demo.open('dialog');
  127 |   const dialog = page.getByRole('dialog');
  128 |   await expect(dialog).toBeVisible();
  129 |   await expect(dialog).toHaveAttribute('aria-modal', 'true');
  130 |   await expect(dialog).toContainText('We are about to sign you out');
  131 |   await expect(dialog).toContainText('Your session will end soon.');
  132 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  133 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  134 | });
  135 | 
```