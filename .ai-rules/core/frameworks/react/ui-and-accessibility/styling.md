# Styling

**Activate:** shared presentation, visual tokens, local/global styling or responsive ownership. **Scope:** this responsibility only; apply project facts and the selected task workflow.

- Reuse the app's page/form/dialog/table primitives and existing public shared components before adding alternatives.
- Promote a component to a shared package when multiple apps need the same presentation and its API is understood. A single feature's business form stays in its feature.
- Shared presentation receives labels, values, slots, and callbacks. Network actions, session policy, and return destinations belong to the app or neutral integration capability.
- Use the configured design tokens and theme for shared font families, type roles, colors, spacing conventions, and component states. Avoid arbitrary per-app overrides of shared controls.
- Inspect comparable components and the installed styling setup, then use its existing CSS Modules, scoped styles, utility classes or library theme APIs. For example, MUI `sx` applies only where MUI is installed and that convention is established. Do not introduce a second styling system or global selectors that restyle unrelated buttons/tables.
- Local presentation styles belong with their component. Global CSS belongs in the framework-owned stylesheet and must have a documented scope.

Compare equivalent computed type/color/spacing roles across affected consumers; do not compare unrelated display and compact typography roles. Library-specific styles apply only to installed dependencies.

**Accept when:** the scoped change follows the configured tokens and unrelated consumers retain their presentation contracts.

## Theme layers and control states

- Define brand ramps and semantic roles at the existing theme/token owner, then map them into the installed UI library. Components consume roles, not copied color literals. Distinguish canvas, card, inset and floating surfaces; pair each background with readable foreground, border and elevation in light/dark modes. Do not assume the solid-action color is also readable as text on every surface.
- Keep hover, selected, focus, disabled and error states in the shared control/theme owner. Use the installed library's supported variant/slot APIs instead of brittle generated class combinations. Respect token units: a numeric library radius may be a multiplier rather than pixels.
- Reuse one icon family, optical size and stroke convention. Semantic icon tiles use paired foreground/tint roles with adequate contrast; do not use strong status fills as decorative backgrounds by default.
- A Select, menu or anchored desktop picker must not dim the page like a modal. Preserve its transparent dismissal layer, portal, focus and outside-click/Escape behavior. Scope tinted backdrops to genuinely modal surfaces, including intentionally modal mobile pickers; never apply a colored backdrop globally to invisible layers.

## Table density

- Expose named sizes at the shared table owner when consumers need different density. Keep header/body padding, controls and skeletons consistent with the selected size; avoid per-screen pixel overrides.
- Treat row height as a minimum/content requirement, not a fixed clamp. Inspect computed cell padding, line height and nested element margins before reducing it; long or multiline content must remain readable. Avoid accidental paragraph margins inflating rows.

## Skeleton fidelity

- A page skeleton represents the page it replaces: reuse the same layout specification for content width, header/actions, responsive filter grid, table columns, fixed-column behavior, row density and footer placement. Do not substitute an unrelated generic table placeholder.
- For embedded screens, responsive layout must use the embedded viewport/container width, not the outer browser width. Keep shared configuration declarative; placeholders must not fetch business data or import another app's private components.
- Derive the visible placeholder row count from available space when necessary; API page size is not a visual row-count policy. Preserve the table's normal row height rather than stretching a few skeleton rows to fill it.
- For a skeleton change, capture loading and ready states with Playwright at the same route, locale, viewport and sidebar state. Inspect both screenshots and compare important bounds (header, filter rows, table start, column widths, row height and footer). Include near-breakpoint/narrow layouts. A skeleton rendering without errors is not evidence that it matches the real screen.

## Empty table states

- Center an empty-state message in the visible table scrollport/body, not across the offscreen minimum table width or a fixed-column region. Respect the available body height after the header/footer.
- Keep empty-state layout independent of fixed-column configuration; do not scatter per-screen fixed-column toggles or offsets to compensate for a shared layout defect. Preserve column widths and fixed behavior when data returns.
- Use a meaningful decorative empty-state icon and translated text. Retain the component's icon override contract; do not announce a decorative icon separately from its message.
- Verify empty/no-match states before/after horizontal scrolling, narrow layouts, and transition back to data. Check both viewport centers and existing header/row behavior in affected consumers.
