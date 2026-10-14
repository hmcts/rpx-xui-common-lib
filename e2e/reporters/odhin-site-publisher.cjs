const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const REPORT_TYPES = {
  functional: { label: 'Functional Odhín', sourceIndex: 'common-lib-playwright.html', historyDirectory: '' },
  accessibility: { label: 'Accessibility Odhín', sourceIndex: 'index.html', historyDirectory: 'accessibility' },
  'cross-browser': { label: 'Cross-browser Odhín', sourceIndex: 'common-lib-playwright.html', historyDirectory: 'cross-browser' }
};
const REPORT_TYPE_NAMES = Object.keys(REPORT_TYPES);

function slugifyBranch(rawBranch) {
  const raw = String(rawBranch || 'unknown-branch');
  if (raw === 'master') return 'master';
  const readable = raw.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/-+/g, '-')
    .replace(/^[.-]+|[.-]+$/g, '').slice(0, 96) || 'unknown-branch';
  return `${readable}-${crypto.createHash('sha256').update(raw).digest('hex').slice(0, 16)}`;
}

function safeSegment(value, fallback) {
  const segment = String(value || fallback).replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-')
    .replace(/^[.-]+|[.-]+$/g, '');
  return segment || fallback;
}

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function normaliseReportType(value = 'functional') {
  if (!Object.hasOwn(REPORT_TYPES, value)) throw new Error(`Unsupported Odhín report type: ${value}`);
  return value;
}

function reportDefinition(reportType) {
  return REPORT_TYPES[normaliseReportType(reportType)];
}

function historyDirectory(branchDir, reportType) {
  const definition = reportDefinition(reportType);
  return definition.historyDirectory ? path.join(branchDir, definition.historyDirectory) : branchDir;
}

function readRunMetadata(runDir) {
  const metadataFile = path.join(runDir, 'odhin-run.json');
  return fs.existsSync(metadataFile) ? JSON.parse(fs.readFileSync(metadataFile, 'utf8')) : null;
}

function listRuns(historyDir) {
  const runsDir = path.join(historyDir, 'runs');
  if (!fs.existsSync(runsDir)) return [];
  return fs.readdirSync(runsDir, { withFileTypes: true }).filter((entry) => entry.isDirectory())
    .map((entry) => readRunMetadata(path.join(runsDir, entry.name))).filter(Boolean)
    .sort((left, right) => Number(right.runId) - Number(left.runId) || Number(right.runAttempt) - Number(left.runAttempt)
      || right.runKey.localeCompare(left.runKey));
}

function ensureBranchIdentity(branchDir, rawBranch, branchSlug) {
  if (!fs.existsSync(branchDir)) return;
  const metadataFile = path.join(branchDir, 'odhin-branch.json');
  if (!fs.existsSync(metadataFile)) throw new Error(`Odhín branch directory is not recognised: ${branchDir}`);
  const existingBranch = JSON.parse(fs.readFileSync(metadataFile, 'utf8'));
  if (existingBranch.rawBranch !== String(rawBranch) || existingBranch.slug !== branchSlug) {
    throw new Error(`Odhín branch slug collision: ${branchSlug}`);
  }
}

function findRunBySha(runs, sha) {
  return runs.find((run) => run.sha === sha);
}

function historyHref(fromType, toType) {
  const target = reportDefinition(toType);
  if (fromType === 'functional') return `./${target.historyDirectory}/`;
  if (toType === 'functional') return '../';
  return `../${target.historyDirectory}/`;
}

function counterpartRunHref(fromType, toType, run) {
  return `${historyHref(fromType, toType)}runs/${encodeURIComponent(run.runKey)}/`;
}

function runHistoryHref(fromType, toType) {
  return `../../${historyHref(fromType, toType).replace(/^\.\//, '')}`;
}

function renderHistoryIndex(branch, reportType, runsByType) {
  const definition = reportDefinition(reportType);
  const latest = branch.runs[0];
  const rows = branch.runs.map((run) => {
    const counterparts = REPORT_TYPE_NAMES.filter((type) => type !== reportType)
      .map((type) => ({ type, run: findRunBySha(runsByType[type], run.sha) }))
      .filter((counterpart) => counterpart.run);
    const exactMatch = counterparts.length
      ? counterparts.map(({ type, run: counterpart }) => ` · <a href="${counterpartRunHref(reportType, type, counterpart)}">Open matching ${escapeHtml(reportDefinition(type).label)} report</a>`).join('')
      : ' · No matching report for this revision';
    return `<li><a href="./runs/${encodeURIComponent(run.runKey)}/">Run ${escapeHtml(run.runKey)}</a>
      <span>${escapeHtml(run.sha.slice(0, 8))} · ${escapeHtml(run.createdAt)}${exactMatch}</span></li>`;
  }).join('');
  const histories = REPORT_TYPE_NAMES.filter((type) => type !== reportType)
    .map((type) => `<a href="${historyHref(reportType, type)}">Open ${escapeHtml(reportDefinition(type).label)} history</a>`).join(' · ');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${escapeHtml(definition.label)} · ${escapeHtml(branch.rawBranch)}</title></head>
<body><main><h1>${escapeHtml(definition.label)} reports · ${escapeHtml(branch.rawBranch)}</h1>
<p>Branch history for <code>${escapeHtml(branch.rawBranch)}</code>.</p>
<p>${histories}</p>
${latest ? `<p><a href="./runs/${encodeURIComponent(latest.runKey)}/">Open latest ${escapeHtml(definition.label)} report</a></p>` : ''}
<h2>Run history</h2><ul>${rows || '<li>No reports published.</li>'}</ul>
</main></body></html>
`;
}

function renderRootIndex(branches) {
  const master = branches.find((branch) => branch.rawBranch === 'master');
  const rows = branches.map((branch) => {
    const reportLinks = REPORT_TYPE_NAMES.map((type) => {
      const run = branch.runsByType[type][0];
      if (!run) return '';
      const directory = reportDefinition(type).historyDirectory;
      const prefix = directory ? `${directory}/` : '';
      return ` · <a href="./reports/${encodeURIComponent(branch.slug)}/${prefix}runs/${encodeURIComponent(run.runKey)}/">latest ${escapeHtml(reportDefinition(type).label)}</a>`;
    }).join('');
    return `<li><a href="./reports/${encodeURIComponent(branch.slug)}/">${escapeHtml(branch.rawBranch)}</a>${reportLinks}</li>`;
  }).join('');
  const masterLink = master ? `<a href="./reports/${encodeURIComponent(master.slug)}/">Open master history</a>` : 'Master history will appear after the next master publication.';
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>CommonLib Odhín report history</title></head>
<body><main><h1>CommonLib Odhín report history</h1>
<p>Functional, cross-browser, and accessibility reports are retained separately per source branch. ${masterLink}</p>
<ul>${rows || '<li>No reports published.</li>'}</ul>
</main></body></html>
`;
}

function addCombinedReportNavigation(file, accessibility = false) {
  const html = fs.readFileSync(file, 'utf8');
  const body = /<body\b[^>]*>/i;
  if (!body.test(html)) throw new Error('Odhín HTML body is missing');
  const prefix = accessibility ? '../' : './';
  const current = accessibility ? 'Accessibility' : 'Functional';
  const target = accessibility ? 'Functional' : 'Accessibility';
  const href = accessibility ? '../index.html' : './accessibility/index.html';
  const navigation = `
<link rel="stylesheet" href="${prefix}presentation/report-navigation.css">
<nav class="odhin-report-navigation" aria-label="Odhín reports">
  <div><strong>Two Odhín reports for this run</strong><span aria-current="page">${current} Odhín report</span></div>
  <a class="odhin-report-navigation-link" href="${href}">Open ${target} Odhín report</a>
  <p>Accessibility findings are advisory; functional results are separate.</p>
</nav>`;
  fs.writeFileSync(file, html.replace(body, `$&${navigation}`));
}

function addHistoryNavigation(file, reportType) {
  const html = fs.readFileSync(file, 'utf8');
  const body = /<body\b[^>]*>/i;
  if (!body.test(html)) throw new Error('Odhín HTML body is missing');
  const links = REPORT_TYPE_NAMES.filter((type) => type !== reportType)
    .map((type) => `<a class="odhin-report-navigation-link" href="${runHistoryHref(reportType, type)}">Open ${escapeHtml(reportDefinition(type).label)} history</a>`).join('');
  const navigation = `
<link rel="stylesheet" href="./presentation/report-navigation.css">
<nav class="odhin-report-navigation" aria-label="Odhín reports">
  <div><strong>${escapeHtml(reportDefinition(reportType).label)} report</strong><span aria-current="page">This report is immutable</span></div>
  <div>${links}</div>
  <p>Reports are linked only when the history confirms the same revision.</p>
</nav>`;
  fs.writeFileSync(file, html.replace(body, `$&${navigation}`));
}

function readBranches(reportsDir) {
  if (!fs.existsSync(reportsDir)) return [];
  return fs.readdirSync(reportsDir, { withFileTypes: true }).filter((entry) => entry.isDirectory())
    .map((entry) => {
      const branchDir = path.join(reportsDir, entry.name);
      const metadataFile = path.join(branchDir, 'odhin-branch.json');
      if (!fs.existsSync(metadataFile)) return null;
      const branch = JSON.parse(fs.readFileSync(metadataFile, 'utf8'));
      const runsByType = Object.fromEntries(REPORT_TYPE_NAMES.map((type) => [type, listRuns(historyDirectory(branchDir, type))]));
      return { rawBranch: branch.rawBranch, slug: branch.slug, runsByType };
    }).filter(Boolean).sort((left, right) => left.rawBranch.localeCompare(right.rawBranch));
}

function publishReport({ sourceDir, siteDir, rawBranch, runKey, runId, runAttempt, sha, runUrl, reportType = 'functional' }) {
  const type = normaliseReportType(reportType);
  const definition = reportDefinition(type);
  if (!fs.existsSync(sourceDir)) throw new Error(`Odhín source directory does not exist: ${sourceDir}`);
  const sourceIndex = path.join(sourceDir, definition.sourceIndex);
  if (!fs.existsSync(sourceIndex) || !fs.statSync(sourceIndex).isFile()) throw new Error(`Odhín HTML index is missing: ${sourceIndex}`);
  const branchSlug = slugifyBranch(rawBranch);
  const safeRunKey = safeSegment(runKey, 'unknown-run');
  const reportsDir = path.join(siteDir, 'reports');
  const branchDir = path.join(reportsDir, branchSlug);
  const typeDir = historyDirectory(branchDir, type);
  const runDir = path.join(typeDir, 'runs', safeRunKey);
  fs.mkdirSync(siteDir, { recursive: true });
  ensureBranchIdentity(branchDir, rawBranch, branchSlug);
  if (fs.existsSync(runDir)) throw new Error(`Odhín run already exists and will not be overwritten: ${runDir}`);
  fs.mkdirSync(path.dirname(runDir), { recursive: true });
  let stagingDir;
  try {
    stagingDir = fs.mkdtempSync(path.join(path.dirname(runDir), '.odhin-run-'));
    fs.cpSync(sourceDir, stagingDir, { recursive: true });
    const stagedIndex = path.join(stagingDir, definition.sourceIndex);
    if (!fs.existsSync(stagedIndex) || !fs.statSync(stagedIndex).isFile()) throw new Error(`Odhín HTML index is missing: ${stagedIndex}`);
    fs.mkdirSync(path.join(stagingDir, 'presentation'), { recursive: true });
    fs.copyFileSync(path.join(__dirname, 'presentation', 'report-navigation.css'), path.join(stagingDir, 'presentation', 'report-navigation.css'));
    const nestedAccessibilityIndex = path.join(stagingDir, 'accessibility', 'index.html');
    if (type === 'functional' && fs.existsSync(nestedAccessibilityIndex)) {
      addCombinedReportNavigation(stagedIndex);
      addCombinedReportNavigation(nestedAccessibilityIndex, true);
    } else {
      addHistoryNavigation(stagedIndex, type);
    }
    if (definition.sourceIndex !== 'index.html') fs.copyFileSync(stagedIndex, path.join(stagingDir, 'index.html'));
    writeJson(path.join(stagingDir, 'odhin-run.json'), {
      schemaVersion: 2, reportType: type, rawBranch: String(rawBranch), branchSlug, runKey: safeRunKey,
      runId: String(runId), runAttempt: String(runAttempt), sha: String(sha), runUrl: String(runUrl), createdAt: new Date().toISOString()
    });
    fs.renameSync(stagingDir, runDir);
    stagingDir = undefined;
  } finally {
    if (stagingDir && fs.existsSync(stagingDir)) fs.rmSync(stagingDir, { recursive: true, force: true });
  }
  const runsByType = Object.fromEntries(REPORT_TYPE_NAMES.map((typeName) => {
    const directory = historyDirectory(branchDir, typeName);
    fs.mkdirSync(directory, { recursive: true });
    return [typeName, listRuns(directory)];
  }));
  const branch = { rawBranch: String(rawBranch), slug: branchSlug, runs: runsByType.functional };
  writeJson(path.join(branchDir, 'odhin-branch.json'), branch);
  REPORT_TYPE_NAMES.filter((typeName) => typeName !== 'functional').forEach((typeName) => {
    writeJson(path.join(historyDirectory(branchDir, typeName), 'odhin-branch.json'), {
      rawBranch: String(rawBranch), slug: branchSlug, reportType: typeName, runs: runsByType[typeName]
    });
  });
  REPORT_TYPE_NAMES.forEach((typeName) => {
    fs.writeFileSync(path.join(historyDirectory(branchDir, typeName), 'index.html'), renderHistoryIndex({
      rawBranch: String(rawBranch), slug: branchSlug, runs: runsByType[typeName]
    }, typeName, runsByType));
  });
  fs.writeFileSync(path.join(siteDir, '.nojekyll'), '');
  fs.writeFileSync(path.join(siteDir, 'index.html'), renderRootIndex(readBranches(reportsDir)));
  const relativeHistory = definition.historyDirectory ? `${definition.historyDirectory}/` : '';
  return { reportType: type, branchSlug, branchUrlPath: `reports/${branchSlug}/${relativeHistory}`,
    runUrlPath: `reports/${branchSlug}/${relativeHistory}runs/${safeRunKey}/` };
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 2) {
    const name = argv[index];
    const value = argv[index + 1];
    if (!name || !name.startsWith('--') || value === undefined) throw new Error(`Expected --name value arguments, got: ${argv.slice(index).join(' ')}`);
    args[name.slice(2)] = value;
  }
  return args;
}

if (require.main === module) {
  try {
    if (process.argv[2] === '--slug') console.log(slugifyBranch(process.argv[3]));
    else {
      const args = parseArgs(process.argv.slice(2));
      console.log(JSON.stringify(publishReport({ sourceDir: args.source, siteDir: args.site, rawBranch: args.branch,
        runKey: args['run-key'], runId: args['run-id'], runAttempt: args['run-attempt'], sha: args.sha,
        runUrl: args['run-url'], reportType: args['report-type'] })));
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { publishReport, slugifyBranch };
