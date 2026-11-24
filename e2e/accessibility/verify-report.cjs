// Read-only report verification; screenshots are receipts, never simulated scan results.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL, fileURLToPath } = require('node:url');
const { chromium } = require('@playwright/test');
const { buildManifest } = require('./combined-manifest.cjs');

async function main() {
  const runDir = path.resolve(process.argv[2]);
  const summary = JSON.parse(fs.readFileSync(path.join(runDir, 'summary.json'), 'utf8'));
  const entries = buildManifest(runDir, summary);
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(pathToFileURL(path.join(runDir, 'index.html')).href);
    await page.locator('#loading').waitFor({ state: 'hidden' });
    await page.locator('#a11y-workspace-tab').click();
    await page.locator('.a11y-workspace').waitFor();
    assert.equal(await page.locator('.main-tablinks.active').count(), 1, 'Exactly one report tab must be active');
    assert(await page.locator('#a11y-workspace-tab').evaluate(node => node.classList.contains('active')),
      'Accessibility must be the active report tab');
    await page.screenshot({ path: path.join(runDir, 'rendered-accessibility.png'), fullPage: true });
    const hrefs = await page.locator('a[href*="accessibility-evidence/"]').evaluateAll(nodes => nodes.map(node => node.href));
    assert(hrefs.length > 0, 'Odhín must expose accessibility evidence links');
    for (const href of hrefs) {
      const url = new URL(href);
      assert.equal(url.protocol, 'file:');
      assert(fs.statSync(fileURLToPath(url)).size, `Broken evidence link ${href}`);
    }
    const engines = ['summary', 'axe', 'wave-like', 'screen-reader', 'lighthouse'];
    for (const engine of engines) {
      const entry = entries.find(candidate => candidate.engine === engine);
      assert(entry, `Missing executed ${engine} evidence`);
      assert(hrefs.some(href => href.includes(entry.htmlFileName)), `Odhín does not link ${engine}`);
      await page.goto(pathToFileURL(path.join(runDir, 'accessibility-evidence', entry.htmlFileName)).href);
      await page.locator('h1').first().waitFor();
      assert.equal(await page.locator('img').evaluateAll(nodes => nodes.filter(node => !node.complete || node.naturalWidth === 0).length), 0, `Broken ${engine} screenshot`);
      await page.screenshot({ path: path.join(runDir, `rendered-${engine}.png`), fullPage: true });
      if (entry.reportFileName) {
        await page.getByRole('link', { name: 'Open full Lighthouse HTML report' }).click();
        await page.locator('.lh-root').waitFor();
        assert.match(await page.locator('body').innerText(), /Accessibility/);
        await page.screenshot({ path: path.join(runDir, 'rendered-lighthouse-native.png'), fullPage: true });
      }
    }
    assert.deepEqual(errors, [], 'Generated report runtime errors');
    console.log(JSON.stringify({ status: summary.status, entries: entries.length, evidenceLinks: hrefs.length,
      engineTotals: summary.engineTotals, screenshot: path.join(runDir, 'rendered-accessibility.png') }, null, 2));
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
