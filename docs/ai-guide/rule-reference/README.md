# Rule Reference

You do not need to select rules manually. Once project instructions are loaded, AI selects the relevant workflow and reads only the modules needed for the current stage.

| Group               | Responsibility                                                                           | Canonical source                                                                                                                                  |
| ------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Instruction loading | Handle task-only prompts, attachments and missing repository access.                     | [Load instructions](../../../.ai-rules/core/execution/load-instructions.md)                                                                       |
| Task selection      | Distinguish UI, behavior bugs, component work, features and planning.                    | [Prompt selector](../../../.ai-rules/README.md)                                                                                                   |
| Scope and safety    | Check every edit; investigate shared/uncertain impact and ask when needed.               | [Common edit check](../../../.ai-rules/core/standards/common.md#before-an-edit) · [Shared code](../../../.ai-rules/core/execution/shared-code.md) |
| Implementation      | Reuse code and follow the affected framework's structure, components, hooks and imports. | [Implementation topics](../../../.ai-rules/core/execution/implementation-rules.md)                                                                |
| Verification        | Exercise the requested result and report actual coverage honestly.                       | [Verify and report](../../../.ai-rules/core/execution/verify.md)                                                                                  |
| Context efficiency  | Avoid bulk reads; reuse unchanged rules and source evidence.                             | [Bounded reading](../../../.ai-rules/core/execution/context.md)                                                                                   |

## Shared rules and project facts

Reusable workflows and framework principles live in `.ai-rules/core/`. The [project profile](../../../.ai-rules/project/README.md) supplies this project's architecture, libraries, owners, commands and extension triggers. App/package instructions remain close to their source. See [Layers](layers.md) to decide where to edit and how each folder maps to the website. Read [Rule Reuse](../../engineering/rule-reuse/README.md) when adopting or maintaining the library; ordinary tasks do not require those guides.

## One source of truth

`AGENTS.md` and tool-specific entry adapters lead to `.ai-rules/README.md`. `.ai-rules/` owns mandatory requirements. `docs/ai-guide/` explains their use without creating a second rule system.

Use [rule maintenance](../../../.ai-rules/core/workflows/rule-maintenance/README.md) when adding or changing lasting requirements.
