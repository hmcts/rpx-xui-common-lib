# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: feature-states.spec.ts >> address — invalid postcode
- Location: e2e/accessibility/feature-states.spec.ts:172:5

# Error details

```
Error: A11Y_VIOLATIONS

expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 10

- Array []
+ Array [
+   Object {
+     "engine": "screen-reader",
+     "issueCount": 1,
+     "rules": Array [
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
    - heading "Address demo" [level=1] [ref=e6]
    - generic [ref=e9]:
      - strong [ref=e11]: Provide address details
      - generic [ref=e12]:
        - generic [ref=e13]: Enter a UK postcode
        - paragraph [ref=e14]:
          - generic [ref=e15]: "Error:"
          - text: Enter a valid postcode
        - generic [ref=e16]:
          - textbox "Enter a UK postcode" [ref=e17]
          - button "Find address" [active] [ref=e18] [cursor=pointer]
      - link "I can't enter a UK postcode" [ref=e19] [cursor=pointer]:
        - /url: "#"
    - heading "Demo form and event outputs" [level=2] [ref=e20]
    - generic [ref=e21]: "{ \"address\": { \"addressLine1\": null, \"addressLine2\": null, \"addressLine3\": null, \"postTown\": null, \"county\": null, \"postCode\": null, \"country\": null } }"
    - paragraph [ref=e22]: "Selection events: 0"
    - paragraph [ref=e23]: "Addresses available: false"
```

# Test source

```ts
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
> 177 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
      |                                                                                  ^ Error: A11Y_VIOLATIONS
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
  251 | 
  252 | test('lifecycle — service messages and enabled feature content', async ({ page, context }, testInfo) => {
  253 |   const lifecycle = new LifecyclePage(page, context);
  254 |   await lifecycle.open();
  255 |   await expect(lifecycle.firstEnglishHeading).toBeVisible();
  256 |   await expect(lifecycle.secondMessage).toBeVisible();
  257 |   await lifecycle.enableCurrentFeature();
  258 |   await expect(lifecycle.featureContent).toHaveCount(1);
  259 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  260 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  261 | });
  262 | 
```