# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: feature-states.spec.ts >> form controls — supplied errors and invalid date
- Location: e2e/accessibility/feature-states.spec.ts:93:5

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
+     "issueCount": 4,
+     "rules": Array [
+       "aria-reference-target",
+       "error-describedby",
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
      - generic [ref=e28]: Review notes
      - text: Add a synthetic review note.
      - generic [ref=e32]:
        - generic [ref=e33]: "Error:"
        - text: Enter review notes
      - textbox "Review notes" [ref=e34]
    - button "Use empty review hint" [ref=e35] [cursor=pointer]
    - button "Remove review hint" [ref=e36] [cursor=pointer]
    - generic [ref=e38]:
      - generic [ref=e39]: Supporting file
      - text: Choose a synthetic text file.
      - generic [ref=e43]:
        - generic [ref=e44]: "Error:"
        - text: Choose a supporting file
      - button "Supporting file" [ref=e45]
    - button "Toggle supplied errors" [ref=e46] [cursor=pointer]
    - group "Hearing date (optional)" [ref=e51]:
      - text: For example, 12 11 2007
      - generic [ref=e54]:
        - generic [ref=e55]: "Error:"
        - text: Enter a valid hearing date
      - generic [ref=e56]:
        - generic [ref=e58]:
          - generic [ref=e59]: Day
          - textbox "Day" [ref=e62]: "31"
        - generic [ref=e64]:
          - generic [ref=e65]: Month
          - textbox "Month" [active] [ref=e68]: "02"
        - generic [ref=e70]:
          - generic [ref=e71]: Year
          - textbox "Year" [ref=e74]: "2024"
    - heading "Parent form values" [level=2] [ref=e75]
    - generic [ref=e76]: "{ \"priority\": \"routine\", \"notes\": \"\", \"supportingFile\": \"\", \"untouched\": \"preserved\" }"
    - paragraph [ref=e77]:
      - text: "Date valid:"
      - status [ref=e78]: "false"
    - generic [ref=e79]: "{ \"hearing_day\": \"31\", \"hearing_month\": \"02\", \"hearing_year\": \"2024\" }"
```

# Test source

```ts
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
  62  |     const hintIds = await page.locator('xuilib-gov-uk-textarea .govuk-hint')
  63  |       .evaluateAll((hints) => hints.map((hint) => hint.id));
  64  |     expect(hintIds, ASSERTION_MARKER).toEqual(['case-notes-hint', 'review-notes-hint']);
  65  |     expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  66  |   });
  67  | }
  68  | 
  69  | for (const action of ['Use empty review hint', 'Remove review hint']) {
  70  |   for (const state of formDescriptionStates) {
  71  |     test(`textarea — ${action} ${state}`, async ({ page }, testInfo) => {
  72  |       await page.goto('/coverage/form-controls');
  73  |       await page.getByRole('button', { name: action, exact: true }).click();
  74  |       const controls = new FormControlsPage(page);
  75  |       if (state !== 'initial') {
  76  |         await controls.errors.click();
  77  |       }
  78  |       if (state === 'cleared') {
  79  |         await controls.errors.click();
  80  |       }
  81  |       const hasError = state === 'errors';
  82  |       const outcomes = await collectAccessibilityEvidence(page, testInfo, [{
  83  |         selector: '#review-notes',
  84  |         describedBy: hasError ? 'review-notes-error' : null,
  85  |         targets: hasError ? [{ id: 'review-notes-error', text: 'Error:Enter review notes' }] : [],
  86  |         absentIds: hasError ? [] : ['review-notes-error']
  87  |       }]);
  88  |       expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  89  |     });
  90  |   }
  91  | }
  92  | 
  93  | test('form controls — supplied errors and invalid date', async ({ page }, testInfo) => {
  94  |   await page.goto('/coverage/form-controls');
  95  |   const controls = new FormControlsPage(page);
  96  |   await controls.errors.click();
  97  |   await controls.fillDate('31', '02', '2024');
  98  |   await expect(page.locator('#priority-error')).toHaveText('Error:Choose a priority');
  99  |   await expect(page.locator('#case-notes-error')).toHaveText('Error:Enter case notes');
  100 |   await expect(controls.dateValid).toHaveText('false');
  101 |   await expect(page.locator('xuilib-gov-uk-date .govuk-error-message')).toHaveText('Error:Enter a valid hearing date');
  102 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
> 103 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
      |                                                                                  ^ Error: A11Y_VIOLATIONS
  104 | });
  105 | 
  106 | test('service selection — expanded suggestions', async ({ page }, testInfo) => {
  107 |   await page.goto('/coverage/service-selection');
  108 |   const services = new ServiceSelectionPage(page);
  109 |   await services.search.fill('Civil');
  110 |   await expect(services.options).toHaveText(['Civil damages', 'Civil enforcement']);
  111 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  112 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  113 | });
  114 | 
  115 | test('service selection — selected service', async ({ page }, testInfo) => {
  116 |   await page.goto('/coverage/service-selection');
  117 |   const services = new ServiceSelectionPage(page);
  118 |   await services.choose('Family');
  119 |   await services.add.click();
  120 |   await expect(services.selected).toHaveText(['Family']);
  121 |   await expect(services.search).toHaveValue('');
  122 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  123 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  124 | });
  125 | 
  126 | test('case sharing — initial assignments', async ({ page }, testInfo) => {
  127 |   await page.goto('/coverage/case-sharing');
  128 |   const sharing = new CaseSharingPage(page);
  129 |   await expect(sharing.case('DEMO-001').getByRole('row', { name: /Alex Taylor/ })).toBeVisible();
  130 |   await expect(page.getByRole('button', { name: 'Continue', exact: true })).toBeEnabled();
  131 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  132 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  133 | });
  134 | 
  135 | test('case sharing — no-change validation', async ({ page }, testInfo) => {
  136 |   await page.goto('/coverage/case-sharing');
  137 |   await page.getByRole('button', { name: 'Continue', exact: true }).click();
  138 |   await expect(page.getByRole('alert')).toContainText('You have not requested any changes to case sharing');
  139 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  140 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  141 | });
  142 | 
  143 | test('case sharing — pending addition', async ({ page }, testInfo) => {
  144 |   await page.goto('/coverage/case-sharing');
  145 |   const sharing = new CaseSharingPage(page);
  146 |   await sharing.addSam();
  147 |   await expect(sharing.case('DEMO-001').getByRole('row', { name: /Sam Morgan/ })).toContainText('To be added');
  148 |   await expect(sharing.case('DEMO-002').getByRole('row', { name: /Sam Morgan/ })).toContainText('To be added');
  149 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  150 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  151 | });
  152 | 
  153 | test('case sharing — confirmation', async ({ page }, testInfo) => {
  154 |   await page.goto('/coverage/case-sharing');
  155 |   const sharing = new CaseSharingPage(page);
  156 |   await sharing.addSam();
  157 |   await page.getByRole('button', { name: 'Continue', exact: true }).click();
  158 |   await expect(page).toHaveURL(/\/coverage\/case-sharing\/confirmation$/);
  159 |   await expect(sharing.confirmation('DEMO-001').getByRole('row', { name: /Sam Morgan/ })).toContainText('To be added');
  160 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  161 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  162 | });
  163 | 
  164 | test('address — initial lookup', async ({ page }, testInfo) => {
  165 |   await page.goto('/coverage/address');
  166 |   await expect(page.getByLabel('Enter a UK postcode')).toBeVisible();
  167 |   await expect(page.getByRole('button', { name: 'Find address', exact: true })).toBeEnabled();
  168 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  169 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  170 | });
  171 | 
  172 | test('address — invalid postcode', async ({ page }, testInfo) => {
  173 |   await page.goto('/coverage/address');
  174 |   await page.getByRole('button', { name: 'Find address', exact: true }).click();
  175 |   await expect(page.locator('#addressLookup')).toContainText('Enter a valid postcode');
  176 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  177 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  178 | });
  179 | 
  180 | test('address — lookup results', async ({ page }, testInfo) => {
  181 |   await page.goto('/coverage/address');
  182 |   await new AddressPage(page).lookup();
  183 |   await expect(page.locator('#addressList option')).toHaveText(['2 addresses found', '10 Demo Street, Testville', '12 Demo Street, Testville']);
  184 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  185 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  186 | });
  187 | 
  188 | test('address — selected address', async ({ page }, testInfo) => {
  189 |   await page.goto('/coverage/address');
  190 |   await new AddressPage(page).lookup();
  191 |   await page.getByLabel('Select an address', { exact: true }).selectOption({ label: '12 Demo Street, Testville' });
  192 |   await expect(page.getByLabel('Building and Street', { exact: true })).toHaveValue('12 Demo Street');
  193 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  194 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  195 | });
  196 | 
  197 | test('address — manual international entry', async ({ page }, testInfo) => {
  198 |   await page.goto('/coverage/address');
  199 |   await page.getByRole('link', { name: 'I can\'t enter a UK postcode', exact: true }).click();
  200 |   await page.getByRole('radio', { name: 'No', exact: true }).check();
  201 |   await expect(page.getByLabel('Country', { exact: true })).toBeVisible();
  202 |   await expect(page.getByLabel('Postcode (Optional)', { exact: true })).toBeVisible();
  203 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
```