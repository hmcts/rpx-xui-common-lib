# Odhín Branch History Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the current CommonLib Odhín report under a branch-scoped Pages path while retaining every run in the `odhin-reports` archive and keeping `master` history stable.

**Architecture:** A small Node publisher copies the complete Odhín output into the type-specific `reports/<branch-slug>/` history, writes branch/root indexes, and is exercised by direct Node tests. GitHub Actions serialises archive publication through a dedicated `odhin-reports` peer branch, builds a fresh latest-only Pages projection, and links the current Pages report, immutable archive, and exact artifact URL.

**Tech Stack:** GitHub Actions YAML, Node.js built-ins, `node:test`, Odhín Playwright output, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-10-13-odhin-branch-history-design.md`

## Global Constraints

- Do not modify production library code under `projects/**`.
- Keep Odhín HTML, CSS, JavaScript, charts, screenshots, traces, and attachments as separate files.
- Publish only same-repository PRs and configured branch pushes; fork PRs remain artifact-only.
- Use `run_id` plus `run_attempt` so reruns cannot overwrite prior attempts.
- Fail closed if an existing readable slug is backed by a different raw branch name.
- Serialise report-history writes so `master` and PR publications cannot race.
- Retain prior report directories; do not add automatic deletion.

### Task 1: Add the report-history publisher and direct tests

**Files:**
- Create: `e2e/reporters/odhin-site-publisher.cjs`
- Create: `e2e/reporters/odhin-site-publisher.node-check.cjs`

**Interfaces:**
- `slugifyBranch(rawBranch): string` returns a readable safe branch slug with a short raw-name hash.
- `publishReport({ sourceDir, siteDir, rawBranch, runKey, runId, runAttempt, sha, runUrl }): { branchSlug, branchUrlPath, runUrlPath }` copies one report and regenerates indexes without deleting earlier runs.
- CLI mode `node e2e/reporters/odhin-site-publisher.cjs --slug <raw-branch>` prints only the slug for workflow output.
- CLI mode accepts `--source`, `--site`, `--branch`, `--run-key`, `--run-id`, `--run-attempt`, `--sha`, and `--run-url`.

- [ ] **Step 1: Write the failing Node checks**

Create a temporary source report containing `common-lib-playwright.html`, `presentation/report.css`, `presentation/report.js`, and one attachment. Call the publisher twice for the same branch with different run keys and once for `master`. Assert:

```js
assert.notEqual(slugifyBranch('feature/a-b'), slugifyBranch('feature-a-b'));
assert.ok(fs.existsSync(path.join(site, 'reports', branch, 'runs', '100-attempt-1', 'index.html')));
assert.ok(fs.existsSync(path.join(site, 'reports', branch, 'runs', '100-attempt-2', 'index.html')));
assert.match(fs.readFileSync(branchIndex, 'utf8'), /100-attempt-1/);
assert.match(fs.readFileSync(branchIndex, 'utf8'), /100-attempt-2/);
assert.match(fs.readFileSync(rootIndex, 'utf8'), /master/);
assert.ok(fs.existsSync(path.join(site, 'reports', branch, 'runs', '100-attempt-2', 'presentation', 'report.css')));
```

- [ ] **Step 2: Run the focused check and confirm it fails**

Run: `node --test e2e/reporters/odhin-site-publisher.node-check.cjs`

Expected: FAIL because the publisher module does not yet exist.

- [ ] **Step 3: Implement the smallest publisher**

Use only `node:crypto`, `node:fs`, and `node:path`. Sanitize the raw branch to lowercase alphanumeric/`.`/`_`/`-`, collapse separators, trim unsafe edges, truncate the readable portion, append a raw-name SHA-256 suffix, and fall back to `unknown-branch`. Sanitize `runKey` similarly. Copy the source directory recursively, copy the Odhín HTML to `index.html`, write run and branch metadata, then write branch and root indexes with HTML-escaped labels and relative links. If a slug directory already exists, verify its recorded raw branch before adding a run.

- [ ] **Step 4: Run the focused check and confirm it passes**

Run: `node --test e2e/reporters/odhin-site-publisher.node-check.cjs`

Expected: all checks pass, including earlier-run retention and external-asset preservation.

- [ ] **Step 5: Run syntax validation**

Run: `node --check e2e/reporters/odhin-site-publisher.cjs && node --check e2e/reporters/odhin-site-publisher.node-check.cjs`

Expected: exit code 0.

### Task 2: Change GitHub Actions to publish branch-scoped history

**Files:**
- Modify: `.github/workflows/publish-odhin.yml`

**Interfaces:**
- `build.outputs.branch_slug` and `build.outputs.run_key` are consumed by `publish-odhin` for stable summary links.
- The `odhin-reports` branch is the persistent publication source; the workflow bootstraps it when absent.

- [ ] **Step 1: Add branch/run context output**

After checkout, call the publisher CLI in `--slug` mode using `github.head_ref || github.ref_name`; expose the slug and `${GITHUB_RUN_ID}-attempt-${GITHUB_RUN_ATTEMPT}` as build outputs.

- [ ] **Step 2: Replace the fixed PR-only publication condition**

Allow publication for same-repository pull requests and pushes to `master` or `Release`. Keep fork pull requests artifact-only. Preserve the rendered Odhín browser gate before any public copy.

- [ ] **Step 3: Prevent report loss and publication races**

Set workflow cancellation off for report-producing runs and add a job-level `commonlib-odhin-publication` concurrency group with `cancel-in-progress: false`.

- [ ] **Step 4: Assemble and persist `odhin-reports`**

In `publish-odhin`, check out the source branch, download `common-lib-playwright-evidence`, clone `odhin-reports` with the job token or initialise it if missing, run the publisher against `test-results/odhin`, commit only the generated report tree, and push `HEAD:odhin-reports` with `contents: write` permission.

- [ ] **Step 5: Deploy the assembled tree and link all URLs**

Build a fresh latest-only Pages projection without copying the archive tree, then upload it using `actions/upload-pages-artifact`. Keep `actions/deploy-pages`. In the Actions summary link the current Pages report, immutable archive path, and exact evidence artifact.

- [ ] **Step 6: Validate workflow text statically**

Assert the workflow contains `odhin-reports`, `contents: write`, `cancel-in-progress: false`, `run_attempt`, branch-scoped `reports/` paths, same-repository fork protection, `actions/download-artifact`, and the exact evidence URL. Parse YAML with an available YAML parser if present; otherwise use the repository’s supported workflow lint command or document its absence.

### Task 3: Document the new report URLs and evidence model

**Files:**
- Modify: `README.md`
- Modify: workspace `PR_DESCRIPTION.md`
- Modify: workspace `PLAN.md`, `TODO.md`, `DECISIONS.md`, `RESULT.md`, `FINDINGS.md`, and `TRACEABILITY.md`

- [ ] **Step 1: Document URL examples**

Explain `reports/master/`, branch-latest paths, immutable run paths, the `odhin-reports` peer branch, and the fact that fork PRs use artifacts only.

- [ ] **Step 2: Reconcile the PR description**

Replace the mutable root-only report wording with the branch/history URL model, preserving the existing scope statement that `projects/**` is untouched and retaining the known reporter/public-report governance risks.

- [ ] **Step 3: Record the decision and evidence expectations**

Record that no automatic report deletion is added and that `master` history is a required acceptance criterion.

### Task 4: Review and validate the frozen change

**Files:**
- Review all changed files; no further scope is expected.

- [ ] **Step 1: Run focused publisher, static workflow, lint, typecheck, and existing reporter checks**
- [ ] **Step 2: Run the existing unit suite and the Playwright/report gate locally where feasible**
- [ ] **Step 3: Run Ponytail complexity review and remove only verified unnecessary code**
- [ ] **Step 4: Run the critical HMCTS review against the current base/head diff**
- [ ] **Step 5: Push the workflow change and verify the exact-head Actions run**
- [ ] **Step 6: Verify a branch-scoped live report URL and exact evidence artifact**
- [ ] **Step 7: Recheck the remote PR head and record whether evidence applies to the frozen branch**

## Self-review

- All design requirements have a task: branch paths, immutable runs, master retention, bootstrap, concurrency, fork protection, external assets, exact links, documentation, and validation.
- No unresolved placeholders are present; angle-bracket tokens are URL/path notation only.
- The publisher function and workflow CLI names are consistent across tasks.
