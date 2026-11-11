import type { Page, TestInfo } from '@playwright/test';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { publishAccessibilityEvidence } from './accessibilityEvidencePublisher';
import { buildLighthouseSummaryHtml } from './lighthouseRendering';
import { attachAccessibilityPageSummaryEvidence } from './screenReaderLikeAccessibility';
import { attachRunEvidence, EngineOutcome } from './accessibilityAudit';

export async function collectLighthouseEvidence(page: Page, port: number, testInfo: TestInfo) {
  const jsonPath = testInfo.outputPath('lighthouse.json');
  const htmlPath = testInfo.outputPath('lighthouse-native.html');
  const [feature, pageState = testInfo.title] = testInfo.title.split(' — ');
  const context = { feature, pageState };
  let outcome: EngineOutcome;
  try {
    await promisify(execFile)(process.execPath, [join(__dirname, 'lighthouse-runner.cjs'), page.url(), String(port), jsonPath, htmlPath],
      { timeout: 60_000, maxBuffer: 4 * 1024 * 1024 });
    const lhr = JSON.parse(await readFile(jsonPath, 'utf8'));
    const audits = Object.values(lhr.audits) as { id: string; score: number | null; scoreDisplayMode: string }[];
    const failed = audits.filter((audit) => audit.score !== null && audit.score < 1 && audit.scoreDisplayMode !== 'manual');
    const score = lhr.categories.accessibility.score * 100;
    outcome = { engine: 'lighthouse', status: failed.length || score < 90 ? 'issues-found' : 'passed',
      issueCount: failed.length || (score < 90 ? 1 : 0), rules: failed.map((audit) => audit.id),
      message: `Accessibility score ${score}; WebApp reference threshold 90. All failed audits remain findings even above the threshold.` };
    await publishAccessibilityEvidence(testInfo, {
      attachmentPrefix: 'lighthouse', entry: { engine: 'lighthouse', ...context, violationCount: outcome.issueCount,
        rules: outcome.rules, targets: [page.url()], status: outcome.status, summary: outcome.message },
      html: buildLighthouseSummaryHtml({ ...context, url: page.url(), message: outcome.message }, '__NATIVE_REPORT__'),
      json: lhr, screenshot: await page.screenshot({ fullPage: true }), nativeReport: await readFile(htmlPath, 'utf8')
    });
  } catch (error) {
    outcome = { engine: 'lighthouse', status: 'error', issueCount: 0, rules: [], message: String(error) };
  }
  const published = await attachAccessibilityPageSummaryEvidence(page, testInfo, { ...context, strict: true, url: page.url(), outcomes: [outcome] });
  await attachRunEvidence(page, testInfo, [outcome], published);
  if (outcome.status === 'error') {
    throw new Error(`Lighthouse scanner/report error: ${outcome.message}`);
  }
  return outcome;
}
