# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: feature-states.spec.ts >> case sharing — initial assignments
- Location: e2e/accessibility/feature-states.spec.ts:96:5

# Error details

```
Error: A11Y_VIOLATIONS

expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 32

- Array []
+ Array [
+   Object {
+     "engine": "axe",
+     "issueCount": 1,
+     "reviewCount": 2,
+     "reviewRules": Array [
+       "aria-prohibited-attr",
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
  - generic [ref=e5]:
    - generic "Share synthetic cases" [ref=e6]:
      - heading "Share synthetic cases" [level=1] [ref=e7]
      - generic [ref=e8]:
        - generic [ref=e9]:
          - generic [ref=e10]: Add a person to all cases
          - text: Search by name or email address. You can share access with as many people as you need.
          - generic [ref=e11]:
            - combobox "Search by name or email address. You can share access with as many people as you need." [ref=e14]
            - button "Add user" [ref=e16] [cursor=pointer]:
              - text: Add
              - generic [ref=e17]: user
          - group [ref=e18]:
            - generic "Can't find an email address?" [ref=e19] [cursor=pointer]
        - generic [ref=e20]:
          - generic [ref=e21]: Remove a person from all cases
          - text: Select a person to remove them from all selected cases.
          - generic [ref=e22]:
            - combobox "Remove a person from all cases" [ref=e24]:
              - option "Select a person" [selected]
              - option "Alex Taylor - alex@example.test"
            - button "Remove user" [ref=e26] [cursor=pointer]:
              - text: Remove
              - generic [ref=e27]: user
      - generic [ref=e28]:
        - heading "Selected cases" [level=3] [ref=e29]
        - generic [ref=e31]:
          - generic [ref=e33]:
            - generic [ref=e34]:
              - generic [ref=e35]:
                - heading "Synthetic case Alpha" [level=3] [ref=e36]
                - heading "DEMO-001" [level=3] [ref=e37]
              - button "Deselect case" [ref=e39] [cursor=pointer]
              - button "Expand or Collapse" [ref=e42]
            - generic "Expand or Collapse" [ref=e43]:
              - generic [ref=e44]: Users from your organisation with access to this case.
              - table [ref=e45]:
                - rowgroup [ref=e46]:
                  - row [ref=e47]:
                    - columnheader "Name" [ref=e48]
                    - columnheader "Email address" [ref=e49]
                    - columnheader "Actions" [ref=e50]
                    - columnheader "Status" [ref=e51]
                - rowgroup [ref=e52]:
                  - row [ref=e53]:
                    - cell "Alex Taylor" [ref=e54]
                    - cell "alex@example.test" [ref=e55]
                    - cell [ref=e56]:
                      - link "Remove Alex Taylor from case" [ref=e57] [cursor=pointer]:
                        - /url: "#"
                        - text: Remove
                        - generic [ref=e58]: Alex Taylor from case
                    - cell [ref=e59]
          - generic [ref=e61]:
            - generic [ref=e62]:
              - generic [ref=e63]:
                - heading "Synthetic case Beta" [level=3] [ref=e64]
                - heading "DEMO-002" [level=3] [ref=e65]
              - button "Deselect case" [ref=e67] [cursor=pointer]
              - button "Expand or Collapse" [ref=e70]
            - generic "Expand or Collapse" [ref=e71]:
              - generic [ref=e72]: Users from your organisation with access to this case.
              - table [ref=e73]:
                - rowgroup [ref=e74]:
                  - row [ref=e75]:
                    - columnheader "Name" [ref=e76]
                    - columnheader "Email address" [ref=e77]
                    - columnheader "Actions" [ref=e78]
                    - columnheader "Status" [ref=e79]
                - rowgroup [ref=e80]:
                  - row [ref=e81]:
                    - cell "Alex Taylor" [ref=e82]
                    - cell "alex@example.test" [ref=e83]
                    - cell [ref=e84]:
                      - link "Remove Alex Taylor from case" [ref=e85] [cursor=pointer]:
                        - /url: "#"
                        - text: Remove
                        - generic [ref=e86]: Alex Taylor from case
                    - cell [ref=e87]
      - generic [ref=e88]:
        - button "Continue" [ref=e89] [cursor=pointer]
        - button "Cancel" [ref=e90] [cursor=pointer]
    - heading "Demo event outputs" [level=2] [ref=e91]
    - generic [ref=e92]: "[]"
    - generic [ref=e93]: "[]"
    - generic [ref=e94]: "[ { \"caseId\": \"DEMO-001\", \"caseTitle\": \"Synthetic case Alpha\", \"sharedWith\": [ { \"idamId\": \"demo-alex\", \"firstName\": \"Alex\", \"lastName\": \"Taylor\", \"email\": \"alex@example.test\" } ], \"pendingShares\": [], \"pendingUnshares\": [] }, { \"caseId\": \"DEMO-002\", \"caseTitle\": \"Synthetic case Beta\", \"sharedWith\": [ { \"idamId\": \"demo-alex\", \"firstName\": \"Alex\", \"lastName\": \"Taylor\", \"email\": \"alex@example.test\" } ], \"pendingShares\": [], \"pendingUnshares\": [] } ]"
```

# Test source

```ts
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
  28  |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
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
> 102 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
      |                                                                                  ^ Error: A11Y_VIOLATIONS
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
  129 |   await expect(sharing.confirmation('DEMO-001').getByRole('row', { name: /Sam Morgan/ })).toContainText('To be added');
  130 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  131 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  132 | });
  133 | 
  134 | test('address — initial lookup', async ({ page }, testInfo) => {
  135 |   await page.goto('/coverage/address');
  136 |   await expect(page.getByLabel('Enter a UK postcode')).toBeVisible();
  137 |   await expect(page.getByRole('button', { name: 'Find address', exact: true })).toBeEnabled();
  138 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  139 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  140 | });
  141 | 
  142 | test('address — invalid postcode', async ({ page }, testInfo) => {
  143 |   await page.goto('/coverage/address');
  144 |   await page.getByRole('button', { name: 'Find address', exact: true }).click();
  145 |   await expect(page.locator('#addressLookup')).toContainText('Enter a valid postcode');
  146 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  147 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  148 | });
  149 | 
  150 | test('address — lookup results', async ({ page }, testInfo) => {
  151 |   await page.goto('/coverage/address');
  152 |   await new AddressPage(page).lookup();
  153 |   await expect(page.locator('#addressList option')).toHaveText(['2 addresses found', '10 Demo Street, Testville', '12 Demo Street, Testville']);
  154 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  155 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  156 | });
  157 | 
  158 | test('address — selected address', async ({ page }, testInfo) => {
  159 |   await page.goto('/coverage/address');
  160 |   await new AddressPage(page).lookup();
  161 |   await page.getByLabel('Select an address', { exact: true }).selectOption({ label: '12 Demo Street, Testville' });
  162 |   await expect(page.getByLabel('Building and Street', { exact: true })).toHaveValue('12 Demo Street');
  163 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  164 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  165 | });
  166 | 
  167 | test('address — manual international entry', async ({ page }, testInfo) => {
  168 |   await page.goto('/coverage/address');
  169 |   await page.getByRole('link', { name: 'I can\'t enter a UK postcode', exact: true }).click();
  170 |   await page.getByRole('radio', { name: 'No', exact: true }).check();
  171 |   await expect(page.getByLabel('Country', { exact: true })).toBeVisible();
  172 |   await expect(page.getByLabel('Postcode (Optional)', { exact: true })).toBeVisible();
  173 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  174 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  175 | });
  176 | 
  177 | test('user management — first page and detail panels', async ({ page }, testInfo) => {
  178 |   await page.goto('/coverage/users');
  179 |   await expect(page.getByRole('link', { name: 'Demo User 1', exact: true })).toBeVisible();
  180 |   await expect(page.getByRole('region', { name: 'Selected user details', exact: true })).toBeVisible();
  181 |   await expect(page.getByRole('region', { name: 'Invited user details', exact: true })).toBeVisible();
  182 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  183 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  184 | });
  185 | 
  186 | test('user management — next page', async ({ page }, testInfo) => {
  187 |   await page.goto('/coverage/users');
  188 |   await new UserManagementPage(page).next.click();
  189 |   await expect(page.getByRole('link', { name: 'Demo User 51', exact: true })).toBeVisible();
  190 |   await expect(page.locator('.hmcts-pagination__results')).toHaveText('Showing 51 to 51 of 51 results');
  191 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  192 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  193 | });
  194 | 
```