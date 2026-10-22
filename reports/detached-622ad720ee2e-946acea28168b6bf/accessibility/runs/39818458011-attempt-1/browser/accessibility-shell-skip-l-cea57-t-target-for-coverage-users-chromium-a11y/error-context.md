# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility-shell.spec.ts >> skip link moves focus to the main-content target for /coverage/users
- Location: e2e/accessibility/accessibility-shell.spec.ts:54:7

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
  1  | import { expect } from '@playwright/test';
  2  | import { test } from '../src/browser-diagnostics.fixture';
  3  | import { collectAccessibilityEvidence } from './accessibilityAudit';
  4  | import { ASSERTION_MARKER } from './report.cjs';
  5  | 
  6  | type RouteContract = {
  7  |   path: string;
  8  |   marker: { selector: string; text?: string };
  9  | };
  10 | 
  11 | const heading = (text: string) => ({ selector: 'h1', text });
  12 | 
  13 | const routes: RouteContract[] = [
  14 |   { path: '/home', marker: heading('ExUI Common Lib Test Page') },
  15 |   { path: '/coverage', marker: heading('CommonLib component coverage examples') },
  16 |   { path: '/coverage?feature=filter', marker: { selector: '[data-testid="generic-filter-demo"]' } },
  17 |   { path: '/coverage?feature=pagination', marker: { selector: '[data-testid="pagination-demo"]' } },
  18 |   { path: '/coverage?feature=cookie', marker: { selector: '[data-testid="cookie-demo"]' } },
  19 |   { path: '/coverage?feature=users', marker: { selector: '[data-testid="user-select-demo"]' } },
  20 |   { path: '/coverage?feature=terms', marker: { selector: '[data-testid="terms-confirm-demo"]' } },
  21 |   { path: '/coverage?feature=terms-html', marker: { selector: '[data-testid="terms-html-demo"]' } },
  22 |   { path: '/coverage?feature=terms-plain', marker: { selector: '[data-testid="terms-plain-demo"]' } },
  23 |   { path: '/coverage?feature=terms-unknown', marker: { selector: '[data-testid="terms-unknown-demo"]' } },
  24 |   { path: '/coverage?feature=form-group', marker: { selector: '[data-testid="form-group-demo"]' } },
  25 |   { path: '/coverage?feature=navigation', marker: { selector: '[data-testid="navigation-demo"]' } },
  26 |   { path: '/coverage?feature=feedback', marker: { selector: '[data-testid="feedback-demo"]' } },
  27 |   { path: '/coverage?feature=dialog', marker: { selector: '[data-testid="dialog-demo"]' } },
  28 |   { path: '/coverage/validators', marker: heading('Validator contract demo') },
  29 |   { path: '/coverage/primitives', marker: heading('Primitives coverage demo') },
  30 |   { path: '/coverage/service-contract-a', marker: heading('Service contract A demo') },
  31 |   { path: '/coverage/case-sharing', marker: { selector: 'xuilib-share-case' } },
  32 |   { path: '/coverage/case-sharing/confirmation', marker: heading('Check case sharing changes') },
  33 |   { path: '/coverage/accessibility', marker: { selector: 'xuilib-accessibility' } },
  34 |   { path: '/coverage/accessibility/manage-case', marker: { selector: 'xuilib-accessibility' } },
  35 |   { path: '/coverage/standalone', marker: heading('Standalone component coverage') },
  36 |   { path: '/coverage/extended-controls', marker: heading('Extended control coverage') },
  37 |   { path: '/coverage/lookups', marker: heading('Lookup component demo') },
  38 |   { path: '/coverage/advanced-filter', marker: heading('Advanced filter contracts') },
  39 |   { path: '/coverage/lifecycle', marker: heading('Lifecycle behaviour coverage') },
  40 |   { path: '/coverage/searches', marker: heading('Search component demo') },
  41 |   { path: '/coverage/invitation', marker: heading('Invitation form demo') },
  42 |   { path: '/coverage/form-controls', marker: heading('Form controls demo') },
  43 |   { path: '/coverage/service-selection', marker: heading('Service selection demo') },
  44 |   { path: '/coverage/address', marker: heading('Address demo') },
  45 |   { path: '/coverage/selected-cases', marker: heading('Selected case component demo') },
  46 |   { path: '/coverage/public-contracts', marker: heading('Public component contract demo') },
  47 |   { path: '/coverage/service-contract-b', marker: heading('Service contract B demo') },
  48 |   { path: '/coverage/remaining', marker: heading('Remaining CommonLib coverage') },
  49 |   { path: '/coverage/users', marker: heading('User management demo') },
  50 |   { path: '/coverage/users/user-1', marker: heading('User management demo') }
  51 | ];
  52 | 
  53 | for (const route of routes) {
  54 |   test(`skip link moves focus to the main-content target for ${route.path}`, async ({ page }, testInfo) => {
  55 |     await page.goto(route.path);
  56 |     const actualRoute = new URL(page.url()).pathname + new URL(page.url()).search;
  57 |     expect(actualRoute).toBe(route.path);
  58 | 
  59 |     const skipLink = page.getByRole('link', { name: 'Skip to main content', exact: true });
  60 |     const mainContent = page.locator('#main-content');
  61 |     const marker = page.locator(route.marker.selector);
  62 |     await expect(skipLink).toBeVisible();
  63 |     if (route.marker.text) {
  64 |       const matchingMarker = marker.filter({ hasText: route.marker.text });
  65 |       await expect(matchingMarker).toHaveCount(1);
  66 |     }
  67 |     else {
  68 |       await expect(marker).toHaveCount(1);
  69 |     }
  70 |     await expect(mainContent).toHaveCount(1);
  71 |     await expect(mainContent).toHaveAttribute('tabindex', '-1');
  72 |     expect(await mainContent.evaluate((element) =>
  73 |       element.matches('main, [role="main"]') || Boolean(element.querySelector('main, [role="main"]'))
  74 |     )).toBe(true);
  75 | 
  76 |     await page.keyboard.press('Tab');
  77 |     await expect(skipLink).toBeFocused();
  78 |     await page.keyboard.press('Enter');
  79 |     await expect(mainContent).toBeFocused();
  80 | 
  81 |     const outcomes = await collectAccessibilityEvidence(page, testInfo);
> 82 |     expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
     |                                                                                    ^ Error: A11Y_VIOLATIONS
  83 |   });
  84 | }
  85 | 
```