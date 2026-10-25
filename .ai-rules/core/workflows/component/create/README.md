# Create a Component

**Workflow kind:** entry
**Select when:** New reusable component
**Selection priority:** 70

**Activate:** new reusable UI. **Excludes:** modifying an existing component or structural extraction; use the family selector only if intent is unclear.

| Order | Action and detailed rules                                                                                                                                                          | Required evidence                                              |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| 1     | [Define contract and owner](define.md), using [bounded context](../../../execution/context.md)                                                                                     | Consumers, states, inputs/outputs; existing primitives checked |
| 2     | [Scope](../../../execution/change-scope.md); [impact](../../../execution/impact.md) for existing callers; [shared restrictions](../../../execution/shared-code.md) when applicable | Authorized patch and understood dependencies                   |
| Gate  | [Approval](../../../execution/approval.md) if impact/permission unclear; [planning](../../planning/README.md) for multi-stage decisions                                            | Required decision resolved before dependent changes            |
| 3     | [Component implementation](../implement.md)                                                                                                                                        | Typed minimal contract; only selected framework topics loaded  |
| 4     | [Consumer verification](../verify.md) and [owner checks/report](../../../execution/verify.md)                                                                                      | Requested states and actual callers verified                   |

No speculative abstraction, unused options, or rewriting every caller merely because a component is reusable. Newly discovered responsibilities trigger [rule switching](../../../execution/switch-rules.md). [Linked diagram](flow.md) is optional.
