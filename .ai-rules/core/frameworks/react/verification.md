# React Verification

**Activate:** planning or performing checks for a React change. **Scope:** affected behavior; commands come from the project's owner/profile, not from this reusable module.

| Changed responsibility     | Select relevant checks                                                                                             |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Forms                      | Invalid/empty input, Enter submit, pending duplicates, server errors, record reset and preserving drafts           |
| Queries and filters        | Correct keys/requests, reset pagination, clear preserves unrelated state, navigation history, stale-response races |
| Mutations                  | One committed request, recoverable failure, successful invalidation and navigable final page                       |
| Dialogs and menus          | Accessible name, focus entry/restoration, idle cancel/Escape, explicit pending behavior; anchored controls retain transparent dismissal layers while modal surfaces use the intended backdrop                            |
| Authentication integration | Valid/invalid destinations, original return context, direct entry and affected origins/modes                       |
| Shared layout and tokens   | Equivalent computed surface/text/border/elevation roles, narrow overflow and affected light/dark consumers; inspect open controls as well as idle states                                        |
| Exports and dependencies   | Public consumers resolve, runtime dependency declaration and client/server separation                              |

Use the configured type/lint/test/build commands proportionally. Do not invent a unit-test runner or add one just to test reversible styling. Test behavior rather than implementation details, CSS hashes or large snapshots.

For browser work prefer roles/names, accessibility snapshots and batched actions; use screenshots when appearance requires inspection. Inspect unexpected console/network failures without logging credentials. Use the project's available browser tooling; a particular MCP provider is not required.

For theme/control/density changes, inspect browser screenshots and computed styles for the affected states: open Select/picker versus modal, hover/focus/disabled, and table loading/empty/long-content states where applicable. Confirm row density comes from the shared size contract and content can still grow. Test the affected standalone/embedded consumers when they exist. Do not treat a screenshot of the closed control as verification of its popup.

Exercise actual changed behavior and report untested cases. A build alone does not establish interaction correctness. Follow [common verification](../../execution/verify.md); select only the rows affected by the change.
