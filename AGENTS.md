# Debt Flow Web — Agent Instructions

Agent entry point. Developers start at [Getting started](docs/getting-started/README.md); canonical agent instructions live in [`.ai-rules/`](.ai-rules/README.md).

## Select rules; do not read everything

1. Establish [instruction access and attachment roles](.ai-rules/core/execution/load-instructions.md) when not already known. Apply the [default execution contract and prompt selector](.ai-rules/README.md), unless already current in context. Short task prompts do not need to repeat the project's workflow obligations.
2. Follow the selected workflow guide and read only modules triggered by the current responsibility. Apply common and nearest owner instructions. Respect read-only, plan-only and explicit review-before-implementation boundaries.
3. Before edits, follow the root selector’s scope/impact gates. Unresolved permission or impact requires developer approval; do not broaden the requested outcome without explicit approval.
4. Follow [bounded reading](.ai-rules/core/execution/context.md) for staged loading and reuse. Human guides and diagrams are optional, not additional required agent context.
5. Preserve user changes. Complete the authorized task through relevant [verification](.ai-rules/core/execution/verify.md) and report actual results, including unavailable checks and remaining gaps.

## Project-specific facts

Read the short [project profile](.ai-rules/project/README.md), then only the matching owner/extension. Keep this entry thin; package managers, ports and aliases are local facts, not reusable framework rules.
