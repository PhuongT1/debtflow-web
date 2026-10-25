# Hooks

**Activate:** creating or changing a custom hook contract. **Scope:** this responsibility only; apply project facts and the selected task workflow.

- A custom hook must use React behavior and have a cohesive purpose. A pure parser/formatter is an ordinary function, not `useSomething`.
- Extract a hook for meaningful reuse or a complex, independently understandable stateful responsibility. Do not create a hook solely to move ten lines out of one readable component.
- Hook names describe the capability: `usePartyFilters`, not `usePageLogic`, `useInit`, or `useEverything`.
- Pass explicit parameters. Return the minimum values and semantic actions callers need; prefer a named object for several outputs.
- Ordinary state/effect hooks must run at the top level, before conditional returns, in a React component or custom hook. Do not call them in event handlers, loops, or ordinary helpers. Do not introduce special React APIs without checking their own semantics and the installed version.
- A hook must not return a component function defined during render or hide UI composition that belongs in a component.
- Keep transport serialization/DTO parsing in the existing client or adapter; a hook coordinates React state and lifecycle.
- Give subscriptions/timers an owner and cleanup. A hook must remain correct across mount, cleanup, and remount.

React reference: [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components).

## Hook API example

A domain hook can expose a focused shape such as `useListFilters`:

```ts
return { params, applyFilters, clearFilters, changePage, changePageSize, changeSort };
```

- Return parsed values and domain actions, not React setters, HTTP transport, unrelated toasts, and a component factory together.
- A pure parser such as `parseListFilters` remains callable without React. The hook connects it to URL subscriptions and actions.
- Share behavior through hooks; two calls do not automatically share one state instance. If consumers need the same state, lift its owner or use the existing scoped provider.
- Keep dependencies explicit. An action used by an effect must have a deliberate identity/dependency contract; do not add `useCallback` to every returned action automatically.
- Use a reducer when a named transition must update several related values atomically; keep separate simple state when the values are independent.

**Accept when:** each value has one source of truth; Back/Forward and clear-filter behavior are defined; a new hook can be explained by one capability; no hidden global state is introduced.

Further reference: [React state structure](https://react.dev/learn/choosing-the-state-structure) and [custom hook reuse](https://react.dev/learn/reusing-logic-with-custom-hooks).
