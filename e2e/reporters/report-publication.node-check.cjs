const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { Script } = require('node:vm');

const workflows = path.join(__dirname, '../../.github/workflows');
const functionalWorkflow = fs.readFileSync(path.join(workflows, 'npmpublish.yml'), 'utf8');
const accessibilityWorkflow = fs.readFileSync(path.join(workflows, 'accessibility-odhin.yml'), 'utf8');
const crossBrowserWorkflow = fs.readFileSync(path.join(workflows, 'cross-browser-odhin.yml'), 'utf8');
const publisherWorkflow = fs.readFileSync(path.join(workflows, 'publish-odhin.yml'), 'utf8');

function jobBlock(workflow, name) {
  return workflow.split(/(?=^  [\w-]+:\r?$)/m).find((block) => block.startsWith(`  ${name}:`));
}

function foldedCondition(job) {
  const folded = job?.match(/^    if: >-\r?\n((?:      .*\r?\n)+)/m)?.[1].trim();
  assert(folded?.startsWith('${{') && folded.endsWith('}}'), 'Expected a folded GitHub expression');
  return folded.slice(3, -2).trim();
}

const publisherJob = jobBlock(publisherWorkflow, 'publish-odhin');
const functionalBuildJob = jobBlock(functionalWorkflow, 'build');
const publisherCondition = new Script(`(${foldedCondition(publisherJob)})`);

test('Odhín source jobs are read-only and upload exact evidence only', () => {
  assert.match(functionalWorkflow, /^permissions:\r?\n  contents: read/m);
  assert.match(accessibilityWorkflow, /^permissions:\r?\n  contents: read/m);
  assert.match(crossBrowserWorkflow, /^permissions:\r?\n  contents: read/m);
  assert.doesNotMatch(functionalBuildJob, /contents: write|pages: write|id-token: write/);
  assert.doesNotMatch(accessibilityWorkflow, /contents: write|pages: write|id-token: write/);
  assert.doesNotMatch(crossBrowserWorkflow, /contents: write|pages: write|id-token: write/);
  assert.doesNotMatch(functionalWorkflow, /  publish-odhin:|workflow_call/);
  assert.doesNotMatch(accessibilityWorkflow, /publish-odhin|workflow_call/);
  assert.doesNotMatch(crossBrowserWorkflow, /publish-odhin|workflow_call/);

  assert.match(functionalWorkflow, /name: common-lib-functional-report/);
  assert.match(functionalWorkflow, /name: common-lib-playwright-evidence/);
  assert.match(functionalBuildJob, /yarn playwright install --with-deps chromium\r?\n/);
  assert.ok(
    functionalBuildJob.indexOf('Install Playwright browsers') < functionalBuildJob.indexOf('yarn node --test e2e/reporters/*.node-check.cjs'),
    'browser-backed Odhín checks must run after Chromium is installed'
  );
  assert.doesNotMatch(functionalBuildJob, /yarn playwright install --with-deps chromium firefox webkit/);
  assert.match(functionalBuildJob, /yarn playwright test --project=chromium/);
  assert.doesNotMatch(functionalWorkflow, /outputs:|evidence_url|odhin_artifact_ready|odhin_prepare/);

  assert.match(accessibilityWorkflow, /^  workflow_dispatch:/m);
  assert.doesNotMatch(accessibilityWorkflow, /^  (pull_request|push):/m);
  assert.match(accessibilityWorkflow, /ref:\r?\n\s+description: Branch, tag, or commit SHA to test/);
  assert.match(accessibilityWorkflow, /ref: \$\{\{ inputs\.ref \}\}/);
  for (const command of [
    'yarn test:a11y:report',
    'yarn test:a11y:self-check',
    'yarn test:a11y:advisory',
    'yarn node e2e/accessibility/verify-report.cjs test-results/odhin/accessibility'
  ]) assert.match(accessibilityWorkflow, new RegExp(command.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(accessibilityWorkflow, /name: common-lib-accessibility-report/);
  assert.match(accessibilityWorkflow, /odhin-source\.json/);
  assert.match(accessibilityWorkflow, /path: accessibility-odhin-artifact\//);

  assert.match(crossBrowserWorkflow, /^  workflow_dispatch:/m);
  assert.doesNotMatch(crossBrowserWorkflow, /^  (pull_request|push):/m);
  assert.match(crossBrowserWorkflow, /ref:\r?\n\s+description: Branch, tag, or commit SHA to test/);
  assert.match(crossBrowserWorkflow, /ref: \$\{\{ inputs\.ref \}\}/);
  assert.match(crossBrowserWorkflow, /fetch-depth: 0/);
  assert.match(crossBrowserWorkflow, /persist-credentials: false/);
  assert.match(crossBrowserWorkflow, /yarn playwright install --with-deps chromium firefox webkit/);
  assert.match(crossBrowserWorkflow, /yarn playwright test --project=firefox --project=webkit/);
  assert.doesNotMatch(crossBrowserWorkflow, /yarn playwright test --project=chromium/);
  assert.match(crossBrowserWorkflow, /name: common-lib-cross-browser-report/);
  assert.match(crossBrowserWorkflow, /name: common-lib-cross-browser-evidence/);
  assert.match(crossBrowserWorkflow, /odhin-source\.json/);
  assert.match(crossBrowserWorkflow, /path: cross-browser-odhin-artifact\//);
  assert.match(crossBrowserWorkflow, /TARGET_SHA="\$\(git rev-parse HEAD\)"/);
  assert.match(crossBrowserWorkflow, /steps\.cross_browser\.outcome == 'success' \|\| steps\.cross_browser\.outcome == 'failure'/);
  assert.match(crossBrowserWorkflow, /steps\.odhin_browser\.outcome == 'success'/);
});

test('publisher is a trusted workflow_run with a validated manual recovery path and scoped write permissions', () => {
  assert.match(publisherWorkflow, /^  workflow_run:/m);
  assert.match(publisherWorkflow, /^  workflow_dispatch:\r?\n    inputs:\r?\n      source_run_id:/m);
  assert.match(publisherWorkflow, /workflows:\r?\n      - Node\.js Package\r?\n      - CommonLib accessibility \(advisory\)\r?\n      - CommonLib cross-browser \(advisory\)/);
  assert.match(publisherWorkflow, /types:\r?\n      - completed/);
  assert.doesNotMatch(publisherWorkflow, /workflow_call/);
  assert.match(publisherWorkflow, /^permissions:\r?\n  contents: read/m);
  assert.match(publisherJob, /actions: read/);
  assert.match(publisherJob, /contents: write/);
  assert.match(publisherJob, /pages: write/);
  assert.match(publisherJob, /id-token: write/);

  const checkout = publisherJob.match(/- uses: actions\/checkout@v7[\s\S]*?(?=      - uses: actions\/setup-node@v7)/)?.[0] ?? '';
  assert.match(checkout, /ref: \$\{\{ github\.event\.repository\.default_branch \}\}/);
  assert.match(checkout, /persist-credentials: false/);
  assert.doesNotMatch(checkout, /pull_request|head_ref/);

  const resolver = publisherJob.match(/- name: Resolve and validate exact source run[\s\S]*?(?=      - name: Check exact upstream report)/)?.[0] ?? '';
  assert.match(resolver, /SOURCE_RUN_ID: \$\{\{ github\.event_name == 'workflow_dispatch' && inputs\.source_run_id \|\| github\.event\.workflow_run\.id \}\}/);
  assert.match(resolver, /actions\/runs\/\$SOURCE_RUN_ID/);
  assert.match(resolver, /run\.head_repository\?\.full_name !== process\.env\.GITHUB_REPOSITORY/);
  assert.match(resolver, /Unsupported Odhín source workflow/);
  assert.match(resolver, /\["success", "failure"\]\.includes\(run\.conclusion\)/);
  assert.match(resolver, /common-lib-functional-report/);
  assert.match(resolver, /common-lib-accessibility-report/);
  assert.match(resolver, /common-lib-cross-browser-report/);

  const download = publisherJob.match(/- name: Download exact upstream report[\s\S]*?(?=      - name: Prepare)/)?.[0] ?? '';
  assert.match(download, /name: \$\{\{ steps\.source\.outputs\.artifact_name \}\}/);
  assert.match(download, /repository: \$\{\{ github\.repository \}\}/);
  assert.match(download, /run-id: \$\{\{ steps\.source\.outputs\.source_run_id \}\}/);
  assert.match(download, /github-token: \$\{\{ github\.token \}\}/);
  assert.doesNotMatch(download, /continue-on-error:\s*true/);
  assert.match(publisherJob, /- name: Check exact upstream report is available/);
  assert.match(publisherJob, /No publishable `%s` artifact was produced/);
  for (const stepName of [
    'Download exact upstream report',
    'Prepare and persist immutable Odhín history',
    'Configure GitHub Pages',
    'Upload Odhín site',
    'Publish Odhín report',
    'Link report in Actions'
  ]) {
    const step = publisherJob.match(new RegExp(`- name: ${stepName}[\\s\\S]*?(?=      - name:|$)`))?.[0] ?? '';
    assert.match(step, /if: \$\{\{ steps\.upstream_report\.outputs\.available == 'true' \}\}/, `${stepName} must be skipped without exact evidence`);
  }
  assert.ok(publisherJob.indexOf('Download exact upstream report') < publisherJob.indexOf('Prepare and persist immutable Odhín history'));

  assert.match(publisherJob, /ODHIN_BRANCH: \$\{\{ steps\.source\.outputs\.source_branch \}\}/);
  assert.match(publisherJob, /ODHIN_SHA: \$\{\{ steps\.source\.outputs\.source_sha \}\}/);
  assert.match(publisherJob, /ODHIN_RUN_KEY: \$\{\{ steps\.source\.outputs\.source_run_id \}\}-attempt-\$\{\{ steps\.source\.outputs\.source_run_attempt \}\}/);
  assert.match(publisherJob, /ODHIN_SOURCE_RUN_ID: \$\{\{ steps\.source\.outputs\.source_run_id \}\}/);
  assert.match(publisherJob, /ODHIN_SOURCE_RUN_ATTEMPT: \$\{\{ steps\.source\.outputs\.source_run_attempt \}\}/);
  assert.match(publisherJob, /ODHIN_RUN_URL: \$\{\{ steps\.source\.outputs\.source_url \}\}/);
  assert.match(publisherJob, /UPSTREAM_URL: \$\{\{ steps\.source\.outputs\.source_url \}\}/);
  assert.match(publisherJob, /--run-id "\$ODHIN_SOURCE_RUN_ID"/);
  assert.match(publisherJob, /--run-attempt "\$ODHIN_SOURCE_RUN_ATTEMPT"/);
  assert.match(publisherJob, /--report-type "\$ODHIN_REPORT_TYPE"/);
  assert.match(publisherJob, /evidence\/odhin-source\.json/);
  assert.match(publisherJob, /if \[ "\$ODHIN_REPORT_TYPE" != 'functional' \]; then/);
  assert.match(publisherJob, /common-lib-cross-browser-report/);
});

test('Pages publication uses a fresh latest-only site instead of copying the archive', () => {
  assert.match(publisherJob, /--site pages-site/);
  assert.match(publisherJob, /--latest-only true/);
  assert.doesNotMatch(publisherJob, /cp -R odhin-site\/\. pages-site/);

  const pagesInvocation = publisherJob.match(
    /^[ \t]+node e2e\/reporters\/odhin-site-publisher\.cjs \\\r?\n(?:(?:[ \t]+--[^\r\n]+)\\\r?\n)*[ \t]+--site pages-site \\\r?\n(?:(?:[ \t]+--[^\r\n]+)\\\r?\n)*[ \t]+--latest-only true >\/dev\/null$/m
  )?.[0] ?? '';
  assert.match(pagesInvocation, /--report-type "\$ODHIN_REPORT_TYPE"/);
});

test('Actions summary links use the current Pages report, immutable archive, and triggering workflow', () => {
  const linkStep = publisherJob.match(
    /^      - name: Link report in Actions\r?\n[\s\S]*?(?=^      - (?:name|uses):|^  [\w-]+:|(?![\s\S]))/m
  )?.[0] ?? '';

  assert.match(linkStep, /pages_url="\$\{PAGES_URL%\/\}"/);
  assert.match(linkStep, /PAGES_URL: \$\{\{ steps\.deployment\.outputs\.page_url \}\}/);
  assert.match(linkStep, /RUN_PATH: \$\{\{ steps\.publish_report\.outputs\.run_url_path \}\}/);
  assert.match(linkStep, /UPSTREAM_URL: \$\{\{ steps\.source\.outputs\.source_url \}\}/);
  assert.match(linkStep, /printf [^\n]*\[Open current public report\]\(%s\/%s\)[^\n]*"\$pages_url" "\$RUN_PATH" >> "\$GITHUB_STEP_SUMMARY"/);
  assert.match(linkStep, /printf [^\n]*\[Open immutable report archive\]\(%s\/%s\)[^\n]*"\$GITHUB_SERVER_URL\/\$GITHUB_REPOSITORY\/tree\/odhin-reports" "\$RUN_PATH" >> "\$GITHUB_STEP_SUMMARY"/);
  assert.match(linkStep, /printf [^\n]*\[Open the triggering workflow evidence\]\(%s\)[^\n]*"\$UPSTREAM_URL" >> "\$GITHUB_STEP_SUMMARY"/);
});

const cases = [
  { name: 'same-repository PR success publishes', workflow: 'Node.js Package', event: 'pull_request', conclusion: 'success', want: true },
  { name: 'same-repository PR failure publishes its valid report', workflow: 'Node.js Package', event: 'pull_request', conclusion: 'failure', want: true },
  { name: 'same-repository PR cancellation does not publish', workflow: 'Node.js Package', event: 'pull_request', conclusion: 'cancelled', want: false },
  { name: 'master push success publishes', workflow: 'Node.js Package', event: 'push', branch: 'master', conclusion: 'success', want: true },
  { name: 'Release push success publishes', workflow: 'Node.js Package', event: 'push', branch: 'Release', conclusion: 'success', want: true },
  { name: 'feature push does not publish', workflow: 'Node.js Package', event: 'push', branch: 'test/private', conclusion: 'success', want: false },
  { name: 'foreign repository PR never publishes', workflow: 'Node.js Package', event: 'pull_request', conclusion: 'success', sourceRepo: 'outside/fork', want: false },
  { name: 'manual dispatch of the functional workflow cannot bypass its trigger policy', workflow: 'Node.js Package', event: 'workflow_dispatch', want: false },
  { name: 'manual accessibility success publishes', workflow: 'CommonLib accessibility (advisory)', event: 'workflow_dispatch', conclusion: 'success', workflowBranch: 'master', want: true },
  { name: 'manual accessibility failure does not publish', workflow: 'CommonLib accessibility (advisory)', event: 'workflow_dispatch', conclusion: 'failure', workflowBranch: 'master', want: false },
  { name: 'manual accessibility from a feature workflow does not publish', workflow: 'CommonLib accessibility (advisory)', event: 'workflow_dispatch', conclusion: 'success', workflowBranch: 'test/untrusted', want: false },
  { name: 'accessibility push cannot publish', workflow: 'CommonLib accessibility (advisory)', event: 'push', conclusion: 'success', want: false },
  { name: 'manual cross-browser success publishes', workflow: 'CommonLib cross-browser (advisory)', event: 'workflow_dispatch', conclusion: 'success', workflowBranch: 'master', want: true },
  { name: 'manual cross-browser failure publishes its valid report', workflow: 'CommonLib cross-browser (advisory)', event: 'workflow_dispatch', conclusion: 'failure', workflowBranch: 'master', want: true },
  { name: 'manual cross-browser cancellation does not publish', workflow: 'CommonLib cross-browser (advisory)', event: 'workflow_dispatch', conclusion: 'cancelled', workflowBranch: 'master', want: false },
  { name: 'manual cross-browser from a feature workflow does not publish', workflow: 'CommonLib cross-browser (advisory)', event: 'workflow_dispatch', conclusion: 'success', workflowBranch: 'test/untrusted', want: false },
  { name: 'cross-browser push cannot publish', workflow: 'CommonLib cross-browser (advisory)', event: 'push', conclusion: 'success', want: false },
  { name: 'unrelated workflow cannot publish', workflow: 'anything else', event: 'workflow_dispatch', conclusion: 'success', want: false },
  { name: 'manual publisher enters the validated recovery path from master', eventName: 'workflow_dispatch', refName: 'master', want: true },
  { name: 'manual publisher cannot execute a feature branch', eventName: 'workflow_dispatch', refName: 'test/untrusted', want: false },
];

for (const scenario of cases) {
  test(scenario.name, () => {
    const context = {
      github: {
        repository: 'hmcts/rpx-xui-common-lib',
        event_name: scenario.eventName,
        ref_name: scenario.refName,
        event: {
          workflow_run: {
            name: scenario.workflow,
            event: scenario.event,
            conclusion: scenario.conclusion,
            head_branch: scenario.workflowBranch ?? scenario.branch ?? 'feature/example',
            head_repository: { full_name: scenario.sourceRepo ?? 'hmcts/rpx-xui-common-lib' },
          },
          repository: { default_branch: 'master' },
        },
      },
    };
    assert.equal(publisherCondition.runInNewContext(context), scenario.want);
  });
}
