# Agents

Role profiles define responsibility, boundaries and return evidence. They do not require delegation or automatically start agents. Native projections are generated for supported clients; other clients can follow the same role in the main conversation. Actual tool access and permissions are controlled by the client, not by Markdown alone.

## Coordination contract

The main agent receives the outcome, establishes repository access and authorized scope, reads the project profile and relevant knowledge, and chooses the task workflow/skill. Preserve explicit plan-only and read-only requests. Investigate the target, a comparable implementation and affected consumers before deciding how to change it.

Use delegation only when the client supports it, session instructions permit it, and a bounded independent responsibility benefits from separation. A small local change does not need a team. Give each worker the outcome, source owner, allowed edits/read-only boundary, relevant contracts, acceptance criteria and known evidence. Do not ask workers to discover the entire repository again or edit overlapping files concurrently. A worker reports a newly required boundary change rather than expanding its assignment.

The parent integrates results, resolves inconsistencies against source evidence, reviews the final diff and verifies the requested outcome and affected consumers. Worker confidence is not verification evidence. Reuse real results instead of blindly rerunning every check; run additional checks when new edits or unresolved risk justify them. Report behavior, changed contracts, actual checks and limitations. Commit/push/deploy and external communications require their own authorization.

## Roles

- [Implementer](engineering-implementer.md): a bounded implementation responsibility.
- [Boundary reviewer](engineering-boundary-reviewer.md): read-only ownership and public-contract review.
- [Verifier](engineering-verifier.md): acceptance and regression evidence; no production fixes.

Project-specific roles may be added under `.ai-rules/project/agents/`; they must have distinct names and obtain architecture/commands from their owner. Do not copy another project's package layers or credentials into a reusable role.
