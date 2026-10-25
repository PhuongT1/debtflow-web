# Without Attachment

## Project instructions are already loaded

The team has connected the tool to the correct repository and configured it to load [AGENTS.md](../../../AGENTS.md) or a small tool-specific adapter pointing there. That entry leads to the [canonical rule selector](../../../.ai-rules/README.md).

Use only the task:

```text
Fix /parties: keep the action buttons on one line.
```

No attached Markdown is needed. The AI reads the selected workflow and current-stage rules from the repository. It must not read every rule or ask you to repeat testing and reporting instructions.

## Repository access exists, but entry loading is not configured

Use a short explicit entry reference:

```text
Read AGENTS.md in debtflow-web, then fix /parties: keep the action buttons on one line.
```

This names a file to read; it does not attach or load that file by itself. The AI must actually open it. For future task-only prompts, [configure entry loading once](../project-context/README.md).

## No repository access

The task sentence is insufficient for project-compliant implementation. Follow [project context setup](../project-context/README.md); do not assume an AI knows local rules from a route name or previous conversations.
