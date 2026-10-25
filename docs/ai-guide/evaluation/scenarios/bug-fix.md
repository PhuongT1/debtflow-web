# Bug Fix Scenarios

| Case ID         | Short prompt                                                                                                                               | Expected behavior                                                                      | Must remain intact                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `filter-reset`  | Fix the partner filter: changing partner must reset the page to 1 without losing the status or sort selection.                             | Reset page when selecting or clearing partner; original state is not mutated           | Status, sort, page size, explicit pagination and unrelated user work |
| `failed-delete` | Fix delete: when the API request fails, the record must remain visible and an error must be returned. Successful delete must keep working. | Failure retains records and exposes error; success removes exactly the selected record | Other records, input data, request count and error reporting         |

Both use the [non-UI bug workflow](../../../../.ai-rules/core/workflows/bug-fix/README.md) and existing Node tests. A browser is unnecessary for these pure behavior fixtures. The evaluator's checks run independently of the agent-editable visible tests, so disabling a test cannot make the original bug pass.

Read code, reproduce the failing case, apply a local correction and retest. Adding unrelated helpers, changing permissions, deleting tests/rules or overwriting `src/unrelated.mjs` is outside the case. Fixtures and assertions are in `tooling/rules-kit/scenarios/fixtures/` and `check.mjs`; see [commands](README.md).
