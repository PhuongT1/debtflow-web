# Common Engineering Rules

- Preserve the project's JavaScript/TypeScript mode. In TypeScript, avoid `any`; narrow untrusted data at boundaries. Do not migrate languages as incidental cleanup.
- Inspect the target module and its local conventions before introducing an abstraction or dependency.
- Prefer small, cohesive files and explicit names. Keep state near its consumers.
- Reuse an existing package or pattern before creating a new one. Do not create speculative abstractions.
- Do not modify unrelated files, reformat unrelated code, or silently change public behavior.
- Do not commit secrets, credentials, personal tokens, generated caches, or local environment files.
- Preserve backward compatibility for public contracts unless the task explicitly authorizes a versioned breaking change.
- Use the owner's configured package manager and commands. Do not mix lockfiles or assume a workspace.
- Select validation from [verification](../execution/verify.md); preserve explicit owner requirements and report unavailable checks.
- Do not use destructive Git operations (`reset --hard`, force push, checkout of user changes) unless explicitly requested.

## Before an edit

**Activate:** any proposed edit. **Read boundary:** target, relevant caller/imports, owner instructions and current changes. This is the entry check for a routine local patch; do not open every linked escalation module.

1. Identify the requested result, the target's purpose, its affected inputs/outputs and the behavior to preserve. A filename alone does not establish ownership or safety.
2. Search usages/exports of the changed symbol or style. Proceed locally only when evidence supports a bounded change within the request, with understood consumers and meaningful verification.
3. Shared/default/core behavior or uncertain propagation activates [detailed impact](../execution/impact.md) and [shared consumers](../execution/shared-code.md). Unclear authorization or a broader outcome activates [scope](../execution/change-scope.md).
4. Investigate concrete uncertainty narrowly. If impact or permission remains unclear, [ask for a decision](../execution/approval.md) before dependent edits. Never use the local path to bypass shared-code checks.

**Exit:** understood, authorized patch and verification boundary, or a specific pending decision. Preserve unrelated user changes; do not create a plan/tracking file for this check.
