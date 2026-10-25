# Refactor Without Behavior Changes

**Workflow kind:** entry
**Select when:** Reorganize/extract/rename code while preserving observable behavior
**Selection priority:** 60

**Activate:** Reorganize, extract, rename, or simplify implementation while preserving behavior. Select only the current stage; linked files are conditional instructions, not a bundle to load.

| Order | Action and detailed instructions                                        | Required boundary/evidence                                                                                                         |
| ----- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 1     | [Define requested structure and invariants](../../execution/context.md) | Target, immediate callers, existing behavior/API/style/URL contracts                                                               |
| 2     | [Assess permission and dependencies](../../execution/impact.md)         | Also apply [scope](../../execution/change-scope.md) and [shared-code restrictions](../../execution/shared-code.md) when applicable |
| 3     | [Resolve required decision](../../execution/approval.md)                | Stop dependent edits if impact/permission unresolved; use [planning](../planning/README.md) for broad/dependent work               |
| 4     | [Apply cohesive refactor](implement.md)                                 | Preserve contracts; no opportunistic fixes or migrations                                                                           |
| 5     | [Verify equivalence](verify.md)                                         | Actual caller/test evidence; [owner checks/report](../../execution/verify.md)                                                      |

New evidence triggers [rule switching](../../execution/switch-rules.md), not extra edit permission. [Linked diagram](flow.md) is optional; use it only when visual navigation is useful.
