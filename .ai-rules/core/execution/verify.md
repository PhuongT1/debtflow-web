# Verification and Completion

**Activate:** patch ready for verification. **Scope:** common command/report obligations; the selected workflow supplies behavior-specific scenarios.

- Choose the smallest configured checks covering the changed behavior and risk; retain explicit owner-required commands. Use current diagnostics, targeted tests/lint and relevant type checks. Build when configuration, framework output, routing integration or unresolved compilation evidence requires it; do not run a whole-project build merely because a UI file changed. Shared exports/dependencies require boundary and affected-consumer checks.
- Before a command, establish its working directory, target files/test pattern, mode and whether it writes files. Prefer check-only commands for verification/review; formatters, lint autofix, code generation and snapshot updates are edits, not evidence-only checks. Keep authorized fixes scoped and review their diff.
- A successful exit code is insufficient when no relevant tests were selected or the acceptance case was skipped/gated. Confirm matching cases actually ran; distinguish pass, fail, skipped, unavailable and not applicable. Do not update a snapshot/baseline solely to make a failure disappear.
- When behavior depends on a feature flag, release/build mode, locale or host/embedded context, select the affected variants and assert their expected behavior. Do not copy another repository's test matrix or run unrelated combinations.
- Do not overwrite an active development server's output during production validation; isolate conflicting builds. Do not invent test commands or add a runner merely for reversible CSS.
- For runtime/browser changes, distinguish compilation, server/runtime errors and observed user behavior. Where a compatible framework introspection tool is available, discover its actual tools and confirm the target project/port before using its evidence alongside browser checks. A clean error list is not an interaction test; reconcile disagreements against the same app, route, session and build mode.
- Exercise actual changed behavior; a build alone is insufficient. Shared changes require affected consumers/apps/modes. Record unavailable checks as limits, not passes.
- Reuse successful checks while their relevant inputs/environment remain unchanged. Capture output once and inspect failures rather than rerunning just to filter logs. Failures return to investigation; broaden checks when risk or evidence warrants it.
- Report cause/requested delta, changed owner/files, actual scenarios/commands/results, and remaining gaps. Complete only when acceptance and required checks pass. Documentation-only changes require formatting/link/consistency checks rather than unrelated application builds.

## Concise reporting

Default to the result, material change, actual verification and remaining limits. Scale detail to task risk and the user's requested format. Summarize successful checks; include exact commands or source paths when they help reproduce or assess the result. Do not dump logs, repeat the plan/rules, list every internal step or claim savings without measurements. Explain a failure or unresolved decision with enough evidence to act on it; brevity must not hide incomplete work.

**Exit:** verified requested outcome or explicit incomplete verification. Do not expand scope to repair unrelated failures without [permission](change-scope.md).
