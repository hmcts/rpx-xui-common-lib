import { test, expect } from '@playwright/test';
import { collectAccessibilityEvidence } from '../accessibilityAudit';
import { ASSERTION_MARKER } from '../report.cjs';
import { scannerFixture, descriptionFixture } from './scanner.fixture';
import { collectDescriptionViolations } from '../description-contract';

test('controlled axe fixture', async ({ page }, testInfo) => {
  await page.setContent(scannerFixture(process.env.A11Y_SELF_CHECK_FAULT === '1'));
  await expect(page.getByRole('heading', { name: 'Scanner self-check' })).toBeVisible();
  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});

for (const state of ['initial', 'errors', 'cleared'] as const) {
  test(`component descriptions — ${state}`, async ({ page }, testInfo) => {
    await page.setContent(descriptionFixture(state, process.env.A11Y_DESCRIPTION_FAULT === '1' ? 'missing' : ''));
    const outcomes = await collectAccessibilityEvidence(page, testInfo, [{
      selector: '#notes', describedBy: `notes-hint${state === 'errors' ? ' notes-error' : ''}`,
      targets: [{ id: 'notes-hint', text: 'Synthetic hint.' }, ...(state === 'errors' ? [{ id: 'notes-error', text: 'Error:Enter notes' }] : [])],
      absentIds: state === 'errors' ? [] : ['notes-error']
    }]);
    expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
  });
}

test('component description isolates faults and setup errors then recovers cleanly', async ({ page }, testInfo) => {
  for (const fault of ['missing', 'attribute', 'text', 'stale']) {
    await page.setContent(descriptionFixture('cleared', fault));
    const findings = await collectDescriptionViolations(page, [{ selector: '#notes', describedBy: 'notes-hint',
      targets: [{ id: 'notes-hint', text: 'Synthetic hint.' }], absentIds: ['notes-error'] }]);
    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({ rule: 'component-description', selector: '#notes' });
    expect(findings[0].message).toContain(fault === 'missing' ? 'missing target' : fault === 'attribute' ? 'aria-describedby' : fault === 'text' ? 'Wrong hint' : 'to be absent');
  }
  await page.setContent(descriptionFixture('initial'));
  await expect(collectDescriptionViolations(page, [{ selector: '#absent', describedBy: '', targets: [], absentIds: [] }]))
    .rejects.toThrow('Description contract setup: missing control #absent');
  const outcomes = await collectAccessibilityEvidence(page, testInfo);
  expect(outcomes.filter((outcome) => outcome.issueCount > 0), ASSERTION_MARKER).toEqual([]);
});
