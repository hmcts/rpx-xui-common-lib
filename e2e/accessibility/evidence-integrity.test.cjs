const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { buildManifest } = require('./combined-manifest.cjs');
const { externaliseHtml } = require('./external-assets.cjs');
const { buildSummary, advisoryExitCode, ASSERTION_MARKER } = require('./report.cjs');

function seed(t, engines = ['axe', 'wave-like', 'screen-reader']) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'a11y-combined-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const dir = path.join(root, 'accessibility-evidence');
  fs.mkdirSync(dir);
  const entries = ['summary', ...engines].map(engine => {
    const entry = { engine, testTitle: '<script>synthetic</script>', status: 'passed', violationCount: 0,
      rules: [], targets: [], htmlFileName: `abc-${engine}.html`, jsonFileName: `abc-${engine}.json`,
      screenshotFileName: `abc-${engine}.png`, ...(engine === 'lighthouse' ? { reportFileName: 'abc-native.html' } : {}) };
    for (const name of [entry.htmlFileName, entry.jsonFileName, entry.screenshotFileName, entry.reportFileName].filter(Boolean)) fs.writeFileSync(path.join(dir, name), '{}');
    fs.writeFileSync(path.join(dir, `manifest-entry-${engine}.json`), JSON.stringify(entry));
    return entry;
  });
  const outcomes = engines.map(engine => ({ engine, status: 'passed', issueCount: 0, rules: [] }));
  const files = { json: path.join(root, 'audit.json'), html: path.join(dir, entries[0].htmlFileName), screenshot: path.join(dir, entries[0].screenshotFileName) };
  const evidence = { outcomes, published: entries[0] };
  fs.writeFileSync(files.json, JSON.stringify(evidence));
  const attempt = { testId: 'test', title: 'test', retry: 0, playwrightStatus: 'passed', errors: [], files };
  return { root, dir, entries, evidence, attempt, summary: buildSummary(root, [attempt], 1) };
}

test('combined manifest requires every executed engine and native Lighthouse evidence', t => {
  for (const engines of [['axe', 'wave-like', 'screen-reader'], ['lighthouse']]) {
    const fixture = seed(t, engines);
    assert.equal(buildManifest(fixture.root, fixture.summary).length, engines.length + 1);
    const last = fixture.entries.at(-1);
    fs.unlinkSync(path.join(fixture.dir, last.reportFileName || last.screenshotFileName));
    assert.throws(() => buildManifest(fixture.root, fixture.summary));
  }
});

test('missing engine, duplicate identity, unsafe link and scanner status fail closed', t => {
  for (const fault of ['missing', 'duplicate', 'unsafe', 'error']) {
    const f = seed(t);
    const entry = { ...f.entries[1] };
    if (fault === 'missing') fs.unlinkSync(path.join(f.dir, 'manifest-entry-axe.json'));
    else {
      if (fault === 'duplicate') entry.htmlFileName = f.entries[0].htmlFileName;
      if (fault === 'unsafe') entry.jsonFileName = '../outside.json';
      if (fault === 'error') entry.status = 'error';
      fs.writeFileSync(path.join(f.dir, 'manifest-entry-axe.json'), JSON.stringify(entry));
    }
    assert.throws(() => buildManifest(f.root, f.summary));
  }
});

test('review-only outcome is not clean; actual findings and engine denominators survive advisory', t => {
  const f = seed(t);
  f.evidence.outcomes[0] = { engine: 'axe', status: 'needs-review', issueCount: 0, rules: [], reviewCount: 2, reviewRules: ['color-contrast'] };
  fs.writeFileSync(f.attempt.files.json, JSON.stringify(f.evidence));
  let summary = buildSummary(f.root, [f.attempt], 1);
  assert.equal(summary.status, 'needs-review');
  assert.deepEqual(summary.engineTotals.axe, { states: 1, issues: 0, reviewNodes: 2 });
  f.evidence.outcomes[1] = { engine: 'wave-like', status: 'issues-found', issueCount: 3, rules: ['label'] };
  fs.writeFileSync(f.attempt.files.json, JSON.stringify(f.evidence));
  summary = buildSummary(f.root, [{ ...f.attempt, playwrightStatus: 'failed', errors: [ASSERTION_MARKER] }], 1, [], 'failed');
  assert.equal(summary.status, 'issues-found');
  assert.equal(summary.engineTotals['wave-like'].issues, 3);
  assert.equal(advisoryExitCode(summary, 1, f.root), 0);
  f.evidence.outcomes[2] = { engine: 'screen-reader', status: 'error', issueCount: 0, rules: [], message: 'CDP failed' };
  fs.writeFileSync(f.attempt.files.json, JSON.stringify(f.evidence));
  assert.equal(advisoryExitCode(summary, 1, f.root), 1);
});

test('summary and detailed engines must share exactly the same journey context', t => {
  const f = seed(t);
  const entry = { ...f.entries[1], context: { persona: 'unexpected different persona' } };
  fs.writeFileSync(path.join(f.dir, 'manifest-entry-axe.json'), JSON.stringify(entry));
  assert.throws(() => buildManifest(f.root, f.summary), /context/);
});

test('external assets preserve executable script order and decoded images without inline payloads', () => {
  const original = '<html><link rel="icon" href=\'data:image/svg+xml;utf8,<svg fill="%23F63"></svg>\'><style>body{color:red}</style><script>window.a=1</script><script>window.b=window.a</script><img src="data:image/png;base64,aGVsbG8="></html>';
  const result = externaliseHtml(original, 'safe-test');
  assert.doesNotMatch(result.html, /<style>|<script>|data:image/);
  assert.match(result.html, /src="safe-test-script-1.js"/);
  assert.match(result.html, /src="safe-test-script-2.js"/);
  assert.equal(result.assets.find(asset => asset.fileName.endsWith('.png')).body.toString(), 'hello');
  assert.equal(result.assets.find(asset => asset.fileName.endsWith('.svg')).body, '<svg fill="#F63"></svg>');
  assert.throws(() => externaliseHtml(original, '../unsafe'));
});
