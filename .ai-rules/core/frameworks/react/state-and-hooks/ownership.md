# State Ownership

**Activate:** choosing a source of truth or provider boundary. **Scope:** this responsibility only; apply project facts and the selected task workflow.

Choose the source of truth before adding state:

| State                                                                     | Preferred owner                              |
| ------------------------------------------------------------------------- | -------------------------------------------- |
| Open dialog/menu, row selection, password visibility                      | Nearest component / common parent            |
| Search, page, sort, selected detail/tab that must survive sharing or Back | URL through the app's routing helpers        |
| Remote data, request status, cache                                        | Existing TanStack Query or server data layer |
| Form values, validation, dirty/submitting state                           | Existing React Hook Form instance            |
| Global locale/session/platform integration                                | Existing app provider or Platform SDK        |
| Totals, filtered arrays, display labels derived from current inputs       | Compute during render / pure helper          |

- Lift state only to the closest owner shared by its consumers. Do not add context or a global store for convenience.
- Do not duplicate a query response in local state just to render it. A deliberate editable draft must have explicit save/cancel/reset semantics.
- Avoid mirrored flags such as `isOpen`, `isClosed`, and `isVisible` for the same state. Model mutually exclusive states with a union when several booleans become ambiguous.
- Preserve current inputs when changing language or opening/closing unrelated UI. Reset only on an explicit action or a documented record/lifecycle transition.
- For a prop-driven editable draft, define what a new record/version does. Prefer a controlled value, explicit reset action, or an identity-based remount over an effect that overwrites edits on every prop change.
- Context must have a narrow app-local responsibility. Do not share React context, state stores, or query clients across independently deployed MFEs.
