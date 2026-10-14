const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { parse } = require('node-html-parser');

const { createEmptyFeatureStat, deriveFeatureName, enhanceGeneratedReport } = require('./odhin-report-enhancer.cjs');

function validReport(t) {
  const outputFolder = fs.mkdtempSync(path.join(os.tmpdir(), 'odhin-valid-'));
  t.after(() => fs.rmSync(outputFolder, { recursive: true, force: true }));
  fs.writeFileSync(path.join(outputFolder, 'index.html'), '<html><body>Report</body></html>');
  return outputFolder;
}

test('reporter failures override a passing test run instead of returning false green', async (t) => {
  const Reporter = require('./odhin-adaptive.reporter.cjs');
  const reporter = new Reporter({ outputFolder: validReport(t), profile: false, createInnerReporter: () => ({
    onEnd() { throw new Error('controlled report failure'); },
  }) });
  assert.deepEqual(await reporter.onEnd({ status: 'passed' }), { status: 'failed' });
});

test('reporter runtime hook failures and timeouts fail the final result', async (t) => {
  const Reporter = require('./odhin-adaptive.reporter.cjs');
  for (const invoke of [() => { throw new Error('controlled callback failure'); }, () => new Promise(resolve => setTimeout(resolve, 20))]) {
    const reporter = new Reporter({ outputFolder: validReport(t), profile: false, runtimeHookTimeoutMs: 1, createInnerReporter: () => ({}) });
    await reporter.enqueueInnerCallback('controlled', invoke);
    assert.deepEqual(await reporter.onEnd({ status: 'passed' }), { status: 'failed' });
  }
});

test('reporter preserves inner failure overrides and does not turn failed tests green', async (t) => {
  const Reporter = require('./odhin-adaptive.reporter.cjs');
  const failed = new Reporter({ outputFolder: validReport(t), profile: false, createInnerReporter: () => ({ onEnd: async () => ({ status: 'failed' }) }) });
  assert.deepEqual(await failed.onEnd({ status: 'passed' }), { status: 'failed' });
  const outputFolder = fs.mkdtempSync(path.join(os.tmpdir(), 'odhin-healthy-'));
  t.after(() => fs.rmSync(outputFolder, { recursive: true, force: true }));
  const healthy = new Reporter({ outputFolder, profile: false, createInnerReporter: () => ({ onEnd: async () => {
    fs.writeFileSync(path.join(outputFolder, 'index.html'), '<html><body>Report</body></html>');
    return { status: 'passed' };
  } }) });
  assert.equal(await healthy.onEnd({ status: 'failed' }), undefined);
});

test('missing, empty or wrong primary report fails closed', async (t) => {
  const Reporter = require('./odhin-adaptive.reporter.cjs');
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'odhin-missing-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const mode of ['absent', 'empty', 'wrong']) {
    const outputFolder = path.join(root, mode);
    if (mode !== 'absent') {
      fs.mkdirSync(outputFolder);
      fs.writeFileSync(path.join(outputFolder, mode === 'empty' ? 'required.html' : 'other.html'), mode === 'empty' ? '' : '<html>Other report</html>');
    }
    const reporter = new Reporter({ outputFolder, indexFilename: 'required.html', profile: false,
      createInnerReporter: () => ({ onEnd: async () => undefined }) });
    assert.deepEqual(await reporter.onEnd({ status: 'passed' }), { status: 'failed' }, mode);
  }
});

test('finalisation timeout and enhancement errors fail the run', async (t) => {
  const Reporter = require('./odhin-adaptive.reporter.cjs');
  const slow = new Reporter({ outputFolder: validReport(t), profile: false, finalizationTimeoutMs: 1,
    createInnerReporter: () => ({ onEnd: () => new Promise(resolve => setTimeout(resolve, 20)) }) });
  assert.deepEqual(await slow.onEnd({ status: 'passed' }), { status: 'failed' });
  const outputFolder = validReport(t);
  fs.writeFileSync(path.join(outputFolder, 'presentation'), 'controlled invalid presentation destination');
  const reporter = new Reporter({ outputFolder, profile: false, createInnerReporter: () => ({}) });
  reporter.featureStats.set('feature', createEmptyFeatureStat('feature'));
  assert.deepEqual(await reporter.onEnd({ status: 'passed' }), { status: 'failed' });
});

test('Playwright CLI exits nonzero for a report failure despite a passing test', () => {
  const { spawnSync } = require('node:child_process');
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'odhin-exit-proof-'));
  try {
    const reporterPath = require.resolve('./odhin-adaptive.reporter.cjs');
    const testPath = require.resolve('@playwright/test');
    fs.writeFileSync(path.join(root, 'probe.spec.cjs'), `const { test, expect } = require(${JSON.stringify(testPath)}); test('passing contract', () => expect(2 + 2).toBe(4));`);
    fs.writeFileSync(path.join(root, 'reporter.cjs'), `const fs = require('node:fs'); const path = require('node:path'); const Reporter = require(${JSON.stringify(reporterPath)}); module.exports = class extends Reporter { constructor(options) { super({outputFolder: options.outputFolder, profile:false, createInnerReporter: () => ({ onEnd() { if(options.mode !== 'missing') { fs.mkdirSync(options.outputFolder); fs.writeFileSync(path.join(options.outputFolder, 'index.html'), '<html><body>Report</body></html>'); } if(options.mode === 'throw') throw new Error('controlled report failure'); } })}); } };`);
    for (const mode of ['healthy', 'throw', 'missing']) {
      fs.writeFileSync(path.join(root, 'playwright.config.cjs'), `module.exports = { testDir: ${JSON.stringify(root)}, testMatch: 'probe.spec.cjs', outputDir: ${JSON.stringify(path.join(root, 'results'))}, reporter: [['./reporter.cjs', {mode:${JSON.stringify(mode)},outputFolder:${JSON.stringify(path.join(root, mode))}}]] };`);
      const result = spawnSync(process.execPath, [require.resolve('@playwright/test/cli'), 'test', '-c', path.join(root, 'playwright.config.cjs')], { cwd: root, encoding: 'utf8' });
      assert.equal(result.status, mode === 'healthy' ? 0 : 1, result.stdout + result.stderr);
      if (mode === 'throw') assert.match(result.stderr, /controlled report failure/);
    }
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('derives grouped features from nested Playwright describe titles', () => {
  const titlePath = ['', 'chromium', 'src/app.spec.ts', 'workspace-project App', 'checkbox list component', 'should render every location'];

  assert.equal(
    deriveFeatureName('/workspace/e2e/src/app.spec.ts', titlePath),
    'checkbox list component'
  );
  assert.equal(
    deriveFeatureName('/workspace/e2e/src/app.spec.ts', ['', 'chromium', 'src/app.spec.ts', 'workspace-project App', 'should display welcome message']),
    'app.spec'
  );
});

test('removes the obsolete file chart initializer from external Odhín assets', () => {
  const outputFolder = fs.mkdtempSync(path.join(os.tmpdir(), 'odhin-enhancer-'));
  try {
    fs.mkdirSync(path.join(outputFolder, 'js'));
    fs.writeFileSync(
      path.join(outputFolder, 'index.html'),
      '<html><head><link rel="icon" href="data:image/png;base64,YQ=="></head><body><img src="data:image/png;base64,YQ=="><div class="dashboard-block"><div class="info-box-header">Files Summary</div><canvas id="chart-file"></canvas></div><script src="js/chartjs.js"></script></body></html>'
    );
    fs.writeFileSync(
      path.join(outputFolder, 'js/chartjs.js'),
      "let ctxFile = document.getElementById('chart-file').getContext('2d'); let chartFile = new Chart(ctxFile, { data: { datasets: [] }, options: options }); let ctxProject = document.getElementById('chart-project').getContext('2d');"
    );

    enhanceGeneratedReport(outputFolder, [createEmptyFeatureStat('app.spec')]);

    const html = fs.readFileSync(path.join(outputFolder, 'index.html'), 'utf8');
    const script = fs.readFileSync(path.join(outputFolder, 'js/chartjs.js'), 'utf8');
    assert.match(html, /odhin-feature-summary/);
    assert.doesNotMatch(html, /id="chart-file"/);
    assert.doesNotMatch(script, /chart-file/);
    assert.match(script, /chart-project/);
    assert.match(html, /<link[^>]+href="\.\/presentation\/report\.css"/);
    assert.match(html, /<script[^>]+src="\.\/presentation\/report\.js"/);
    assert.match(fs.readFileSync(path.join(outputFolder, 'presentation', 'report.css'), 'utf8'), /report-metrics/);
    assert.match(fs.readFileSync(path.join(outputFolder, 'presentation', 'report.js'), 'utf8'), /Tests in this run/);
    assert.match(html, /\.\/presentation\/feature\.css/);
    assert.doesNotMatch(html, /id="odhin-enhancer-styles"|data:image\//);
    assert.ok(fs.readFileSync(path.join(outputFolder, 'presentation', 'feature.css'), 'utf8').includes('odhin-feature-summary'));
    const imagePath = parse(html).querySelector('img').getAttribute('src');
    assert.match(imagePath, /^\.\/images\/[a-f0-9]+\.png$/);
    assert.deepEqual(fs.readFileSync(path.join(outputFolder, imagePath)), Buffer.from('a'));
  } finally {
    fs.rmSync(outputFolder, { recursive: true, force: true });
  }
});

test('writes failed stdout and stderr beside Odhín instead of embedding them', async () => {
  const outputFolder = fs.mkdtempSync(path.join(os.tmpdir(), 'odhin-logs-'));
  try {
    const Reporter = require('./odhin-adaptive.reporter.cjs');
    let forwarded;
    const reporter = new Reporter({ outputFolder, testOutput: 'only-on-failure', createInnerReporter: () => ({
      onTestEnd(_test, result) { forwarded = result; },
    }) });
    await reporter.onTestEnd(
      { id: 'test-id', location: { file: '/tests/app.spec.ts' }, retries: 0, titlePath: () => ['app', 'fails'] },
      { status: 'failed', retry: 0, duration: 1, stdout: ['stdout marker'], stderr: ['stderr marker'], errors: [] }
    );
    await reporter.flushInnerCallbacks();
    assert.deepEqual(forwarded.stdout, []);
    assert.deepEqual(forwarded.stderr, []);
    const logPath = path.join(outputFolder, reporter.testMetadata[0].logFileName);
    assert.match(fs.readFileSync(logPath, 'utf8'), /stdout marker[\s\S]*stderr marker/);
  } finally {
    fs.rmSync(outputFolder, { recursive: true, force: true });
  }
});

test('keeps dashboard blocks separate for the fluid WebApp layout', () => {
  const html = '<html><head></head><body><div id="TabDashboard"><div class="container-fluid"><div class="row">' +
    ['Run info', 'Files Summary', 'Global Summary', 'Projects Summary'].map((title) =>
      `<div class="col-12 col-xl-6"><div class="dashboard-block"><div class="info-box-header">${title}</div></div></div>`
    ).join('') + '</div></div></div></body></html>';
  const { enhanceDashboardHtml } = require('./odhin-report-enhancer.cjs');
  const root = parse(enhanceDashboardHtml(html, [createEmptyFeatureStat('app.spec')]));
  assert.equal(root.querySelectorAll('#TabDashboard > .container-fluid > .row > .col-12').length, 4);
});

test('adds feature metadata to native test rows for dashboard drill-down', () => {
  const html = '<html><head></head><body><table id="test-list-table"><thead><tr><th>Title</th></tr></thead><tbody><tr data-bs-target="#test-0"><td>A test</td></tr></tbody><tfoot><tr><th>Title</th></tr></tfoot></table><div id="test-0"><div class="modal-body"></div></div></body></html>';
  const { enhanceDashboardHtml } = require('./odhin-report-enhancer.cjs');
  const root = parse(enhanceDashboardHtml(html, [createEmptyFeatureStat('app.spec')], [], [
    { target: '#test-0', feature: 'app.spec', tags: ['@smoke'], durationMs: 25, retry: 0, logFileName: 'logs/output.log' },
  ]));
  assert.deepEqual(root.querySelectorAll('#test-list-table thead th').map((cell) => cell.text.trim()), ['Title', 'Feature', 'Tags', 'Attempt']);
  assert.deepEqual(root.querySelectorAll('#test-list-table tbody td').map((cell) => cell.text.trim()), ['A test', 'app.spec', '@smoke', '1']);
  assert.equal(root.querySelector('#test-0 .modal-body a')?.getAttribute('href'), './logs/output.log');
});

test('reuses combined WebApp accessibility panels and external per-engine evidence links', () => {
  const { enhanceDashboardHtml } = require('./odhin-report-enhancer.cjs');
  const title = 'Invitation validation';
  const html = `<html><head></head><body><div><table id="test-list-table"><thead><tr><th>Title</th></tr></thead><tbody><tr><td>${title}</td></tr></tbody></table></div><div class="modal-content"><div class="header-col-center">${title}</div><div class="modal-body odhin-bg-2"></div></div></body></html>`;
  const entries = ['summary', 'axe', 'wave-like', 'screen-reader', 'lighthouse'].map((engine) => ({
    engine, testTitle: title, feature: 'Invitation', pageState: 'Invalid form',
    htmlFileName: `${engine}.html`, jsonFileName: `${engine}.json`, screenshotFileName: `${engine}.png`,
    reportFileName: engine === 'lighthouse' ? 'native-lighthouse.html' : '',
    violationCount: 1, rules: ['label'], targets: ['#firstName']
  }));
  const root = parse(enhanceDashboardHtml(html, [], entries));
  const panel = root.querySelector('.odhin-a11y-test-evidence');
  assert.ok(panel, 'native test modal receives the combined evidence panel');
  for (const entry of entries) {
    for (const file of [entry.htmlFileName, entry.jsonFileName, entry.screenshotFileName]) {
      assert.ok(panel.querySelector(`a[href="./accessibility-evidence/${file}"]`), file);
    }
  }
  assert.ok(panel.querySelector('a[href="./accessibility-evidence/native-lighthouse.html"]'));
  assert.equal(root.querySelectorAll('.odhin-a11y-issue-summary tbody tr').length, 4, 'summary does not double count engine issue groups');
  assert.ok(root.querySelector('[data-a11y-issue-filter="label"]'));
  assert.match(panel.text, /Scanner, setup and reporting errors remain blocking/);
  assert.ok(root.querySelector('#TabAccessibility .a11y-workspace'), 'current WebApp combined accessibility workspace is present');
  assert.equal(root.querySelector('#a11y-workspace-script').getAttribute('src'), './presentation/accessibility.js');
});
