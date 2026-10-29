# Retest the UI

**Read when:** the patch affects a browser surface. A passing build is insufficient.

- Repeat the original trigger with the same route/state and relevant viewport/locale. Use accessibility snapshots and targeted assertions for structure/behavior; screenshots for visual assessment. A snapshot alone is not evidence of correct alignment or absence of clipping.
- **Visual mode:** verify the corrected bounds/line count/alignment and appearance. Confirm no overlap, hidden required controls, or whole-page overflow. Add narrow/near-breakpoint widths for responsive defects, long content/locales for wrapping, and keyboard/focus checks for changed controls. Choose widths from the layout, not a mandatory device matrix.
- **Skeleton changes:** capture the loading and loaded page at identical viewport/locale/sidebar settings; compare screenshots and key geometry. Check the container viewport when embedded.
- **Behavior mode:** select affected cases only: invalid input, pending/duplicate actions, failure/retry, success, preserved edits/URL context, focus, and nearest regression edge.
- Shared changes require affected standalone/embedded consumers, not just the first app. Inspect console/network again; distinguish deliberately simulated failures.
- Do not perform unrelated destructive actions. Failure returns to [diagnosis](../README.md#investigation); unavailable retesting is a limitation, not a pass.

**Exit:** relevant scenarios checked or limits recorded. Follow [owner checks/reporting](../../../execution/verify.md).
