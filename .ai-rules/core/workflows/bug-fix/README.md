# Bug Fix

**Workflow kind:** entry
**Select when:** Existing incorrect behavior, validation, request, redirect, race, runtime/build
**Selection priority:** 40

**Activate:** existing incorrect behavior. Appearance-only defects use [UI](../ui/README.md); plan-only requests use [planning](../planning/README.md).

## Investigation

Select the affected surface, not a framework. A login redirect is UI behavior; an API/build error is non-UI. Read both branches only for a genuinely mixed defect.

| Order | Required action and detailed rules                                                                                      | Read condition                                                                      |
| ----- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| 1     | Identify owner and smallest failing scenario; use [context details](../../execution/context.md) if discovery must widen | Reuse source and owner facts already established                                    |
| 2     | [UI investigation](ui/investigate.md) **or** [non-UI investigation](non-ui/investigate.md)                              | Actual reported surface                                                             |
| 3     | [Common edit check](../../standards/common.md#before-an-edit); follow its detailed gates only when triggered            | Before the patch; identify purpose, consumers, permission and checks                |
| Gate  | [Developer approval](../../execution/approval.md)                                                                       | Impact/permission remains uncertain or required scope expands; stop dependent edits |
| 4     | [Focused correction](implement.md)                                                                                      | Cause understood and implementation authorized                                      |
| 5     | [UI retest](ui/verify.md) **or** [non-UI retest](non-ui/verify.md)                                                      | Affected surface                                                                    |
| 6     | [Owner checks and completion report](../../execution/verify.md)                                                         | Patch ready                                                                         |

## Completion

Retest the reported failure, check the nearest regression edge, and follow the linked completion step above. Do not load the other branch or create a detailed plan for a routine understood fix.

If evidence changes category or responsibility, [switch rules](../../execution/switch-rules.md); activating rules grants no extra modification permission. Reuse loaded rules and successful investigation. Do not read the unselected branch, optional diagrams, or every linked standard.

Optional diagrams: [overview](flow.md), [UI branch](ui/flow.md), [non-UI branch](non-ui/flow.md). Optional diagrams support navigation when the project provides a viewer.
