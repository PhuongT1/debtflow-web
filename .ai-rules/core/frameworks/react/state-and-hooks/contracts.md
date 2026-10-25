# State Contracts

**Activate:** URL, draft, async or reset state transitions. **Scope:** this responsibility only; apply project facts and the selected task workflow.

| Situation                                      | Required representation / transition                                                                                                                |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| A selected row comes from query data           | Store `selectedId`; resolve the current record from the latest data. Define what happens when it disappears.                                        |
| Create and edit dialogs are mutually exclusive | Use a union such as `{ kind: 'closed' }`, `{ kind: 'create' }`, `{ kind: 'edit'; partyId: string }`; avoid independent flags allowing both to open. |
| A filter changes                               | Validate/normalize it, reset page to 1, and preserve unrelated URL parameters. Clearing removes only owned filter keys.                             |
| Browser Back changes committed filters         | Read the new URL; refresh the visible filter draft according to its explicit edit/reset contract.                                                   |
| A parent needs to apply a filter               | Expose `applyFilters(values)` rather than `setParams` or a writable `URLSearchParams` object.                                                       |
| A value does not affect rendering              | Use a ref only for an actual imperative need; do not hide renderable state in refs.                                                                 |
