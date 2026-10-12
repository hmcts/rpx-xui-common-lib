const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { parse } = require('node-html-parser');

const { createEmptyFeatureStat, deriveFeatureName, enhanceGeneratedReport } = require('./odhin-report-enhancer.cjs');

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
