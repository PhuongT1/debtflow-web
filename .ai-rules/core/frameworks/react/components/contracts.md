# Component Modes and Composition Contracts

**Activate:** changing component modes, slot composition, wrapper spread precedence, or pending/error ownership. **Scope:** contract validity, not permission for consumer migrations.

## Pick a component contract

| Component kind                                | Owns                                                             | Receives                                                         |
| --------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| Feature screen, e.g. `PartiesClient`          | Query/filter orchestration, translation, choosing domain actions | Route/record context, not another app's implementation           |
| Domain presentation, e.g. `PartnerDebtsTable` | Domain columns, statuses, row action availability                | Current records and semantic callbacks                           |
| Shared primitive, e.g. `SignOutDialog`        | Focus, pending/error presentation, invoking the supplied action  | Labels and `onConfirm`; no endpoint or current-session discovery |
| Input wrapper                                 | UI defaults and documented value/ref/slot adaptation             | Supported field props; no domain validation schema               |

### Prop contracts must prevent invalid combinations

```ts
type PartyEditorProps =
  | { mode: 'create'; onSave: (input: CreatePartyInput) => Promise<void> }
  | { mode: 'edit'; partyId: string; onSave: (input: UpdatePartyInput) => Promise<void> };
```

Illustrative types: define the DTOs in the actual owning feature/adapter. Do not replace the union with optional `partyId`, optional `onSave`, and independent `isCreate`/`isEdit` flags.

- A reusable async control owns pending/error presentation **or** receives it from its owner; do not create two competing request-status owners. With `SignOutDialog`, `onConfirm` must return the promise and reject on failure so the dialog can restore enabled actions.
- Specify spread precedence in wrappers: defaults before caller props when overridable; enforced invariants after them when intentionally fixed. Never spread an entire domain record onto a DOM element.
- Keep slot names semantic (`actions`, `footer`, `emptyState`). Avoid `renderAnything`, unrelated boolean modes, and passing a whole form/query object when a child needs one value and action.
- Use one exported primary component per ordinary module by default. Private render helpers may remain local; extract one when it has independent state, reuse, or its own substantial responsibility. Existing cohesive primitive families may share a module.

**Accept when:** props express all required mode data, callbacks expose domain values, pending/error ownership is explicit, and the component has no hidden session/transport dependency.

**Exit:** changed responsibility satisfies these requirements; use the selected workflow for verification.
