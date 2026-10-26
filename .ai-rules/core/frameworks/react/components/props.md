# Props and Component Contracts

**Activate:** changing props, defaults, callbacks, slots, or wrapper contracts. **Scope:** React contract design; no permission for consumer migrations.

## Props, functions, and types

- Keep the props contract explicit using the project's language conventions. In TypeScript, declare a small named props type: use `type` for closed compositions/unions and `interface` for an intentionally extensible public object contract. In JavaScript, preserve existing documentation/runtime validation conventions rather than introducing TypeScript.
- Destructure only props used locally, transformed, consumed by the wrapper or assigned a default. Forward unchanged supported props such as `title`/`toolbar` through typed `...rest` rather than destructuring and repeating them in JSX. Use defaults for genuinely optional behavior. Group related values through a named contract (for example pagination metadata). Spread a typed, compatible group such as `{...meta}` instead of repeating its fields. Use `{...rest}` in wrappers when forwarding the remaining supported props, after consuming wrapper-only props; preserve documented override order. Never spread an entire API response/domain record or unknown props onto DOM elements. This improves consistency/readability; it is not a rendering-performance optimization.
- Give repeated defaults one owner. An entity table may default `rowKey` to `id` only when its row contract guarantees a stable ID; otherwise require an explicit key/accessor. Preserve overrides, avoid unchecked generic casts and do not use array positions for reorderable records. Skeleton size is a presentation policy: reuse the shared default or a caller override; do not invent min/max clamps from pagination without a documented requirement.
- Use domain values or a small view model, not an entire session/store/API response when the child needs two fields.
- Callback props use `on<Action>`; local handlers use `handle<Action>`. Describe the event's meaning: `onConfirm`, `onPageChange`, `handleSubmit`.
- Pass a domain identifier/value to business callbacks; use DOM event types only where the consumer actually needs the event.
- Do not expose raw React setters when a semantic action communicates the contract better.
- Type async actions deliberately, for example `onConfirm: () => Promise<void>`, and define who catches failures and shows pending state.
- Use `ReactNode` for renderable slots where needed. Do not add `children` to components that do not render it. `React.FC` is not required.
- Use discriminated unions when modes require different props; avoid combinations that allow invalid states such as an editable mode without an update handler.
- Do not use `any`, unchecked casts, or non-null assertions to conceal missing data. Narrow `unknown` at external boundaries.
- Prefer inferred component return types. Add explicit function return types when they clarify an exported nontrivial contract, not mechanically to every expression.
- Pure functions must not read React context or browser state implicitly. Accept their inputs as arguments and return their result without mutating inputs.

For mode-dependent/composed contracts, also select [contracts.md](contracts.md).

**Exit:** changed props and callbacks have explicit typed semantics.
