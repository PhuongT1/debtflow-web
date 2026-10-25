# Scope and Permissions

**Activate:** authorization is unclear, the required outcome broadens, or a migration/public-contract change is proposed. Routine local patches use the [common edit check](../standards/common.md#before-an-edit). **Scope:** authorization; no framework-specific policy.

Define the requested outcome, necessary edits, preserved behavior, and exclusions from the prompt plus prior explicit approvals. A different necessary file is not automatically scope expansion; unrelated outcomes, migrations, and compatibility changes are.

| Proposed action                                                                                | Permission                                              |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Bounded read/search/reversible local verification                                              | Proceed within relevant investigation scope             |
| Requested local implementation with understood impact                                          | Proceed after applicable standards/impact checks        |
| Existing component/hook/utility/config edit                                                    | First apply [impact assessment](impact.md)              |
| Shared/reusable code or global-default edit                                                    | Also apply [shared-code restrictions](shared-code.md)   |
| Unrelated cleanup, speculative abstraction, dependency upgrades, or extra features             | Do not include; request approval if needed for the task |
| Architecture/public-contract migration or broader compatibility change beyond authorized scope | Stop dependent edits; follow [approval](approval.md)    |
| Uncertain permission or impact after targeted investigation                                    | Follow [approval](approval.md); no optimistic edit      |

Do not treat “fix it,” file access, tool availability, or a successful typecheck as unlimited authorization. Do not commit/push, discard user changes, or perform unrelated destructive actions without explicit instruction. Prior approval applies only to its stated scope; silence is not approval.

**Exit:** proposed patch is authorized and impact understood, or a specific pending approval prevents dependent edits.
