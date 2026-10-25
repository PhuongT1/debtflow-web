# Component Responsibilities

**Activate:** changing component responsibility, composition, or extraction boundaries. **Scope:** React implementation; permission comes from execution rules.

## Component responsibilities

A component should describe a recognizable UI responsibility: a screen, section, table, row, form, dialog, or control.

- A screen/container may connect domain data, URL filters, mutations, translation, and child components. It must not absorb HTTP transport, every field renderer, and all domain calculations into one file.
- Presentation components receive the data and callbacks they need. They must not discover the current user, call a domain endpoint, or read a global store merely to avoid explicit props.
- Small app-specific visual wrappers may add defaults, accessibility, and styling to the installed UI library or native controls. Do not wrap a library component without adding a stable, useful contract.
- Keep small private helpers in the same module. Extract a substantial independently changing section, or reusable behavior with a clear owner.
- Do not declare a component inside another component's render function. Define it at module scope so its component identity is stable.
- Use composition through `children` or named slots such as `actions` / `footer` when structure varies. Avoid a universal component controlled by many unrelated booleans.
- Render components as JSX (`<PartyTable />`), not by calling component functions.
- Prefer function components for new ordinary UI. Preserve existing class-based integration and error-boundary requirements; do not migrate unrelated components as part of adoption.

A practical component order is: props/type declarations, component declaration, hooks, pure derived values, handlers, explicit state branches, JSX. This is an organizational default, not permission to violate Hook ordering.

**Exit:** changed responsibility satisfies these requirements; use the selected workflow for verification.
