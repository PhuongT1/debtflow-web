# Implement Appearance Changes

**Activate:** appearance cause understood and edit authorized. **Scope:** requested visual delta; existing behavior remains intact.

- Reuse the [common edit check](../../standards/common.md#before-an-edit); open its detailed gates only for actual shared/uncertain/broader changes.
- Select only the owning framework's styling/accessibility topics through [implementation rules](../../execution/implementation-rules.md). Style values alone do not activate component props/state/form guides.
- Correct at the narrowest owner using established tokens/primitives. Preserve full required content, actions, accessible names, focus, permissions, and translations.
- Do not hide content, shrink fonts, truncate labels, or introduce global overrides merely to disguise a defect. For table wrapping, inspect feature column/action sizing and keep bounded scrolling; do not impose one global width.
- Newly required JSX/state/data changes trigger [rule switching](../../execution/switch-rules.md) and renewed scope assessment.

**Exit:** focused patch ready for [visual verification](verify.md).
