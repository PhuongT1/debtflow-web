# UI-Only Changes

**Workflow kind:** entry
**Select when:** Appearance only: spacing, typography, wrapping, alignment, responsive layout
**Selection priority:** 30

**Activate:** appearance-only changes/fixes: spacing, typography, wrapping, alignment, clipping, responsiveness. **Excludes:** state/data/callback/navigation changes.

| Order | Action and detailed rules                                                                      | Read condition                                                |
| ----- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 1     | [Investigate appearance](investigate.md), using [bounded context](../../execution/context.md)  | Task starts                                                   |
| 2     | [Common edit check](../../standards/common.md#before-an-edit), escalating only on its triggers | Before editing; local ownership and affected usages supported |
| Gate  | [Approval](../../execution/approval.md)                                                        | Permission/impact unresolved or required scope expands        |
| 3     | [Implement local correction](implement.md)                                                     | Cause understood; authorized patch                            |
| 4     | [Verify appearance](verify.md), then [owner checks/report](../../execution/verify.md)          | Patch ready                                                   |

A style-value-only edit does not trigger props/hooks/forms rules. If state/data/JSX contracts become necessary, [switch rules](../../execution/switch-rules.md) before dependent edits. Optional [linked diagram](flow.md); open it only when visual navigation is useful.
