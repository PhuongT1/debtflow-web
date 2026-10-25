# Implement a Component Change

**Activate:** creation/modification contract understood and authorized. **Scope:** selected component and necessary approved callers.

1. Complete the [common edit check](../../standards/common.md#before-an-edit). Reuse established evidence; load the detailed shared/impact/scope gates only when triggered. Component creation still requires understanding its intended consumers and authorized contract.
2. Select only changed [implementation topics](../../execution/implementation-rules.md): responsibility, props/contracts, rendering, state, forms, data, styles, or file/import organization. Never load every framework topic.
3. Keep public inputs minimal and callbacks semantic; use types consistent with the project's language mode. Assign pending/error/state ownership once. Separate domain transport/policy from generic presentation; preserve required attributes, refs, supported customization, defaults, and controlled values.
4. Use the existing styling, copy/localization and primitive conventions; tokens, translation catalogs and shared packages apply only when present. Publish exports where the owning architecture requires them and update only necessary authorized callers. Avoid unused configuration, speculative abstraction, or dependency additions.
5. Preserve existing behavior except the explicitly requested delta. [Switch rules](../../execution/switch-rules.md) when new responsibility is discovered.

**Exit:** focused patch ready for [consumer verification](verify.md).
