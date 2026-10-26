# React Study

This review uses the local `react/react` checkout at commit `a6b912fbe77f698ad43c922f206db0d4f4ad7485`. It examines instructions for developing React itself, not an application coding standard or proof that every upstream skill is optimal.

## How this checkout organizes AI

| Observed source                                                                                                                                  | Role                                                                     | What Debtflow adopts                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| [CLAUDE.md](https://github.com/react/react/blob/a6b912fbe77f698ad43c922f206db0d4f4ad7485/CLAUDE.md)                                              | Short root map distinguishing React and Compiler                         | Establish owner before selecting instructions                                                                              |
| [.claude/instructions.md](https://github.com/react/react/blob/a6b912fbe77f698ad43c922f206db0d4f4ad7485/.claude/instructions.md) and settings     | React-core instructions injected by a Claude SessionStart hook           | Keep required instructions reachable through entries for all supported clients; a hook is not a portable loading mechanism |
| [.claude/skills](https://github.com/react/react/tree/a6b912fbe77f698ad43c922f206db0d4f4ad7485/.claude/skills)                                    | Small command-oriented skills: test, verify, lint/format, Flow and flags | Explicit purpose, owner command, target/mode and common mistakes                                                           |
| [Compiler instructions](https://github.com/react/react/blob/a6b912fbe77f698ad43c922f206db0d4f4ad7485/compiler/CLAUDE.md) and nested skills/rules | Separate compiler architecture, verification, plans and specialized work | Separate reusable procedures from local owner facts; load only the affected responsibility                                 |
| Compiler orchestrator/reviewer profiles                                                                                                          | Specialized multi-stage porting, review and checkpoints                  | Reconcile current progress with source/history, preserve role boundaries; no mandatory delegation or automatic commits     |

This checkout does not contain root `.agents/` or `.cursor/` directories. Its explicit tool settings and hooks focus on Claude; this is not evidence that every AI client loads its instructions automatically. Debtflow retains generated client adapters and a shared canonical source to support its multi-client team.

## Practical improvements applied here

The [verification contract](../../../.ai-rules/core/execution/verify.md) now makes three checks explicit:

- Establish the command's owner directory, target/pattern, mode and write behavior. A formatter or snapshot update is an edit, while a check-only invocation is verification.
- Confirm relevant cases ran. A zero-test run, skipped acceptance case or unavailable runner cannot be reported as a passing behavior test.
- Select variants from the changed behavior: flags, locales, standalone/embedded context or build modes. Assert both meaningful states when they differ; do not copy React's release-channel matrix.

The [loading contract](../../../.ai-rules/core/execution/load-instructions.md) avoids relying on hidden client hooks for shared policy. The [planning workflow](../../../.ai-rules/core/workflows/planning/README.md#4-execute-and-update) checks a resumed plan against current source and history before acting on stale remaining-work items.

React's skills are useful examples of concise task guidance, but its `yarn`, Flow, renderer/channel commands, Compiler/Rust paths and command permission settings belong to React. Debtflow uses its own npm scripts, TypeScript, app owners and integration modes. Do not add generic `/test` or `/fix` skills that obscure which command or owner applies, or copy a verify skill that silently formats files during a read-only review.

## Assessment of the current rule library

The current `core/` separation is appropriate: skills select a task, workflows own its stages, execution modules handle common gates, framework/concern modules are conditional and project files supply actual architecture. No folder migration or additional skill layer is justified by this comparison.

Keep routine use short: entry → project profile → selected skill/workflow → current-stage evidence. Do not read every rule, create a plan file for each fix or load upstream research pages during ordinary product work. Existing workflow/skill coverage, document links, projection drift and export checks protect structural consistency.

This is a structural assessment, not measured proof of the best token cost or agent success rate. Use [Evaluate AI Workflows](../evaluation/README.md) for controlled task trials before claiming an efficiency improvement. Add or split a module only when a recurring task needs an independently selectable responsibility; extend its existing owner otherwise.
