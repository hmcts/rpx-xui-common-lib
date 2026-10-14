# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: feature-states.spec.ts >> address — manual international entry
- Location: e2e/accessibility/feature-states.spec.ts:167:5

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
  - heading "Address demo" [level=1] [ref=e5]
  - generic [ref=e8]:
    - generic [ref=e9]:
      - radio "Yes" [ref=e10] [cursor=pointer]
      - generic [ref=e11] [cursor=pointer]: "Yes"
    - generic [ref=e12]:
      - radio "No" [checked] [active] [ref=e13] [cursor=pointer]
      - generic [ref=e14] [cursor=pointer]: "No"
    - generic [ref=e18]:
      - generic [ref=e19]: Enter address details
      - generic [ref=e20]:
        - generic [ref=e21]: Building and Street
        - textbox "Building and Street" [ref=e22]
      - generic [ref=e23]:
        - generic [ref=e24]: Address line 2 (Optional)
        - textbox "Address line 2 (Optional)" [ref=e25]
      - generic [ref=e26]:
        - generic [ref=e27]: Address line 3 (Optional)
        - textbox "Address line 3 (Optional)" [ref=e28]
      - generic [ref=e29]:
        - generic [ref=e30]: Town or City
        - textbox "Town or City" [ref=e31]
      - generic [ref=e32]:
        - generic [ref=e33]: County/ State/ Province (Optional)
        - textbox "County/ State/ Province (Optional)" [ref=e34]
      - generic [ref=e35]:
        - generic [ref=e36]: Country
        - textbox "Country" [ref=e37]
      - generic [ref=e38]:
        - generic [ref=e39]: Postcode (Optional)
        - textbox "Postcode (Optional)" [ref=e40]
  - heading "Demo form and event outputs" [level=2] [ref=e41]
  - generic [ref=e42]: "{ \"address\": { \"addressLine1\": \"\", \"addressLine2\": \"\", \"addressLine3\": \"\", \"postTown\": \"\", \"county\": \"\", \"postCode\": \"\", \"country\": \"\" } }"
  - paragraph [ref=e43]: "Selection events: 0"
  - paragraph [ref=e44]: "Addresses available: false"
```

# Test source

```ts
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
> 174 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
      |                                                                                  ^ Error: A11Y_VIOLATIONS
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