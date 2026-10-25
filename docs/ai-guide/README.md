# AI Guide

This tab answers **how to set up and work with AI**: connect your tool, give a task, understand its workflow and review the result. For naming, component design and framework coding standards, use [Engineering](../engineering/README.md). Both tabs link to the same canonical `.ai-rules/` sources; they do not define competing rules.

Website topics match the folders beside this file: `project-context/`, `prompts/`, `how-ai-works/`, `result-review/`, and `rule-reference/`. See the [Documentation Map](../README.md) for all tabs.

## First-time setup for team members

After cloning, open a terminal at the `debtflow-web` repository root and generate the client skills:

```bash
npm run rules:setup
```

Use the Node.js/npm versions required by `package.json`. The setup script uses Node's built-in modules; it does not install dependencies or change your AI account settings.

| Tool        | Project instructions                          | Generated skills                 |
| ----------- | --------------------------------------------- | -------------------------------- |
| Codex       | `AGENTS.md`                                   | `.agents/skills/<name>/SKILL.md` |
| Claude Code | `CLAUDE.md` and `.claude/rules/ai-toolkit.md` | `.claude/skills/<name>/SKILL.md` |
| Cursor      | `.cursor/rules/ai-toolkit.mdc`                | `.cursor/skills/<name>/SKILL.md` |

Next, open this same repository in your AI tool, reload/start a new session and follow the one-time [discovery check](project-context/client-setup.md#confirm-instruction-and-skill-loading). The entry files direct the AI to `.ai-rules/README.md` and this project's profile. A selected skill leads to the relevant workflow and conditional coding rules; the AI should not load every skill or rule.

You do not need to recreate skills when switching tools or attach `AGENTS.md` to every prompt. Run the same setup command again after pulling toolkit changes. Setup refreshes both workflow selection and client files; `rules:sync` is the underlying maintainer command. For editing sources and checks, see [the team contribution contract](project-context/client-setup.md#team-contribution-contract). Viewing/building docs only reads sources and does not install skills.

## Choose your starting point

Using a different AI? See [Use another AI](project-context/client-setup.md#use-another-ai) for registered adapters, per-member selection and the generic repository entry. Git stores sources and tools; generated client files and local state are ignored and recreated on each machine. Run setup before viewing the generated capability catalog.

| Your situation                                                                 | Read                                                          |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| You are new to this repository or switching AI tools                           | [Client Setup](project-context/client-setup.md)               |
| The tool can read the repository and already loads its project instructions    | [Prompt without an attachment](prompts/without-attachment.md) |
| You attach a Markdown file to the prompt                                       | [Prompt with an attachment](prompts/with-attachment.md)       |
| You have not connected the tool to this project, or it cannot read local files | [Set up project context](project-context/README.md)           |

Once the entry instructions are loaded, this request is enough:

```text
Fix /parties: keep the action buttons on one line.
```

Requests may be written in another language; documentation and rules are maintained in English.

## What happens next?

[How AI works](how-ai-works/README.md) explains the process. [Review the result](result-review/README.md) explains acceptance. [Rule groups](rule-reference/README.md) shows the governing requirements. Use [prompt examples](prompts/examples.md) when you need a starting sentence.

These guides explain the system. `.ai-rules/` remains the canonical rule source; neither the documentation website nor a file link automatically loads instructions into every AI tool.

Maintaining the rules? Use [Evaluate AI Workflows](evaluation/README.md) to compare accepted results, scope safety, tokens and time. It is optional maintainer documentation, not another required setup step.
