# Odhín branch-scoped report history

## Goal

Keep published Odhín reports separately addressable by source branch and retain every published run, with `master` having a stable, durable report history. The existing WebApp-style report presentation remains unchanged: HTML, CSS, JavaScript, charts, screenshots, traces, and other attachments stay as separate files in each run directory.

## Scope

Change only the CommonLib CI publication path, its report-history helper/check, and documentation. Do not modify production library code under `projects/**`.

## Design

GitHub Actions will maintain a dedicated `odhin-reports` peer branch as the report-history source. The publication job serialises all report writes through a job-level concurrency group so a `master` publication cannot race a PR publication.

Each eligible internal PR or `master`/`Release` push publishes to:

```text
reports/<branch-slug>/index.html
reports/<branch-slug>/runs/<run-id>-attempt-<attempt>/index.html
```

The branch index links to the newest run and lists older runs. The root index lists every branch and its newest run. Branch slugs are readable, filesystem-safe, and include a short hash of the raw branch name to prevent collisions such as `feature/a-b` and `feature-a-b`.

The workflow will:

1. Run the existing build, unit, typecheck, Playwright, and Odhín browser checks.
2. Upload the exact-run evidence artifact.
3. Check out or bootstrap `odhin-reports`.
4. Copy the complete Odhín output into the branch/run directory and regenerate the branch and root indexes.
5. Commit and push the report-history update.
6. Upload the assembled history tree as the GitHub Pages artifact and deploy it.
7. Put branch-latest, immutable-run, and exact evidence-artifact links in the Actions summary.

Reports from forked PRs will remain artifact-only because the workflow must not grant a fork the ability to write the repository report-history branch or publish untrusted data publicly.

## Failure and concurrency behaviour

- A failed browser run still retains its exact Actions evidence when available, but it is not copied to the public report-history branch unless the rendered Odhín gate passes.
- A rerun uses `run_attempt` in its directory name, so it cannot overwrite the original attempt.
- A missing `odhin-reports` branch is bootstrapped on the first successful eligible publication.
- A publication push failure fails the publication job and leaves the prior Pages deployment intact.

## Validation

- Node checks prove branch slug collision resistance, run-attempt uniqueness, external asset preservation, and retention of earlier runs.
- YAML/static checks prove the workflow has branch-scoped paths, serialised publication, write permissions, fork protection, and exact-run links.
- Existing lint, unit, E2E typecheck, Playwright, Odhín browser, and report-asset checks remain required.
- The exact-head Actions run must be checked after the workflow change, including the live `master`/branch URL shape and the immutable run link.

## Non-goals

- No production CommonLib implementation changes.
- No automatic deletion of old reports; retention is intentionally preserved until a separate policy is agreed.
- No separate GitHub Pages site or domain per branch; one Pages site is partitioned by branch paths.
