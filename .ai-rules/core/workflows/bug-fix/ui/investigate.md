# Investigate a Browser Defect

**Read when:** the defect occurs on a browser surface. Covers visual and behavioral failures; does not prescribe a framework implementation.

- Open the actual reported route and repeat the trigger with the available browser tool. Prefer accessibility snapshots, stable roles/names, batched actions, and waits for specific outcomes; avoid fixed sleeps.
- Inspect visible output, console errors, and failed/4xx/5xx responses. Record only relevant route, locale, inputs, and account/state. Keep credentials/tokens out of evidence; avoid unrelated destructive actions.
- **Visual defects:** record viewport in CSS pixels and relevant content; capture a baseline screenshot. Inspect affected widths, line count, wrapping, alignment, clipping, and overflow owner.
- **Behavioral defects:** record the interaction, state transition, and relevant request/result. Screenshot only when appearance matters.
- Trace the owning render/handler/style chain and support the suspected cause. For layout, inspect feature configuration before shared primitives. If reproduction is unavailable, state the blocker and use strongest source/log evidence without claiming confirmation.

**Exit:** evidence-supported cause or explicit investigation limit. Next: [implementation](../implement.md) after any required planning/review gate; see [workflow](../README.md#investigation).
