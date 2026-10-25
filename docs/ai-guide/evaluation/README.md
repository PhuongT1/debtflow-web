# Evaluate AI Workflows

For maintainers changing the rule system, not required context for routine coding tasks. Measure accepted results, regressions, input tokens and elapsed time before adding more instructions. Fewer files read is a diagnostic, not proof of quality.

## Run a fair comparison

1. Select representative [cases](cases.md) and record their exact prompts, fixtures and acceptance criteria before running either variant.
2. Use separate clean sessions/checkouts with identical source baseline, data, installed versions, model settings, tools, permissions and instruction access. Change only the rules under evaluation. Record concrete identifiers in `environmentId` and `agentConfig`; use rule commit IDs or content hashes for `rulesRevision`.
3. Run both variants on every selected case with the same trial numbers. For a pilot use at least three trials per case where budget permits; this is a local protocol, not a statistical guarantee. Include failed/blocked attempts and developer interventions; never silently discard retries.
4. Review the diff and actual test/browser evidence using the [review criteria](review.md). An agent saying “done” or reading the expected file is insufficient.
5. Record [results](results.md) and run the comparison command. Keep raw results outside default agent context; omit credentials, session tokens and private user data.

## Commands

From the repository root:

```bash
npm run rules:check
npm run rules:evaluate -- --baseline /tmp/ai-baseline.json --candidate /tmp/ai-candidate.json
```

`rules:check` checks documentation links, indexing, viewer behavior, portable exports and the comparison utility. It does not run AI tasks. `rules:evaluate` only validates and aggregates recorded results; it does not verify that the evidence is truthful or enforce agent compliance.

Prefer a candidate that preserves acceptance and scope safety while reducing cost/time. Review regressions per case before accepting a lower aggregate cost. Do not claim a token improvement until comparable measured records exist. If a rule is always read with another and has no independent trigger, consider consolidating it under [module placement](../../../.ai-rules/core/workflows/rule-maintenance/placement.md).

Reusable rules live in [`.ai-rules/`](../../../.ai-rules/README.md); this evaluation guide is optional developer documentation and is not included in the portable rule-kit export.

Measured pilot: [Codex trials and limitations](reports/README.md). These are candidate-only smoke trials, not evidence of a percentage improvement over a baseline.

For repeatable bug/UI/scope fixtures with independent behavior checks and file-change auditing, use [Executable Scenarios](scenarios/README.md). Ordinary rule checks never start a paid AI run.
