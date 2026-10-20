# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: feature-states.spec.ts >> case sharing — pending addition
- Location: e2e/accessibility/feature-states.spec.ts:116:5

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
+     "issueCount": 5,
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
- generic [active] [ref=e1]:
  - link "Skip to main content" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - main [ref=e5]:
    - generic [ref=e6]:
      - generic "Share synthetic cases" [ref=e7]:
        - heading "Share synthetic cases" [level=1] [ref=e8]
        - generic [ref=e9]:
          - generic [ref=e10]:
            - generic [ref=e11]: Add a person to all cases
            - text: Search by name or email address. You can share access with as many people as you need.
            - generic [ref=e12]:
              - combobox "Search by name or email address. You can share access with as many people as you need." [ref=e15]
              - button "Add user" [disabled] [ref=e17]:
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
                - option "Sam Morgan - sam@example.test"
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
                    - row [ref=e61]:
                      - cell "Sam Morgan" [ref=e62]
                      - cell "sam@example.test" [ref=e63]
                      - cell [ref=e64]:
                        - link "Cancel adding Sam Morgan to case" [ref=e65] [cursor=pointer]:
                          - /url: "#"
                          - text: Cancel
                          - generic [ref=e66]: adding Sam Morgan to case
                      - cell "To be added" [ref=e67]
            - generic [ref=e69]:
              - generic [ref=e70]:
                - generic [ref=e71]:
                  - heading "Synthetic case Beta" [level=3] [ref=e72]
                  - heading "DEMO-002" [level=3] [ref=e73]
                - button "Deselect case" [ref=e75] [cursor=pointer]
                - button "Expand or Collapse" [ref=e78]
              - generic "Expand or Collapse" [ref=e79]:
                - generic [ref=e80]: Users from your organisation with access to this case.
                - table [ref=e81]:
                  - rowgroup [ref=e82]:
                    - row [ref=e83]:
                      - columnheader "Name" [ref=e84]
                      - columnheader "Email address" [ref=e85]
                      - columnheader "Actions" [ref=e86]
                      - columnheader "Status" [ref=e87]
                  - rowgroup [ref=e88]:
                    - row [ref=e89]:
                      - cell "Alex Taylor" [ref=e90]
                      - cell "alex@example.test" [ref=e91]
                      - cell [ref=e92]:
                        - link "Remove Alex Taylor from case" [ref=e93] [cursor=pointer]:
                          - /url: "#"
                          - text: Remove
                          - generic [ref=e94]: Alex Taylor from case
                      - cell [ref=e95]
                    - row [ref=e96]:
                      - cell "Sam Morgan" [ref=e97]
                      - cell "sam@example.test" [ref=e98]
                      - cell [ref=e99]:
                        - link "Cancel adding Sam Morgan to case" [ref=e100] [cursor=pointer]:
                          - /url: "#"
                          - text: Cancel
                          - generic [ref=e101]: adding Sam Morgan to case
                      - cell "To be added" [ref=e102]
        - generic [ref=e103]:
          - button "Continue" [ref=e104] [cursor=pointer]
          - button "Cancel" [ref=e105] [cursor=pointer]
      - heading "Demo event outputs" [level=2] [ref=e106]
      - generic [ref=e107]: "[ { \"caseId\": \"DEMO-001\", \"caseTitle\": \"Synthetic case Alpha\", \"sharedWith\": [ { \"idamId\": \"demo-alex\", \"firstName\": \"Alex\", \"lastName\": \"Taylor\", \"email\": \"alex@example.test\" } ], \"pendingShares\": [ { \"idamId\": \"demo-sam\", \"firstName\": \"Sam\", \"lastName\": \"Morgan\", \"email\": \"sam@example.test\" } ], \"pendingUnshares\": [] }, { \"caseId\": \"DEMO-002\", \"caseTitle\": \"Synthetic case Beta\", \"sharedWith\": [ { \"idamId\": \"demo-alex\", \"firstName\": \"Alex\", \"lastName\": \"Taylor\", \"email\": \"alex@example.test\" } ], \"pendingShares\": [ { \"idamId\": \"demo-sam\", \"firstName\": \"Sam\", \"lastName\": \"Morgan\", \"email\": \"sam@example.test\" } ], \"pendingUnshares\": [] } ]"
      - generic [ref=e108]: "[]"
      - generic [ref=e109]: "[ { \"caseId\": \"DEMO-001\", \"caseTitle\": \"Synthetic case Alpha\", \"sharedWith\": [ { \"idamId\": \"demo-alex\", \"firstName\": \"Alex\", \"lastName\": \"Taylor\", \"email\": \"alex@example.test\" } ], \"pendingShares\": [ { \"idamId\": \"demo-sam\", \"firstName\": \"Sam\", \"lastName\": \"Morgan\", \"email\": \"sam@example.test\" } ], \"pendingUnshares\": [] }, { \"caseId\": \"DEMO-002\", \"caseTitle\": \"Synthetic case Beta\", \"sharedWith\": [ { \"idamId\": \"demo-alex\", \"firstName\": \"Alex\", \"lastName\": \"Taylor\", \"email\": \"alex@example.test\" } ], \"pendingShares\": [ { \"idamId\": \"demo-sam\", \"firstName\": \"Sam\", \"lastName\": \"Morgan\", \"email\": \"sam@example.test\" } ], \"pendingUnshares\": [] } ]"
```

# Test source

```ts
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
  62  |     expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
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
> 123 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
      |                                                                                  ^ Error: A11Y_VIOLATIONS
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
  163 |   await new AddressPage(page).lookup();
  164 |   await page.getByLabel('Select an address', { exact: true }).selectOption({ label: '12 Demo Street, Testville' });
  165 |   await expect(page.getByLabel('Building and Street', { exact: true })).toHaveValue('12 Demo Street');
  166 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  167 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  168 | });
  169 | 
  170 | test('address — manual international entry', async ({ page }, testInfo) => {
  171 |   await page.goto('/coverage/address');
  172 |   await page.getByRole('link', { name: 'I can\'t enter a UK postcode', exact: true }).click();
  173 |   await page.getByRole('radio', { name: 'No', exact: true }).check();
  174 |   await expect(page.getByLabel('Country', { exact: true })).toBeVisible();
  175 |   await expect(page.getByLabel('Postcode (Optional)', { exact: true })).toBeVisible();
  176 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  177 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  178 | });
  179 | 
  180 | test('user management — first page and detail panels', async ({ page }, testInfo) => {
  181 |   await page.goto('/coverage/users');
  182 |   await expect(page.getByRole('link', { name: 'Demo User 1', exact: true })).toBeVisible();
  183 |   await expect(page.getByRole('region', { name: 'Selected user details', exact: true })).toBeVisible();
  184 |   await expect(page.getByRole('region', { name: 'Invited user details', exact: true })).toBeVisible();
  185 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  186 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  187 | });
  188 | 
  189 | test('user management — next page', async ({ page }, testInfo) => {
  190 |   await page.goto('/coverage/users');
  191 |   await new UserManagementPage(page).next.click();
  192 |   await expect(page.getByRole('link', { name: 'Demo User 51', exact: true })).toBeVisible();
  193 |   await expect(page.locator('.hmcts-pagination__results')).toHaveText('Showing 51 to 51 of 51 results');
  194 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  195 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  196 | });
  197 | 
  198 | test('advanced filter — conditional detail visible', async ({ page }, testInfo) => {
  199 |   const filter = new AdvancedFilterPage(page);
  200 |   await filter.openConditional();
  201 |   await filter.enableDetail();
  202 |   await expect(filter.detail).toBeVisible();
  203 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  204 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  205 | });
  206 | 
  207 | test('find person — expanded judicial suggestions', async ({ page }, testInfo) => {
  208 |   const search = new SearchPage(page);
  209 |   await search.openPerson('judicial', true);
  210 |   await search.search('Alex');
  211 |   await expect(search.options).toHaveText(['Judge Alex Taylor (alex@example.test)']);
  212 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  213 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  214 | });
  215 | 
  216 | test('search judicials — expanded suggestions', async ({ page }, testInfo) => {
  217 |   const search = new SearchPage(page);
  218 |   await search.openJudicials();
  219 |   await search.search('Alex');
  220 |   await expect(search.options).toHaveText(['Judge Alex Taylor (alex@example.test)']);
  221 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  222 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  223 | });
```