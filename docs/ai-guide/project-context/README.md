# Project Context

New team member or switching between Codex and Claude Code? Start with [Client Setup](client-setup.md) for the exact commands, generated paths and discovery check.

This repository includes native skill projections and optional roles. Run `npm run rules:setup` once after adopting or changing canonical capabilities, then confirm discovery in the client. See [Toolkit](../how-ai-works/toolkit.md) for client paths, configuration and limitations. The project profile still supplies the actual architecture; installing a skill is not a substitute for project context.

Do this when connecting an AI tool to the project, not before every task. The rules are shared; each tool has its own way to load repository instructions.

## With repository access

1. Select the `debtflow-web` workspace. Being in `debtflow-api` does not establish the frontend's instructions.
2. Configure the tool's project-instruction entry to load [AGENTS.md](../../../AGENTS.md). If it uses a different entry format, keep that adapter small and point it to `AGENTS.md`.
3. Ensure the AI can read `.ai-rules/README.md`, the selected modules and the relevant source files.
4. Check once: **“Which project entry and workflow did you actually read for this task?”** Inspect its file-read evidence when available. The AI must distinguish files it read from files it only intends to read.
5. Use [short task-only prompts](../prompts/without-attachment.md) after confirming entry loading works in that workspace/session.

A link on this website, a local URL or a skill name alone does not establish access to its contents. Tools that do not retain project context need the entry supplied again in a new session.

## With uploads only

Attach the project entry and state its original repository path. Provide the canonical selector, the selected rule modules and relevant source as needed. Do not upload the entire rules library by default.

If a required link cannot be resolved, AI should request the smallest missing file/context, explain what decision it blocks, and continue only independent analysis. Without source/tool access, it may propose a change but cannot claim it edited or verified the project.

[Attachment guidance](../prompts/with-attachment.md) · [Canonical loading behavior](../../../.ai-rules/core/execution/load-instructions.md)
