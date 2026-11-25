const { test } = require('node:test');
const assert = require('node:assert/strict');
const { mkdtempSync, writeFileSync, rmSync, unlinkSync, mkdirSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { spawnSync } = require('node:child_process');
const { join } = require('node:path');
const { buildSummary, advisoryExitCode, ASSERTION_MARKER } = require('./report.cjs');

function seed(t, { violations = [], error = null, status = 'passed', errors = [] } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'commonlib-a11y-test-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const files = { json: join(root, 'axe.json'), html: join(root, 'axe.html'), screenshot: join(root, 'page.png') };
  const evidence = { title: 'Synthetic scan', url: 'https://example.test/', error,
    outcomes: [{ engine: 'axe', status: violations.length ? 'issues-found' : 'passed',
      issueCount: violations.reduce((total, rule) => total + rule.nodes.length, 0), rules: violations.map(rule => rule.id) }] };
  writeFileSync(files.json, JSON.stringify(evidence));
  writeFileSync(files.html, '<h1>Synthetic evidence file</h1>');
  writeFileSync(files.screenshot, 'fake image fixture');
  return { root, evidence, attempt: { testId: 'state-1', title: evidence.title, retry: 0, files, playwrightStatus: status, errors } };
}

const violation = { id: 'button-name', nodes: [{ target: ['#unnamed-button'] }] };

test('clean evidence produces links and an advisory green result', t => {
  const { root, attempt } = seed(t);
  const summary = buildSummary(root, [attempt], 1);
  assert.equal(summary.status, 'clean');
  assert.equal(advisoryExitCode(summary, 0, root), 0);
  assert.equal(summary.entries[0].links.html, 'axe.html');
  assert.equal(summary.entries[0].links.screenshot, 'page.png');
});

test('strict violation failure remains issues-found with actual counts', t => {
  const { root, attempt } = seed(t, { violations: [violation], status: 'failed', errors: [ASSERTION_MARKER] });
  const summary = buildSummary(root, [attempt], 1, [], 'failed');
  assert.equal(summary.status, 'issues-found');
  assert.equal(summary.ruleCount, 1);
  assert.equal(summary.nodeCount, 1);
  assert.equal(advisoryExitCode(summary, 1, root), 0);
});

test('missing evidence, malformed JSON and scan errors block advisory', t => {
  for (const failure of ['missing', 'json', 'scanner']) {
    const { root, attempt } = seed(t, { error: failure === 'scanner' ? 'injection failed' : null });
    if (failure === 'missing') unlinkSync(attempt.files.screenshot);
    if (failure === 'json') writeFileSync(attempt.files.json, '{');
    const summary = buildSummary(root, [attempt], 1);
    assert.equal(summary.status, 'execution-error');
    assert.equal(advisoryExitCode(summary, 1, root), 1);
  }
});

test('setup, skipped, runner and unrelated assertion errors never become product findings', t => {
  const { root, attempt } = seed(t, { violations: [violation], status: 'failed', errors: [ASSERTION_MARKER, 'console error'] });
  for (const sample of [attempt, { ...attempt, files: undefined }, { ...attempt, playwrightStatus: 'skipped' }]) {
    assert.equal(buildSummary(root, [sample], 1).status, 'execution-error');
  }
  assert.equal(buildSummary(root, [], 0).status, 'execution-error');
  assert.equal(buildSummary(root, [attempt], 2).status, 'execution-error');
  assert.equal(buildSummary(root, [], 1, ['global setup failed']).status, 'execution-error');
});

test('retry evidence remains separate; totals use final attempts and never hide execution errors', t => {
  const first = seed(t, { violations: [violation], status: 'failed', errors: [ASSERTION_MARKER] });
  const dir = join(first.root, 'retry-1');
  mkdirSync(dir);
  const files = { json: join(dir, 'axe.json'), html: join(dir, 'axe.html'), screenshot: join(dir, 'page.png') };
  writeFileSync(files.json, JSON.stringify({ outcomes: [{ engine: 'axe', status: 'passed', issueCount: 0, rules: [] }] }));
  writeFileSync(files.html, 'clean'); writeFileSync(files.screenshot, 'screenshot');
  const retry = { ...first.attempt, retry: 1, files, playwrightStatus: 'passed', errors: [] };
  const summary = buildSummary(first.root, [first.attempt, retry], 1);
  assert.equal(summary.entries.length, 2);
  assert.equal(summary.ruleCount, 0);
  assert.notEqual(summary.entries[0].links.html, summary.entries[1].links.html);
  assert.equal(buildSummary(first.root, [{ ...first.attempt, files: undefined }, retry], 1).status, 'execution-error');
});

test('stale runs, out-of-run paths, missing tests and abnormal child exits block', t => {
  const { root, attempt } = seed(t);
  const other = seed(t);
  assert.equal(buildSummary(root, [other.attempt], 1).status, 'execution-error');
  const summary = buildSummary(root, [attempt], 1);
  assert.equal(advisoryExitCode(summary, 0, other.root), 1);
  assert.equal(advisoryExitCode(summary, null, root), 1);
  assert.equal(advisoryExitCode(summary, 2, root), 1);
  assert.equal(buildSummary(root, [attempt], 1, [], 'timedout').status, 'execution-error');
  unlinkSync(attempt.files.html);
  assert.equal(advisoryExitCode(summary, 0, root), 1);
});

test('lane-specific trace and screenshot links survive setup errors; video is excluded', t => {
  const { root, attempt } = seed(t);
  const trace = join(root, 'trace.zip');
  const screenshot = join(root, 'failure.jpg');
  writeFileSync(trace, 'fake trace fixture');
  writeFileSync(screenshot, 'fake screenshot fixture');
  const diagnostics = [
    { name: 'trace', path: trace, contentType: 'application/zip' },
    { name: 'screenshot', path: screenshot, contentType: 'image/jpeg' },
    { name: 'video', path: join(root, 'video.webm'), contentType: 'video/webm' },
  ];
  const summary = buildSummary(root, [{ ...attempt, files: undefined, diagnostics }], 1);
  assert.equal(summary.status, 'execution-error');
  assert.equal(summary.entries[0].links['trace-1'], 'trace.zip');
  assert.equal(summary.entries[0].links['screenshot-2'], 'failure.jpg');
  assert(!Object.values(summary.entries[0].links).includes('video.webm'));
  unlinkSync(trace);
  assert.match(buildSummary(root, [{ ...attempt, diagnostics }], 1).entries[0].error, /Missing diagnostic evidence/);
});

test('advisory wrapper refuses a stale or concurrently owned explicit output directory', t => {
  const { root } = seed(t);
  const result = spawnSync(process.execPath, [join(__dirname, 'run-advisory.cjs')], {
    env: { ...process.env, COMMONLIB_A11Y_RUN_DIR: root }, encoding: 'utf8',
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /EEXIST/);
  assert.doesNotMatch(result.stdout, /Running \d+ test/);
});

test('strict CLI also refuses a reused explicit run directory before executing tests', t => {
  const { root } = seed(t);
  const result = spawnSync(process.execPath, [require.resolve('@playwright/test/cli'), 'test',
    '-c', 'playwright.accessibility.config.ts', '--list'], {
    env: { ...process.env, COMMONLIB_A11Y_RUN_DIR: root }, encoding: 'utf8',
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /EEXIST/);
});
