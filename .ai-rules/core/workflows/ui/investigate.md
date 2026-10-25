# Investigate Appearance

**Activate:** appearance-only task. **Read boundary:** reported route, owning render/column/style configuration, and only implicated shared primitives.

- Record expected/actual appearance, viewport in CSS pixels, locale, relevant content/state, and working changes. Locate owner under [context boundaries](../../execution/context.md).
- Open the actual route using the available browser tool. Prefer stable roles/names and accessibility snapshots. Capture baseline screenshot when judging visual appearance.
- Inspect affected widths, line count, wrapping, alignment, clipping, and overflow owner. Check console errors and failed/4xx/5xx responses once for baseline.
- Trace the shortest render/style chain; inspect feature configuration before changing shared defaults. If the cause is behavioral, [switch rules](../../execution/switch-rules.md).
- No fixed sleeps, unrelated destructive actions, secret output, or claimed reproduction when browser access is unavailable.

**Exit:** supported cause and scope, or explicit access limit. Return to [UI sequence](README.md) for impact/permission gates.
