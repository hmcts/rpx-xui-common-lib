# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: feature-states.spec.ts >> user management — first page and detail panels
- Location: e2e/accessibility/feature-states.spec.ts:180:5

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
  - main [ref=e5]:
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
              - link "Demo User 1" [ref=e17] [cursor=pointer]:
                - /url: /coverage/users/user-1
            - cell "user1@example.test" [ref=e18]
            - cell "Active" [ref=e19]
          - row [ref=e20]:
            - cell [ref=e21]:
              - link "Demo User 2" [ref=e22] [cursor=pointer]:
                - /url: /coverage/users/user-2
            - cell "user2@example.test" [ref=e23]
            - cell "Active" [ref=e24]
          - row [ref=e25]:
            - cell [ref=e26]:
              - link "Demo User 3" [ref=e27] [cursor=pointer]:
                - /url: /coverage/users/user-3
            - cell "user3@example.test" [ref=e28]
            - cell "Active" [ref=e29]
          - row [ref=e30]:
            - cell [ref=e31]:
              - link "Demo User 4" [ref=e32] [cursor=pointer]:
                - /url: /coverage/users/user-4
            - cell "user4@example.test" [ref=e33]
            - cell "Active" [ref=e34]
          - row [ref=e35]:
            - cell [ref=e36]:
              - link "Demo User 5" [ref=e37] [cursor=pointer]:
                - /url: /coverage/users/user-5
            - cell "user5@example.test" [ref=e38]
            - cell "Active" [ref=e39]
          - row [ref=e40]:
            - cell [ref=e41]:
              - link "Demo User 6" [ref=e42] [cursor=pointer]:
                - /url: /coverage/users/user-6
            - cell "user6@example.test" [ref=e43]
            - cell "Active" [ref=e44]
          - row [ref=e45]:
            - cell [ref=e46]:
              - link "Demo User 7" [ref=e47] [cursor=pointer]:
                - /url: /coverage/users/user-7
            - cell "user7@example.test" [ref=e48]
            - cell "Active" [ref=e49]
          - row [ref=e50]:
            - cell [ref=e51]:
              - link "Demo User 8" [ref=e52] [cursor=pointer]:
                - /url: /coverage/users/user-8
            - cell "user8@example.test" [ref=e53]
            - cell "Active" [ref=e54]
          - row [ref=e55]:
            - cell [ref=e56]:
              - link "Demo User 9" [ref=e57] [cursor=pointer]:
                - /url: /coverage/users/user-9
            - cell "user9@example.test" [ref=e58]
            - cell "Active" [ref=e59]
          - row [ref=e60]:
            - cell [ref=e61]:
              - link "Demo User 10" [ref=e62] [cursor=pointer]:
                - /url: /coverage/users/user-10
            - cell "user10@example.test" [ref=e63]
            - cell "Active" [ref=e64]
          - row [ref=e65]:
            - cell [ref=e66]:
              - link "Demo User 11" [ref=e67] [cursor=pointer]:
                - /url: /coverage/users/user-11
            - cell "user11@example.test" [ref=e68]
            - cell "Active" [ref=e69]
          - row [ref=e70]:
            - cell [ref=e71]:
              - link "Demo User 12" [ref=e72] [cursor=pointer]:
                - /url: /coverage/users/user-12
            - cell "user12@example.test" [ref=e73]
            - cell "Active" [ref=e74]
          - row [ref=e75]:
            - cell [ref=e76]:
              - link "Demo User 13" [ref=e77] [cursor=pointer]:
                - /url: /coverage/users/user-13
            - cell "user13@example.test" [ref=e78]
            - cell "Active" [ref=e79]
          - row [ref=e80]:
            - cell [ref=e81]:
              - link "Demo User 14" [ref=e82] [cursor=pointer]:
                - /url: /coverage/users/user-14
            - cell "user14@example.test" [ref=e83]
            - cell "Active" [ref=e84]
          - row [ref=e85]:
            - cell [ref=e86]:
              - link "Demo User 15" [ref=e87] [cursor=pointer]:
                - /url: /coverage/users/user-15
            - cell "user15@example.test" [ref=e88]
            - cell "Active" [ref=e89]
          - row [ref=e90]:
            - cell [ref=e91]:
              - link "Demo User 16" [ref=e92] [cursor=pointer]:
                - /url: /coverage/users/user-16
            - cell "user16@example.test" [ref=e93]
            - cell "Active" [ref=e94]
          - row [ref=e95]:
            - cell [ref=e96]:
              - link "Demo User 17" [ref=e97] [cursor=pointer]:
                - /url: /coverage/users/user-17
            - cell "user17@example.test" [ref=e98]
            - cell "Active" [ref=e99]
          - row [ref=e100]:
            - cell [ref=e101]:
              - link "Demo User 18" [ref=e102] [cursor=pointer]:
                - /url: /coverage/users/user-18
            - cell "user18@example.test" [ref=e103]
            - cell "Active" [ref=e104]
          - row [ref=e105]:
            - cell [ref=e106]:
              - link "Demo User 19" [ref=e107] [cursor=pointer]:
                - /url: /coverage/users/user-19
            - cell "user19@example.test" [ref=e108]
            - cell "Active" [ref=e109]
          - row [ref=e110]:
            - cell [ref=e111]:
              - link "Demo User 20" [ref=e112] [cursor=pointer]:
                - /url: /coverage/users/user-20
            - cell "user20@example.test" [ref=e113]
            - cell "Active" [ref=e114]
          - row [ref=e115]:
            - cell [ref=e116]:
              - link "Demo User 21" [ref=e117] [cursor=pointer]:
                - /url: /coverage/users/user-21
            - cell "user21@example.test" [ref=e118]
            - cell "Active" [ref=e119]
          - row [ref=e120]:
            - cell [ref=e121]:
              - link "Demo User 22" [ref=e122] [cursor=pointer]:
                - /url: /coverage/users/user-22
            - cell "user22@example.test" [ref=e123]
            - cell "Active" [ref=e124]
          - row [ref=e125]:
            - cell [ref=e126]:
              - link "Demo User 23" [ref=e127] [cursor=pointer]:
                - /url: /coverage/users/user-23
            - cell "user23@example.test" [ref=e128]
            - cell "Active" [ref=e129]
          - row [ref=e130]:
            - cell [ref=e131]:
              - link "Demo User 24" [ref=e132] [cursor=pointer]:
                - /url: /coverage/users/user-24
            - cell "user24@example.test" [ref=e133]
            - cell "Active" [ref=e134]
          - row [ref=e135]:
            - cell [ref=e136]:
              - link "Demo User 25" [ref=e137] [cursor=pointer]:
                - /url: /coverage/users/user-25
            - cell "user25@example.test" [ref=e138]
            - cell "Active" [ref=e139]
          - row [ref=e140]:
            - cell [ref=e141]:
              - link "Demo User 26" [ref=e142] [cursor=pointer]:
                - /url: /coverage/users/user-26
            - cell "user26@example.test" [ref=e143]
            - cell "Active" [ref=e144]
          - row [ref=e145]:
            - cell [ref=e146]:
              - link "Demo User 27" [ref=e147] [cursor=pointer]:
                - /url: /coverage/users/user-27
            - cell "user27@example.test" [ref=e148]
            - cell "Active" [ref=e149]
          - row [ref=e150]:
            - cell [ref=e151]:
              - link "Demo User 28" [ref=e152] [cursor=pointer]:
                - /url: /coverage/users/user-28
            - cell "user28@example.test" [ref=e153]
            - cell "Active" [ref=e154]
          - row [ref=e155]:
            - cell [ref=e156]:
              - link "Demo User 29" [ref=e157] [cursor=pointer]:
                - /url: /coverage/users/user-29
            - cell "user29@example.test" [ref=e158]
            - cell "Active" [ref=e159]
          - row [ref=e160]:
            - cell [ref=e161]:
              - link "Demo User 30" [ref=e162] [cursor=pointer]:
                - /url: /coverage/users/user-30
            - cell "user30@example.test" [ref=e163]
            - cell "Active" [ref=e164]
          - row [ref=e165]:
            - cell [ref=e166]:
              - link "Demo User 31" [ref=e167] [cursor=pointer]:
                - /url: /coverage/users/user-31
            - cell "user31@example.test" [ref=e168]
            - cell "Active" [ref=e169]
          - row [ref=e170]:
            - cell [ref=e171]:
              - link "Demo User 32" [ref=e172] [cursor=pointer]:
                - /url: /coverage/users/user-32
            - cell "user32@example.test" [ref=e173]
            - cell "Active" [ref=e174]
          - row [ref=e175]:
            - cell [ref=e176]:
              - link "Demo User 33" [ref=e177] [cursor=pointer]:
                - /url: /coverage/users/user-33
            - cell "user33@example.test" [ref=e178]
            - cell "Active" [ref=e179]
          - row [ref=e180]:
            - cell [ref=e181]:
              - link "Demo User 34" [ref=e182] [cursor=pointer]:
                - /url: /coverage/users/user-34
            - cell "user34@example.test" [ref=e183]
            - cell "Active" [ref=e184]
          - row [ref=e185]:
            - cell [ref=e186]:
              - link "Demo User 35" [ref=e187] [cursor=pointer]:
                - /url: /coverage/users/user-35
            - cell "user35@example.test" [ref=e188]
            - cell "Active" [ref=e189]
          - row [ref=e190]:
            - cell [ref=e191]:
              - link "Demo User 36" [ref=e192] [cursor=pointer]:
                - /url: /coverage/users/user-36
            - cell "user36@example.test" [ref=e193]
            - cell "Active" [ref=e194]
          - row [ref=e195]:
            - cell [ref=e196]:
              - link "Demo User 37" [ref=e197] [cursor=pointer]:
                - /url: /coverage/users/user-37
            - cell "user37@example.test" [ref=e198]
            - cell "Active" [ref=e199]
          - row [ref=e200]:
            - cell [ref=e201]:
              - link "Demo User 38" [ref=e202] [cursor=pointer]:
                - /url: /coverage/users/user-38
            - cell "user38@example.test" [ref=e203]
            - cell "Active" [ref=e204]
          - row [ref=e205]:
            - cell [ref=e206]:
              - link "Demo User 39" [ref=e207] [cursor=pointer]:
                - /url: /coverage/users/user-39
            - cell "user39@example.test" [ref=e208]
            - cell "Active" [ref=e209]
          - row [ref=e210]:
            - cell [ref=e211]:
              - link "Demo User 40" [ref=e212] [cursor=pointer]:
                - /url: /coverage/users/user-40
            - cell "user40@example.test" [ref=e213]
            - cell "Active" [ref=e214]
          - row [ref=e215]:
            - cell [ref=e216]:
              - link "Demo User 41" [ref=e217] [cursor=pointer]:
                - /url: /coverage/users/user-41
            - cell "user41@example.test" [ref=e218]
            - cell "Active" [ref=e219]
          - row [ref=e220]:
            - cell [ref=e221]:
              - link "Demo User 42" [ref=e222] [cursor=pointer]:
                - /url: /coverage/users/user-42
            - cell "user42@example.test" [ref=e223]
            - cell "Active" [ref=e224]
          - row [ref=e225]:
            - cell [ref=e226]:
              - link "Demo User 43" [ref=e227] [cursor=pointer]:
                - /url: /coverage/users/user-43
            - cell "user43@example.test" [ref=e228]
            - cell "Active" [ref=e229]
          - row [ref=e230]:
            - cell [ref=e231]:
              - link "Demo User 44" [ref=e232] [cursor=pointer]:
                - /url: /coverage/users/user-44
            - cell "user44@example.test" [ref=e233]
            - cell "Active" [ref=e234]
          - row [ref=e235]:
            - cell [ref=e236]:
              - link "Demo User 45" [ref=e237] [cursor=pointer]:
                - /url: /coverage/users/user-45
            - cell "user45@example.test" [ref=e238]
            - cell "Active" [ref=e239]
          - row [ref=e240]:
            - cell [ref=e241]:
              - link "Demo User 46" [ref=e242] [cursor=pointer]:
                - /url: /coverage/users/user-46
            - cell "user46@example.test" [ref=e243]
            - cell "Active" [ref=e244]
          - row [ref=e245]:
            - cell [ref=e246]:
              - link "Demo User 47" [ref=e247] [cursor=pointer]:
                - /url: /coverage/users/user-47
            - cell "user47@example.test" [ref=e248]
            - cell "Active" [ref=e249]
          - row [ref=e250]:
            - cell [ref=e251]:
              - link "Demo User 48" [ref=e252] [cursor=pointer]:
                - /url: /coverage/users/user-48
            - cell "user48@example.test" [ref=e253]
            - cell "Active" [ref=e254]
          - row [ref=e255]:
            - cell [ref=e256]:
              - link "Demo User 49" [ref=e257] [cursor=pointer]:
                - /url: /coverage/users/user-49
            - cell "user49@example.test" [ref=e258]
            - cell "Active" [ref=e259]
          - row [ref=e260]:
            - cell [ref=e261]:
              - link "Demo User 50" [ref=e262] [cursor=pointer]:
                - /url: /coverage/users/user-50
            - cell "user50@example.test" [ref=e263]
            - cell "Active" [ref=e264]
      - navigation [ref=e267]:
        - paragraph [ref=e268]: Pagination navigation
        - list [ref=e269]:
          - listitem
          - listitem [ref=e270]: "1"
          - listitem [ref=e271]:
            - generic [ref=e272]:
              - generic [ref=e273]: page
              - text: "2"
          - listitem [ref=e274]:
            - generic [ref=e275]:
              - text: Next
              - generic [ref=e276]: page
        - paragraph [ref=e277]: Showing 1 to 50 of 51 results
    - heading "Selected user" [level=2] [ref=e278]
    - button "Toggle account actions" [ref=e279] [cursor=pointer]
    - region "Selected user details" [ref=e280]:
      - generic [ref=e281]:
        - generic [ref=e282]:
          - generic [ref=e283]:
            - term [ref=e284]: Name
            - definition [ref=e285]: Demo User 1
            - definition [ref=e286]
          - generic [ref=e287]:
            - term [ref=e288]: Email address
            - definition [ref=e289]: user1@example.test
            - definition [ref=e290]
          - generic [ref=e291]:
            - term [ref=e292]: Permissions
            - definition [ref=e293]:
              - generic [ref=e294]: Manage users
              - generic [ref=e295]: Manage cases
              - generic [ref=e296]: Case access administrator
            - definition [ref=e297]:
              - link "Change roles" [ref=e298] [cursor=pointer]:
                - /url: /coverage/users
                - text: Change
                - generic [ref=e299]: roles
        - button "Suspend account" [ref=e300] [cursor=pointer]
    - heading "Pending invitation" [level=2] [ref=e301]
    - region "Invited user details" [ref=e302]:
      - generic [ref=e303]:
        - generic [ref=e304]:
          - generic [ref=e305]:
            - term [ref=e306]: Name
            - definition [ref=e307]: Invited Demo User
            - definition [ref=e308]
          - generic [ref=e309]:
            - term [ref=e310]: Email address
            - definition [ref=e311]: invited@example.test
            - definition [ref=e312]
        - generic [ref=e313]:
          - generic [ref=e314]:
            - paragraph [ref=e315]: This user has already been invited but has not activated their account.
            - paragraph [ref=e316]: If you resend an invitation, they'll receive an email from HM Courts and Tribunals to finish setting up their account.
            - paragraph [ref=e317]: You can't invite the same user more than once an hour.
          - button "Resend invitation" [ref=e318] [cursor=pointer]
    - heading "Demo event outputs" [level=2] [ref=e319]
    - generic [ref=e320]: "[]"
    - generic [ref=e321]: "[]"
    - generic [ref=e322]: "[]"
    - generic [ref=e323]: "[]"
```

# Test source

```ts
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
> 186 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
      |                                                                                  ^ Error: A11Y_VIOLATIONS
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