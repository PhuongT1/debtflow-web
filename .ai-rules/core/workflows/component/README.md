# Component Workflows

**Workflow kind:** group

**Activate:** component creation or intentional modification. Root prompt selection can open the exact operation directly; this family index is not an extra required read.

| Intent                                                                | Read next                         |
| --------------------------------------------------------------------- | --------------------------------- |
| New reusable component                                                | [Create](create/README.md)        |
| Existing props/composition/states/behavior, without a reported defect | [Modify](modify/README.md)        |
| Appearance only                                                       | [UI](../ui/README.md)             |
| Existing incorrect behavior                                           | [Bug fix](../bug-fix/README.md)   |
| Extraction/reorganization preserving behavior                         | [Refactor](../refactor/README.md) |

Creation and modification share [implementation](implement.md) and [verification](verify.md). Read those only when the selected operation reaches that stage. Reusable components, hooks, and helpers require [shared impact assessment](../../execution/shared-code.md) before changing existing contracts.

[Linked family diagram](flow.md) is optional. Use it only when visual navigation is useful.
