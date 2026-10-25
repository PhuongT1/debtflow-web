# Feature Boundaries

**Activate:** changing feature layout or dependency direction. **Scope:** this responsibility only; apply project facts and the selected task workflow.

Start a small feature with a flat structure. Add subfolders such as `forms/`, `list/`, `detail/`, or `hooks/` when those are real responsibilities with several related files.

Illustrative expanded feature; create only the modules needed by the task:

```text
src/
  app/<route>/page.tsx           # route adapter
  features/parties/
    index.ts                    # intentional external feature API
    parties-client.tsx          # screen orchestration
    party-table.tsx             # domain presentation
    party-form.tsx              # domain form
    use-party-filters.ts        # React state + interaction
    party-queries.ts            # query options/keys when reuse warrants extraction
    party-schema.ts             # validation
    party-types.ts              # feature-owned shared types
    party-formatters.ts         # pure domain transformations
  components/ui/button.tsx      # app presentation primitive
  lib/routing/pagination.ts     # technical URL helper
```

- Dependencies must flow from route composition to features and from features to app primitives, technical capabilities, or public packages.
- `components/ui`, `lib`, and shared packages must not reach into routes or feature internals. If reusable UI needs domain data, pass a small view model or children from the feature.
- A feature must not import another feature's private implementation. Use its intentional public API for a deliberate dependency, or compose both at their common route/layout owner.
- Do not create circular feature dependencies. Extract a genuine shared contract or move orchestration upward instead.
- A feature's own files must not import that feature's `index.ts`. Internal files import one another directly.
- App-owned layouts can compose feature public APIs where the app architecture permits it; do not put business orchestration in a generic visual primitive.
- Shared packages must never import app source. React apps must never import each other's `src/`, even through an alias or a dynamic import.
