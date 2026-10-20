# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: feature-states.spec.ts >> user management — next page
- Location: e2e/accessibility/feature-states.spec.ts:189:5

# Error details

```
Error: A11Y_VIOLATIONS

expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 15

- Array []
+ Array [
+   Object {
+     "engine": "axe",
+     "issueCount": 15,
+     "reviewCount": 5,
+     "reviewRules": Array [
+       "aria-prohibited-attr",
+       "color-contrast",
+     ],
+     "rules": Array [
+       "dlitem",
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
  - main [active] [ref=e5]:
    - heading "User management demo" [level=1] [ref=e6]
    - generic [ref=e7]:
      - table [ref=e8]:
        - rowgroup [ref=e9]:
          - row [ref=e10]:
            - columnheader "Name" [ref=e11]
            - columnheader "Email" [ref=e12]
            - columnheader "Status" [ref=e13]
        - rowgroup [ref=e14]:
          - row [ref=e15]:
            - cell [ref=e16]:
              - link "Demo User 51" [ref=e17] [cursor=pointer]:
                - /url: /coverage/users/user-51
            - cell "user51@example.test" [ref=e18]
            - cell "Active" [ref=e19]
      - navigation [ref=e22]:
        - paragraph [ref=e23]: Pagination navigation
        - list [ref=e24]:
          - listitem [ref=e25]:
            - generic [ref=e26]:
              - text: Previous
              - generic [ref=e27]: set of pages
          - listitem [ref=e28]:
            - generic [ref=e29]:
              - generic [ref=e30]: page
              - text: "1"
          - listitem [ref=e31]: "2"
          - listitem
        - paragraph [ref=e32]: Showing 51 to 51 of 51 results
    - heading "Selected user" [level=2] [ref=e33]
    - button "Toggle account actions" [ref=e34] [cursor=pointer]
    - region "Selected user details" [ref=e35]:
      - generic [ref=e36]:
        - generic [ref=e37]:
          - generic [ref=e38]:
            - term [ref=e39]: Name
            - definition [ref=e40]: Demo User 1
            - definition [ref=e41]
          - generic [ref=e42]:
            - term [ref=e43]: Email address
            - definition [ref=e44]: user1@example.test
            - definition [ref=e45]
          - generic [ref=e46]:
            - term [ref=e47]: Permissions
            - definition [ref=e48]:
              - generic [ref=e49]: Manage users
              - generic [ref=e50]: Manage cases
              - generic [ref=e51]: Case access administrator
            - definition [ref=e52]:
              - link "Change roles" [ref=e53] [cursor=pointer]:
                - /url: /coverage/users
                - text: Change
                - generic [ref=e54]: roles
        - button "Suspend account" [ref=e55] [cursor=pointer]
    - heading "Pending invitation" [level=2] [ref=e56]
    - region "Invited user details" [ref=e57]:
      - generic [ref=e58]:
        - generic [ref=e59]:
          - generic [ref=e60]:
            - term [ref=e61]: Name
            - definition [ref=e62]: Invited Demo User
            - definition [ref=e63]
          - generic [ref=e64]:
            - term [ref=e65]: Email address
            - definition [ref=e66]: invited@example.test
            - definition [ref=e67]
        - generic [ref=e68]:
          - generic [ref=e69]:
            - paragraph [ref=e70]: This user has already been invited but has not activated their account.
            - paragraph [ref=e71]: If you resend an invitation, they'll receive an email from HM Courts and Tribunals to finish setting up their account.
            - paragraph [ref=e72]: You can't invite the same user more than once an hour.
          - button "Resend invitation" [ref=e73] [cursor=pointer]
    - heading "Demo event outputs" [level=2] [ref=e74]
    - generic [ref=e75]: "[ 2 ]"
    - generic [ref=e76]: "[]"
    - generic [ref=e77]: "[]"
    - generic [ref=e78]: "[]"
```

# Test source

```ts
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
> 195 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
      |                                                                                  ^ Error: A11Y_VIOLATIONS
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