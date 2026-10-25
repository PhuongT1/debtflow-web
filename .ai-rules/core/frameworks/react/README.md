# React Rule Index

Reusable React implementation rules. Confirm the target project's installed libraries, aliases, source layout and owner instructions; do not infer them from examples.

## Read selectively

1. Read this index when React topics still need selection, plus applicable common/owner instructions. If the [implementation selector](../../execution/implementation-rules.md) or selected workflow already chose the exact topics, open those directly without reading this index again.
2. Each topic contains reusable decisions and acceptance criteria. Dependency-specific examples apply only when that library/version is installed. Concrete paths, commands and local examples belong to the project profile; load only its matching topic.
3. Select only the modules whose triggers match the actual change. Add another module when the scope expands. **Do not read every file in this folder by default.**
4. Before completing the work, read [verification.md](verification.md) for the applicable checks, unless selected workflow stages and owner instructions already establish the required checks. Read it when commands, behavioral coverage, or expanded scope remain unclear. Reading a linked file does not require recursively opening all its references.

| Task or changed responsibility                                                                                   | Read                                                      |
| ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Create/move files; place components, hooks, utilities, schemas, or services; define feature boundaries or naming | [structure.md](structure/README.md)                       |
| Add/change imports, aliases, feature APIs, package exports, or dependencies                                      | [imports.md](imports.md)                                  |
| Create/change a component, props, callbacks, composition, or JSX                                                 | [Component topic selector](components/README.md)          |
| Add/change state, context, URL state, drafts, or a custom hook                                                   | [state-and-hooks.md](state-and-hooks/README.md)           |
| Add/change an effect, subscription, timer, debounce, or async cleanup                                            | [effects.md](effects.md)                                  |
| Change fetching, API adapters, query keys, cache invalidation, or mutations                                      | [data-fetching.md](data-fetching.md)                      |
| Change fields, validation, defaults, reset behavior, or form submission                                          | [forms.md](forms/README.md)                               |
| Change styling, shared UI, responsive layout, tables, dialogs, or accessibility                                  | [ui-and-accessibility.md](ui-and-accessibility/README.md) |
| Change locale/formatting, navigation, auth integration, or error contracts                                       | [integration.md](integration.md)                          |
| Optimize rendering; add memoization, lazy loading, or a reusable abstraction                                     | [performance.md](performance.md)                          |
| Plan checks or verify a change                                                                                   | [verification.md](verification.md)                        |

Examples: an import-only correction needs `imports.md`; a stateful component selects the affected `components/` topics and `state-and-hooks.md`; add `structure.md` and `imports.md` when creating its file. A form submission change needs `forms.md` and `data-fetching.md`; add other modules only for responsibilities actually changed.

## Scope and policy

- **MUST / must not** identifies a requirement. **SHOULD / prefer** identifies a default; document the concrete reason when departing from it.
- For Next.js rendering, routing, and configuration, also apply [nextjs.md](../nextjs/README.md). Angular follows [angular.md](../angular/README.md), not these React modules.
- Apply the relevant [i18n](../../concerns/i18n.md), [authentication](../../concerns/authentication.md), [security](../../standards/security.md), and [API contract](../../concerns/api-contracts.md) policies when touched. Topic modules complement those policies; they do not replace them.
- Folder/code examples describe the target convention, not a requirement to create empty modules or restructure unrelated files.
- External references inform runtime/library behavior; project-specific layout, naming, and import choices belong in its project profile. Check the installed version before using an API from latest-version documentation.
- Existing code is compatibility evidence, not automatic proof of the standard. Improve it within the task's scope; do not copy an exception into new work.

## Process comes from the task workflow

Use the selected [framework-independent workflow](../../workflows/README.md) for investigation, planning/user review, implementation stages, and retesting. This React index selects implementation standards; it does not replace the task process or require all topic files.

Project audits and migration notes are optional local evidence; do not load them for routine tasks.
