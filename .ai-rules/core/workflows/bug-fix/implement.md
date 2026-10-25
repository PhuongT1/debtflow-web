# Apply the Correction

**Activate:** cause and correction understood; implementation authorized. **Scope:** correction of the reported defect, not unrelated redesign.

1. Complete the [common edit check](../../standards/common.md#before-an-edit), reusing investigation evidence. Load its scope/impact/shared-code details only when triggered; unresolved uncertainty stops dependent edits.
2. Select only the matching [implementation standards](../../execution/implementation-rules.md), unless already loaded. Do not read a framework index when the exact topic has already been selected.
3. Fix the cause at the narrowest authorized owner. Preserve inputs, URL/callback context, permissions, accessibility, and public contracts unless the requested change explicitly alters them. Reuse shared capabilities only after assessing their impact.
4. Keep unrelated cleanup, speculative abstractions, arbitrary waits, disabled validation and swallowed errors out of the patch. For a reproducible behavioral defect, use the existing test setup for a regression that fails before the fix and passes after it when practical. Assert observable behavior; report when before/after execution is unavailable. Do not introduce a runner for trivial styling.
5. If new evidence changes responsibility or required scope, [switch rules](../../execution/switch-rules.md) before dependent edits. Rule activation itself never authorizes broader changes.

**Exit:** focused authorized patch. Next: [UI retest](ui/verify.md) or [non-UI retest](non-ui/verify.md), based on affected surfaces.
