# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: feature-states.spec.ts >> invitation — parent validation errors
- Location: e2e/accessibility/feature-states.spec.ts:22:5

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
+       "govuk-template-body",
+       "skip-link",
+     ],
+     "status": "issues-found",
+   },
+ ]
```

# Page snapshot

```yaml
- main [ref=e4]:
  - heading "Invitation form demo" [level=1] [ref=e5]
  - paragraph [ref=e6]: Synthetic data only. Validation is supplied by the demo parent; no invitation is sent.
  - generic [ref=e8]:
    - generic [ref=e10]:
      - generic [ref=e11]: First name
      - text: Include all middle names.
      - generic [ref=e15]:
        - generic [ref=e16]: "Error:"
        - text: Enter a first name
      - textbox "First name" [invalid] [ref=e17]
    - generic [ref=e19]:
      - generic [ref=e20]: Last name
      - generic [ref=e24]:
        - generic [ref=e25]: "Error:"
        - text: Enter a last name
      - textbox "Last name" [invalid] [ref=e26]
    - generic [ref=e28]:
      - generic [ref=e29]: Email address
      - generic [ref=e33]:
        - generic [ref=e34]: "Error:"
        - text: Enter a valid email address
      - textbox "Email address" [invalid] [ref=e35]
    - group "Permissions" [ref=e40]:
      - text: Choose what the user will be able to do. You can change this later.
      - generic [ref=e42]:
        - generic [ref=e44]:
          - checkbox "Manage Cases" [ref=e45] [cursor=pointer]
          - generic [ref=e46] [cursor=pointer]: Manage Cases
          - generic [ref=e48]: View, create and progress cases.
        - generic [ref=e50]:
          - checkbox "Manage Users" [ref=e51] [cursor=pointer]
          - generic [ref=e52] [cursor=pointer]: Manage Users
          - generic [ref=e54]: Invite users.
        - generic [ref=e56]:
          - checkbox "Manage Organisation" [ref=e57] [cursor=pointer]
          - generic [ref=e58] [cursor=pointer]: Manage Organisation
          - generic [ref=e60]: View organisation name and addresses.
    - button "Send invitation" [active] [ref=e61] [cursor=pointer]
  - heading "Parent form and emitted events" [level=2] [ref=e62]
  - paragraph [ref=e63]:
    - text: "Form valid:"
    - status [ref=e64]: "false"
  - paragraph [ref=e65]:
    - text: "Submit events:"
    - status [ref=e66]: "1"
  - generic [ref=e67]: "{ \"firstName\": \"\", \"lastName\": \"\", \"email\": \"\", \"roles\": { \"pui-case-manager\": false, \"pui-user-manager\": false, \"pui-organisation-manager\": false } }"
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
  9   | import { collectAccessibilityEvidence } from './accessibilityAudit';
  10  | import { ASSERTION_MARKER } from './report.cjs';
  11  | import { formDescriptions, formDescriptionStates } from './form-description.data';
  12  | 
  13  | test('invitation — initial form', async ({ page }, testInfo) => {
  14  |   await page.goto('/coverage/invitation');
  15  |   const invitation = new InvitationPage(page);
  16  |   await expect(invitation.firstName).toBeVisible();
  17  |   await expect(invitation.submit).toBeEnabled();
  18  |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  19  |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  20  | });
  21  | 
  22  | test('invitation — parent validation errors', async ({ page }, testInfo) => {
  23  |   await page.goto('/coverage/invitation');
  24  |   await new InvitationPage(page).submit.click();
  25  |   await expect(page.locator('#firstName-error')).toHaveText('Error:Enter a first name');
  26  |   await expect(page.locator('#email-error')).toHaveText('Error:Enter a valid email address');
  27  |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
> 28  |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
      |                                                                                  ^ Error: A11Y_VIOLATIONS
  29  | });
  30  | 
  31  | test('invitation — submitted details and permissions', async ({ page }, testInfo) => {
  32  |   await page.goto('/coverage/invitation');
  33  |   const invitation = new InvitationPage(page);
  34  |   await invitation.fillDetails();
  35  |   await invitation.cases.check();
  36  |   await invitation.submit.click();
  37  |   await expect(invitation.submissions).toHaveText('1');
  38  |   await expect(invitation.valid).toHaveText('true');
  39  |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  40  |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  41  | });
  42  | 
  43  | for (const state of formDescriptionStates) {
  44  |   test(`form controls — descriptions ${state}`, async ({ page }, testInfo) => {
  45  |     await page.goto('/coverage/form-controls');
  46  |     const controls = new FormControlsPage(page);
  47  |     await expect(controls.priority).toBeVisible();
  48  |     await expect(controls.file).toBeVisible();
  49  |     await expect(controls.day).toBeVisible();
  50  |     if (state !== 'initial') {
  51  |       await controls.errors.click();
  52  |       await expect(page.locator('#case-notes-error')).toBeVisible();
  53  |     }
  54  |     if (state === 'cleared') {
  55  |       await controls.errors.click();
  56  |       await expect(page.locator('#case-notes-error')).toHaveCount(0);
  57  |     }
  58  |     const outcomes = await collectAccessibilityEvidence(page, testInfo, formDescriptions(state));
  59  |     expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  60  |   });
  61  | }
  62  | 
  63  | test('form controls — supplied errors and invalid date', async ({ page }, testInfo) => {
  64  |   await page.goto('/coverage/form-controls');
  65  |   const controls = new FormControlsPage(page);
  66  |   await controls.errors.click();
  67  |   await controls.fillDate('31', '02', '2024');
  68  |   await expect(page.locator('#priority-error')).toHaveText('Error:Choose a priority');
  69  |   await expect(page.locator('#case-notes-error')).toHaveText('Error:Enter case notes');
  70  |   await expect(controls.dateValid).toHaveText('false');
  71  |   await expect(page.locator('xuilib-gov-uk-date .govuk-error-message')).toHaveText('Error:Enter a valid hearing date');
  72  |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  73  |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  74  | });
  75  | 
  76  | test('service selection — expanded suggestions', async ({ page }, testInfo) => {
  77  |   await page.goto('/coverage/service-selection');
  78  |   const services = new ServiceSelectionPage(page);
  79  |   await services.search.fill('Civil');
  80  |   await expect(services.options).toHaveText(['Civil damages', 'Civil enforcement']);
  81  |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  82  |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  83  | });
  84  | 
  85  | test('service selection — selected service', async ({ page }, testInfo) => {
  86  |   await page.goto('/coverage/service-selection');
  87  |   const services = new ServiceSelectionPage(page);
  88  |   await services.choose('Family');
  89  |   await services.add.click();
  90  |   await expect(services.selected).toHaveText(['Family']);
  91  |   await expect(services.search).toHaveValue('');
  92  |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  93  |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  94  | });
  95  | 
  96  | test('case sharing — initial assignments', async ({ page }, testInfo) => {
  97  |   await page.goto('/coverage/case-sharing');
  98  |   const sharing = new CaseSharingPage(page);
  99  |   await expect(sharing.case('DEMO-001').getByRole('row', { name: /Alex Taylor/ })).toBeVisible();
  100 |   await expect(page.getByRole('button', { name: 'Continue', exact: true })).toBeEnabled();
  101 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  102 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  103 | });
  104 | 
  105 | test('case sharing — no-change validation', async ({ page }, testInfo) => {
  106 |   await page.goto('/coverage/case-sharing');
  107 |   await page.getByRole('button', { name: 'Continue', exact: true }).click();
  108 |   await expect(page.getByRole('alert')).toContainText('You have not requested any changes to case sharing');
  109 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  110 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  111 | });
  112 | 
  113 | test('case sharing — pending addition', async ({ page }, testInfo) => {
  114 |   await page.goto('/coverage/case-sharing');
  115 |   const sharing = new CaseSharingPage(page);
  116 |   await sharing.addSam();
  117 |   await expect(sharing.case('DEMO-001').getByRole('row', { name: /Sam Morgan/ })).toContainText('To be added');
  118 |   await expect(sharing.case('DEMO-002').getByRole('row', { name: /Sam Morgan/ })).toContainText('To be added');
  119 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  120 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  121 | });
  122 | 
  123 | test('case sharing — confirmation', async ({ page }, testInfo) => {
  124 |   await page.goto('/coverage/case-sharing');
  125 |   const sharing = new CaseSharingPage(page);
  126 |   await sharing.addSam();
  127 |   await page.getByRole('button', { name: 'Continue', exact: true }).click();
  128 |   await expect(page).toHaveURL(/\/coverage\/case-sharing\/confirmation$/);
```