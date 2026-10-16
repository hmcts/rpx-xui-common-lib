const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');
const { publishReport, slugifyBranch } = require('./odhin-site-publisher.cjs');

const assetPaths = [
  'presentation/report.css',
  'presentation/feature.css',
  'presentation/report.js',
  'js/chartjs.js',
  'images/chart.png',
  'screenshots/test.png',
  'traces/trace.zip',
  'logs/browser.log'
];

function digest(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function createSource(root, label, { includeIndex = true } = {}) {
  assetPaths.forEach((assetPath) => fs.mkdirSync(path.dirname(path.join(root, assetPath)), { recursive: true }));
  if (includeIndex) {
    fs.writeFileSync(path.join(root, 'common-lib-playwright.html'), `<!doctype html>
<html><body>
<link rel="stylesheet" href="./presentation/report.css">
<link rel="stylesheet" href="./presentation/feature.css">
<script src="./presentation/report.js"></script>
<script src="./js/chartjs.js"></script>
<img src="./images/chart.png">
<img src="./screenshots/test.png">
<p>${label}</p></body></html>`);
  }
  assetPaths.forEach((assetPath) => fs.writeFileSync(path.join(root, assetPath), `${label}:${assetPath}`));
}

function publish({ source, site, branch, reportType = 'functional', runId, runAttempt = '1', sha = 'a'.repeat(40) }) {
  return publishReport({
    sourceDir: source,
    siteDir: site,
    rawBranch: branch,
    reportType,
    runKey: `${runId}-attempt-${runAttempt}`,
    runId,
    runAttempt,
    sha,
    runUrl: `https://github.com/hmcts/rpx-xui-common-lib/actions/runs/${runId}/attempts/${runAttempt}`
  });
}

test('retains immutable branch history, external assets and master links', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'common-lib-odhin-'));
  const source = path.join(root, 'source');
  const site = path.join(root, 'site');
  try {
    createSource(source, 'master-10');
    const masterFirst = publish({ source, site, branch: 'master', runId: '10', sha: 'm'.repeat(40) });
    const firstRunDir = path.join(site, 'reports', masterFirst.branchSlug, 'runs', '10-attempt-1');
    const firstHtml = fs.readFileSync(path.join(firstRunDir, 'index.html'), 'utf8');
    const firstAssetDigests = Object.fromEntries(assetPaths.map((assetPath) => [assetPath, digest(path.join(firstRunDir, assetPath))]));

    createSource(source, 'feature-11-attempt-1');
    const featureFirst = publish({ source, site, branch: 'feature/a-b', runId: '11', sha: 'f'.repeat(40) });
    createSource(source, 'feature-11-attempt-2');
    publish({ source, site, branch: 'feature/a-b', runId: '11', runAttempt: '2', sha: 'g'.repeat(40) });

    createSource(source, 'collision-12');
    const collision = publish({ source, site, branch: 'feature-a-b', runId: '12', sha: 'c'.repeat(40) });
    createSource(source, 'master-13');
    publish({ source, site, branch: 'master', runId: '13', sha: 'n'.repeat(40) });
    createSource(source, 'hostile-14');
    const hostile = publish({ source, site, branch: 'feature/<script>', runId: '14', sha: 'h'.repeat(40) });

    assert.equal(masterFirst.branchSlug, 'master');
    assert.notEqual(slugifyBranch('feature/a-b'), slugifyBranch('feature-a-b'));
    assert.match(featureFirst.branchSlug, /^[a-z0-9._-]+$/);
    assert.match(collision.branchSlug, /^[a-z0-9._-]+$/);
    assert.notEqual(featureFirst.branchSlug, collision.branchSlug);
    assert.equal(slugifyBranch('feature/<script>'), hostile.branchSlug);

    const featureDir = path.join(site, 'reports', featureFirst.branchSlug);
    const featureIndex = fs.readFileSync(path.join(featureDir, 'index.html'), 'utf8');
    const rootIndex = fs.readFileSync(path.join(site, 'index.html'), 'utf8');
    assert.match(featureIndex, /Open latest Functional Odhín report.*11-attempt-2/s);
    assert.match(featureIndex, /11-attempt-1/);
    assert.match(featureIndex, /11-attempt-2/);
    assert.doesNotMatch(featureIndex, /10-attempt-1|12-attempt-1/);
    assert.match(rootIndex, /href="\.\/reports\/master\/"/);
    assert.match(rootIndex, new RegExp(`reports/${featureFirst.branchSlug}/`));
    assert.match(rootIndex, /feature\/&lt;script&gt;/);
    assert.ok(fs.existsSync(path.join(site, '.nojekyll')));

    assert.equal(fs.readFileSync(path.join(firstRunDir, 'index.html'), 'utf8'), firstHtml);
    assetPaths.forEach((assetPath) => {
      const copied = path.join(firstRunDir, assetPath);
      assert.ok(fs.existsSync(copied), `missing copied asset ${assetPath}`);
      assert.equal(digest(copied), firstAssetDigests[assetPath], `changed copied asset ${assetPath}`);
    });
    assert.doesNotMatch(firstHtml, /data:image\//);
    assert.doesNotMatch(firstHtml, /id="odhin-enhancer-styles"/);

    assert.throws(() => publish({ source, site, branch: 'master', runId: '10', sha: 'z'.repeat(40) }), /already exists|will not be overwritten/);
    assert.equal(fs.readFileSync(path.join(firstRunDir, 'index.html'), 'utf8'), firstHtml);

    const masterBranch = JSON.parse(fs.readFileSync(path.join(site, 'reports', 'master', 'odhin-branch.json'), 'utf8'));
    assert.deepEqual(masterBranch.runs.map((run) => run.runKey), ['13-attempt-1', '10-attempt-1']);
    assert.equal(masterBranch.runs[0].rawBranch, 'master');
    assert.equal(masterBranch.runs[0].runUrl, 'https://github.com/hmcts/rpx-xui-common-lib/actions/runs/13/attempts/1');
    assert.equal(masterBranch.runs[0].sha, 'n'.repeat(40));

    const collidingSlug = slugifyBranch('feature/collision');
    const collidingDir = path.join(site, 'reports', collidingSlug);
    fs.mkdirSync(collidingDir, { recursive: true });
    fs.writeFileSync(path.join(collidingDir, 'odhin-branch.json'), JSON.stringify({ rawBranch: 'different-branch' }));
    assert.throws(
      () => publish({ source, site, branch: 'feature/collision', runId: '15', sha: 'x'.repeat(40) }),
      /branch slug collision/
    );
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('rejects an incomplete report before creating public history', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'common-lib-odhin-invalid-'));
  const source = path.join(root, 'source');
  const site = path.join(root, 'site');
  try {
    createSource(source, 'invalid', { includeIndex: false });
    assert.throws(() => publish({ source, site, branch: 'broken', runId: '99' }), /HTML index is missing/);
    assert.equal(fs.existsSync(path.join(site, 'reports')), false);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('links the matching accessibility evidence without changing the source or older runs', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'common-lib-a11y-site-'));
  const source = path.join(root, 'source');
  const site = path.join(root, 'site');
  try {
    createSource(source, 'old');
    publish({ source, site, branch: 'master', runId: '20' });
    const sourceHtml = '<!doctype html><html><body class="report"><h1>Functional results</h1></body></html>';
    fs.writeFileSync(path.join(source, 'common-lib-playwright.html'), sourceHtml);
    fs.mkdirSync(path.join(source, 'accessibility'));
    const accessibilityHtml = '<!doctype html><html><body><h1>Accessibility findings</h1></body></html>';
    fs.writeFileSync(path.join(source, 'accessibility/index.html'), accessibilityHtml);
    fs.writeFileSync(path.join(source, 'accessibility/summary.json'), '{"status":"issues-found"}');
    publish({ source, site, branch: 'master', runId: '21' });
    const current = path.join(site, 'reports/master/runs/21-attempt-1');
    for (const name of ['index.html', 'common-lib-playwright.html']) {
      const html = fs.readFileSync(path.join(current, name), 'utf8');
      assert.match(html, /aria-label="Odhín reports"/);
      assert.match(html, /href="\.\/accessibility\/index.html"[^>]*>Open Accessibility Odhín report/);
      assert.match(html, /aria-current="page">Functional Odhín report/);
      assert.match(html, /href="\.\/presentation\/report-navigation.css"/);
      assert.doesNotMatch(html, /<style|style=/);
    }
    const accessibility = fs.readFileSync(path.join(current, 'accessibility/index.html'), 'utf8');
    assert.match(accessibility, /href="\.\.\/index.html"[^>]*>Open Functional Odhín report/);
    assert.match(accessibility, /aria-current="page">Accessibility Odhín report/);
    assert.match(accessibility, /href="\.\.\/presentation\/report-navigation.css"/);
    assert.match(fs.readFileSync(path.join(current, 'presentation/report-navigation.css'), 'utf8'), /:focus-visible/);
    assert.equal(fs.readFileSync(path.join(current, 'accessibility/summary.json'), 'utf8'), '{"status":"issues-found"}');
    assert.equal(fs.readFileSync(path.join(source, 'common-lib-playwright.html'), 'utf8'), sourceHtml);
    assert.equal(fs.readFileSync(path.join(source, 'accessibility/index.html'), 'utf8'), accessibilityHtml);
    assert.doesNotMatch(fs.readFileSync(path.join(site, 'reports/master/runs/20-attempt-1/index.html'), 'utf8'), /Functional results/);
    fs.writeFileSync(path.join(source, 'accessibility/index.html'), 'broken accessibility document');
    assert.throws(() => publish({ source, site, branch: 'master', runId: '22' }), /body/);
    assert.equal(fs.existsSync(path.join(site, 'reports/master/runs/22-attempt-1')), false);
    assert.equal(fs.readdirSync(path.join(site, 'reports/master/runs')).some(name => name.startsWith('.odhin-run-')), false);
    fs.writeFileSync(path.join(source, 'accessibility/index.html'), accessibilityHtml);
    fs.writeFileSync(path.join(source, 'common-lib-playwright.html'), 'broken document');
    assert.throws(() => publish({ source, site, branch: 'master', runId: '23' }), /body/);
    assert.equal(fs.existsSync(path.join(site, 'reports/master/runs/23-attempt-1')), false);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('keeps type-specific histories separate and links only matching report revisions', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'common-lib-odhin-report-types-'));
  const functional = path.join(root, 'functional');
  const accessibility = path.join(root, 'accessibility');
  const site = path.join(root, 'site');
  const matchingSha = 'a'.repeat(40);
  const differentSha = 'b'.repeat(40);
  try {
    createSource(functional, 'functional');
    const functionalResult = publish({ source: functional, site, branch: 'test/EXUI-5356-a11y-on-demand', reportType: 'functional', runId: '100', sha: matchingSha });
    fs.mkdirSync(path.join(accessibility, 'presentation'), { recursive: true });
    fs.writeFileSync(path.join(accessibility, 'index.html'), '<!doctype html><html><body><h1>Accessibility findings</h1></body></html>');
    fs.writeFileSync(path.join(accessibility, 'presentation', 'accessibility.js'), 'window.report = true;');
    const accessibilityResult = publish({ source: accessibility, site, branch: 'test/EXUI-5356-a11y-on-demand', reportType: 'accessibility', runId: '101', sha: matchingSha });
    const branchDir = path.join(site, 'reports', functionalResult.branchSlug);

    assert.equal(accessibilityResult.branchSlug, functionalResult.branchSlug);
    assert.equal(functionalResult.runUrlPath, `reports/${functionalResult.branchSlug}/runs/100-attempt-1/`);
    assert.equal(accessibilityResult.runUrlPath, `reports/${functionalResult.branchSlug}/accessibility/runs/101-attempt-1/`);
    assert.ok(fs.existsSync(path.join(branchDir, 'runs', '100-attempt-1', 'index.html')));
    assert.ok(fs.existsSync(path.join(branchDir, 'accessibility', 'runs', '101-attempt-1', 'index.html')));
    const functionalHistory = fs.readFileSync(path.join(branchDir, 'index.html'), 'utf8');
    const accessibilityHistory = fs.readFileSync(path.join(branchDir, 'accessibility', 'index.html'), 'utf8');
    assert.match(functionalHistory, /href="\.\/accessibility\/runs\/101-attempt-1\/">Open matching Accessibility Odhín report/);
    assert.match(accessibilityHistory, /href="\.\.\/runs\/100-attempt-1\/">Open matching Functional Odhín report/);

    createSource(functional, 'functional-different-sha');
    publish({ source: functional, site, branch: 'test/EXUI-5356-a11y-on-demand', reportType: 'functional', runId: '102', sha: differentSha });
    const differentFunctionalHistory = fs.readFileSync(path.join(branchDir, 'index.html'), 'utf8');
    assert.match(differentFunctionalHistory, /Run 102-attempt-1[\s\S]*No matching report for this revision/);

    const reverseBranch = 'test/EXUI-5356-a11y-first';
    const reverseSha = 'c'.repeat(40);
    publish({ source: accessibility, site, branch: reverseBranch, reportType: 'accessibility', runId: '103', sha: reverseSha });
    publish({ source: functional, site, branch: reverseBranch, reportType: 'functional', runId: '104', sha: reverseSha });
    const reverseDir = path.join(site, 'reports', slugifyBranch(reverseBranch));
    assert.match(fs.readFileSync(path.join(reverseDir, 'index.html'), 'utf8'), /href="\.\/accessibility\/runs\/103-attempt-1\/">Open matching Accessibility Odhín report/);
    assert.match(fs.readFileSync(path.join(reverseDir, 'accessibility', 'index.html'), 'utf8'), /href="\.\.\/runs\/104-attempt-1\/">Open matching Functional Odhín report/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
