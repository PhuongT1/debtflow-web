# Planning and User Review

**Workflow kind:** entry
**Select when:** Plan only or explicit review before implementation
**Selection priority:** 10

Read only when the workflow selection gate applies or the user explicitly asks for a plan. A plan is a short executable agreement, not a mandatory artifact for every change.

## Follow the workflow

1. [Investigate enough for a concrete plan](#1-investigate-enough-to-make-the-plan-concrete).
2. [Define outcome, evidence, files and verification](#2-write-the-smallest-useful-plan).
3. [Resolve actual review/decision gate](#3-decide-whether-user-review-blocks-execution).
4. [Execute only authorized work and update evidence](#4-execute-and-update).

Optional [linked diagram](flow.md); open it only when visual navigation is useful.

## 1. Investigate enough to make the plan concrete

Locate the owner and relevant behavior first. Separate observed facts, working assumptions, and unresolved decisions. Do not plan a framework rewrite before checking the existing implementation.

## 2. Write the smallest useful plan

Default to a short message with:

- **Outcome:** observable behavior and acceptance criteria.
- **Evidence:** current failure/pattern and affected entry points.
- **Changes:** ordered steps, owners/modules, compatibility needs, and explicit scope boundaries.
- **Verification:** reproduction/retest or representative usage, targeted commands, and affected consumers.
- **Decision needed:** only a choice that materially changes behavior, scope, data, or public contracts.

Prefer 3–5 execution steps. Persist a plan in `docs/plans/<task-name>.md` only when requested or when a substantial multi-stage change benefits from a durable handoff; do not create plan files for routine fixes.

## 3. Decide whether user review blocks execution

| Situation                                                              | Action                                                                                   |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Routine reversible work already authorized; approach is clear          | Share the plan/summary and proceed; do not invent an approval stop                       |
| Useful preference with a reasonable default                            | Ask concisely, state the default, and continue independent work                          |
| Required product/contract decision is unresolved                       | Present concrete options and their consequences; wait before implementing dependent work |
| User says “plan only”, “review first”, or explicitly requires approval | Present the plan and stop dependent implementation until the user responds               |
| Existing authorization already covers the action                       | Use that authorization; do not ask again                                                 |

Unresolved component/shared-code impact, uncertain permission, or scope expansion uses [approval rules](../../execution/approval.md) and stops dependent edits. A clear plan does not waive [scope permissions](../../execution/change-scope.md) or [impact assessment](../../execution/impact.md).

When requesting review, explain exactly what decision is needed. Silence is not approval. Continue only work that does not depend on a required answer; a later user correction updates the active plan.

## 4. Execute and update

Work through the steps, verify each meaningful boundary, and keep concise progress updates focused on findings. Revise the plan when evidence changes scope; re-open user review only for a new required decision, not each implementation detail. If verification fails, return to investigation rather than marking the plan complete.

**Done when:** the agreed outcome is implemented and verified, or the user requested only the plan and has received a concrete reviewable one. Report unresolved dependencies and checks without claiming completion of unfinished implementation.
