# Component Development

Start here when adding or changing a component. This is the member-facing checklist for the detailed rules: it shows what to check, when it applies and where the maintained requirement lives. You do not need to discover the rule library file by file.

Use the affected app's [project profile and owner instructions](../../.ai-rules/project/README.md) to establish its architecture, libraries and commands. The linked canonical rules remain authoritative; this guide summarizes them rather than defining another coding policy. AI setup is covered separately in [Client Setup](../ai-guide/project-context/client-setup.md).

## Before you write code

1. Find the screen/feature owner and inspect a comparable implementation, existing primitives and real consumers. Decide whether to reuse, extend or create.
2. State the component's responsibility, inputs, events and observable acceptance behavior. Identify the data, URL, form and local UI owners before adding state.
3. Use the checklist below for the responsibilities actually involved. A static display component does not need query keys, an HTTP service or a form library.
4. Implement within the existing architecture, verify the changed behavior and review the diff against the same checklist.

## Component checklist

| Check                                            | When it applies                                                      | What the author/reviewer should confirm                                                                                                                                                                         | Maintained rule                                                                                                                                                                              |
| ------------------------------------------------ | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Owner and reuse                                  | Every component change                                               | Existing primitives/consumers were inspected; new code has a clear feature or shared-UI owner                                                                                                                   | [Placement](../../.ai-rules/core/frameworks/react/structure/placement.md), [extraction](../../.ai-rules/core/frameworks/react/structure/extraction.md)                                       |
| Responsibility and props                         | Every React component                                                | The component owns a recognizable UI responsibility; data and semantic callbacks are explicit; related typed props are grouped/spread with deliberate precedence; unrelated responsibilities are separated      | [Responsibilities](../../.ai-rules/core/frameworks/react/components/responsibilities.md), [props](../../.ai-rules/core/frameworks/react/components/props.md)                                 |
| Names and feature structure                      | Creating, moving or splitting files                                  | Names describe behavior, such as `PartyList`; a growing feature groups real list/detail/form/api/model responsibilities; `use client` alone does not require a `Client` suffix                                  | [Naming](../../.ai-rules/core/frameworks/react/structure/naming.md), [feature boundaries](../../.ai-rules/core/frameworks/react/structure/feature-boundaries.md)                             |
| Imports, types and file size                     | Changed source modules                                               | Imports respect public boundaries; params, request, response and form types have distinct roles and reuse matching fields through utility types; the source-size policy or its documented exception is followed | [Code style](../../.ai-rules/core/standards/code-style.md)                                                                                                                                   |
| State and effects                                | State, hooks or lifecycle behavior                                   | Each value has one owner; derived values are not mirrored state; effects synchronize external systems and clean up resources                                                                                    | [State ownership](../../.ai-rules/core/frameworks/react/state-and-hooks/ownership.md), [effects](../../.ai-rules/core/frameworks/react/effects.md)                                           |
| API calls and services                           | Reading or writing remote data                                       | UI uses the owner’s domain hook/service boundary; endpoint construction, credentials, serialization and normalized errors stay at the transport/service boundary                                                | [HTTP ownership](../../.ai-rules/core/concerns/http-client.md), [React data fetching](../../.ai-rules/core/frameworks/react/data-fetching.md)                                                |
| Axios instance                                   | Axios is installed/selected for that owner                           | The configured instance is reused; current headers, timeout, cancellation and error behavior are preserved; JSON is not serialized twice                                                                        | [HTTP ownership](../../.ai-rules/core/concerns/http-client.md)                                                                                                                               |
| Query keys and invalidation                      | TanStack Query is installed and the change touches queries/mutations | Named key factories are reused by queries and invalidation; keys match normalized server inputs; domain hooks call services, forward cancellation and own mutation/cache lifecycle                              | [TanStack Query rules](../../.ai-rules/core/frameworks/react/data-fetching.md#tanstack-query-when-installed)                                                                                 |
| Status values and routes                         | Repeated business statuses or URL construction                       | Typed domain constants and route builders are reused; wire values, URL encoding, filters and pagination behavior remain compatible                                                                              | [Domain values and navigation](../../.ai-rules/core/standards/code-style.md#domain-values-and-navigation)                                                                                    |
| Language and formatting                          | Visible text, errors, validation or locale-sensitive values          | Labels, help, toasts, loading/empty/errors and accessible names use the catalog; dates/numbers respect locale; language changes preserve input                                                                  | [I18n](../../.ai-rules/core/concerns/i18n.md)                                                                                                                                                |
| Forms and mutations                              | Inputs, validation, submit or reset                                  | Field binding, default/reset behavior and errors are explicit; failures preserve retry context; success follows a successful write                                                                              | [Form topics](../../.ai-rules/core/frameworks/react/forms/README.md), [data fetching](../../.ai-rules/core/frameworks/react/data-fetching.md)                                                |
| Shared UI, accessibility and responsive behavior | Reusable UI or interactive controls                                  | Supported shared components/tokens are reused; keyboard/focus, accessible names and narrow-screen behavior work                                                                                                 | [Accessibility](../../.ai-rules/core/frameworks/react/ui-and-accessibility/accessibility.md), [shared consumers](../../.ai-rules/core/execution/shared-code.md)                              |
| Framework and deployment boundaries              | Next.js, Angular or independently deployed consumers are affected    | Apply the actual router/framework and owner contracts; preserve server/client separation and required standalone/embedded modes                                                                                 | [Next.js](../../.ai-rules/core/frameworks/nextjs/README.md), [Angular](../../.ai-rules/core/frameworks/angular/README.md), [MFE boundaries](../../.ai-rules/core/standards/microfrontend.md) |
| Verification                                     | Before calling the change complete                                   | Original acceptance behavior and affected consumers were checked; commands and coverage limits are reported; skipped/zero-case runs are not passes                                                              | [React verification](../../.ai-rules/core/frameworks/react/verification.md), [completion contract](../../.ai-rules/core/execution/verify.md)                                                 |

React-specific rows apply to React/Next.js work. For Angular components use the Angular owner rules and the applicable common HTTP, i18n, naming and verification requirements; do not copy React Hooks or TanStack React APIs into Angular.

## Follow the data flow

For an application using TanStack Query and an HTTP service, the responsibility flow is:

```text
Component / screen
  -> domain hook (query, mutation and cache lifecycle)
  -> domain service
  -> configured HTTP client
  -> API

Successful mutation
  -> refresh affected keys from the same key factory
  -> show the outcome through the app's translated UI
```

In Partner Ops, for example, the screen uses:

```ts
const partiesQuery = useParties(filters);
```

In Partner Ops, Party hooks live in `features/parties/hooks/`, app-wide hooks in `src/hooks/`, HTTP services/API contracts in `services/parties/` and domain models in `models/`. Services never import feature UI. Form values are schema-inferred and mapped to explicit request bodies; shared response fields use `Pick`/`Omit` without treating nullable response fields as valid write inputs.

The service has three responsibilities with explicit owners: `party.types.ts` defines its contract, `providers/rest.ts` implements REST and `party.service.ts` binds the configured client. Add provider selection/registry/lazy loading only when the project has an actual need, following the [HTTP/service rule](../../.ai-rules/core/concerns/http-client.md).

For paginated data, the API already supplies `meta.pagination`. Partner Ops normalizes it to `{ items, meta }`; the table call uses `rows={items}` and `{...meta}` instead of repeating `page`, `pageSize` and `total`. Wrapper components use `{...rest}` for unchanged supported props after consuming their own props; do not extract `title`/`toolbar` solely to forward them. Extract values only for local use, transformation or defaults. Partner Ops tables default `rowKey` to `id` through an identified-row contract, with caller overrides supported. Skeletons use the shared default of 8 rows or an explicit `skeletonRowCount`; page size is not an implicit min/max policy. Keep spread precedence deliberate and avoid forwarding raw response fields to the DOM. See [props rules](../../.ai-rules/core/frameworks/react/components/props.md).

The screen does not need an inline endpoint or an ad hoc query-key array. See the [Parties Feature source map](../architecture/parties-feature.md) for the actual files and the [Debtflow data contract](../../.ai-rules/project/frameworks/react/data-fetching.md) for the selected Axios/query-key/route owners. Other projects may use different libraries and paths; the ownership principles remain reusable.

## Organize by feature and component family

Use the owning feature for business components and a capability family for generic UI. In both apps: `ui/form/`, `ui/dialog/`, `ui/page/` and `components/tables/`. In the shared package, `table/data-table/` contains the composed table and its content/loading/state modules; low-level table primitives remain in the parent. Small independent primitives may stay flat. A four-file cohesive feature does not need several extra folders.

Within a named group, `fields.tsx`, `schema.ts` or `content.tsx` is clearer than repeating the whole path in the filename. Exports still describe the responsibility, such as `DebtFormFields` or `DataTableContent`. Keep route files thin and preserve public exports when reorganizing. See the [complete component structure audit](component-structure-audit.md) for the reviewed files, ownership and explicit exceptions.

## Build consistent controls and theme layers

Use shared controls before adding feature-specific alternatives. The [Debtflow UI conventions](../../.ai-rules/project/frameworks/react/ui-and-accessibility.md#shared-ui-conventions) map public components to their theme/token owners and local sizes. The [UI package guide](../../packages/ui/react/README.md) shows their usage.

| Review point        | What to check                                                                                                           | Canonical requirement                                                                                                                    |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Theme and icons     | Semantic surface/text/border/shadow roles, readable light/dark states and one icon family; no scattered color overrides | [Theme layers and control states](../../.ai-rules/core/frameworks/react/ui-and-accessibility/styling.md#theme-layers-and-control-states) |
| Reusable controls   | Supported props, refs, slots and caller overrides survive wrappers                                                      | [Wrappers](../../.ai-rules/core/frameworks/react/ui-and-accessibility/wrappers.md)                                                       |
| Table size          | Shared named density, matching skeleton/header padding, no accidental cell margins or clipped long content              | [Table density](../../.ai-rules/core/frameworks/react/ui-and-accessibility/styling.md#table-density)                                     |
| Open-state behavior | Anchored Select/picker does not tint the page; modal backdrop, focus and dismissal behave correctly                     | [React verification](../../.ai-rules/core/frameworks/react/verification.md)                                                              |

These extend existing styling/wrapper/verification rules; they are not separate per-component policies. Check the affected states in the browser, including relevant standalone/embedded and light/dark modes.

Main-content gutters are owned by [shared layout tokens](../../packages/ui/tokens/src/layout.ts): 12/16/24/28/32px at the MUI xs/sm/md/lg/xl breakpoints. Shell owns ordinary screens; an embedded app owns its own content padding, while Shell keeps its remote outlet at zero. Embedded skeleton frames use the same values through container queries. Angular reads the generated `--df-content-padding` variable. Do not add a second page-level gutter.

## Verify a skeleton against the real screen

Capture loading and loaded states in Playwright at the same viewport, language and navigation state. Compare the screenshots and measure header/actions, filter rows, table position/columns, row height and footer. Responsive placeholders for embedded pages must follow the embedded width, including when it differs from the outer Shell breakpoint. Reuse a shared layout specification; displaying any skeleton is insufficient.

Parties and its Shell placeholder consume [composition presentation metadata](../../packages/platform/registry/src/registrations/partner-ops/loading-layout.ts) and the neutral [ListPageSkeleton](../../packages/ui/react/src/components/table/data-table/page-skeleton.tsx). [The live layout check](../../tooling/e2e/party-skeleton-layout.mjs) compares corresponding bounds with a 1px tolerance and optionally saves both screenshots.

Shell list routes use [table presentation metadata](../../apps/shell/src/components/tables/page-layouts.ts) and the [shared page skeleton](../../apps/shell/src/components/skeletons/table-page-skeleton.tsx). Overdue, Aging and Users apply the same column geometry to their loaded tables. Aging also preserves its metric-card grid. Payments keeps its Angular table/header/footer mounted while rows load; it consumes the generated neutral density tokens rather than React components. The [browser comparison](../../tooling/e2e/shell-table-skeletons.mjs) checks loading/ready column widths, table position and footer bounds.

## Check an empty table

An empty/no-match message belongs in the center of the visible table body, including horizontally scrollable tables with fixed columns. The shared renderer handles this automatically; do not add per-page fixed-column toggles or hardcoded offsets. Verify left/middle/right scroll positions, mobile, and the return to data. The default empty-inbox icon is decorative; `emptyIcon` remains an override. See [shared table presentation](../../packages/ui/react/README.md#empty-table-states) and the [live empty-state check](../../tooling/e2e/table-empty-state.mjs).

## Before opening a pull request

- [ ] The owner, comparable implementation and reuse/placement decision are clear.
- [ ] Applicable checklist rows are satisfied; any deliberate exception names its reason and scope.
- [ ] Loading, empty, error, pending and success behavior relevant to the change were checked.
- [ ] Affected locales, consumers and viewport/deployment modes were checked where applicable.
- [ ] The PR lists actual commands/results and unavailable verification, without treating a build as proof of UI behavior.
- [ ] Changed behavior or conventions have matching documentation and source links.

Use the team's [Contributing](contributing.md) agreement and [Git Workflow](git-workflow.md). The [automation coverage table](contributing.md#what-is-automated) explains which checks are enforced by tools and which require review. A checklist tick or a skill invocation is not evidence that code passed.

## Where to maintain this guidance

| Content                                        | Edit here                                                 |
| ---------------------------------------------- | --------------------------------------------------------- |
| This human overview/checklist                  | `docs/engineering/component-development.md`               |
| Detailed reusable requirement                  | Its linked module under `.ai-rules/core/`                 |
| Debtflow library choices, paths and exceptions | `.ai-rules/project/` or the affected owner's instructions |
| Concrete Parties implementation/source map     | [Parties Feature](../architecture/parties-feature.md)     |

When a canonical requirement changes, update its summary/link here in the same change if affected. Do not paste its full policy body into this page. The viewer reads this Markdown directly and shows its exact source path; there is no separate website copy. AI agents still load the selected workflow and relevant rule modules, not this entire human checklist on every task.

For global dialogs in embedded applications, follow [Cross-Application Overlays](../architecture/overlays/README.md). Register the remote view, reuse the original content, and verify standalone/embedded close guards and completion-driven query refresh.
