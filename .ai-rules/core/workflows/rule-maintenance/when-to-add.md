# When to Add a Rule

**Activate:** deciding whether a new/changed policy is warranted.

| Finding                                                                                     | Action                                                                             |
| ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Existing rule already covers the problem                                                    | Apply it; improve its selector/example only if discoverability caused the mistake  |
| Repeatable cross-task mistake or a missing boundary decision                                | Add/refine the rule at the narrowest owner that needs it                           |
| User explicitly establishes a lasting standard                                              | Record it in the canonical owner and link it from the relevant selector            |
| One-off incident, temporary workaround, personal session preference, or unproven hypothesis | Keep task notes/report; do not create permanent policy unless explicitly requested |
| Actual architectural decision rather than an instruction                                    | Record rationale in `docs/`; keep a short actionable rule linking to it if needed  |

Search the relevant index and likely owner first. Do not load all framework modules looking for a duplicate.
