# Effects and async lifecycle

Read when adding or changing effects, subscriptions, timers, or debouncing. Start with the [React rule index](README.md) for scope and selection.

- Effects synchronize with an external system: browser events, storage, DOM integrations, timers, or an external subscription.
- Do not use an effect to calculate values already derivable from props/state, or to trigger an action caused by a button/form event. Put those actions in their handlers.
- Do not suppress dependency checks to make an effect appear to run once. Include reactive dependencies or restructure the responsibility.
- Cleanup must remove the exact listener/subscription and cancel the relevant timer or in-flight work. Do not hide lifecycle bugs with a `hasRun` ref.
- Effect callbacks must not be `async`; put async work inside the effect and return a synchronous cleanup function.
- Prefer the existing server/query data layer over ad hoc request effects. Where an effect-owned request is necessary, handle cancellation or stale results, loading, and errors.
- Debounced search must keep the visible draft responsive, cancel superseded timers, and not let late requests overwrite newer results. Define how external URL changes reset the draft.
- Do not read browser-only globals during SSR/module initialization. A client boundary alone does not mean the first render is browser-only; follow the Next.js rules.

React reference: [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect).

## Choose the mechanism before writing an effect

| Work                                             | Required mechanism                                                |
| ------------------------------------------------ | ----------------------------------------------------------------- |
| Filter/sort/total current records for display    | Pure calculation during render; copy cached arrays before sorting |
| Submit, delete, sign out, show action-success UI | Event handler / mutation lifecycle                                |
| Load list/detail data                            | Existing server adapter or query hook                             |
| Observe an element's size                        | Effect with a ref-owned `ResizeObserver`; disconnect on cleanup   |
| Listen to Platform locale events                 | Effect returning the SDK unsubscribe function                     |
| Debounce an editable search draft                | Cancelable timer with an explicit committed-value/draft contract  |

Each effect must identify its external resource, its reactive inputs, and its cleanup. Separate independent resources instead of coupling them through a broad dependency object.

| Resource created                  | Matching cleanup                                                               |
| --------------------------------- | ------------------------------------------------------------------------------ |
| `addEventListener(type, handler)` | Remove the same type and handler                                               |
| `setTimeout` / `setInterval`      | Clear that timer                                                               |
| `ResizeObserver`                  | `disconnect()`                                                                 |
| SDK event subscription            | Call/return the unsubscribe function                                           |
| Effect-owned fetch                | Abort if supported; otherwise ignore results belonging to a superseded request |

### Debounce ownership

For changes to `DebouncedSearchInput`: A typed draft stays visible immediately; only the committed search is delayed. Typing A then B must cancel A's timer. Clearing filters or browser navigation must update the draft according to its reset contract. A late response for A must not replace B's data. Do not re-create an `onSearch` dependency unnecessarily and restart the delay on unrelated renders.

**Accept when:** setup → cleanup → setup leaves one live resource; unmount cancels owned work; no dependency suppression or async effect callback is added; rapid input cannot display stale results.
