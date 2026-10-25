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
