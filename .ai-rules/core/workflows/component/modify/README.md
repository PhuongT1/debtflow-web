# Modify a Component

**Workflow kind:** entry
**Select when:** Change an existing component’s API, composition, states, or behavior without a reported defect
**Selection priority:** 50

**Activate:** intentional changes to existing props, composition, states, or behavior. Existing failures use [bug fix](../../bug-fix/README.md); appearance-only work uses [UI](../../ui/README.md).

| Order | Action and detailed rules                                                                                           | Required evidence                                                             |
| ----- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 1     | [Bounded investigation](../../../execution/context.md)                                                              | Before/after behavior and purpose understood                                  |
| 2     | [Common edit check](../../../standards/common.md#before-an-edit), then its shared/impact/scope gates when triggered | Contracts, consumers, preserved behavior and meaningful checks                |
| Gate  | [Approval](../../../execution/approval.md)                                                                          | Required if impact/permission unresolved or scope expands; no dependent edits |
| 3     | [Component implementation](../implement.md)                                                                         | Requested delta only; relevant framework modules selected                     |
| 4     | [Verify consumers](../verify.md), then [checks/report](../../../execution/verify.md)                                | Affected states/callers checked; limitations explicit                         |

Do not redesign unrelated consumers or introduce abstractions merely because a component is open. New evidence activates [rule switching](../../../execution/switch-rules.md), not broader edit permission. [Linked diagram](flow.md) is optional.
