const fs = require('node:fs');
const path = require('node:path');

function buildManifest(runDir, summary) {
  const directory = path.join(runDir, 'accessibility-evidence');
  const names = fs.readdirSync(directory).filter(name => name.startsWith('manifest-entry-') && name.endsWith('.json'));
  const entries = names.map(name => JSON.parse(fs.readFileSync(path.join(directory, name), 'utf8')));
  const identities = new Set();
  for (const entry of entries) {
    if (!['summary', 'axe', 'wave-like', 'screen-reader', 'lighthouse'].includes(entry.engine) ||
        typeof entry.testTitle !== 'string' || !Array.isArray(entry.rules) || !Array.isArray(entry.targets) ||
        !Number.isInteger(entry.violationCount) || entry.violationCount < 0 || entry.status === 'error' || identities.has(entry.htmlFileName)) throw new Error('Invalid or duplicate combined evidence entry');
    identities.add(entry.htmlFileName);
    for (const name of [entry.htmlFileName, entry.jsonFileName, entry.screenshotFileName, ...(entry.reportFileName ? [entry.reportFileName] : []), ...(entry.assetFileNames ?? [])]) {
      if (!name || path.basename(name) !== name || !fs.statSync(path.join(directory, name)).size) throw new Error(`Missing or unsafe combined evidence: ${name}`);
    }
    if (entry.engine === 'lighthouse' && !entry.reportFileName) throw new Error('Missing native Lighthouse report');
  }
  for (const attempt of summary.entries) {
    if (!attempt.outcomes) continue;
    const json = JSON.parse(fs.readFileSync(attempt.files.json, 'utf8'));
    const prefix = json.published?.htmlFileName?.split('-')[0];
    if (!prefix) throw new Error('Missing per-attempt publication identity');
    const own = entries.filter(entry => entry.htmlFileName.startsWith(`${prefix}-`));
    const contexts = new Set(own.map(entry => JSON.stringify([entry.testTitle, entry.feature, entry.pageState,
      Object.entries(entry.context ?? {}).sort(([a], [b]) => a.localeCompare(b))])));
    if (contexts.size !== 1) throw new Error(`Mismatched summary/detail journey context for ${attempt.title}`);
    for (const engine of ['summary', ...attempt.outcomes.map(outcome => outcome.engine)]) {
      if (own.filter(entry => entry.engine === engine).length !== 1) throw new Error(`Missing or duplicate ${engine} evidence for ${attempt.title}`);
    }
  }
  if (!entries.length) throw new Error('No combined accessibility evidence');
  return entries;
}
module.exports = { buildManifest };
