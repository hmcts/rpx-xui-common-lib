const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('@playwright/test');

async function main() {
  const report = path.resolve(process.env.PW_ODHIN_OUTPUT ?? 'test-results/odhin', process.env.PW_ODHIN_INDEX ?? 'common-lib-playwright.html');
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('console', (message) => {
      if (message.type() === 'error') {
        errors.push(`console: ${message.text()}`);
      }
    });
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(pathToFileURL(report).href);
    await page.locator('.report-metric').first().waitFor();
    assert.equal(await page.locator('.report-metric').count(), 4, 'four dashboard metrics render');
    assert.deepEqual(await page.locator('.report-grid .report-panel .info-box-header').allTextContents().then((titles) => titles.map((title) => title.replace(/[⠿↗]/g, '').trim())),
      ['Feature Overview', 'Run info', 'Global Summary', 'Projects Summary', 'Status by project'], 'WebApp dashboard panels render in order');
    assert.equal(await page.locator('.report-grid .report-panel').first().evaluate((element) => getComputedStyle(element).gridColumn), '1 / -1', 'feature overview spans the dashboard');
    assert.equal(await page.locator('.report-panel > .odhin-thin-border').first().evaluate((element) => getComputedStyle(element).borderRadius), '16px', 'external presentation CSS loads');
    const total = Number((await page.locator('.report-metric strong').first().textContent()).trim());
    assert.ok(total > 0, 'run metric contains test results');
    const visibleRows = await page.locator('#test-list-table tbody tr').count();
    const tableInfo = await page.locator('#test-list-table_info').textContent();
    const tableInfoMatch = tableInfo?.match(/of\s+(\d+)\s+entries/);
    assert.ok(tableInfoMatch, 'test table pagination reports the final-result total');
    const reportedRows = Number(tableInfoMatch[1]);
    assert.ok(
      Math.max(visibleRows, reportedRows) >= total,
      'test rows cover final results and possible retries'
    );
    const featureRows = page.locator('#odhin-feature-summary tbody > tr').filter({ has: page.locator('.feature-toggle') });
    assert.ok(await featureRows.count() > 0, 'report contains a feature group');
    let groupedTests = 0;
    for (let index = 0; index < await featureRows.count(); index += 1) {
      await featureRows.nth(index).locator('.feature-toggle').click();
      const details = page.locator(`#feature-tests-${index}`);
      const tests = await details.locator('li').count();
      assert.ok(tests > 0, `feature ${index + 1} drill-down exposes tests`);
      assert.equal(await details.locator('.test-detail-link').count(), tests, `feature ${index + 1} exposes every test detail`);
      groupedTests += tests;
    }
    assert.equal(groupedTests, reportedRows, 'feature groups account for every rendered report result row');
    await page.locator('#feature-tests-0 .test-detail-link').first().click();
    const modal = page.locator('.modal.show').last();
    await modal.waitFor();
    assert.equal(await modal.locator('.result-tab-header button.active').textContent().then((text) => text.trim()), 'Info', 'test detail opens the native result information');
    assert.match((await modal.locator('.result-tabcontent[style*="display: block"]').textContent()).trim(), /\S/, 'test detail renders native result content');
    await modal.locator('[data-bs-dismiss="modal"]').click();

    const modalWithSteps = page.locator('.modal').filter({ has: page.locator('.stepLine') }).first();
    if (await modalWithSteps.count()) {
      const modalId = await modalWithSteps.getAttribute('id');
      await page.locator(`[data-bs-target="#${modalId}"]`).first().click();
      await modalWithSteps.locator('.result-tab-header button').filter({ hasText: 'Steps' }).click();
      assert.equal(await modalWithSteps.locator('.result-tab-header button.active').textContent().then((text) => text.trim()), 'Steps', 'retained native steps open their result tab');
      assert.ok(await modalWithSteps.locator('.result-tabcontent[style*="display: block"] .stepLine').count(), 'retained native test steps render');
    }
    assert.deepEqual(errors, [], 'report JavaScript has no console or page errors');
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
