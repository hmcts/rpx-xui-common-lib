const { spawnSync } = require('node:child_process');
const { readFileSync, statSync } = require('node:fs');
const { join } = require('node:path');
const { advisoryExitCode } = require('./report.cjs');
const { createRunDirectory } = require('./run-directory.cjs');
const { buildManifest } = require('./combined-manifest.cjs');

const runDir = createRunDirectory('test-results/accessibility');
console.log(`Accessibility run: ${runDir}`);
const result = spawnSync(process.execPath, [require.resolve('@playwright/test/cli'), 'test', '-c',
  'playwright.accessibility.config.ts', ...process.argv.slice(2)], {
  stdio: 'inherit', env: { ...process.env, COMMONLIB_A11Y_RUN_DIR: runDir },
});
try {
  if (result.error) throw result.error;
  for (const report of ['index.html', 'playwright-report/index.html', 'junit.xml']) {
    if (!statSync(join(runDir, report)).size) throw new Error(`Missing accessibility report: ${report}`);
  }
  const summary = JSON.parse(readFileSync(join(runDir, 'summary.json'), 'utf8'));
  buildManifest(runDir, summary);
  process.exitCode = advisoryExitCode(summary, result.status, runDir);
  console.log(`Advisory gate: ${summary.status}; ${summary.ruleCount} rule occurrences, ${summary.nodeCount} finding occurrences (not unique defects). Evidence: ${runDir}`);
  console.log(`Engine denominators and findings: ${JSON.stringify(summary.engineTotals)}`);
} catch (error) {
  console.error(`Accessibility execution/report error: ${error.message}`);
  process.exitCode = 1;
}
