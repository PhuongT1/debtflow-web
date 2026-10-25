# Placement

**Activate:** choosing the canonical owner of a rule.

- `core/execution/`: framework-independent classification transitions, context boundaries, impact, permission, and approval rules.
- `core/workflows/`: task stages and evidence requirements, independent of frameworks.
- `core/frameworks/<framework>/`: implementation syntax, lifecycle, APIs, and framework-owned file conventions.
- `core/standards/`: general code conventions, security and cross-app boundaries.
- `core/concerns/`: shared auth, i18n, contract or tooling policy; use reusable concern principles only when their responsibility is affected; they do not imply multiple apps.
- `project/`: adopting-project facts, commands, aliases and local examples; do not export these as framework rules.
- App/package `.ai-rules/`: local ownership, supported entry points, and team-specific constraints.
- `AGENTS.md` / tool instruction files: entry points and selection links, not copied policy bodies.

Extend an existing focused module when the trigger/owner is the same. Create a new file only when the topic is independently selectable and combining it would make unrelated tasks read unnecessary rules. If two tiny modules are always loaded together, consolidate them under their common responsibility; line count alone is not a reason to split. Preserve the first-read path and test links after any move.

For multi-stage workflows, use `core/workflows/<family>/<operation>/` when operations are related, with a short `README.md` execution guide. Split only independently selectable responsibilities: UI versus non-UI investigation, implementation, and affected-surface verification. Keep short common transitions/checks/reporting in the guide; do not create a file per procedural sentence. Aim for roughly 100–250 words per specialized module where practical, without a hard limit. Each module states its trigger, scope, required actions, and exit evidence. Prompt selection belongs only in the [root README](../../../README.md). UI/non-UI branches belong in their own subfolders. Every workflow action and diagram node must link to its detailed instructions (file or exact section); no unlinked behavior labels. Optional diagrams belong inside their workflow folder and link to canonical modules. The local viewer reads these diagrams rather than maintaining duplicate graph data. Do not create parallel routers or copy policy into onboarding guides.

Project-specific source maps and documentation viewer guidance belong to the local project profile/onboarding, not the reusable rule library.
