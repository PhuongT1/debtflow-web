# Feature Boundaries

**Activate:** changing feature layout or dependency direction. **Scope:** this responsibility only; apply project facts and the selected task workflow.

Group related components and their supporting hooks/types/schemas by the feature or technical capability they serve. A large shared component family should separate its composition from lower-level primitives when they have distinct responsibilities; do not let a generic `components/` or `ui/` directory become an unrelated flat collection. Apply the same ownership rule to shared packages and app wrappers. Group a growing feature by cohesive responsibility: list, detail, form and shared domain/API/model modules when they contain real work. Within that scope use concise meaningful names such as `list/toolbar.tsx` instead of repeating every ancestor in a long filename. Keep one public feature entry; do not make an index for every subfolder. Start a small feature with a flat structure. Add subfolders such as `forms/`, `list/`, `detail/`, or `hooks/` when those are real responsibilities with several related files.

Illustrative expanded feature; create only the modules needed by the task:

```text
src/
  app/<route>/page.tsx           # route adapter
  features/parties/
    index.ts                    # intentional external feature API
    party-list.tsx          # screen orchestration
    party-table.tsx             # domain presentation
    party-form.tsx              # domain form
    use-party-filters.ts        # React state + interaction
    hooks/use-parties.ts        # query lifecycle, cancellation and cache policy
    party-schema.ts             # validation
    party-types.ts              # feature-owned shared types
    party-formatters.ts         # pure domain transformations
  components/ui/button.tsx      # app presentation primitive
  services/parties/             # HTTP operations/contracts when app-owned
  lib/routing/pagination.ts     # technical URL helper
```

- Separate domain hooks from HTTP services according to the project profile. A feature hook must not force transport code to depend on feature UI. Do not add a global hook folder for every feature-specific hook.
- Dependencies must flow from route composition to features and from features to app primitives, technical capabilities, or public packages.
- `components/ui`, `lib`, and shared packages must not reach into routes or feature internals. If reusable UI needs domain data, pass a small view model or children from the feature.
- A feature must not import another feature's private implementation. Use its intentional public API for a deliberate dependency, or compose both at their common route/layout owner.
- Do not create circular feature dependencies. Extract a genuine shared contract or move orchestration upward instead.
- A feature's own files must not import that feature's `index.ts`. Internal files import one another directly.
- App-owned layouts can compose feature public APIs where the app architecture permits it; do not put business orchestration in a generic visual primitive.
- Shared packages must never import app source. React apps must never import each other's `src/`, even through an alias or a dynamic import.
