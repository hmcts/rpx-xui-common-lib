const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

function slugifyBranch(rawBranch) {
  const raw = String(rawBranch || 'unknown-branch');
  if (raw === 'master') {
    return 'master';
  }
  const readable = raw
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[.-]+|[.-]+$/g, '')
    .slice(0, 96) || 'unknown-branch';
  const hash = crypto.createHash('sha256').update(raw).digest('hex').slice(0, 16);
  return `${readable}-${hash}`;
}

function safeSegment(value, fallback) {
  const segment = String(value || fallback)
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[.-]+|[.-]+$/g, '');
  return segment || fallback;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function readRunMetadata(runDir) {
  const metadataFile = path.join(runDir, 'odhin-run.json');
  if (!fs.existsSync(metadataFile)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(metadataFile, 'utf8'));
}

function addReportNavigation(file, accessibility = false) {
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

function listRuns(branchDir) {
  const runsDir = path.join(branchDir, 'runs');
  if (!fs.existsSync(runsDir)) {
    return [];
  }
  return fs.readdirSync(runsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => readRunMetadata(path.join(runsDir, entry.name)))
    .filter(Boolean)
    .sort((left, right) => {
      const runIdOrder = Number(right.runId) - Number(left.runId);
      return runIdOrder || Number(right.runAttempt) - Number(left.runAttempt) || right.runKey.localeCompare(left.runKey);
    });
}

function renderBranchIndex(branch) {
  const latest = branch.runs[0];
  const rows = branch.runs.map((run) => `
      <li><a href="./runs/${encodeURIComponent(run.runKey)}/">Run ${escapeHtml(run.runKey)}</a>
        <span>${escapeHtml(run.sha.slice(0, 8))} · ${escapeHtml(run.createdAt)}</span></li>`).join('');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Odhín · ${escapeHtml(branch.rawBranch)}</title></head>
<body><main><h1>Odhín reports · ${escapeHtml(branch.rawBranch)}</h1>
<p>Branch history for <code>${escapeHtml(branch.rawBranch)}</code>.</p>
${latest ? `<p><a href="./runs/${encodeURIComponent(latest.runKey)}/">Open latest report</a></p>` : ''}
<h2>Run history</h2><ul>${rows || '<li>No reports published.</li>'}</ul>
</main></body></html>
`;
}

function renderRootIndex(branches) {
  const master = branches.find((branch) => branch.rawBranch === 'master');
  const rows = branches.map((branch) => {
    const latest = branch.runs[0];
    return `<li><a href="./reports/${encodeURIComponent(branch.slug)}/">${escapeHtml(branch.rawBranch)}</a>${latest ? ` · <a href="./reports/${encodeURIComponent(branch.slug)}/runs/${encodeURIComponent(latest.runKey)}/">latest run</a>` : ''}</li>`;
  }).join('');
  const masterLink = master
    ? `<a href="./reports/${encodeURIComponent(master.slug)}/">Open master history</a>`
    : 'Master history will appear after the next master publication.';
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>CommonLib Odhín report history</title></head>
<body><main><h1>CommonLib Odhín report history</h1>
<p>Reports are retained per source branch. ${masterLink}</p>
<ul>${rows || '<li>No reports published.</li>'}</ul>
</main></body></html>
`;
}

function publishReport({ sourceDir, siteDir, rawBranch, runKey, runId, runAttempt, sha, runUrl }) {
  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Odhín source directory does not exist: ${sourceDir}`);
  }
  const sourceIndex = path.join(sourceDir, 'common-lib-playwright.html');
  if (!fs.existsSync(sourceIndex) || !fs.statSync(sourceIndex).isFile()) {
    throw new Error(`Odhín HTML index is missing: ${sourceIndex}`);
  }
  const branchSlug = slugifyBranch(rawBranch);
  const safeRunKey = safeSegment(runKey, 'unknown-run');
  const reportsDir = path.join(siteDir, 'reports');
  const branchDir = path.join(reportsDir, branchSlug);
  const runDir = path.join(branchDir, 'runs', safeRunKey);
  fs.mkdirSync(siteDir, { recursive: true });
  if (fs.existsSync(branchDir)) {
    const branchMetadataFile = path.join(branchDir, 'odhin-branch.json');
    if (!fs.existsSync(branchMetadataFile)) {
      throw new Error(`Odhín branch directory is not recognised: ${branchDir}`);
    }
    const existingBranch = JSON.parse(fs.readFileSync(branchMetadataFile, 'utf8'));
    if (existingBranch.rawBranch !== String(rawBranch)) {
      throw new Error(`Odhín branch slug collision: ${branchSlug}`);
    }
  }
  if (fs.existsSync(runDir)) {
    throw new Error(`Odhín run already exists and will not be overwritten: ${runDir}`);
  }
  fs.mkdirSync(path.dirname(runDir), { recursive: true });
  let stagingDir;
  try {
    stagingDir = fs.mkdtempSync(path.join(path.dirname(runDir), '.odhin-run-'));
    fs.cpSync(sourceDir, stagingDir, { recursive: true });
    const stagedIndex = path.join(stagingDir, 'common-lib-playwright.html');
    if (!fs.existsSync(stagedIndex) || !fs.statSync(stagedIndex).isFile()) {
      throw new Error(`Odhín HTML index is missing: ${stagedIndex}`);
    }
    const accessibilityIndex = path.join(stagingDir, 'accessibility', 'index.html');
    if (fs.existsSync(accessibilityIndex)) {
      fs.mkdirSync(path.join(stagingDir, 'presentation'), { recursive: true });
      fs.copyFileSync(path.join(__dirname, 'presentation', 'report-navigation.css'), path.join(stagingDir, 'presentation', 'report-navigation.css'));
      addReportNavigation(stagedIndex);
      addReportNavigation(accessibilityIndex, true);
    }
    fs.copyFileSync(stagedIndex, path.join(stagingDir, 'index.html'));
    const metadata = {
      rawBranch: String(rawBranch),
      branchSlug,
      runKey: safeRunKey,
      runId: String(runId),
      runAttempt: String(runAttempt),
      sha: String(sha),
      runUrl: String(runUrl),
      createdAt: new Date().toISOString()
    };
    writeJson(path.join(stagingDir, 'odhin-run.json'), metadata);
    fs.renameSync(stagingDir, runDir);
    stagingDir = undefined;
  } finally {
    if (stagingDir && fs.existsSync(stagingDir)) {
      fs.rmSync(stagingDir, { recursive: true, force: true });
    }
  }
  const branch = {
    rawBranch: String(rawBranch),
    slug: branchSlug,
    runs: listRuns(branchDir)
  };
  writeJson(path.join(branchDir, 'odhin-branch.json'), branch);
  fs.writeFileSync(path.join(branchDir, 'index.html'), renderBranchIndex(branch));
  const branches = fs.readdirSync(reportsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const metadataFile = path.join(reportsDir, entry.name, 'odhin-branch.json');
      return fs.existsSync(metadataFile) ? JSON.parse(fs.readFileSync(metadataFile, 'utf8')) : null;
    })
    .filter(Boolean)
    .sort((left, right) => left.rawBranch.localeCompare(right.rawBranch));
  fs.writeFileSync(path.join(siteDir, '.nojekyll'), '');
  fs.writeFileSync(path.join(siteDir, 'index.html'), renderRootIndex(branches));
  return {
    branchSlug,
    branchUrlPath: `reports/${branchSlug}/`,
    runUrlPath: `reports/${branchSlug}/runs/${safeRunKey}/`
  };
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 2) {
    const name = argv[index];
    const value = argv[index + 1];
    if (!name || !name.startsWith('--') || value === undefined) {
      throw new Error(`Expected --name value arguments, got: ${argv.slice(index).join(' ')}`);
    }
    args[name.slice(2)] = value;
  }
  return args;
}

if (require.main === module) {
  try {
    if (process.argv[2] === '--slug') {
      console.log(slugifyBranch(process.argv[3]));
    } else {
      const args = parseArgs(process.argv.slice(2));
      const result = publishReport({
        sourceDir: args.source,
        siteDir: args.site,
        rawBranch: args.branch,
        runKey: args['run-key'],
        runId: args['run-id'],
        runAttempt: args['run-attempt'],
        sha: args.sha,
        runUrl: args['run-url']
      });
      console.log(JSON.stringify(result));
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { publishReport, slugifyBranch };
