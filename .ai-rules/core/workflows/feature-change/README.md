# Add or Enhance Functionality

**Workflow kind:** entry
**Select when:** New application capability or intentional behavior enhancement
**Selection priority:** 80

**Activate:** New application capability or intentional enhancement, rather than existing defect or behavior-preserving refactor. Select only the current stage; linked files are conditional instructions, not a bundle to load.

| Order | Action and detailed instructions                                         | Required boundary/evidence                                                                                         |
| ----- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| 1     | [Define acceptance and actual owner](../../execution/context.md)         | User-visible outcome, inputs/outputs, entry points and existing capabilities                                       |
| 2     | [Assess scope and existing-code impact](../../execution/change-scope.md) | Apply [impact](../../execution/impact.md) and [shared restrictions](../../execution/shared-code.md) when triggered |
| 3     | [Resolve decision/approval gates](../../execution/approval.md)           | [Planning](../planning/README.md) for multi-stage dependencies or unresolved product choices                       |
| 4     | [Implement requested capability](implement.md)                           | Only actual implementation concerns; no speculative extra behavior                                                 |
| 5     | [Verify acceptance](verify.md)                                           | Actual entry points and relevant edges; [owner checks/report](../../execution/verify.md)                           |

New evidence triggers [rule switching](../../execution/switch-rules.md), not extra edit permission. [Linked diagram](flow.md) is optional; use it only when visual navigation is useful.
