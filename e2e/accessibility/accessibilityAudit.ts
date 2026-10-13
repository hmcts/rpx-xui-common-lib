import AxeBuilder from '@axe-core/playwright';
import type { Page, TestInfo } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { publishAccessibilityEvidence, AccessibilityEngine, PublishedAccessibilityEvidenceEntry } from './accessibilityEvidencePublisher';
import { collectWaveLikeAccessibilityViolations, attachWaveLikeAccessibilityEvidence } from './waveLikeAccessibility';
import { collectScreenReaderLikeAccessibilityViolations, attachScreenReaderLikeAccessibilityEvidence,
  attachAccessibilityPageSummaryEvidence } from './screenReaderLikeAccessibility';
import { buildIssueSummaryHtml, markViolationsOnPage } from './axeIssueRendering';

export interface EngineOutcome {
  engine: AccessibilityEngine;
  status: 'passed' | 'issues-found' | 'needs-review' | 'error';
  issueCount: number;
  rules: string[];
  message?: string;
  reviewCount?: number;
  reviewRules?: string[];
}
export type AccessibilityCheckOutcome = { name: string; status: 'passed' | 'failed'; message?: string };

// Collection only. Strict assertions are owned by the specs, including controlled red proof.
export async function collectAccessibilityEvidence(page: Page, testInfo: TestInfo) {
  const [feature, pageState = testInfo.title] = testInfo.title.split(' — ');
  const context = { feature, pageState };
  const outcomes: EngineOutcome[] = [];
  let axeResults: Awaited<ReturnType<AxeBuilder['analyze']>>;
  for (const engine of ['axe', 'wave-like', 'screen-reader'] as const) {
    try {
      if (engine === 'axe') {
        axeResults = await new AxeBuilder({ page }).analyze();
        const cleanup = await markViolationsOnPage(page, [...axeResults.violations, ...axeResults.incomplete]);
        let screenshot: Buffer;
        try {
          screenshot = await page.screenshot({ fullPage: true });
        } finally {
          await cleanup();
        }
        await publishAccessibilityEvidence(testInfo, {
          attachmentPrefix: engine, entry: { engine, ...context,
            status: axeResults.violations.length ? 'issues-found' : axeResults.incomplete.length ? 'needs-review' : 'passed',
            reviewCount: axeResults.incomplete.reduce((sum, rule) => sum + rule.nodes.length, 0),
            reviewRules: axeResults.incomplete.map((rule) => rule.id),
            findings: axeResults.violations.map((rule, index) => ({ rule: rule.id,
              targets: rule.nodes.map((node) => JSON.stringify(node.target)), summary: rule.help, anchor: `issue-${index + 1}` })),
            violationCount: axeResults.violations.reduce((sum, rule) => sum + rule.nodes.length, 0),
            rules: axeResults.violations.map((rule) => rule.id),
            targets: axeResults.violations.flatMap((rule) => rule.nodes.map((node) => JSON.stringify(node.target))) },
          html: buildIssueSummaryHtml(axeResults), json: axeResults, screenshot
        });
        outcomes.push({ engine, status: axeResults.violations.length ? 'issues-found' : axeResults.incomplete.length ? 'needs-review' : 'passed',
          reviewCount: axeResults.incomplete.reduce((sum, rule) => sum + rule.nodes.length, 0), reviewRules: axeResults.incomplete.map((rule) => rule.id),
          issueCount: axeResults.violations.reduce((sum, rule) => sum + rule.nodes.length, 0), rules: axeResults.violations.map((rule) => rule.id) });
      } else if (engine === 'wave-like') {
        const violations = await collectWaveLikeAccessibilityViolations(page);
        await attachWaveLikeAccessibilityEvidence(page, testInfo, violations, engine, { engine, ...context });
        outcomes.push({ engine, status: violations.length ? 'issues-found' : 'passed', issueCount: violations.length,
          rules: [...new Set(violations.map((violation) => violation.rule))] });
      } else {
        const evidence = await collectScreenReaderLikeAccessibilityViolations(page);
        await attachScreenReaderLikeAccessibilityEvidence(page, testInfo, evidence, engine, { engine, ...context });
        outcomes.push({ engine, status: evidence.violations.length ? 'issues-found' : 'passed', issueCount: evidence.violations.length,
          rules: [...new Set(evidence.violations.map((violation) => violation.rule))] });
      }
    } catch (error) {
      outcomes.push({ engine, status: 'error', issueCount: 0, rules: [], message: String(error) });
    }
  }
  const published = await attachAccessibilityPageSummaryEvidence(page, testInfo, { ...context, strict: true, url: page.url(), outcomes });
  await attachRunEvidence(page, testInfo, outcomes, published, axeResults?.incomplete.length ?? 0);
  const errors = outcomes.filter((outcome) => outcome.status === 'error');
  if (errors.length) {
    throw new Error(`Accessibility scanner/report error: ${JSON.stringify(errors)}`);
  }
  return outcomes;
}

export async function attachRunEvidence(page: Page, testInfo: TestInfo, outcomes: EngineOutcome[],
  published: PublishedAccessibilityEvidenceEntry, incompleteCount = 0) {
  const evidenceDir = join(process.env.COMMONLIB_A11Y_ACTIVE_RUN_DIR, 'accessibility-evidence');
  const files = { json: testInfo.outputPath('audit.json'), html: join(evidenceDir, published.htmlFileName), screenshot: join(evidenceDir, published.screenshotFileName) };
  const audit = { project: testInfo.project.name, browserVersion: page.context().browser()?.version(), viewport: page.viewportSize(),
    retry: testInfo.retry, repeatEachIndex: testInfo.repeatEachIndex, scope: 'Full-page. All default axe rules; WebApp WAVE-like and screen-reader-like heuristics. No exclusions or known-violation waivers.' };
  await writeFile(files.json, JSON.stringify({ title: testInfo.title, url: page.url(), audit, outcomes, incompleteCount,
    published }, null, 2));
  await testInfo.attach('a11y-evidence', { body: JSON.stringify(files), contentType: 'application/json' });
}
