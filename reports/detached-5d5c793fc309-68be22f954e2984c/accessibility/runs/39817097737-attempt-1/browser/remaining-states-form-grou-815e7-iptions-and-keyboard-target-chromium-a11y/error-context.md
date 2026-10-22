# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: remaining-states.spec.ts >> form-group wrapper exposes its group name, descriptions and keyboard target
- Location: e2e/accessibility/remaining-states.spec.ts:18:5

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
  - generic [ref=e4]:
    - banner [ref=e5]:
      - heading "CommonLib component coverage examples" [level=1] [ref=e6]
    - main [ref=e7]:
      - group "Wrapped options" [ref=e12]:
        - text: The wrapper owns this hint.
        - generic [ref=e15]:
          - generic [ref=e16]: "Error:"
          - text: Choose at least one option
        - text: Wrapped option
        - checkbox "Wrapped option" [checked] [active] [ref=e17]
```

# Test source

```ts
  1  | import { expect } from '@playwright/test';
  2  | import { test } from '../src/browser-diagnostics.fixture';
  3  | import { mockLookupHttp } from '../src/lookups.mock';
  4  | import { collectAccessibilityEvidence } from './accessibilityAudit';
  5  | import { ASSERTION_MARKER } from './report.cjs';
  6  | 
  7  | test('remaining terms states expose the selected content in the browser accessibility tree', async ({ page }, testInfo) => {
  8  |   await page.goto('/coverage?feature=terms-html');
  9  |   const main = page.locator('[role="main"]');
  10 |   await expect(main.getByRole('heading', { name: 'HTML terms', exact: true })).toBeVisible();
  11 |   await expect(await main.ariaSnapshot()).toContain('heading "HTML terms"');
  12 |   await expect(main.locator('script')).toHaveCount(0);
  13 | 
  14 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  15 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  16 | });
  17 | 
  18 | test('form-group wrapper exposes its group name, descriptions and keyboard target', async ({ page }, testInfo) => {
  19 |   await page.goto('/coverage?feature=form-group');
  20 |   const group = page.getByRole('group', { name: 'Wrapped options', exact: true });
  21 |   const checkbox = page.getByRole('checkbox', { name: 'Wrapped option', exact: true });
  22 | 
  23 |   await expect(group).toHaveAccessibleName('Wrapped options');
  24 |   await expect(group).toHaveAccessibleDescription(/The wrapper owns this hint/);
  25 |   await expect(group).toHaveAttribute('aria-describedby', /wrapped-options-hint/);
  26 |   await expect(group).toHaveAttribute('aria-describedby', /wrapped-options-error/);
  27 |   await checkbox.focus();
  28 |   await expect(checkbox).toBeFocused();
  29 |   await page.keyboard.press('Space');
  30 |   await expect(checkbox).toBeChecked();
  31 | 
  32 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
> 33 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
     |                                                                                  ^ Error: A11Y_VIOLATIONS
  34 | });
  35 | 
  36 | test('direct SearchWorkType exposes options and a keyboard selection contract', async ({ page }, testInfo) => {
  37 |   await mockLookupHttp(page);
  38 |   await page.goto('/coverage/lookups?feature=search-work-type');
  39 |   const input = page.locator('#inputWorkTypeSearch');
  40 | 
  41 |   await input.fill('Review');
  42 |   const option = page.getByRole('option', { name: 'Review case', exact: true });
  43 |   await expect(option).toBeVisible();
  44 |   await expect(await page.locator('body').ariaSnapshot()).toContain('option "Review case"');
  45 | 
  46 |   await input.press('ArrowDown');
  47 |   await input.press('Enter');
  48 |   await expect(page.getByTestId('direct-work-type-selection')).toContainText('review');
  49 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  50 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  51 | });
  52 | 
  53 | test('validator states retain semantic headings and keyboard-accessible transitions', async ({ page }, testInfo) => {
  54 |   await page.goto('/coverage/validators');
  55 |   await expect(page.getByRole('heading', { name: 'Date validator', exact: true })).toBeVisible();
  56 |   await expect(page.getByRole('heading', { name: 'Radio-group validator', exact: true })).toBeVisible();
  57 |   await expect(page.getByRole('heading', { name: 'Checkbox validator', exact: true })).toBeVisible();
  58 | 
  59 |   const dateStatus = page.getByTestId('date-validator-status');
  60 |   await expect(dateStatus).toHaveText('invalid');
  61 |   await page.getByRole('button', { name: 'Set valid date' }).focus();
  62 |   await expect(page.getByRole('button', { name: 'Set valid date' })).toBeFocused();
  63 |   await page.keyboard.press('Enter');
  64 |   await expect(dateStatus).toHaveText('valid');
  65 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  66 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  67 | });
  68 | 
  69 | test('session dialog exposes a modal dialog and accepts keyboard focus', async ({ page }, testInfo) => {
  70 |   await page.goto('/coverage?feature=dialog');
  71 |   const dialog = page.getByRole('dialog');
  72 |   await expect(dialog).toBeVisible();
  73 |   await expect(dialog).toHaveAttribute('aria-modal', 'true');
  74 |   await expect(dialog).toContainText('We are about to sign you out');
  75 |   await dialog.focus();
  76 |   await expect(dialog).toBeFocused();
  77 |   await expect(await dialog.ariaSnapshot()).toContain('We are about to sign you out');
  78 |   const outcomes = await collectAccessibilityEvidence(page, testInfo);
  79 |   expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  80 | });
  81 | 
```