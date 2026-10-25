# Verify Appearance

**Activate:** appearance patch ready. **Scope:** original viewport/state and relevant edges only.

- Repeat the original route/context. Check corrected bounds, line count, alignment, clipping, or typography using measurements and visual inspection where needed.
- Add narrow/near-breakpoint widths for responsiveness, long content/locales for wrapping, and keyboard/focus for changed controls. Choose widths from the layout rather than a mandatory device matrix.
- Confirm no overlap, hidden required controls, or whole-page overflow; shared changes include affected standalone/embedded consumers from the impact assessment.
- Recheck console/network. Use accessibility snapshots for structure and stable targets; inspect screenshots for visual acceptance. A snapshot alone cannot establish alignment, typography or clipping. Compare equivalent viewport/state; batch safe actions and avoid unrelated destructive operations.
- Follow [common checks/reporting](../../execution/verify.md). Failed checks return to [investigation](investigate.md); unavailable browser checks are limitations, not passes.

**Exit:** requested appearance verified, relevant checks pass, and untested cases are explicit.
