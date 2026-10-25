# Verification and Completion

**Activate:** patch ready for verification. **Scope:** common command/report obligations; the selected workflow supplies behavior-specific scenarios.

- Choose the smallest configured checks covering the changed behavior and risk; retain explicit owner-required commands. Use current diagnostics, targeted tests/lint and relevant type checks. Build when configuration, framework output, routing integration or unresolved compilation evidence requires it; do not run a whole-project build merely because a UI file changed. Shared exports/dependencies require boundary and affected-consumer checks.
- Do not overwrite an active development server's output during production validation; isolate conflicting builds. Do not invent test commands or add a runner merely for reversible CSS.
- Exercise actual changed behavior; a build alone is insufficient. Shared changes require affected consumers/apps/modes. Record unavailable checks as limits, not passes.
- Reuse successful checks while their relevant inputs/environment remain unchanged. Capture output once and inspect failures rather than rerunning just to filter logs. Failures return to investigation; broaden checks when risk or evidence warrants it.
- Report cause/requested delta, changed owner/files, actual scenarios/commands/results, and remaining gaps. Complete only when acceptance and required checks pass. Documentation-only changes require formatting/link/consistency checks rather than unrelated application builds.

**Exit:** verified requested outcome or explicit incomplete verification. Do not expand scope to repair unrelated failures without [permission](change-scope.md).
