# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: feature-states.spec.ts >> advanced filter — conditional detail visible
- Location: e2e/accessibility/feature-states.spec.ts:198:5

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
+       "heading-order",
+     ],
+     "status": "issues-found",
+   },
+   Object {
+     "engine": "wave-like",
+     "issueCount": 2,
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
- generic [ref=e1]:
  - link "Skip to main content" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - main [ref=e5]:
    - heading "Advanced filter contracts" [level=1] [ref=e6]
    - generic [ref=e8]:
      - generic [ref=e10]:
        - heading "Include details" [level=3] [ref=e12]
        - group "Include details" [ref=e14]:
          - generic [ref=e15]:
            - radio "No detail" [ref=e16] [cursor=pointer]
            - generic [ref=e17] [cursor=pointer]: No detail
          - generic [ref=e18]:
            - radio "Include detail" [checked] [active] [ref=e19] [cursor=pointer]
            - generic [ref=e20] [cursor=pointer]: Include detail
      - generic [ref=e22]:
        - heading "Detail" [level=3] [ref=e24]
        - textbox "Detail" [ref=e26]
      - separator [ref=e27]
      - button "Apply advanced filters" [ref=e30] [cursor=pointer]
    - status [ref=e31]: "null"
```

# Test source

```ts
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
> 204 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
      |                                                                                  ^ Error: A11Y_VIOLATIONS
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
  224 | 
  225 | test('lifecycle — service messages and enabled feature content', async ({ page, context }, testInfo) => {
  226 |   const lifecycle = new LifecyclePage(page, context);
  227 |   await lifecycle.open();
  228 |   await expect(lifecycle.firstEnglishHeading).toBeVisible();
  229 |   await expect(lifecycle.secondMessage).toBeVisible();
  230 |   await lifecycle.enableCurrentFeature();
  231 |   await expect(lifecycle.featureContent).toHaveCount(1);
  232 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  233 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  234 | });
  235 | 
```