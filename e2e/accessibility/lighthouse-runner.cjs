// Native import keeps Lighthouse ESM intact under Playwright's TypeScript transform.
const { writeFile } = require('node:fs/promises');

async function main() {
  const [url, port, jsonPath, htmlPath] = process.argv.slice(2);
  const { default: lighthouse } = await import('lighthouse');
  const result = await lighthouse(url, {
    port: Number(port), output: ['json', 'html'], onlyCategories: ['accessibility'],
    formFactor: 'desktop', screenEmulation: { disabled: true }, disableStorageReset: true,
    logLevel: 'error', maxWaitForLoad: 30_000
  });
  if (!result || result.lhr.runtimeError || result.lhr.categories.accessibility.score === null) {
    throw new Error(`Lighthouse execution failed: ${JSON.stringify(result?.lhr.runtimeError)}`);
  }
  const errors = Object.values(result.lhr.audits).filter((audit) => audit.errorMessage);
  if (errors.length) throw new Error(`Lighthouse audit errors: ${JSON.stringify(errors)}`);
  await writeFile(jsonPath, JSON.stringify(result.lhr, null, 2), { flag: 'wx' });
  await writeFile(htmlPath, result.report[1], { flag: 'wx' });
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
