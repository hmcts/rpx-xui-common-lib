# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: feature-states.spec.ts >> form controls — descriptions errors
- Location: e2e/accessibility/feature-states.spec.ts:47:7

# Error details

```
Error: A11Y_VIOLATIONS

expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 11

- Array []
+ Array [
+   Object {
+     "engine": "screen-reader",
+     "issueCount": 2,
+     "rules": Array [
+       "aria-reference-target",
+       "component-description",
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
  - main [ref=e5]:
    - heading "Form controls demo" [level=1] [ref=e6]
    - paragraph [ref=e7]: Error messages are supplied by the demo parent. Date validity uses the library's own validator.
    - generic [ref=e9]:
      - generic [ref=e10]: Priority
      - text: Choose how soon to review.
      - generic [ref=e14]:
        - generic [ref=e15]: "Error:"
        - text: Choose a priority
      - combobox "Priority" [ref=e16]:
        - option "Routine" [selected]
        - option "Urgent"
    - generic [ref=e18]:
      - generic [ref=e19]: Case notes
      - text: Include only synthetic notes.
      - generic [ref=e23]:
        - generic [ref=e24]: "Error:"
        - text: Enter case notes
      - textbox "Case notes" [ref=e25]
    - generic [ref=e27]:
      - generic [ref=e28]: Supporting file
      - text: Choose a synthetic text file.
      - generic [ref=e32]:
        - generic [ref=e33]: "Error:"
        - text: Choose a supporting file
      - button "Supporting file" [ref=e34]
    - button "Toggle supplied errors" [active] [ref=e35] [cursor=pointer]
    - group "Hearing date (optional)" [ref=e40]:
      - text: For example, 12 11 2007
      - generic [ref=e42]:
        - generic [ref=e44]:
          - generic [ref=e45]: Day
          - textbox "Day" [ref=e48]
        - generic [ref=e50]:
          - generic [ref=e51]: Month
          - textbox "Month" [ref=e54]
        - generic [ref=e56]:
          - generic [ref=e57]: Year
          - textbox "Year" [ref=e60]
    - heading "Parent form values" [level=2] [ref=e61]
    - generic [ref=e62]: "{ \"priority\": \"routine\", \"notes\": \"\", \"supportingFile\": \"\", \"untouched\": \"preserved\" }"
    - paragraph [ref=e63]:
      - text: "Date valid:"
      - status [ref=e64]: "true"
    - generic [ref=e65]: "{ \"hearing_day\": \"\", \"hearing_month\": \"\", \"hearing_year\": \"\" }"
```

# Test source

```ts
  1   | import { expect } from '@playwright/test';
  2   | import { test } from '../src/browser-diagnostics.fixture';
  3   | import { InvitationPage } from '../src/invitation.po';
  4   | import { FormControlsPage } from '../src/form-controls.po';
  5   | import { ServiceSelectionPage } from '../src/service-selection.po';
  6   | import { CaseSharingPage } from '../src/case-sharing.po';
  7   | import { AddressPage } from '../src/address.po';
  8   | import { UserManagementPage } from '../src/user-management.po';
  9   | import { AdvancedFilterPage } from '../src/advanced-filter.po';
  10  | import { LifecyclePage } from '../src/lifecycle.po';
  11  | import { SearchPage } from '../src/search.po';
  12  | import { collectAccessibilityEvidence } from './accessibilityAudit';
  13  | import { ASSERTION_MARKER } from './report.cjs';
  14  | import { formDescriptions, formDescriptionStates } from './form-description.data';
  15  | 
  16  | test('invitation — initial form', async ({ page }, testInfo) => {
  17  |   await page.goto('/coverage/invitation');
  18  |   const invitation = new InvitationPage(page);
  19  |   await expect(invitation.firstName).toBeVisible();
  20  |   await expect(invitation.submit).toBeEnabled();
  21  |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  22  |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  23  | });
  24  | 
  25  | test('invitation — parent validation errors', async ({ page }, testInfo) => {
  26  |   await page.goto('/coverage/invitation');
  27  |   await new InvitationPage(page).submit.click();
  28  |   await expect(page.locator('#firstName-error')).toHaveText('Error:Enter a first name');
  29  |   await expect(page.locator('#email-error')).toHaveText('Error:Enter a valid email address');
  30  |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  31  |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  32  | });
  33  | 
  34  | test('invitation — submitted details and permissions', async ({ page }, testInfo) => {
  35  |   await page.goto('/coverage/invitation');
  36  |   const invitation = new InvitationPage(page);
  37  |   await invitation.fillDetails();
  38  |   await invitation.cases.check();
  39  |   await invitation.submit.click();
  40  |   await expect(invitation.submissions).toHaveText('1');
  41  |   await expect(invitation.valid).toHaveText('true');
  42  |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  43  |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  44  | });
  45  | 
  46  | for (const state of formDescriptionStates) {
  47  |   test(`form controls — descriptions ${state}`, async ({ page }, testInfo) => {
  48  |     await page.goto('/coverage/form-controls');
  49  |     const controls = new FormControlsPage(page);
  50  |     await expect(controls.priority).toBeVisible();
  51  |     await expect(controls.file).toBeVisible();
  52  |     await expect(controls.day).toBeVisible();
  53  |     if (state !== 'initial') {
  54  |       await controls.errors.click();
  55  |       await expect(page.locator('#case-notes-error')).toBeVisible();
  56  |     }
  57  |     if (state === 'cleared') {
  58  |       await controls.errors.click();
  59  |       await expect(page.locator('#case-notes-error')).toHaveCount(0);
  60  |     }
  61  |     const outcomes = await collectAccessibilityEvidence(page, testInfo, formDescriptions(state));
> 62  |     expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
      |                                                                                    ^ Error: A11Y_VIOLATIONS
  63  |   });
  64  | }
  65  | 
  66  | test('form controls — supplied errors and invalid date', async ({ page }, testInfo) => {
  67  |   await page.goto('/coverage/form-controls');
  68  |   const controls = new FormControlsPage(page);
  69  |   await controls.errors.click();
  70  |   await controls.fillDate('31', '02', '2024');
  71  |   await expect(page.locator('#priority-error')).toHaveText('Error:Choose a priority');
  72  |   await expect(page.locator('#case-notes-error')).toHaveText('Error:Enter case notes');
  73  |   await expect(controls.dateValid).toHaveText('false');
  74  |   await expect(page.locator('xuilib-gov-uk-date .govuk-error-message')).toHaveText('Error:Enter a valid hearing date');
  75  |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  76  |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  77  | });
  78  | 
  79  | test('service selection — expanded suggestions', async ({ page }, testInfo) => {
  80  |   await page.goto('/coverage/service-selection');
  81  |   const services = new ServiceSelectionPage(page);
  82  |   await services.search.fill('Civil');
  83  |   await expect(services.options).toHaveText(['Civil damages', 'Civil enforcement']);
  84  |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  85  |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  86  | });
  87  | 
  88  | test('service selection — selected service', async ({ page }, testInfo) => {
  89  |   await page.goto('/coverage/service-selection');
  90  |   const services = new ServiceSelectionPage(page);
  91  |   await services.choose('Family');
  92  |   await services.add.click();
  93  |   await expect(services.selected).toHaveText(['Family']);
  94  |   await expect(services.search).toHaveValue('');
  95  |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  96  |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  97  | });
  98  | 
  99  | test('case sharing — initial assignments', async ({ page }, testInfo) => {
  100 |   await page.goto('/coverage/case-sharing');
  101 |   const sharing = new CaseSharingPage(page);
  102 |   await expect(sharing.case('DEMO-001').getByRole('row', { name: /Alex Taylor/ })).toBeVisible();
  103 |   await expect(page.getByRole('button', { name: 'Continue', exact: true })).toBeEnabled();
  104 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  105 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  106 | });
  107 | 
  108 | test('case sharing — no-change validation', async ({ page }, testInfo) => {
  109 |   await page.goto('/coverage/case-sharing');
  110 |   await page.getByRole('button', { name: 'Continue', exact: true }).click();
  111 |   await expect(page.getByRole('alert')).toContainText('You have not requested any changes to case sharing');
  112 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  113 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  114 | });
  115 | 
  116 | test('case sharing — pending addition', async ({ page }, testInfo) => {
  117 |   await page.goto('/coverage/case-sharing');
  118 |   const sharing = new CaseSharingPage(page);
  119 |   await sharing.addSam();
  120 |   await expect(sharing.case('DEMO-001').getByRole('row', { name: /Sam Morgan/ })).toContainText('To be added');
  121 |   await expect(sharing.case('DEMO-002').getByRole('row', { name: /Sam Morgan/ })).toContainText('To be added');
  122 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  123 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  124 | });
  125 | 
  126 | test('case sharing — confirmation', async ({ page }, testInfo) => {
  127 |   await page.goto('/coverage/case-sharing');
  128 |   const sharing = new CaseSharingPage(page);
  129 |   await sharing.addSam();
  130 |   await page.getByRole('button', { name: 'Continue', exact: true }).click();
  131 |   await expect(page).toHaveURL(/\/coverage\/case-sharing\/confirmation$/);
  132 |   await expect(sharing.confirmation('DEMO-001').getByRole('row', { name: /Sam Morgan/ })).toContainText('To be added');
  133 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  134 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  135 | });
  136 | 
  137 | test('address — initial lookup', async ({ page }, testInfo) => {
  138 |   await page.goto('/coverage/address');
  139 |   await expect(page.getByLabel('Enter a UK postcode')).toBeVisible();
  140 |   await expect(page.getByRole('button', { name: 'Find address', exact: true })).toBeEnabled();
  141 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  142 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  143 | });
  144 | 
  145 | test('address — invalid postcode', async ({ page }, testInfo) => {
  146 |   await page.goto('/coverage/address');
  147 |   await page.getByRole('button', { name: 'Find address', exact: true }).click();
  148 |   await expect(page.locator('#addressLookup')).toContainText('Enter a valid postcode');
  149 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  150 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  151 | });
  152 | 
  153 | test('address — lookup results', async ({ page }, testInfo) => {
  154 |   await page.goto('/coverage/address');
  155 |   await new AddressPage(page).lookup();
  156 |   await expect(page.locator('#addressList option')).toHaveText(['2 addresses found', '10 Demo Street, Testville', '12 Demo Street, Testville']);
  157 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  158 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  159 | });
  160 | 
  161 | test('address — selected address', async ({ page }, testInfo) => {
  162 |   await page.goto('/coverage/address');
```