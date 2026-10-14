# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: demo.spec.ts >> session — visible timeout dialog
- Location: e2e/accessibility/demo.spec.ts:125:5

# Error details

```
Error: A11Y_VIOLATIONS

expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 21

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
  - main:
    - dialog [ref=e7]:
      - generic [ref=e8]: We are about to sign you out
      - paragraph [ref=e14]: Your session will end soon.
```

# Test source

```ts
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
> 133 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
      |                                                                                  ^ Error: A11Y_VIOLATIONS
  134 | });
  135 | 
```