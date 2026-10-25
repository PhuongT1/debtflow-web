# Layers

Use the folder owner to decide where a change belongs. Agents combine reusable rules with the actual project's contracts; developers maintain one Markdown source, which the website renders directly.

| Layer         | Source                                                  | Put here                                                                   | Example                                                                 |
| ------------- | ------------------------------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Stable entry  | [Rule selector](../../../.ai-rules/README.md)           | Execution contract and generated workflow selection                        | Route a task to its applicable workflow                                 |
| Reusable core | [Core overview](../../../.ai-rules/core/README.md)      | How to investigate, implement and verify; conditional framework principles | Inspect comparable components and consumers before creating a component |
| Project-local | [Project profile](../../../.ai-rules/project/README.md) | Architecture, installed libraries, naming, source locations and commands   | Which UI package owns shared components and how it is checked           |
| Owner-local   | App/package `AGENTS.md` and `.ai-rules/`                | Contracts for the affected source owner                                    | Supported host/embedded modes or domain boundaries                      |

## Choose where to edit

Change `core/` when the decision process or framework principle should apply across adopting projects. Change `project/` or the relevant source owner's instructions when the choice belongs only to this repository. A local preference does not become a reusable requirement merely because current code follows it. Conversely, do not copy common policy into every local extension.

For a new component, the [reusable workflow](../../../.ai-rules/core/workflows/component/create/README.md) asks the agent to inspect existing primitives, consumers and conventions. The project profile and source evidence establish its actual placement, styling and verification commands. No particular folder layout, UI library, package manager or monorepo is implied.

## Website and source mapping

Skills and roles are a second classification alongside core/project: **Skills** reads `.ai-rules/core/skills/`, **Agent Roles** reads `.ai-rules/core/agents/`; local capabilities stay under **Project Rules (Local)**. The generated [catalog](../../../.ai-rules/CATALOG.md) links current capabilities. Native client projections are excluded from the website index, so each capability has one canonical document/search entry. See [Toolkit](../how-ai-works/toolkit.md) for the prompt-to-result flow.

The website's **Rule Entry** group reads `.ai-rules/README.md`. **Core Rules (Reusable)** reads `.ai-rules/core/` execution/workflow pages; Engineering's **Core Standards**, **Core Frameworks** and **Core Concerns** show the other core families. **Project Rules (Local)** reads `.ai-rules/project/`. Owner groups keep their app paths.

Every page displays its actual source path and links to that Markdown. For example, `.ai-rules/core/workflows/ui/verify.md` maps to `/rules/core/workflows/ui/verify/`. Moving a file requires updating links, grouping and bookmark aliases; aliases never create another indexed rule body.

After changing workflow entries, run `npm run rules:sync`, then `npm run rules:check`. Documentation build and viewer startup read source without changing instructions or client configuration. For adding a page, see [Documentation Structure and Authoring](../../engineering/documentation/README.md); for transferring the library, see [Rule Reuse](../../engineering/rule-reuse/README.md).
