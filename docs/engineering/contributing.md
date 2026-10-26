# Contributing

Use this agreement for human-written and AI-assisted changes. [Client Setup](../ai-guide/project-context/client-setup.md) configures AI discovery; it does not replace these engineering expectations. [Git Workflow](git-workflow.md) owns branch naming.

For component work, start with [Component Development](component-development.md): the member-facing checklist links naming, structure, data/service ownership, optional libraries, i18n and acceptance evidence in one page.

## Decide before introducing a pattern

Read the affected owner's instructions and inspect a comparable implementation and its consumers. Follow the existing supported pattern when it meets the requirement. A historical implementation that violates the maintained rules is not a new precedent: identify the conflict and propose the smallest scoped correction.

| Decision                                                  | Authoritative source                                                                                                                                                                                                                               |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| General naming, types, imports and public exports         | [Code style](../../.ai-rules/core/standards/code-style.md)                                                                                                                                                                                         |
| File placement and dependency direction in React          | [Placement](../../.ai-rules/core/frameworks/react/structure/placement.md), [feature boundaries](../../.ai-rules/core/frameworks/react/structure/feature-boundaries.md), [Debtflow examples](../../.ai-rules/project/frameworks/react/structure.md) |
| Actual aliases, libraries, commands and app/package owner | [Project profile](../../.ai-rules/project/README.md) and its selected local extension                                                                                                                                                              |
| Framework behavior and component contracts                | The matching topic in [Engineering](README.md)                                                                                                                                                                                                     |
| Permission, affected consumers and completion evidence    | Selected workflow from the [rule entry](../../.ai-rules/README.md)                                                                                                                                                                                 |

Keep new helpers beside their owner until real reuse justifies extraction. Inspect existing primitives before adding UI, and existing adapters before adding API access. Reusing a component's name while bypassing its supported contract does not count as reuse. Use the current project's architecture; do not introduce Nimara's package layout, providers or test stack into Debtflow.

## Keep one maintained convention

A change to a lasting convention must identify the problem, canonical rule owner, affected consumers, compatibility and validation. Update the rule and affected documentation in the same change. Reusable decision principles belong in `core/`; Debtflow library choices, paths, commands and exceptions belong in `project/` or the affected owner's instructions.

When two maintained instructions conflict, report the exact conflict and resolve the intended convention with the owner before dependent edits. Do not silently choose a personal preference or rewrite unrelated legacy code. A deliberate exception must be scoped and explained in the PR, with its owner and follow-up or removal condition where applicable; update the local rule if the exception is lasting. Exceptions do not become implicit global defaults.

## Review evidence

The repository [pull request template](../../.github/PULL_REQUEST_TEMPLATE.md) asks every contributor for the requested behavior, affected owners, reuse/placement decisions, actual checks and any exception. Reviewers assess these against the linked sources rather than requesting their own competing style. Documentation-only work can mark application behavior checks as not applicable with a reason.

For an existing-code audit, report findings by severity with file/line evidence, the violated rule, affected behavior and the smallest correction. Separate confirmed violations from design preferences and unavailable evidence. Split unrelated repairs into focused work; a clean lint result is not a whole-repository compliance verdict.

## What is automated

| Check                                                                             | Existing command or mechanism                          | Coverage limit                                                                 |
| --------------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------ |
| Formatting                                                                        | `npm run format:check`                                 | Layout of source text, not architecture or behavior                            |
| App/package lint and types                                                        | Owner commands in package scripts and app CI workflows | Only configured rules and type constraints                                     |
| Workspace dependencies, aliases and integration manifest                          | `npm run check:architecture`                           | Configured static boundaries; does not prove every feature has the right owner |
| Client source entries and local generated-file health                             | `npm run rules:doctor`                                 | Repository wiring only; not client login or active-session discovery           |
| Skill discovery links, workflow coverage, source mapping, projections and export  | `npm run rules:check` after `npm run rules:setup`      | Structural integrity, not model obedience                                      |
| Documentation output                                                              | `npm run docs:build`                                   | Renderable output, not application acceptance                                  |
| Placement rationale, reuse, meaningful tests, public compatibility and exceptions | Author/reviewer evidence in the PR                     | Requires judgment and actual affected-behavior checks                          |

Use the smallest relevant checks while honoring required owner checks. Report commands, outcomes and unavailable coverage. Existing CI workflows run their configured gates; repository branch protection and required statuses must be configured separately by maintainers. This document does not enable those remote settings.

## Maintain AI capabilities

Follow [Maintaining capabilities](../ai-guide/how-ai-works/toolkit.md#maintaining-capabilities) for triggers, exclusions, source ownership and generation. Each shared selectable workflow must have a core skill entry linking to it; each core skill selects one primary workflow. The structural check derives this relationship from current files, so a new or removed workflow cannot silently lose its client discovery entry. Group/reference workflows are not independent skills.

Keep detailed procedures in workflows and task-specific references; skills stay small and describe when to use them. Project capabilities may link to project-owned procedures without becoming mandatory shared workflows. Native role profiles are optional responsibilities, not permission to delegate or implement unrelated changes.

For the concrete service/query-key/route/i18n arrangement in Partner Ops, see [Parties Feature](../architecture/parties-feature.md). New component work activates the relevant core data/HTTP/i18n rules when those responsibilities are present; do not import Axios merely because another project uses it.
