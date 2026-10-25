# Verify Refactor Equivalence

**Activate:** structural patch ready. **Scope:** observable contracts and discovered consumers.

Compare relevant before/after inputs/outputs, UI states, callbacks, identity/timing, cleanup, navigation, query behavior, and public exports using existing tests or actual callers. Check only contracts affected by the refactor.

File/export/dependency changes require architecture/consumer checks. Shared changes require identified apps/modes, not just one caller. Follow [common checks and reporting](../../execution/verify.md). Report unavailable equivalence evidence explicitly; do not infer behavior preservation from compilation alone.

**Exit:** requested structure with supported behavior equivalence, or failed checks returned to investigation.
