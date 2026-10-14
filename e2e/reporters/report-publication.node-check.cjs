const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { Script } = require('node:vm');

const workflows = path.join(__dirname, '../../.github/workflows');
const functionalWorkflow = fs.readFileSync(path.join(workflows, 'npmpublish.yml'), 'utf8');
const accessibilityWorkflow = fs.readFileSync(path.join(workflows, 'accessibility-odhin.yml'), 'utf8');
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
  assert.doesNotMatch(functionalBuildJob, /contents: write|pages: write|id-token: write/);
  assert.doesNotMatch(accessibilityWorkflow, /contents: write|pages: write|id-token: write/);
  assert.doesNotMatch(functionalWorkflow, /  publish-odhin:|workflow_call/);
  assert.doesNotMatch(accessibilityWorkflow, /publish-odhin|workflow_call/);

  assert.match(functionalWorkflow, /name: common-lib-functional-report/);
  assert.match(functionalWorkflow, /name: common-lib-playwright-evidence/);
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
});

test('publisher is a trusted workflow_run with scoped write permissions', () => {
  assert.match(publisherWorkflow, /^  workflow_run:/m);
  assert.match(publisherWorkflow, /workflows:\r?\n      - Node\.js Package\r?\n      - CommonLib accessibility \(advisory\)/);
  assert.match(publisherWorkflow, /types:\r?\n      - completed/);
  assert.doesNotMatch(publisherWorkflow, /workflow_call|inputs\./);
  assert.match(publisherWorkflow, /^permissions:\r?\n  contents: read/m);
  assert.match(publisherJob, /actions: read/);
  assert.match(publisherJob, /contents: write/);
  assert.match(publisherJob, /pages: write/);
  assert.match(publisherJob, /id-token: write/);

  const checkout = publisherJob.match(/- uses: actions\/checkout@v7[\s\S]*?(?=      - uses: actions\/setup-node@v7)/)?.[0] ?? '';
  assert.match(checkout, /ref: \$\{\{ github\.event\.repository\.default_branch \}\}/);
  assert.match(checkout, /persist-credentials: false/);
  assert.doesNotMatch(checkout, /pull_request|head_ref|workflow_run\.head_branch/);

  const download = publisherJob.match(/- name: Download exact upstream report[\s\S]*?(?=      - name: Prepare)/)?.[0] ?? '';
  assert.match(download, /name: \$\{\{ steps\.report\.outputs\.artifact_name \}\}/);
  assert.match(download, /repository: \$\{\{ github\.repository \}\}/);
  assert.match(download, /run-id: \$\{\{ github\.event\.workflow_run\.id \}\}/);
  assert.match(download, /github-token: \$\{\{ github\.token \}\}/);
  assert.doesNotMatch(download, /continue-on-error:\s*true/);
  assert.ok(publisherJob.indexOf('Download exact upstream report') < publisherJob.indexOf('Prepare and persist immutable Odhín history'));

  assert.match(publisherJob, /ODHIN_BRANCH: \$\{\{ github\.event\.workflow_run\.head_branch \}\}/);
  assert.match(publisherJob, /ODHIN_SHA: \$\{\{ github\.event\.workflow_run\.head_sha \}\}/);
  assert.match(publisherJob, /ODHIN_RUN_KEY: \$\{\{ github\.event\.workflow_run\.id \}\}-attempt-\$\{\{ github\.event\.workflow_run\.run_attempt \}\}/);
  assert.match(publisherJob, /ODHIN_SOURCE_RUN_ID: \$\{\{ github\.event\.workflow_run\.id \}\}/);
  assert.match(publisherJob, /ODHIN_SOURCE_RUN_ATTEMPT: \$\{\{ github\.event\.workflow_run\.run_attempt \}\}/);
  assert.match(publisherJob, /ODHIN_RUN_URL: \$\{\{ github\.server_url \}\}\/\$\{\{ github\.repository \}\}\/actions\/runs\/\$\{\{ github\.event\.workflow_run\.id \}\}\/attempts\/\$\{\{ github\.event\.workflow_run\.run_attempt \}\}/);
  assert.match(publisherJob, /UPSTREAM_URL: \$\{\{ github\.server_url \}\}\/\$\{\{ github\.repository \}\}\/actions\/runs\/\$\{\{ github\.event\.workflow_run\.id \}\}\/attempts\/\$\{\{ github\.event\.workflow_run\.run_attempt \}\}/);
  assert.match(publisherJob, /--run-id "\$ODHIN_SOURCE_RUN_ID"/);
  assert.match(publisherJob, /--run-attempt "\$ODHIN_SOURCE_RUN_ATTEMPT"/);
  assert.match(publisherJob, /--report-type "\$ODHIN_REPORT_TYPE"/);
  assert.match(publisherJob, /evidence\/odhin-source\.json/);
});

test('Pages publication uses a fresh latest-only site instead of copying the archive', () => {
  assert.match(publisherJob, /--site pages-site/);
  assert.match(publisherJob, /--latest-only true/);
  assert.doesNotMatch(publisherJob, /cp -R odhin-site\/\. pages-site/);
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
  { name: 'manual accessibility success publishes', workflow: 'CommonLib accessibility (advisory)', event: 'workflow_dispatch', conclusion: 'success', want: true },
  { name: 'manual accessibility failure does not publish', workflow: 'CommonLib accessibility (advisory)', event: 'workflow_dispatch', conclusion: 'failure', want: false },
  { name: 'accessibility push cannot publish', workflow: 'CommonLib accessibility (advisory)', event: 'push', conclusion: 'success', want: false },
  { name: 'unrelated workflow cannot publish', workflow: 'anything else', event: 'workflow_dispatch', conclusion: 'success', want: false },
];

for (const scenario of cases) {
  test(scenario.name, () => {
    const context = {
      github: {
        repository: 'hmcts/rpx-xui-common-lib',
        event: {
          workflow_run: {
            name: scenario.workflow,
            event: scenario.event,
            conclusion: scenario.conclusion,
            head_branch: scenario.branch ?? 'feature/example',
            head_repository: { full_name: scenario.sourceRepo ?? 'hmcts/rpx-xui-common-lib' },
          },
        },
      },
    };
    assert.equal(publisherCondition.runInNewContext(context), scenario.want);
  });
}
