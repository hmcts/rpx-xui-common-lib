import type { FullConfig, FullResult, Reporter, Suite, TestCase, TestError, TestResult } from '@playwright/test/reporter';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildSummary } from './report.cjs';
import { buildManifest } from './combined-manifest.cjs';
// Reuse the repository's Odhín renderer, including current-master accessibility UI.
import OdhinReporter from '../reporters/odhin-adaptive.reporter.cjs';

export default class AccessibilityReporter extends OdhinReporter implements Reporter {
  private attempts: { testId: string; title: string; retry: number; playwrightStatus: string;
    errors: string[]; files?: { json: string; html: string; screenshot: string };
    diagnostics: { name: string; path?: string; contentType: string }[] }[] = [];

  private errors: string[] = [];
  private expectedTests = 0;
  constructor(private options: { runDir: string }) {
    super({ outputFolder: options.runDir, indexFilename: 'index.html', title: 'CommonLib combined accessibility',
      project: 'CommonLib accessibility', testEnvironment: 'synthetic demo', embedAssets: false,
      embedAttachments: false, startServer: false, testOutput: 'only-on-failure' });
  }

  async onBegin(_config: FullConfig, suite: Suite) {
    this.expectedTests = suite.allTests().length;
    await super.onBegin(_config, suite);
  }

  onError(error: TestError) {
    this.errors.push(error.message ?? 'Unknown runner error');
  }

  async onTestEnd(test: TestCase, result: TestResult) {
    const attachment = result.attachments.find((item) => item.name === 'a11y-evidence');
    let files;
    try {
      files = attachment?.body ? JSON.parse(attachment.body.toString()) : undefined;
    } catch {
      this.errors.push(`Malformed evidence manifest: ${test.title}`);
    }
    this.attempts.push({ testId: test.id, title: test.title, retry: result.retry,
      playwrightStatus: result.status, errors: result.errors.map((error) => error.message ?? 'Unknown test error'), files,
      diagnostics: result.attachments.filter((item) => item.name === 'trace' || item.contentType.startsWith('image/')) });
    await super.onTestEnd(test, result);
  }

  async onEnd(result: FullResult) {
    try {
      const summary = buildSummary(this.options.runDir, this.attempts, this.expectedTests, this.errors, result.status);
      mkdirSync(this.options.runDir, { recursive: true });
      try {
        const entries = buildManifest(this.options.runDir, summary);
        writeFileSync(join(this.options.runDir, 'accessibility-evidence/manifest.json'), JSON.stringify(entries, null, 2));
      } catch (error) {
        summary.status = 'execution-error';
        summary.executionErrors.push(`Combined evidence publication: ${String(error)}`);
      }
      const reportOutcome = await super.onEnd(result);
      if (reportOutcome?.status === 'failed') {
        summary.status = 'execution-error';
        summary.executionErrors.push('Odhín runtime/finalisation failed');
      }
      writeFileSync(join(this.options.runDir, 'summary.json'), JSON.stringify(summary, null, 2));
      console.log(`Accessibility ${summary.status}: ${join(this.options.runDir, 'index.html')}`);
      return summary.status === 'execution-error' ? { status: 'failed' as const } : undefined;
    } catch (error) {
      console.error('Accessibility reporting failed', error);
      return { status: 'failed' as const };
    }
  }
}
