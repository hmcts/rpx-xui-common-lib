# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: feature-states.spec.ts >> user management — first page and detail panels
- Location: e2e/accessibility/feature-states.spec.ts:177:5

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
+     "issueCount": 15,
+     "reviewCount": 4,
+     "reviewRules": Array [
+       "aria-prohibited-attr",
+       "color-contrast",
+     ],
+     "rules": Array [
+       "dlitem",
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
  - heading "User management demo" [level=1] [ref=e5]
  - generic [ref=e6]:
    - table [ref=e7]:
      - rowgroup [ref=e8]:
        - row [ref=e9]:
          - columnheader "Name" [ref=e10]
          - columnheader "Email" [ref=e11]
          - columnheader "Status" [ref=e12]
      - rowgroup [ref=e13]:
        - row [ref=e14]:
          - cell [ref=e15]:
            - link "Demo User 1" [ref=e16] [cursor=pointer]:
              - /url: /coverage/users/user-1
          - cell "user1@example.test" [ref=e17]
          - cell "Active" [ref=e18]
        - row [ref=e19]:
          - cell [ref=e20]:
            - link "Demo User 2" [ref=e21] [cursor=pointer]:
              - /url: /coverage/users/user-2
          - cell "user2@example.test" [ref=e22]
          - cell "Active" [ref=e23]
        - row [ref=e24]:
          - cell [ref=e25]:
            - link "Demo User 3" [ref=e26] [cursor=pointer]:
              - /url: /coverage/users/user-3
          - cell "user3@example.test" [ref=e27]
          - cell "Active" [ref=e28]
        - row [ref=e29]:
          - cell [ref=e30]:
            - link "Demo User 4" [ref=e31] [cursor=pointer]:
              - /url: /coverage/users/user-4
          - cell "user4@example.test" [ref=e32]
          - cell "Active" [ref=e33]
        - row [ref=e34]:
          - cell [ref=e35]:
            - link "Demo User 5" [ref=e36] [cursor=pointer]:
              - /url: /coverage/users/user-5
          - cell "user5@example.test" [ref=e37]
          - cell "Active" [ref=e38]
        - row [ref=e39]:
          - cell [ref=e40]:
            - link "Demo User 6" [ref=e41] [cursor=pointer]:
              - /url: /coverage/users/user-6
          - cell "user6@example.test" [ref=e42]
          - cell "Active" [ref=e43]
        - row [ref=e44]:
          - cell [ref=e45]:
            - link "Demo User 7" [ref=e46] [cursor=pointer]:
              - /url: /coverage/users/user-7
          - cell "user7@example.test" [ref=e47]
          - cell "Active" [ref=e48]
        - row [ref=e49]:
          - cell [ref=e50]:
            - link "Demo User 8" [ref=e51] [cursor=pointer]:
              - /url: /coverage/users/user-8
          - cell "user8@example.test" [ref=e52]
          - cell "Active" [ref=e53]
        - row [ref=e54]:
          - cell [ref=e55]:
            - link "Demo User 9" [ref=e56] [cursor=pointer]:
              - /url: /coverage/users/user-9
          - cell "user9@example.test" [ref=e57]
          - cell "Active" [ref=e58]
        - row [ref=e59]:
          - cell [ref=e60]:
            - link "Demo User 10" [ref=e61] [cursor=pointer]:
              - /url: /coverage/users/user-10
          - cell "user10@example.test" [ref=e62]
          - cell "Active" [ref=e63]
        - row [ref=e64]:
          - cell [ref=e65]:
            - link "Demo User 11" [ref=e66] [cursor=pointer]:
              - /url: /coverage/users/user-11
          - cell "user11@example.test" [ref=e67]
          - cell "Active" [ref=e68]
        - row [ref=e69]:
          - cell [ref=e70]:
            - link "Demo User 12" [ref=e71] [cursor=pointer]:
              - /url: /coverage/users/user-12
          - cell "user12@example.test" [ref=e72]
          - cell "Active" [ref=e73]
        - row [ref=e74]:
          - cell [ref=e75]:
            - link "Demo User 13" [ref=e76] [cursor=pointer]:
              - /url: /coverage/users/user-13
          - cell "user13@example.test" [ref=e77]
          - cell "Active" [ref=e78]
        - row [ref=e79]:
          - cell [ref=e80]:
            - link "Demo User 14" [ref=e81] [cursor=pointer]:
              - /url: /coverage/users/user-14
          - cell "user14@example.test" [ref=e82]
          - cell "Active" [ref=e83]
        - row [ref=e84]:
          - cell [ref=e85]:
            - link "Demo User 15" [ref=e86] [cursor=pointer]:
              - /url: /coverage/users/user-15
          - cell "user15@example.test" [ref=e87]
          - cell "Active" [ref=e88]
        - row [ref=e89]:
          - cell [ref=e90]:
            - link "Demo User 16" [ref=e91] [cursor=pointer]:
              - /url: /coverage/users/user-16
          - cell "user16@example.test" [ref=e92]
          - cell "Active" [ref=e93]
        - row [ref=e94]:
          - cell [ref=e95]:
            - link "Demo User 17" [ref=e96] [cursor=pointer]:
              - /url: /coverage/users/user-17
          - cell "user17@example.test" [ref=e97]
          - cell "Active" [ref=e98]
        - row [ref=e99]:
          - cell [ref=e100]:
            - link "Demo User 18" [ref=e101] [cursor=pointer]:
              - /url: /coverage/users/user-18
          - cell "user18@example.test" [ref=e102]
          - cell "Active" [ref=e103]
        - row [ref=e104]:
          - cell [ref=e105]:
            - link "Demo User 19" [ref=e106] [cursor=pointer]:
              - /url: /coverage/users/user-19
          - cell "user19@example.test" [ref=e107]
          - cell "Active" [ref=e108]
        - row [ref=e109]:
          - cell [ref=e110]:
            - link "Demo User 20" [ref=e111] [cursor=pointer]:
              - /url: /coverage/users/user-20
          - cell "user20@example.test" [ref=e112]
          - cell "Active" [ref=e113]
        - row [ref=e114]:
          - cell [ref=e115]:
            - link "Demo User 21" [ref=e116] [cursor=pointer]:
              - /url: /coverage/users/user-21
          - cell "user21@example.test" [ref=e117]
          - cell "Active" [ref=e118]
        - row [ref=e119]:
          - cell [ref=e120]:
            - link "Demo User 22" [ref=e121] [cursor=pointer]:
              - /url: /coverage/users/user-22
          - cell "user22@example.test" [ref=e122]
          - cell "Active" [ref=e123]
        - row [ref=e124]:
          - cell [ref=e125]:
            - link "Demo User 23" [ref=e126] [cursor=pointer]:
              - /url: /coverage/users/user-23
          - cell "user23@example.test" [ref=e127]
          - cell "Active" [ref=e128]
        - row [ref=e129]:
          - cell [ref=e130]:
            - link "Demo User 24" [ref=e131] [cursor=pointer]:
              - /url: /coverage/users/user-24
          - cell "user24@example.test" [ref=e132]
          - cell "Active" [ref=e133]
        - row [ref=e134]:
          - cell [ref=e135]:
            - link "Demo User 25" [ref=e136] [cursor=pointer]:
              - /url: /coverage/users/user-25
          - cell "user25@example.test" [ref=e137]
          - cell "Active" [ref=e138]
        - row [ref=e139]:
          - cell [ref=e140]:
            - link "Demo User 26" [ref=e141] [cursor=pointer]:
              - /url: /coverage/users/user-26
          - cell "user26@example.test" [ref=e142]
          - cell "Active" [ref=e143]
        - row [ref=e144]:
          - cell [ref=e145]:
            - link "Demo User 27" [ref=e146] [cursor=pointer]:
              - /url: /coverage/users/user-27
          - cell "user27@example.test" [ref=e147]
          - cell "Active" [ref=e148]
        - row [ref=e149]:
          - cell [ref=e150]:
            - link "Demo User 28" [ref=e151] [cursor=pointer]:
              - /url: /coverage/users/user-28
          - cell "user28@example.test" [ref=e152]
          - cell "Active" [ref=e153]
        - row [ref=e154]:
          - cell [ref=e155]:
            - link "Demo User 29" [ref=e156] [cursor=pointer]:
              - /url: /coverage/users/user-29
          - cell "user29@example.test" [ref=e157]
          - cell "Active" [ref=e158]
        - row [ref=e159]:
          - cell [ref=e160]:
            - link "Demo User 30" [ref=e161] [cursor=pointer]:
              - /url: /coverage/users/user-30
          - cell "user30@example.test" [ref=e162]
          - cell "Active" [ref=e163]
        - row [ref=e164]:
          - cell [ref=e165]:
            - link "Demo User 31" [ref=e166] [cursor=pointer]:
              - /url: /coverage/users/user-31
          - cell "user31@example.test" [ref=e167]
          - cell "Active" [ref=e168]
        - row [ref=e169]:
          - cell [ref=e170]:
            - link "Demo User 32" [ref=e171] [cursor=pointer]:
              - /url: /coverage/users/user-32
          - cell "user32@example.test" [ref=e172]
          - cell "Active" [ref=e173]
        - row [ref=e174]:
          - cell [ref=e175]:
            - link "Demo User 33" [ref=e176] [cursor=pointer]:
              - /url: /coverage/users/user-33
          - cell "user33@example.test" [ref=e177]
          - cell "Active" [ref=e178]
        - row [ref=e179]:
          - cell [ref=e180]:
            - link "Demo User 34" [ref=e181] [cursor=pointer]:
              - /url: /coverage/users/user-34
          - cell "user34@example.test" [ref=e182]
          - cell "Active" [ref=e183]
        - row [ref=e184]:
          - cell [ref=e185]:
            - link "Demo User 35" [ref=e186] [cursor=pointer]:
              - /url: /coverage/users/user-35
          - cell "user35@example.test" [ref=e187]
          - cell "Active" [ref=e188]
        - row [ref=e189]:
          - cell [ref=e190]:
            - link "Demo User 36" [ref=e191] [cursor=pointer]:
              - /url: /coverage/users/user-36
          - cell "user36@example.test" [ref=e192]
          - cell "Active" [ref=e193]
        - row [ref=e194]:
          - cell [ref=e195]:
            - link "Demo User 37" [ref=e196] [cursor=pointer]:
              - /url: /coverage/users/user-37
          - cell "user37@example.test" [ref=e197]
          - cell "Active" [ref=e198]
        - row [ref=e199]:
          - cell [ref=e200]:
            - link "Demo User 38" [ref=e201] [cursor=pointer]:
              - /url: /coverage/users/user-38
          - cell "user38@example.test" [ref=e202]
          - cell "Active" [ref=e203]
        - row [ref=e204]:
          - cell [ref=e205]:
            - link "Demo User 39" [ref=e206] [cursor=pointer]:
              - /url: /coverage/users/user-39
          - cell "user39@example.test" [ref=e207]
          - cell "Active" [ref=e208]
        - row [ref=e209]:
          - cell [ref=e210]:
            - link "Demo User 40" [ref=e211] [cursor=pointer]:
              - /url: /coverage/users/user-40
          - cell "user40@example.test" [ref=e212]
          - cell "Active" [ref=e213]
        - row [ref=e214]:
          - cell [ref=e215]:
            - link "Demo User 41" [ref=e216] [cursor=pointer]:
              - /url: /coverage/users/user-41
          - cell "user41@example.test" [ref=e217]
          - cell "Active" [ref=e218]
        - row [ref=e219]:
          - cell [ref=e220]:
            - link "Demo User 42" [ref=e221] [cursor=pointer]:
              - /url: /coverage/users/user-42
          - cell "user42@example.test" [ref=e222]
          - cell "Active" [ref=e223]
        - row [ref=e224]:
          - cell [ref=e225]:
            - link "Demo User 43" [ref=e226] [cursor=pointer]:
              - /url: /coverage/users/user-43
          - cell "user43@example.test" [ref=e227]
          - cell "Active" [ref=e228]
        - row [ref=e229]:
          - cell [ref=e230]:
            - link "Demo User 44" [ref=e231] [cursor=pointer]:
              - /url: /coverage/users/user-44
          - cell "user44@example.test" [ref=e232]
          - cell "Active" [ref=e233]
        - row [ref=e234]:
          - cell [ref=e235]:
            - link "Demo User 45" [ref=e236] [cursor=pointer]:
              - /url: /coverage/users/user-45
          - cell "user45@example.test" [ref=e237]
          - cell "Active" [ref=e238]
        - row [ref=e239]:
          - cell [ref=e240]:
            - link "Demo User 46" [ref=e241] [cursor=pointer]:
              - /url: /coverage/users/user-46
          - cell "user46@example.test" [ref=e242]
          - cell "Active" [ref=e243]
        - row [ref=e244]:
          - cell [ref=e245]:
            - link "Demo User 47" [ref=e246] [cursor=pointer]:
              - /url: /coverage/users/user-47
          - cell "user47@example.test" [ref=e247]
          - cell "Active" [ref=e248]
        - row [ref=e249]:
          - cell [ref=e250]:
            - link "Demo User 48" [ref=e251] [cursor=pointer]:
              - /url: /coverage/users/user-48
          - cell "user48@example.test" [ref=e252]
          - cell "Active" [ref=e253]
        - row [ref=e254]:
          - cell [ref=e255]:
            - link "Demo User 49" [ref=e256] [cursor=pointer]:
              - /url: /coverage/users/user-49
          - cell "user49@example.test" [ref=e257]
          - cell "Active" [ref=e258]
        - row [ref=e259]:
          - cell [ref=e260]:
            - link "Demo User 50" [ref=e261] [cursor=pointer]:
              - /url: /coverage/users/user-50
          - cell "user50@example.test" [ref=e262]
          - cell "Active" [ref=e263]
    - navigation [ref=e266]:
      - paragraph [ref=e267]: Pagination navigation
      - list [ref=e268]:
        - listitem
        - listitem [ref=e269]: "1"
        - listitem [ref=e270]:
          - generic [ref=e271]:
            - generic [ref=e272]: page
            - text: "2"
        - listitem [ref=e273]:
          - generic [ref=e274]:
            - text: Next
            - generic [ref=e275]: page
      - paragraph [ref=e276]: Showing 1 to 50 of 51 results
  - heading "Selected user" [level=2] [ref=e277]
  - button "Toggle account actions" [ref=e278] [cursor=pointer]
  - region "Selected user details" [ref=e279]:
    - generic [ref=e280]:
      - generic [ref=e281]:
        - generic [ref=e282]:
          - term [ref=e283]: Name
          - definition [ref=e284]: Demo User 1
          - definition [ref=e285]
        - generic [ref=e286]:
          - term [ref=e287]: Email address
          - definition [ref=e288]: user1@example.test
          - definition [ref=e289]
        - generic [ref=e290]:
          - term [ref=e291]: Permissions
          - definition [ref=e292]:
            - generic [ref=e293]: Manage users
            - generic [ref=e294]: Manage cases
            - generic [ref=e295]: Case access administrator
          - definition [ref=e296]:
            - link "Change roles" [ref=e297] [cursor=pointer]:
              - /url: /coverage/users
              - text: Change
              - generic [ref=e298]: roles
      - button "Suspend account" [ref=e299] [cursor=pointer]
  - heading "Pending invitation" [level=2] [ref=e300]
  - region "Invited user details" [ref=e301]:
    - generic [ref=e302]:
      - generic [ref=e303]:
        - generic [ref=e304]:
          - term [ref=e305]: Name
          - definition [ref=e306]: Invited Demo User
          - definition [ref=e307]
        - generic [ref=e308]:
          - term [ref=e309]: Email address
          - definition [ref=e310]: invited@example.test
          - definition [ref=e311]
      - generic [ref=e312]:
        - generic [ref=e313]:
          - paragraph [ref=e314]: This user has already been invited but has not activated their account.
          - paragraph [ref=e315]: If you resend an invitation, they'll receive an email from HM Courts and Tribunals to finish setting up their account.
          - paragraph [ref=e316]: You can't invite the same user more than once an hour.
        - button "Resend invitation" [ref=e317] [cursor=pointer]
  - heading "Demo event outputs" [level=2] [ref=e318]
  - generic [ref=e319]: "[]"
  - generic [ref=e320]: "[]"
  - generic [ref=e321]: "[]"
  - generic [ref=e322]: "[]"
```

# Test source

```ts
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
  174 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  175 | });
  176 | 
  177 | test('user management — first page and detail panels', async ({ page }, testInfo) => {
  178 |   await page.goto('/coverage/users');
  179 |   await expect(page.getByRole('link', { name: 'Demo User 1', exact: true })).toBeVisible();
  180 |   await expect(page.getByRole('region', { name: 'Selected user details', exact: true })).toBeVisible();
  181 |   await expect(page.getByRole('region', { name: 'Invited user details', exact: true })).toBeVisible();
  182 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
> 183 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
      |                                                                                  ^ Error: A11Y_VIOLATIONS
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