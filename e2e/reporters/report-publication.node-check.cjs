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
const condition = foldedCondition(publisherJob);
const gate = new Script(`(${condition})`);

test('functional workflow remains read-only and publishes only functional evidence as an artifact', () => {
  assert.doesNotMatch(functionalWorkflow, /^  publish-odhin:/m);
  assert.doesNotMatch(functionalWorkflow, /test:a11y:advisory|common-lib-accessibility-report/);
  assert.match(functionalWorkflow, /^permissions:\r?\n  contents: read/m);
  assert.match(functionalWorkflow, /name: common-lib-functional-report/);
  assert.match(functionalWorkflow, /name: common-lib-playwright-evidence/);
});

test('manual accessibility workflow keeps product findings advisory but report execution blocking', () => {
  assert.match(accessibilityWorkflow, /^  workflow_dispatch:/m);
  assert.match(accessibilityWorkflow, /^permissions:\r?\n  contents: read/m);
  assert.doesNotMatch(accessibilityWorkflow, /pages: write|contents: write|id-token: write/);
  for (const command of [
    'yarn test:a11y:report',
    'yarn test:a11y:self-check',
    'yarn test:a11y:advisory',
    'yarn node e2e/accessibility/verify-report.cjs test-results/odhin/accessibility'
  ]) assert.match(accessibilityWorkflow, new RegExp(command.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(accessibilityWorkflow, /name: common-lib-accessibility-report/);
});

test('only trusted default-branch workflow code receives publication permissions', () => {
  assert.match(publisherWorkflow, /^  workflow_run:/m);
  assert.match(publisherWorkflow, /- Node\.js Package/);
  assert.match(publisherWorkflow, /- CommonLib accessibility \(advisory\)/);
  assert.match(publisherJob, /contents: write/);
  assert.match(publisherJob, /actions: read/);
  assert.match(publisherJob, /pages: write/);
  assert.match(publisherJob, /id-token: write/);
  assert.match(publisherJob, /head_repository\.full_name == github\.repository/);
  assert.match(publisherJob, /workflow_run\.event == 'workflow_dispatch'/);
  const checkout = publisherJob.match(/- uses: actions\/checkout@v5[\s\S]*?(?=      - uses: actions\/setup-node@v5)/)?.[0];
  assert.match(checkout || '', /persist-credentials: false/);
  assert.doesNotMatch(checkout || '', /ref:/);
  assert.match(publisherJob, /report-type "\$ODHIN_REPORT_TYPE"/);
  assert.match(publisherJob, /run-id "\$ODHIN_SOURCE_RUN_ID"/);
  assert.match(publisherJob, /run-attempt "\$ODHIN_SOURCE_RUN_ATTEMPT"/);
});

const cases = [
  { name: 'same-repository PR functional report publishes even when its functional suite failed', workflow: 'Node.js Package', event: 'pull_request', conclusion: 'failure', want: true },
  { name: 'master functional report publishes', workflow: 'Node.js Package', event: 'push', branch: 'master', want: true },
  { name: 'Release functional report publishes', workflow: 'Node.js Package', event: 'push', branch: 'Release', want: true },
  { name: 'feature push functional report does not publish', workflow: 'Node.js Package', event: 'push', branch: 'test/private', want: false },
  { name: 'manual advisory accessibility report publishes after a successful complete run', workflow: 'CommonLib accessibility (advisory)', event: 'workflow_dispatch', want: true },
  { name: 'failed manual accessibility execution does not publish incomplete evidence', workflow: 'CommonLib accessibility (advisory)', event: 'workflow_dispatch', conclusion: 'failure', want: false },
  { name: 'foreign repository reports never receive Pages publication', workflow: 'Node.js Package', event: 'pull_request', sourceRepo: 'outside/fork', want: false },
  { name: 'manual dispatch of the functional workflow cannot bypass its trigger policy', workflow: 'Node.js Package', event: 'workflow_dispatch', want: false },
  { name: 'an unrelated workflow cannot publish', workflow: 'anything else', event: 'workflow_dispatch', want: false },
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
            conclusion: scenario.conclusion ?? 'success',
            head_branch: scenario.branch ?? 'test/EXUI-5356-common-lib-coverage-a11y',
            head_repository: { full_name: scenario.sourceRepo ?? 'hmcts/rpx-xui-common-lib' },
          },
        },
      },
    };
    assert.equal(gate.runInNewContext(context), scenario.want);
  });
}
