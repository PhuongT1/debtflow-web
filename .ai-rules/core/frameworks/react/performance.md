# Performance and reuse

Read when optimizing rendering, memoizing, lazy-loading, or introducing an abstraction. Start with the [React rule index](README.md) for scope and selection.

- Start with straightforward components and derived values. Add `memo`, `useMemo`, or `useCallback` for a measured expensive path or a concrete identity-sensitive integration, not to every declaration.
- Memoization must not be required for correctness or used to bypass effect dependencies.
- Pass focused props and colocate transient state so a typing/menu interaction does not unnecessarily update an entire page.
- Do not introduce a generic table/form/query framework to solve one feature. Prefer an existing primitive plus domain-specific composition.
- Avoid redundant request waterfalls when independent data can be loaded together; keep server/client data ownership explicit.
- Lazy-load genuinely heavy optional UI where the framework supports it. Do not change bundling/client boundaries solely on speculation.

## Optimization decision table

| Observation                                                            | First action                                                                    | Avoid                                                     |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Typing rerenders a large screen                                        | Move transient draft state to its owning input/section                          | A global store or memoizing every child                   |
| A large pure calculation is repeatedly expensive                       | Measure that path; memoize with complete inputs if it helps                     | Using a memo to store mutable state                       |
| An effect/third-party subscription restarts because a callback changes | Fix its dependency/ownership contract; stabilize the callback if required       | An empty dependency array hiding stale captured values    |
| A shared table recalculates scroll shadows                             | Compare next/current flags before setting state, as the existing container does | State updates on every scroll event with identical values |
| A large optional dialog/editor dominates initial bundle                | Check actual bundle impact and isolate/lazy-load that client boundary           | Converting a whole server page to client code             |
| Filter requests overlap                                                | Correct key/cancellation/debounce behavior first                                | Increasing debounce delay to hide a race                  |

Do not add `React.memo` unless props can remain meaningfully stable and the render is worth skipping. A new object/function prop defeats a shallow comparison; a custom comparator must not hide changed callbacks or stale data. No memoization is required for correctness.

For each performance change, record the interaction measured, the suspected cause, and the observable improvement. Keep memoization only when it solves that cause or a documented identity-sensitive integration. Avoid promising performance gains from file splitting or a barrel rewrite without evidence.

**Accept when:** the original interaction still works, dependencies stay correct, and evidence explains why the optimization helps. No speculative provider/store/dependency is added.
