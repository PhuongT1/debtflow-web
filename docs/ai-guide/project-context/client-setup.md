# Client Setup

Use this after cloning the repository, switching AI tools, or pulling changes to skills/roles. These are repository-local capabilities; generating them does not install a global plugin or configure a disconnected chat account.

## Before you begin

Install and sign in to your chosen AI application, CLI or editor extension using its own setup instructions. This repository does not install Codex, Claude Code, Cursor or Copilot. Open or connect the `debtflow-web` checkout so the tool can read its files; a separate chat account without repository access cannot discover these local skills.

Use Node.js 22.23.1 from `.nvmrc` and npm 10+ for the repository setup command. Application dependencies are a separate step described in [Run the project](../../getting-started/run-project.md). The AI setup itself uses Node built-in modules and can run before dependency installation.

## Step 1: Generate the client files

Open the `debtflow-web` repository in your editor and terminal. Use the Node.js/npm versions declared in its `package.json`. From the repository root, run:

```bash
npm run rules:setup
npm run rules:doctor
```

The setup command refreshes workflow selection, reads canonical skills/roles from `.ai-rules/core/` and any local capabilities from `.ai-rules/project/`, then generates client files and `.ai-rules/CATALOG.md`. Successful output reports current capabilities and client paths; counts may change as the library evolves. Setup does not install dependencies or change model/account permissions. If it reports a conflict, resolve it with a maintainer before using the affected generated files.

`rules:doctor` checks workflow synchronization, generated-file drift and selected client entry files without changing them. A pass confirms repository wiring only; it cannot check login, model permissions or whether an active session has discovered a skill. Resolve any reported conflict before repeating setup.

Optional external skills and MCP tools have separate version/client prerequisites. See [Next.js Study](../how-ai-works/nextjs-study.md) before adding Next.js tooling; the reviewed installation is on Next.js 15 and cannot use the newer runtime MCP loop as-is.

## Step 2: Open your AI tool

Open the same checkout in Codex or Cursor. For Claude Code, open a terminal at the repository root and run:

```bash
claude
```

Complete sign-in if prompted. If the command is missing, follow the official [Claude Code quickstart](https://code.claude.com/docs/en/quickstart#step-1-install-claude-code), then return here. Keep installation instructions with the tool vendor rather than maintaining a second installer guide.

Start a fresh session or refresh discovery after generation. **Expected result:** your tool sees the generated paths for its row below; the next step checks actual loading.

There are two different loading steps: **project instructions** establish the working contract; **skill discovery** exposes names/descriptions and loads a selected skill when relevant. The entry instructs the AI to read `.ai-rules/README.md`, the short `.ai-rules/project/README.md` and relevant owner instructions. It does not preload the entire library.

| Tool        | What it uses in this repository                                                         | What you do                                                                                                       |
| ----------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Codex       | `AGENTS.md` plus `.agents/skills/<name>/SKILL.md`                                       | Open this repository, start a new session or reload, and check the available skill list/picker                    |
| Claude Code | `CLAUDE.md`, `.claude/rules/ai-toolkit.md`, `.claude/skills/`, `.claude/agents/`        | Start Claude Code in this repository, start a new session or reload, and check skill commands and agent discovery |
| Cursor      | `.cursor/rules/ai-toolkit.mdc` and `.cursor/skills/`                                    | Open this workspace and reload discovery when necessary                                                           |
| Copilot     | Existing repository instructions plus `.github/instructions/ai-toolkit.instructions.md` | Enable supported repository instructions; this adapter is not a native skill/agent installer                      |

The generated skill body points to the maintained workflow under `.ai-rules/core/workflows/`. The workflow selects only the affected execution/framework/standard modules and local extensions. All clients therefore use the same procedure with this project's architecture, even though their discovery folders differ. Claude's `.claude/agents/` contains optional role profiles; skill discovery is separate from starting a subagent.

## Step 3: Confirm instruction and skill loading

Open the same repository in your chosen tool and reload/start a new session after setup. Generated files alone do not prove the current session has reloaded them.

**Where to type:** the following text goes in your AI conversation, not in the terminal.

For a safe first check, explicitly select `engineering-plan` in the client's skill picker, or invoke `$engineering-plan` in Codex / `/engineering-plan` in Claude Code, and request:

```text
Plan only: find where a new reusable input would belong in this project.
Do not edit files. Report the existing component you inspected, the project
instructions you actually read, and the checks you would use.
```

Inspect actual skill invocation and file-read evidence when the client exposes them. Confirm that the response uses this project's architecture, component conventions and available commands. A file existing on disk or an AI saying “understood” does not prove discovery or correct behavior. Then use ordinary task prompts; you do not need to attach the entry file on every request.

The catalog links every current source skill and role. Native agent registration is provided for Claude Code; the other tools can use role profiles as references, but this generator does not register native Codex/Cursor/Copilot subagents.

Before your first implementation task, confirm all three outcomes:

- Setup completed without conflicts and printed your selected client's paths.
- The client discovered `engineering-plan` and the plan-only check used actual repository evidence without editing files.
- You can find the same source in the website: **AI Guide → Skills → Engineering Plan → SKILL**, with `.ai-rules/core/skills/engineering-plan/SKILL.md` shown as its path. Start the viewer with `npm run docs:dev` and open `http://127.0.0.1:4317/ai-guide/`.

If any outcome is missing, use the troubleshooting table below before relying on automatic task prompts.

## Step 4: Give your first task

Once the plan-only check succeeds, describe the result you need in the AI conversation:

```text
Fix /parties: keep the action buttons on one line.
Follow the existing shared table and verify the affected viewports.
```

Skill selection is optional. The project entry directs ordinary prompts to the relevant workflow; you may select a matching skill explicitly. Review the diff, actual checks and any reported limitations using [Result Review](../result-review/README.md).

> [!NOTE]
> Run setup again after pulling toolkit changes or changing enabled clients. You do not need to run it before every prompt. Generated files do not prove an active AI session has loaded them.

## Use another AI

Client adapters are declared in `.ai-rules/clients.json`, not scattered across setup code. The default setup generates the team's common clients. To choose different registered clients on your machine, create the ignored `.ai-rules/tools.local.json` with their client IDs and run the same setup command.

For a repository-aware tool without a native adapter, use:

```json
{ "targets": ["generic"] }
```

Setup creates `.ai-rules/generated/INSTRUCTIONS.md`. Configure that tool's repository-instruction setting to read this entry once; it points to the same AGENTS.md, selector, project profile and capability catalog. Generation alone does not make an unknown tool auto-load instructions. A tool without repository/file access still needs access or supplied context.

To add native support, a maintainer verifies the tool's documented discovery paths and format, adds an adapter to `.ai-rules/clients.json`, and tests setup plus an actual discovery task. Existing Agent Skills or Markdown-instruction formats can be configured through the registry. A different native agent format requires an implemented renderer; do not label it supported by renaming a Claude profile. Unknown client names fail explicitly instead of producing misleading files. Local selection never changes the team's default targets.

## Source versus generated output

```text
.ai-rules/core/skills/       Shared skill sources: edit here
.ai-rules/core/agents/       Shared role sources: edit here
.ai-rules/project/           Project facts and local capability sources
          ↓ npm run rules:setup
.agents/skills/              Codex output
.claude/skills/              Claude Code output
.claude/agents/              Claude Code role output
.cursor/skills/              Cursor output
```

Switching from Codex to Claude Code does not require rewriting the source skill. Both projections are already generated by the default setup. If using a remote workspace, ensure it has the repository and run setup there; local files do not automatically appear on the remote machine.

## Team contribution contract

- For ordinary product work, give the outcome, affected route/feature and acceptance behavior; inspect the resulting diff and actual checks. You do not need to edit skills or run setup before every task.
- Maintain shared procedures in `.ai-rules/core/`; put architecture, library choices and source-owner facts in `.ai-rules/project/` or the affected owner's instructions. Edit human onboarding under `docs/ai-guide/`, which the website reads directly.
- After changing toolkit sources, run `npm run rules:setup`, then `npm run rules:check` and `npm run docs:build`. Commit canonical sources, tools, documentation, registry and the managed `.gitignore` block. The marked workflow-selector table remains part of the shared source entry; include its update when changing workflow metadata.
- Client projections, `.ai-rules/CATALOG.md`, `.ai-rules/.toolkit-generated.json` and `.ai-rules/tools.local.json` are local ignored artifacts. Do not commit or hand-edit generated outputs; each member recreates them with setup, like installed dependencies. Stable source entries such as AGENTS.md and CLAUDE.md remain versioned.
- The Frontend Architecture workflow runs setup from source before toolkit checks and docs build. Local checks do not configure branch protection or prove every model follows the rules; review actual behavior as well.

The registry supplies team defaults, optionally overridden by shared `.ai-rules/project/tools.json`. Members can select registered clients with their ignored `.ai-rules/tools.local.json`. Setup manages ignore patterns for every registered adapter, independent of a member's selection; changing personal selection should not create source diffs. See [Toolkit](../how-ai-works/toolkit.md#setup-and-synchronization).

## Update and troubleshoot

| Situation                             | Action                                                                                                                                                    |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pulled toolkit changes                | Run `npm run rules:setup`; refresh client discovery                                                                                                       |
| Edited workflows, skills or roles     | Follow the team contribution contract above; the same setup command refreshes both selectors and clients                                                  |
| Command says package.json is missing  | Switch to the repository root                                                                                                                             |
| Skill is absent in the client         | Confirm the generated directory exists, the target is enabled, and the client is open on this repo; reload/start a new session and check its discovery UI |
| Setup refuses a modified/unowned file | Keep the file, inspect the conflict and contact a maintainer; do not delete user changes or edit the ownership manifest to force an overwrite             |
| AI cannot read this repository        | Connect repository access or supply the smallest relevant context; setup on another machine alone cannot fix access                                       |

See [Toolkit](../how-ai-works/toolkit.md) for the prompt-to-result flow and official client documentation, [Project Context](README.md) for instruction access, and [Rule Reuse](../../engineering/rule-reuse/README.md) for adopting in a different project. The website renders this Markdown source directly; there is no separate onboarding copy to maintain.
