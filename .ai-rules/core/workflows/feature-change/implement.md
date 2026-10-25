# Implement Requested Functionality

**Activate:** acceptance criteria and ownership clear; implementation authorized. **Scope:** requested capability and necessary authorized integration.

- Apply [scope](../../execution/change-scope.md), [impact](../../execution/impact.md) for existing code, and [shared restrictions](../../execution/shared-code.md) when applicable. Unknown impact or an out-of-scope prerequisite activates [approval](../../execution/approval.md).
- Select only applicable [implementation topics](../../execution/implementation-rules.md): component, forms, state/data, auth, contracts, configuration, or styles based on actual edits.
- Reuse existing architecture/primitives. No speculative extra features, migrations, abstractions, or dependency upgrades. New reusable UI may activate [component creation](../component/create/README.md) for that subtask.
- Newly discovered requirements trigger [rule switching](../../execution/switch-rules.md) and renewed permission checks; loading a rule is not scope authorization.

**Exit:** requested behavior implemented for [acceptance verification](verify.md).
