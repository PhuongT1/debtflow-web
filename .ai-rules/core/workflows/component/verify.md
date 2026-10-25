# Verify Component Consumers

**Activate:** component creation/modification patch ready. **Scope:** actual callers and affected variants, not every possible component state.

- Exercise a representative real caller and changed states: valid/invalid input, empty/loading/pending, failure/retry/success, controlled values, callbacks, and duplicate actions where relevant.
- Check accessible names, keyboard/focus restoration, narrow layout, and translated/long labels when affected. Use accessibility snapshots first; screenshots for appearance.
- Shared contracts require affected apps/modes and consumers identified during [impact assessment](../../execution/impact.md). Do not check one app then claim all consumers passed.
- For extraction preserve original values, focus, event/request timing, and outputs. An intentional contract change must match explicit authorization.
- Follow [common checks and reporting](../../execution/verify.md). Failures return to investigation; unavailable variants remain explicit limits.

**Exit:** requested component behavior verified in intended callers, owner checks pass, and gaps reported.
