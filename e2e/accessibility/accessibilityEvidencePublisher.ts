import type { TestInfo } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { externaliseHtml } from './external-assets.cjs';

export type AccessibilityEngine = 'axe' | 'wave-like' | 'screen-reader' | 'lighthouse';
export type AccessibilityContext = { scenarioId?: string; persona?: string; language?: string; authentication?: string; dataMode?: string };
export function formatAccessibilityContext(context?: AccessibilityContext): string {
  return Object.entries(context ?? {}).map(([key, value]) => `${key}: ${value}`).join(' / ');
}
export interface PublishedAccessibilityEvidenceEntry {
  context?: AccessibilityContext;
  engine: AccessibilityEngine | 'summary';
  feature?: string;
  pageState?: string;
  testTitle: string;
  attachmentPrefix: string;
  htmlFileName: string;
  jsonFileName: string;
  screenshotFileName: string;
  violationCount: number;
  reviewCount?: number;
  reviewRules?: string[];
  findings?: { rule: string; targets: string[]; summary?: string; anchor?: string }[];
  status?: string;
  summary?: string;
  rules: string[];
  targets: string[];
  reportFileName?: string;
  assetFileNames?: string[];
  url?: string;
}

// WebApp manifest schema, but each test attempt exclusively owns its entry and assets.
// The coordinator builds the aggregate manifest once; workers never race on it.
export async function publishAccessibilityEvidence(testInfo: TestInfo, evidence: {
  attachmentPrefix: string;
  entry: Omit<PublishedAccessibilityEvidenceEntry, 'testTitle' | 'attachmentPrefix' | 'htmlFileName' | 'jsonFileName' | 'screenshotFileName'>;
  html: string;
  json: unknown;
  screenshot: Buffer;
  screenshotSuffix?: string;
  nativeReport?: string;
}): Promise<PublishedAccessibilityEvidenceEntry> {
  const runDir = process.env.COMMONLIB_A11Y_ACTIVE_RUN_DIR;
  if (!runDir) {
    throw new Error('Accessibility run directory was not reserved');
  }
  const evidenceDir = join(runDir, 'accessibility-evidence');
  const identity = createHash('sha256').update(`${testInfo.testId}|${testInfo.project.name}|${testInfo.retry}|${testInfo.repeatEachIndex}`).digest('hex').slice(0, 20);
  const base = `${identity}-${sanitiseFileName(evidence.attachmentPrefix)}`;
  const entry: PublishedAccessibilityEvidenceEntry = {
    context: { scenarioId: testInfo.testId, persona: 'synthetic demo user', language: 'en', authentication: 'none', dataMode: 'local synthetic fixtures' },
    ...evidence.entry, testTitle: testInfo.title, attachmentPrefix: evidence.attachmentPrefix,
    status: evidence.entry.status ?? (evidence.entry.violationCount ? 'issues-found' : 'passed'),
    htmlFileName: `${base}.html`, jsonFileName: `${base}.json`, screenshotFileName: `${base}.png`,
    ...(evidence.nativeReport ? { reportFileName: `${base}-native.html` } : {})
  };
  if (!entry.context) {
    entry.context = { scenarioId: testInfo.testId, persona: 'synthetic demo user', language: 'en', authentication: 'none', dataMode: 'local synthetic fixtures' };
  }
  const violations = (evidence.json as { violations?: { rule?: string; selector?: string; message?: string }[] }).violations;
  if (!entry.findings && violations) {
    entry.findings = violations.map((violation, index) => ({ rule: violation.rule ?? 'unknown',
      targets: violation.selector ? [violation.selector] : [], summary: violation.message, anchor: `issue-${index + 1}` }));
  }
  await mkdir(evidenceDir, { recursive: true });
  const rendered = externaliseHtml(evidence.html.replaceAll('__SCREENSHOT__', entry.screenshotFileName)
    .replaceAll('__NATIVE_REPORT__', entry.reportFileName ?? ''), base);
  const native = evidence.nativeReport ? externaliseHtml(evidence.nativeReport, `${base}-native`) : undefined;
  const assets = [...rendered.assets, ...(native?.assets ?? [])];
  entry.assetFileNames = assets.map((asset) => asset.fileName);
  for (const asset of assets) {
    await writeFile(join(evidenceDir, asset.fileName), asset.body, { flag: 'wx' });
  }
  await writeFile(join(evidenceDir, entry.htmlFileName), rendered.html, { flag: 'wx' });
  await writeFile(join(evidenceDir, entry.jsonFileName), JSON.stringify(evidence.json, null, 2), { flag: 'wx' });
  await writeFile(join(evidenceDir, entry.screenshotFileName), evidence.screenshot, { flag: 'wx' });
  if (evidence.nativeReport) {
    await writeFile(join(evidenceDir, entry.reportFileName), native.html, { flag: 'wx' });
  }
  await writeFile(join(evidenceDir, `manifest-entry-${base}.json`), JSON.stringify(entry, null, 2), { flag: 'wx' });
  return entry;
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;' }[character]));
}
export function escapeAttribute(value: string): string {
  return escapeHtml(value).replaceAll('`', '&#96;');
}
export function sanitiseFileName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').slice(0, 100) || 'accessibility';
}
