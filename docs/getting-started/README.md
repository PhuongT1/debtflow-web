# Getting Started

Read this page first. It explains the workspace, where documentation belongs, and how to make your first change. Follow the links needed for your task; the handbook is not a required reading sequence.

## Understand the workspace

Debtflow is an npm monorepo with three independently runnable apps:

| App         | Responsibility                                     | Local port |
| ----------- | -------------------------------------------------- | ---------- |
| Shell       | Platform composition, dashboard and authentication | 3000       |
| Partner Ops | Customers, suppliers and parties                   | 3001       |
| Payments    | Payment workflows                                  | 3002       |

`apps/` owns application features. `packages/` holds shared public contracts, integration helpers and presentation. See the [workspace map](../architecture/workspace.md) for exact folders; do not import another app's private source.

## Choose the right documentation

Use the [Documentation Map](../README.md) to match website tabs, sidebar topics and repository paths. Every page displays its source path for opening the same file in your editor.

| Your question                                | Start here                                                                                        |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| How do I run the project and documentation?  | [Run the project](run-project.md)                                                                 |
| Which app/package owns my change?            | [Find the owner](find-owner.md), then [architecture](../architecture/README.md) for that boundary |
| What must a new or changed component follow? | [Component Development checklist](../engineering/component-development.md)                        |
| Which coding convention applies?             | [Engineering](../engineering/README.md), then the matching topic                                  |
| How will AI handle my prompt?                | [AI Guide](../ai-guide/README.md); [worked examples](../ai-guide/prompts/examples.md) when useful |
| Where should I add or update documentation?  | [Documentation structure and authoring](../engineering/documentation/README.md)                   |

`docs/` explains the project to people. `.ai-rules/` contains canonical agent and engineering requirements. `AGENTS.md` is the agent entry point. `tooling/rules-viewer/` displays the same Markdown; it does not maintain a second rules library.

## Make your first change

Before your first component task, read [Component Development](../engineering/component-development.md). It collects the applicable requirements in one place and links the maintained rules and a real source example.

Using Codex, Claude Code or Cursor? Complete [AI Client Setup](../ai-guide/project-context/client-setup.md) once before the first AI task. The same setup command works for the team's configured clients; you do not need to learn the toolkit internals first.

Use [Contributing](../engineering/contributing.md) for the shared coding and review agreement. Before creating a work branch, follow [Git Workflow](../engineering/git-workflow.md) for the team's branch naming convention.

1. [Start the relevant app](run-project.md), then reproduce or describe the intended result.
2. [Find its owner](find-owner.md); read that owner's instructions and the coding topic being changed.
3. Inspect dependencies and existing changes. Reuse the established component, helper or rule before adding another.
4. If using AI, state the outcome, affected route/file and constraints. Ask for “plan only; wait for review” when you need to approve a plan first.
5. Verify the actual behavior and owner checks. Review the patch and reported coverage before merging.

For AI work, the execution path is **classify → investigate → assess impact/permission → implement → verify**. The [prompt-to-result walkthrough](../ai-guide/how-ai-works/README.md) links each stage to its canonical rule. Unresolved impact or permission stops dependent edits; ordinary work already authorized can proceed.

Agents start at [AGENTS.md](../../AGENTS.md), not this human onboarding page. They load only the selected workflow, current-stage rules and relevant source evidence under the [bounded-reading policy](../../.ai-rules/core/execution/context.md).
