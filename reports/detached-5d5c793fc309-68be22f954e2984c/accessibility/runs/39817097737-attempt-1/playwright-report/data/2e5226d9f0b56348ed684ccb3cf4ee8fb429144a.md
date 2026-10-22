# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: feature-states.spec.ts >> user management — next page
- Location: e2e/accessibility/feature-states.spec.ts:216:5

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
> 222 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
      |                                                                                  ^ Error: A11Y_VIOLATIONS
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