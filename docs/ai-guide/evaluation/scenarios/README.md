# Executable Scenarios

Use isolated fixtures to check whether short prompts produce a focused fix, preserve existing behavior and respect approval boundaries. They supplement the [evaluation protocol](../README.md); they do not become default AI context or production application code.

See [measured trial results and limitations](results.md) for the three completed AI runs.

| Family               | Cases and acceptance                                       |
| -------------------- | ---------------------------------------------------------- |
| Behavioral bugs      | [Pagination and failed deletion](bug-fix.md)               |
| Visual fixes         | [Action wrapping and long labels](ui.md)                   |
| Scope and permission | [Shared API approval and plan-only](scope-and-approval.md) |

## Prepare and inspect

From the project root, choose a new directory:

```bash
node tooling/rules-kit/scenarios/prepare.mjs filter-reset /tmp/filter-trial
node tooling/rules-kit/scenarios/check.mjs /tmp/filter-trial.baseline.json
```

Preparation copies the reusable rules, a local project profile and deliberately faulty code. The sidecar baseline records hashes outside the agent workspace. The original bug should fail the behavioral checker. Run the case's returned prompt in that fixture, then check again. Scope checks detect modified/deleted protected files, unrelated additions, changed user work and modified rules, even if the target behavior works.

Expected changed paths are deliberately narrow test expectations. A legitimate larger correction still needs review; do not treat an unexpected path as proof of malicious behavior. PNG/log/snapshot artifacts may use `.evaluation-artifacts/` or `.playwright-mcp/`; code files hidden there are flagged. Snapshot exceptions are not a security sandbox.

## Optional Codex trial

This command spends model usage. It uses an explicit model, medium reasoning, an ephemeral session and workspace-write sandbox; personal configuration is disabled for reproducibility. Use disposable fixtures, not the application checkout.

```bash
node tooling/rules-kit/scenarios/run-codex.mjs \
  --receipt /tmp/filter-trial.baseline.json \
  --out /tmp/filter-trial-run \
  --model YOUR_MODEL
```

Output contains the raw CLI events, usage, wall time, final response, before/after checks and an `accepted: null` review field. The default CLI deadline is three minutes; timeout/failure stays in the record. No automatic retry or automatic acceptance is performed. Review the diff and trace using [review criteria](../review.md).

For a UI trial add `--playwright-cli /absolute/path/to/installed/@playwright/mcp/cli.js`. This uses an existing MCP installation and Chrome, never installs dependencies. The runner starts the fixture server, enables an isolated headless Playwright MCP for the agent, and independently checks the result at 1280px and 390px. Inspect screenshots as well as assertions. Missing browser tooling remains a limitation, not a pass. Without that option, start the fixture server manually and use your available browser tooling with `check-browser.mjs`.

The runner/checkers/catalog live together in `tooling/rules-kit/scenarios/`; fixture source is under its `fixtures/<feature>/` folders. `npm run rules:check` tests fixture integrity and reference corrections without invoking a paid AI service. It does not execute all AI scenarios.
