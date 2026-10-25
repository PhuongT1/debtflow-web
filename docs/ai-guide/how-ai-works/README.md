# How AI Works

For the end-to-end prompt flow, skill/agent boundaries and per-client setup, read [Toolkit](toolkit.md). Its canonical capabilities appear in the generated [catalog](../../../.ai-rules/CATALOG.md).

For implementation requests, AI follows these steps. Read-only and plan-only requests keep their explicit boundaries.

The [execution contract](../../../.ai-rules/README.md#default-execution-contract) prioritizes correct, safe completion. AI may read more code or run additional checks when needed; efficiency means avoiding redundant work and unrelated scope, not minimizing token usage at the expense of quality.

| Step                          | AI responsibility                                                                         | What you should see                                                      |
| ----------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| 1. Load instructions          | Confirm the project entry and accessible rules, including the role of any attachment.     | A specific access question only if needed; no claims about unread files. |
| 2. Understand and investigate | Select the workflow, locate the owner, reproduce the issue and assess affected consumers. | A short update about the task and the supported cause.                   |
| 3. Implement                  | Reuse existing components/helpers and stay within the authorized scope.                   | A focused patch with no unrelated changes.                               |
| 4. Verify                     | Retest the original case and affected states; run appropriate owner checks.               | Actual checks and results, including unavailable verification.           |
| 5. Report                     | Explain the change, affected files and remaining gaps.                                    | Enough evidence to [review the result](../result-review/README.md).      |

## When does AI ask you?

When required instructions/source are inaccessible, a product decision is missing, impact remains uncertain after investigation, or the necessary change exceeds the request. It must name the blocker and the decision or access needed.

Routine authorized steps do not require repeated confirmation. A plan-only request stops before editing.

## Detailed requirements

A routine local fix uses the [common edit check](../../../.ai-rules/core/standards/common.md#before-an-edit). AI must understand purpose, usages and verification, but loads detailed impact/shared-code/approval modules only when their triggers apply. No detailed plan or repeated permission request is required for an understood, authorized local change.

For example, “Keep the action buttons on one line” selects UI-only work. AI inspects the actual route and owning cell/styles, corrects the local layout, then checks the original and relevant narrow viewports. A changed shared default requires consumer assessment. A visual pass requires visual evidence; a build or accessibility snapshot alone is insufficient.

[Instruction loading](../../../.ai-rules/core/execution/load-instructions.md) · [Default execution](../../../.ai-rules/README.md#default-execution-contract) · [Impact](../../../.ai-rules/core/execution/impact.md) · [Approval](../../../.ai-rules/core/execution/approval.md) · [Workflow diagram](../../../.ai-rules/core/execution/flow.md).
