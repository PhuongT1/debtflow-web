# Engineering Rules — Start Here

For developers and AI. This is the single prompt selector. Classify the requested outcome automatically; developers do not need to name rules. Reuse this page and unchanged rules already in context.

## Project-independent rules, local project facts

Read the short [project profile](project/README.md) once, then the selected owner and local extension. Use [project resolution](core/execution/project-context.md) only when those facts need resolving. `core/` contains reusable instructions; `project/` contains local facts and architecture choices. Both apply to a task; neither requires loading every file.

| Layer                          | Maintain here                                                             | Adoption                                                                 |
| ------------------------------ | ------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [Core](core/README.md)         | How to investigate, implement and verify; applicable framework principles | Reuse and update deliberately across projects                            |
| [Project](project/README.md)   | Actual architecture, libraries, paths, commands and local extensions      | Establish for the target repository; do not copy another project's facts |
| App/package owner instructions | Constraints specific to an owner, kept near its source                    | Link from the project profile when that owner exists                     |

## Default execution contract

Skills describe task entrypoints; workflows hold their detailed stages; rules constrain the selected responsibility; role profiles bound optional delegated work. Discover current capabilities in the generated [catalog](CATALOG.md). Follow the [coordination contract](core/agents/README.md) when dividing work; a native agent profile does not itself authorize delegation. Keep the parent responsible for integration and actual verification.

Optimize input, output and tool usage for a correct, verified result within the authorized scope. Load only decision-relevant context, reuse unchanged evidence and report concisely. Necessary investigation, compatibility and verification take priority over token savings; no fixed file/token target defines success.

Native skill invocation is optional. For an ordinary prompt, choose the primary workflow from the selector below and use its matching skill when the client supports it. A developer may explicitly choose a skill or add a complementary capability; respect that choice within its scope and load only the relevant added guidance. Resolve a material mismatch with the requested outcome instead of silently changing scope. If native skill discovery is absent but repository access works, follow the canonical workflow directly; do not require an installer or skill picker for ordinary work.

Once the tool has loaded its entry instructions, a short outcome-based task is sufficient. If access is unverified or Markdown is attached, first resolve [instruction loading](core/execution/load-instructions.md). File links alone do not configure an agent.

- Select one workflow below; investigate, assess, implement, verify and report. Honor read-only, plan-only and explicit review boundaries.
- Briefly state the task/owner and next action. Do not require developers to select rules or approve routine understood work.
- For implementation, read [common rules](core/standards/common.md) once, including its local edit check. Read-only/plan-only work stops at the selected guide and relevant evidence; do not load implementation/full verification modules merely to describe obvious future checks. Load an exact verification topic only when it resolves a concrete planning question. Batch independent needed reads, reuse evidence, and use [context details](core/execution/context.md) when discovery must widen.
- Every existing-code edit needs purpose, affected usages and compatibility understanding. Shared/uncertain/broader changes activate the detailed gates below. Stop dependent edits when impact or permission remains unclear.
- Finish with actual [verification evidence](core/execution/verify.md); unavailable checks are limits, never passes. Human guides and diagrams are optional context.

## 1. Classify the prompt

Record in working context: **outcome, task category, owner, affected responsibility, authorized scope, current stage**. Determine the owner from route/file evidence, not assumed framework. Keywords are hints, not permission.

Apply priority in this order:

For explanation, discovery, comparison, read-only review or test-only work without implementation, use only relevant source/evidence; do not enter an implementation workflow. Explicit planning/review-before-implementation requests retain their planning boundary.

The table below is generated from workflow entry metadata, ordered by selection priority. Match intent and source evidence; priorities resolve overlap, not authorization. Do not hand-edit generated rows.

<!-- workflow-selector:start -->

<!-- prettier-ignore -->
| Intent / evidence | Select only this primary workflow |
| --- | --- |
| Plan only or explicit review before implementation | [Planning and User Review](core/workflows/planning/README.md) |
| Appearance only: spacing, typography, wrapping, alignment, responsive layout | [UI-Only Changes](core/workflows/ui/README.md) |
| Existing incorrect behavior, validation, request, redirect, race, runtime/build | [Bug Fix](core/workflows/bug-fix/README.md) |
| Change an existing component’s API, composition, states, or behavior without a reported defect | [Modify a Component](core/workflows/component/modify/README.md) |
| Reorganize/extract/rename code while preserving observable behavior | [Refactor Without Behavior Changes](core/workflows/refactor/README.md) |
| New reusable component | [Create a Component](core/workflows/component/create/README.md) |
| New application capability or intentional behavior enhancement | [Add or Enhance Functionality](core/workflows/feature-change/README.md) |
| Add/split/change lasting rules | [Rule Maintenance](core/workflows/rule-maintenance/README.md) |

<!-- workflow-selector:end -->

“Fix login spacing” is UI; “fix login callback” is behavioral; “add a loading state” modifies a component. For mixed prompts, choose the main outcome and activate extra modules only for actual responsibilities. If intent remains materially ambiguous, investigate bounded evidence, then ask for the missing decision before dependent changes.

Before tools/edits, decide the **evidence surface and risk**, not just the task label. Implementation affecting browser appearance or interaction requires the relevant browser investigation/retest; plan-only work does not authorize implementation or require executing the fix. API/build/pure-function defects start with their failing request/command/test; open a browser only if a changed consumer needs it. Locate the actual component/caller before selecting component standards. Shared contracts, auth/data boundaries and uncertain consumers activate the impact gates below. Reclassify from source evidence when needed; do not scan every framework or trust prompt keywords as proof of safety.

## 2. Activate rules at the right stage

| Trigger                                                      | Read only the matching detail                                                                |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Any proposed edit                                            | [Common edit check](core/standards/common.md#before-an-edit); reuse it when loaded           |
| Owner/source unresolved, or dependency search must widen     | [Context boundaries](core/execution/context.md)                                              |
| Shared/default/core contracts or uncertain propagation       | [Impact](core/execution/impact.md) and [shared consumers](core/execution/shared-code.md)     |
| Unclear authorization or a broader requested outcome         | [Scope](core/execution/change-scope.md)                                                      |
| Permission/impact still unclear after targeted investigation | [Approval](core/execution/approval.md); stop dependent edits                                 |
| New evidence changes responsibility, owner or category       | [Switch rules](core/execution/switch-rules.md)                                               |
| Implementation topic not yet selected                        | [Implementation selector](core/execution/implementation-rules.md); skip if exact topic known |

A link is not a requirement to open its destination. Do not create tracking files or read all linked standards to demonstrate compliance.

## Where to find things

- `project/`: project-owned facts and local topic extensions; replace this layer when adopting elsewhere.
- `core/skills/`: task entrypoints with discovery metadata and canonical workflow links.
- `core/agents/`: optional role profiles and coordination; client projections do not authorize delegation.
- `core/standards/`: common conventions, code style, security, and cross-app boundaries.
- `core/execution/`: framework-independent reading boundaries, permissions, and decision gates.
- `core/workflows/<family>/`: related operations grouped together: `component/create`, `component/modify`, `bug-fix/ui`, `bug-fix/non-ui`, and `ui`. Each guide links to exact detailed modules.
- `core/frameworks/`: implementation standards, selected by changed responsibility.
- `core/concerns/`: auth, i18n, contract, and tooling policy.
- App/package `.ai-rules/`: local/business rules linked by its `AGENTS.md`.
- `docs/`: optional rationale/audits/plans; not default task input.

[Workflow directory](core/workflows/README.md) and [execution diagram](core/execution/flow.md) are optional references, not mandatory agent reads. Markdown guides decisions; it does not run a classifier or enforce permissions. A documentation viewer is optional and is not part of task context.
