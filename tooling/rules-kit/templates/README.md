# Reusable AI Rules

This directory is an adoption kit, not a preconfigured application. Its process rules do not require a particular AI tool, framework, package manager or documentation website.

1. Review/copy `.ai-rules/` into the target repository. Do not overwrite existing rules or user changes blindly.
2. Complete [.ai-rules/project/README.md](.ai-rules/project/README.md) from that project's manifests, commands and owner contracts. Configure actual framework/router/language choices; examples are not migration instructions.
3. Connect the tool's project entry to [AGENTS.md](AGENTS.md). Merge the entry instructions if an entry already exists. Tool-specific adapters should point here, not copy the rules.
4. Try a small real task. Review selected rule paths, changed files and verification evidence.

The agent reads the short profile and selected workflow, then only relevant stage/framework/local modules. Keeping Angular rules on disk does not require reading them for React work.

Reusable layer: `.ai-rules/core/` (execution, workflows, standards, frameworks and concerns). Local layer: `.ai-rules/project/`. Keep `.ai-rules/README.md` as the stable selector combining both layers. Update reusable modules deliberately, keeping local extensions separate and reviewing compatibility before replacing an adopted version.

## Maintain workflows

Declare each workflow directory's README as `Workflow kind`: `entry`, `group` or `reference`. An entry also supplies `Select when` and a unique positive `Selection priority`; see [.ai-rules/core/workflows/README.md](.ai-rules/core/workflows/README.md). Lower priorities are considered first. Preserve plan/read-only boundaries when choosing priorities.

After adding/removing/changing entries, run `node tooling/rules-kit/workflows.mjs --write`. This refreshes the generated table in `.ai-rules/README.md` without rewriting its execution contract. Run `node tooling/rules-kit/workflows.mjs --check` in your checks to detect drift. Update inbound references when deleting or moving a workflow; the tool cannot decide what should replace it. Copy `tooling/rules-kit/workflows.mjs`, `setup.mjs` and `clients.mjs` alongside the rules if adopting manually. Documentation build and viewer startup read source only; synchronize explicitly before sharing rule changes.

The optional viewer reads the same Markdown files; it does not maintain a second workflow body. Packaging/link checks establish file integrity, not AI compliance. Validate adoption with a real task against the target project's existing components, architecture and commands.

Client projections and capabilities are maintained with `node tooling/rules-kit/setup.mjs --write` (`--check` for drift). Copy this tool with the rules. It generates repository-scoped skills for Codex, Claude Code and Cursor, Claude role profiles, a Copilot adapter and `.ai-rules/CATALOG.md`. Client paths/formats live in the source `.ai-rules/clients.json` registry. Shared targets may use `.ai-rules/project/tools.json`; each member may override targets in ignored `.ai-rules/tools.local.json`. Generated outputs, catalog and ownership state are ignored; setup manages their gitignore patterns. CI must run setup before checks. Use the registered generic entry for other repository-aware tools, or add a verified native adapter. Canonical skill/role Markdown is the website source; generated client files are not a second documentation library.
