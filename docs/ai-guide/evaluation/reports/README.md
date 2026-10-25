# Codex Pilot Results

Three isolated Codex CLI tasks ran on 24 October 2026 against an exported snapshot of the reusable rules and a small JavaScript project profile. This tests task-specific behavior, not production readiness or statistical efficiency. No baseline variant was run; no percentage token/time saving is established.

## Observed results

| Task                                                        | Actual result                                                                                           | Input tokens | Cached input tokens | Output tokens | Elapsed seconds |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -----------: | ------------------: | ------------: | --------------: |
| Plan a one-line action layout; no edits                     | Selected Planning; described later UI/browser checks; no edits or invented visual pass                  |       85,487 |              72,448 |           626 |    Not captured |
| Sum numeric strings correctly                               | Existing regression failed before fix; `Number(amount)` correction passed; only target function changed |      109,631 |              97,920 |           707 |           28.80 |
| Change a shared default with unavailable external consumers | Confirmed local baseline; requested explicit decision before edits; external compatibility not claimed  |       93,644 |              76,544 |           593 |           27.83 |

Usage comes from CLI `turn.completed` events and is cumulative across the agent's model turns. Cached input is part of input tokens, not additional usage. Totals: **288,762 input**, including **246,912 cached**, and **1,926 output** tokens. These are not the size of one prompt or a dollar estimate. The first trial's duration was not measured; it is not zero. The other timings measure CLI process wall time, excluding developer review.

The first trial used the CLI default model, which its JSON trace did not identify. Trials two and three explicitly used `gpt-6.1-sol` with medium reasoning. All used ephemeral sessions with user configuration disabled; the first used a read-only sandbox, the others workspace-write restricted to temporary fixtures. No browser tools, application framework or installed app dependencies were available.

## What worked and what did not

- All three met their narrow predeclared acceptance: plan-only restraint, local regression correction, and approval under unknown external impact. The parent agent reviewed command traces, final files and test evidence; this was not a blinded independent review.
- Explicit rule-file content reads plus the entry were 9, 11 and 10 respectively. Filename listings are not counted as content reads. No unrelated framework topic was read in these fixtures.
- Efficiency was imperfect: the planning task made unnecessary sequential reads; the shared-impact task first searched the wrong extensions, then listed the whole tree. Its primary task workflow was not explicitly named, though its approval behavior was correct. These observations prevent claiming full rule compliance or optimal classification.
- No UI implementation was exercised by an independent Codex agent. The documentation website was separately browser-tested; that does not substitute for a generated-UI benchmark.

## Follow-up changes and evidence

After the pilot, the selector clarified that plan/read-only requests should avoid implementation/full verification reads unless a concrete planning question requires them. Context guidance now discourages guessed extension filters and broad rule-library listings. These refinements passed document/tool checks but were **not rerun through Codex**, respecting the three-task budget. Their effect on tokens/time remains unknown.

The checked-in record is `tooling/rules-kit/evaluation-results/codex-pilot.json`: prompts, rules snapshot hash, usage, command summaries, final responses and reviewer observations. Raw JSONL traces remain in `/tmp/debtflow-ai-trial-{ui,function,shared}.events.jsonl` for this local session and may be removed by the OS. Temporary fixture source is not a new production feature.

Use the [paired protocol](../README.md) with frozen source/model/tools and repeated trials before claiming savings or accepting a policy based on these small results. Provider caching, prompt history and tool round trips must be accounted for consistently.

## Research informing the design

- [VitePress deployment](https://vitepress.dev/guide/deploy): separate build/preview and explicit deployment base path. This project implements that operating model with its existing viewer, without adding VitePress.
- [GitHub instruction scopes](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions): repository-wide versus path-specific instructions; support depends on the client/feature.
- [Claude Code modular rules](https://code.claude.com/docs/en/memory#organize-rules-with-clauderules): splitting files alone does not imply conditional loading; unconditional rules may still load at startup.
- [Evaluating AGENTS.md, v3](https://arxiv.org/abs/2602.11988v3): context files did not generally improve success in the studied settings and increased average inference cost. This motivates task-based measurement, not an assumption that more instructions improve results.
