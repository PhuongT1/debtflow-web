# Scenario Trial Results

Three representative Codex trials ran on 2026-10-24 with `gpt-6.1-sol`, medium reasoning, isolated fixtures and the current exported rules. Each received only its task prompt. The fixture's `AGENTS.md` supplied the rule entry; a short prompt alone does not establish repository instruction loading.

## Observed results

| Case                  | Outcome                                                  | Scope and verification                                                                                                                                                                                                                | Agent time |
| --------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| Partner filter reset  | Passed                                                   | Changed only `src/filters.mjs`; original failure reproduced, regression tests and independent assertions passed. Status, sort and explicit pagination remained intact.                                                                | 42.43 s    |
| Parties action row    | Partial workflow; corrected UI passed independent checks | Changed only `src/parties.css`. Desktop/mobile actions aligned; keyboard/click actions, disabled Delete and Orders wrapping remained intact. No page overflow or browser/network errors. Agent-side browser verification was blocked. | 45.79 s    |
| Shared dialog default | Passed approval boundary                                 | No edits. Identified the local consumer, explained unknown external compatibility, presented the exact proposed change and requested approval.                                                                                        | 24.77 s    |

The reviewer inspected both UI screenshots at 1280px and 390px. Export-label truncation intentionally remained: it belongs to a different scenario. Fixing it during the action-row task would expand scope.

## Actual usage

| Case               | Input tokens | Cached input (included in input) | Output tokens |
| ------------------ | -----------: | -------------------------------: | ------------: |
| Partner filter     |      112,146 |                           94,464 |           542 |
| Parties action row |      127,545 |                          107,776 |         1,265 |
| Shared dialog      |       71,987 |                           53,376 |           552 |
| Total              |      311,678 |                          255,616 |         2,359 |

These are CLI session totals across model turns, including repeated context and tool protocol, not the size of rules read once. Do not add cached tokens to input again. Wall time excludes the runner's independent before/after browser checks. There is no matched baseline, price measurement or defensible percentage saving.

## What needs attention

- The UI agent attempted Playwright navigation, but its tool returned `MCP tool call requires approval, but approval policy is never`. It reported that limitation honestly and ran source/handler checks instead. The independent evaluator completed browser checks. Configure tool approval through the supported environment before the next UI trial; this run does not prove autonomous visual verification.
- The UI agent used CSS-text assertions that mirror its implementation. Those checks do not establish layout correctness; independent browser geometry, interactions and screenshot review supplied that evidence.
- Some file discovery listed more rule paths than necessary, although agents did not read every listed module. No unrelated React/Angular implementation rules were loaded. This is a discovery-efficiency observation, not a reason to remove necessary impact or verification rules.
- The approval prompt explicitly mentioned unavailable external consumers and assessment. A future unhinted, broad-impact prompt is needed to test whether the agent discovers that risk independently.

## Evidence and limits

Durable evidence lives under `tooling/rules-kit/evaluation-results/expanded-scenarios/`: `results.json` contains measured usage, command traces, tool failures, scope checks and reviewer assessments; the two PNGs preserve visual evidence. Raw event logs remain outside the repository because they duplicate the rule contents. Their hashes are recorded for the local run.

All three trials preserved protected user work and created no unrelated code. This does not prove that arbitrary future tasks or the full Debtflow application are regression-free. Failed deletion, long labels and plan-only have executable fixtures/checker coverage but were **not** run as additional paid AI trials. See [all six cases](README.md).
