const fs = require('node:fs');
const path = require('node:path');

const ASSERTION_MARKER = 'A11Y_VIOLATIONS';
const LIMITATION = 'Automated axe and Lighthouse audits plus WebApp WAVE-like and screen-reader-like heuristics. Not official WAVE, NVDA or JAWS. No automated result establishes WCAG conformance. Advisory product findings remain visible and tracked; execution/report errors block. Incomplete checks need human investigation.';

function inspectAttempt(runDir, attempt) {
  const entry = { ...attempt, status: 'execution-error', ruleCount: 0, nodeCount: 0, incompleteCount: 0, rules: [], links: {} };
  try {
    if (!attempt.files) throw new Error('Missing a11y evidence attachment (setup or scan did not complete)');
    for (const kind of ['json', 'html', 'screenshot']) {
      const file = attempt.files[kind];
      const relative = path.relative(runDir, file);
      if (relative.startsWith('..') || path.isAbsolute(relative) || !fs.statSync(file).size) {
        throw new Error(`Missing or out-of-run ${kind} evidence`);
      }
      entry.links[kind] = relative.split(path.sep).map(encodeURIComponent).join('/');
    }
    const evidence = JSON.parse(fs.readFileSync(attempt.files.json, 'utf8'));
    entry.url = evidence.url;
    entry.audit = evidence.audit;
    if (evidence.error) throw new Error(`Scanner error: ${evidence.error}`);
    if (!Array.isArray(evidence.outcomes) || !evidence.outcomes.length) throw new Error('Missing engine outcomes');
    entry.outcomes = evidence.outcomes;
    for (const outcome of evidence.outcomes) {
      if (!['passed', 'issues-found', 'needs-review'].includes(outcome.status) || !Number.isInteger(outcome.issueCount) || outcome.issueCount < 0 || !Array.isArray(outcome.rules)) {
        throw new Error(`Scanner error or invalid outcome: ${JSON.stringify(outcome)}`);
      }
    }
    entry.rules = evidence.outcomes.flatMap(outcome => outcome.rules.map(rule => `${outcome.engine}:${rule}`));
    entry.ruleCount = entry.rules.length;
    entry.nodeCount = evidence.outcomes.reduce((sum, outcome) => sum + outcome.issueCount, 0);
    entry.incompleteCount = evidence.incompleteCount ?? 0;
    entry.reviewCount = evidence.outcomes.reduce((sum, outcome) => sum + (outcome.reviewCount ?? 0), 0);
    const violationFailure = attempt.playwrightStatus === 'failed' && attempt.errors.length > 0 && attempt.errors.every(error => error.includes(ASSERTION_MARKER));
    if (entry.nodeCount && violationFailure) entry.status = 'issues-found';
    else if (!entry.nodeCount && attempt.playwrightStatus === 'passed' && !attempt.errors.length) entry.status = entry.reviewCount ? 'needs-review' : 'clean';
    else throw new Error('Unexpected combined audit test outcome');
  } catch (error) {
    entry.error = error.message;
  }
  // Keep failure diagnostics available even when setup prevented an axe scan.
  for (const [index, diagnostic] of (attempt.diagnostics ?? []).entries()) {
    if (!diagnostic.path || !(diagnostic.name === 'trace' || diagnostic.contentType.startsWith('image/'))) continue;
    try {
      const relative = path.relative(runDir, diagnostic.path);
      if (relative.startsWith('..') || path.isAbsolute(relative) || !fs.statSync(diagnostic.path).size) throw new Error('Invalid diagnostic file');
      entry.links[`${diagnostic.name}-${index + 1}`] = relative.split(path.sep).map(encodeURIComponent).join('/');
    } catch (error) {
      entry.status = 'execution-error';
      entry.error = `Missing diagnostic evidence: ${error.message}`;
    }
  }
  return entry;
}

function buildSummary(runDir, attempts, expectedTests, errors = [], runnerStatus = 'passed') {
  const entries = attempts.map(attempt => inspectAttempt(runDir, attempt));
  const executionErrors = [...errors];
  const completed = new Set(entries.map(entry => entry.testId)).size;
  if (!expectedTests || completed !== expectedTests) executionErrors.push(`Expected ${expectedTests} tests; received ${completed}`);
  if (['interrupted', 'timedout'].includes(runnerStatus)) executionErrors.push(`Runner ${runnerStatus}`);
  if (runnerStatus === 'failed' && !entries.some(entry => entry.status !== 'clean')) executionErrors.push('Runner failed outside axe assertions');
  const latest = new Map();
  for (const entry of entries) latest.set(entry.testId, entry);
  const finalEntries = [...latest.values()];
  const status = executionErrors.length || entries.some(entry => entry.status === 'execution-error') ? 'execution-error'
    : finalEntries.some(entry => entry.status === 'issues-found') ? 'issues-found'
      : finalEntries.some(entry => entry.status === 'needs-review') ? 'needs-review' : 'clean';
  const engineTotals = {};
  for (const entry of finalEntries) for (const outcome of entry.outcomes ?? []) {
    const total = engineTotals[outcome.engine] ??= { states: 0, issues: 0, reviewNodes: 0 };
    total.states += 1; total.issues += outcome.issueCount; total.reviewNodes += outcome.reviewCount ?? 0;
  }
  return {
    schemaVersion: 1, generatedAt: new Date().toISOString(), runDir, status, expectedTests, completedTests: completed,
    ruleCount: finalEntries.reduce((sum, entry) => sum + entry.ruleCount, 0),
    nodeCount: finalEntries.reduce((sum, entry) => sum + entry.nodeCount, 0),
    incompleteCount: finalEntries.reduce((sum, entry) => sum + entry.incompleteCount, 0),
    executionErrors, entries, engineTotals, limitation: LIMITATION,
  };
}

function advisoryExitCode(summary, childExitCode, runDir) {
  if (![0, 1].includes(childExitCode) || summary.runDir !== runDir || !['clean', 'issues-found', 'needs-review'].includes(summary.status)) return 1;
  if (!summary.expectedTests || summary.completedTests !== summary.expectedTests || !summary.entries?.length) return 1;
  const verified = buildSummary(runDir, summary.entries, summary.expectedTests, summary.executionErrors, childExitCode ? 'failed' : 'passed');
  return verified.status === 'execution-error' ? 1 : 0;
}

module.exports = { ASSERTION_MARKER, inspectAttempt, buildSummary, advisoryExitCode };
