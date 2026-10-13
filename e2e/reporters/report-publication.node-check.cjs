const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { Script } = require('node:vm');

const workflow = fs.readFileSync(path.join(__dirname, '../../.github/workflows/npmpublish.yml'), 'utf8');
// Read only this workflow's folded job condition, not a general YAML/expression parser.
const job = workflow.split(/(?=^  [\w-]+:\r?$)/m).find(block => block.startsWith('  publish-odhin:'));
const folded = job?.match(/^    if: >-\r?\n((?:      .*\r?\n)+)/m)?.[1].trim();
assert(folded?.startsWith('${{') && folded.endsWith('}}'), 'Expected the publication job condition');
const condition = folded.slice(3, -2).trim();
const gate = new Script(`(${condition})`);

// Literal expectations describe policy, not values computed from the condition.
const cases = [
  { name: 'failed functional build with verified reports publishes', result: 'failure', want: true },
  { name: 'successful build with verified reports publishes', result: 'success', want: true },
  { name: 'future same-repository PR 1234 publishes', number: 1234, want: true },
  { name: 'future same-repository PR 9876 publishes', number: 9876, want: true },
  { name: 'cancelled run does not publish', cancelled: true, want: false },
  { name: 'unverified reports do not publish', ready: 'false', want: false },
  { name: 'missing readiness output does not publish', ready: '', want: false },
  { name: 'fork PR does not publish', sourceRepo: 'outside/fork', want: false },
  { name: 'master push publishes after functional failure', event: 'push', ref: 'master', want: true },
  { name: 'Release push publishes after functional failure', event: 'push', ref: 'Release', want: true },
  { name: 'other branch push does not publish', event: 'push', ref: 'feature/private', want: false },
  { name: 'release event does not publish reports', event: 'release', want: false },
  { name: 'manual dispatch does not bypass event policy', event: 'workflow_dispatch', want: false },
  { name: 'master push still requires readiness', event: 'push', ref: 'master', ready: 'false', want: false },
  { name: 'Release push still respects cancellation', event: 'push', ref: 'Release', cancelled: true, want: false },
];

for (const scenario of cases) {
  test(scenario.name, () => {
    const result = scenario.result ?? 'failure';
    const context = {
      cancelled: () => scenario.cancelled ?? false,
      success: () => result === 'success',
      failure: () => result === 'failure',
      always: () => true,
      needs: { build: { result, outputs: { odhin_artifact_ready: scenario.ready ?? 'true' } } },
      github: {
        event_name: scenario.event ?? 'pull_request',
        ref_name: scenario.ref ?? 'test/EXUI-5356-common-lib-coverage-a11y',
        repository: 'hmcts/rpx-xui-common-lib',
        event: { number: scenario.number ?? 571, pull_request: {
          number: scenario.number ?? 571,
          head: { repo: { full_name: scenario.sourceRepo ?? 'hmcts/rpx-xui-common-lib' } },
        } },
      },
    };
    // Without a status function, GitHub applies success() before the job condition.
    const statusAllows = /\b(?:cancelled|success|failure|always)\s*\(/.test(condition) || result === 'success';
    assert.equal(statusAllows && gate.runInNewContext(context), scenario.want);
    assert.equal(context.needs.build.result, result, 'Publishing must not change the failed build result');
  });
}
