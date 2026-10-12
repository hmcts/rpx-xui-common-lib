const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { createEmptyFeatureStat, enhanceGeneratedReport } = require('./odhin-report-enhancer.cjs');

test('removes the obsolete file chart initializer from external Odhín assets', () => {
  const outputFolder = fs.mkdtempSync(path.join(os.tmpdir(), 'odhin-enhancer-'));
  try {
    fs.mkdirSync(path.join(outputFolder, 'js'));
    fs.writeFileSync(
      path.join(outputFolder, 'index.html'),
      '<html><body><div class="dashboard-block"><div class="info-box-header">Files Summary</div><canvas id="chart-file"></canvas></div><script src="js/chartjs.js"></script></body></html>'
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
  } finally {
    fs.rmSync(outputFolder, { recursive: true, force: true });
  }
});
