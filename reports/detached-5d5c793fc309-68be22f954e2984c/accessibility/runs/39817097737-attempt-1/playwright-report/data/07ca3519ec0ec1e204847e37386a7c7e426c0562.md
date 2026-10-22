# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: feature-states.spec.ts >> case sharing — pending addition
- Location: e2e/accessibility/feature-states.spec.ts:143:5

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
- generic [ref=e2]:
  - link "Skip to main content" [ref=e3] [cursor=pointer]:
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
  103 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
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
> 150 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
      |                                                                                  ^ Error: A11Y_VIOLATIONS
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
  204 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  205 | });
  206 | 
  207 | test('user management — first page and detail panels', async ({ page }, testInfo) => {
  208 |   await page.goto('/coverage/users');
  209 |   await expect(page.getByRole('link', { name: 'Demo User 1', exact: true })).toBeVisible();
  210 |   await expect(page.getByRole('region', { name: 'Selected user details', exact: true })).toBeVisible();
  211 |   await expect(page.getByRole('region', { name: 'Invited user details', exact: true })).toBeVisible();
  212 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  213 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  214 | });
  215 | 
  216 | test('user management — next page', async ({ page }, testInfo) => {
  217 |   await page.goto('/coverage/users');
  218 |   await new UserManagementPage(page).next.click();
  219 |   await expect(page.getByRole('link', { name: 'Demo User 51', exact: true })).toBeVisible();
  220 |   await expect(page.locator('.hmcts-pagination__results')).toHaveText('Showing 51 to 51 of 51 results');
  221 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  222 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  223 | });
  224 | 
  225 | test('advanced filter — conditional detail visible', async ({ page }, testInfo) => {
  226 |   const filter = new AdvancedFilterPage(page);
  227 |   await filter.openConditional();
  228 |   await filter.enableDetail();
  229 |   await expect(filter.detail).toBeVisible();
  230 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  231 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  232 | });
  233 | 
  234 | test('find person — expanded judicial suggestions', async ({ page }, testInfo) => {
  235 |   const search = new SearchPage(page);
  236 |   await search.openPerson('judicial', true);
  237 |   await search.search('Alex');
  238 |   await expect(search.options).toHaveText(['Judge Alex Taylor (alex@example.test)']);
  239 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  240 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  241 | });
  242 | 
  243 | test('search judicials — expanded suggestions', async ({ page }, testInfo) => {
  244 |   const search = new SearchPage(page);
  245 |   await search.openJudicials();
  246 |   await search.search('Alex');
  247 |   await expect(search.options).toHaveText(['Judge Alex Taylor (alex@example.test)']);
  248 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  249 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  250 | });
```