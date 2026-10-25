# Rendering and Component Identity

**Activate:** changing JSX logic, component identity, keys, or render purity. **Scope:** React rendering; style values alone do not trigger this module.

## Render purity and JSX

- Client rendering must be pure. Do not start imperative requests, write storage, navigate, subscribe, or call mutations during Client Component render. Server Components may load data through the established server layer as described in the Next.js guide; do not turn server loading into a client effect merely to follow this rule.
- Do not mutate props, React state, Hook results, or query-cache objects. Copy arrays before sorting when the array belongs to a caller/cache.
- Use functional state updates when the next state depends on the previous state.
- Keys must represent stable record identity. Do not generate keys during render or use array indexes for reorderable/editable records. Generate a client-only row ID once when creating an unsaved row.
- Use explicit conditions such as `items.length > 0` rather than rendering a number accidentally with `items.length && ...`.
- Use early returns or named subcomponents for substantial loading/error/empty branches. Avoid nested ternaries that hide state handling.
- Do not use `dangerouslySetInnerHTML` for untrusted content. A sanitized rich-content requirement needs a dedicated boundary and security review appropriate to the task.
- Use refs for focus, measurements, or third-party DOM integration; keep ordinary UI rendering declarative. Avoid document-wide selectors to manipulate another component's DOM.

React reference: [Rules of React](https://react.dev/reference/rules).

**Exit:** changed responsibility satisfies these requirements; use the selected workflow for verification.
