# Engineering Documentation Architecture — Proposal

Status: implemented as a documentation/navigation change following explicit developer authorization. Canonical rule files and policy remain in place. Task-specific token savings have not been measured; the worked examples document expected scoped reads rather than benchmark claims.

## 1. Separate the reader's questions

| Portal section        | Question                                              | Canonical sources                                                                                                             |
| --------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Getting started       | Where do I begin?                                     | A short onboarding page linking to the three sections below                                                                   |
| Project architecture  | How is Debtflow built and where does a change belong? | Existing [architecture overview](../architecture.md), app-owned architecture documents, workspace manifests and actual source |
| Engineering standards | How should code be written?                           | Existing `.ai-rules/core/frameworks`, shared concern policies, and owner-specific standards                                   |
| AI playbook           | What will the agent do with my prompt?                | Existing prompt selection, execution gates, and feature-grouped workflows                                                     |

The portal navigation is curated by purpose. It must not force every reader through the raw `.ai-rules` tree. Keep a source path/tree available for traceability. Navigation/search metadata links to canonical files; it must not copy policy bodies.

## 2. Proposed navigation

```text
Getting started
  Run the project
  Find the owning app
  Work with an AI agent
Project architecture
  Workspace map and dependency boundaries
  Apps / Shell / Partner Ops / Payments
  Shared packages
  Routing, authentication, integration flows
Engineering standards
  Common / Security / API contracts / Internationalization
  React / Components / Hooks / Data / Forms / UI
  Next.js / Routes / Server-client boundaries / File placement
  Angular
AI playbook
  Prompt classification and scoped rule loading
  Planning and approval gates
  Workflows / Bug fix / UI / Non-UI
  Workflows / Component / Create / Modify
  Workflows / UI changes / Refactor / Feature changes
  Examples and linked execution diagrams
```

Next.js framework conventions and Debtflow's feature placement are separate contracts. Project architecture explains actual ownership; standards define allowed dependencies and file conventions. Validate architecture claims against manifests/source before presenting them as current facts.

## 3. Developer and agent reading paths

Developer onboarding: getting started → project map → relevant standard → one worked AI example. Developers may explore broadly; this is not the agent's default context.

Agent execution: [repository entry](../../AGENTS.md) → [prompt selector](../../.ai-rules/README.md) → bounded owner/source investigation → selected workflow → relevant implementation module → impact/permission gate → implementation → actual verification.

| Prompt               | Expected route                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------ |
| Explain a file       | Relevant source and required owner instructions; no implementation workflow                |
| Fix table wrapping   | UI workflow; target/column styles; impacted callers; visual checks                         |
| Fix login callback   | Bug workflow; browser reproduction; auth/integration rules; round-trip verification        |
| Modify shared button | Component modification; props/defaults/styles and consumer analysis; approval if uncertain |
| Refactor a hook      | Behavior-preserving refactor; affected hook/import/effect rules and consumer checks        |
| Plan only            | Investigate enough to name rules/files/checks; present plan; wait before dependent edits   |

Before editing, retain a short execution summary: category, owner, scope, rules actually loaded and why, affected contracts/consumers, required approval, verification. Do not persist a new log file by default or repeatedly print the same list.

Planning is conditional: routine understood local work proceeds within existing authorization; explicit plan-only requests wait; uncertain impact/permission or scope expansion requires a concrete developer decision. Approval is not evidence of compatibility.

## 4. Page contracts and context cost

Architecture pages contain purpose, folder/dependency map, actual entry points, owners, and links to standards. They explain the system rather than embedding the complete agent process.

Rule modules contain activation, scope/exclusions, bounded reads, required actions, forbidden changes, approval triggers, and acceptance evidence. Workflow pages link the applicable modules in execution order; do not paste their full contents.

Human tutorials/examples/diagrams are optional agent input. Search operates on the documentation service; a search UI must not inject the complete library into an agent prompt. Generate navigation/search metadata from source, load the selected module only, and reuse unchanged rules in context. Measure reads, tokens and elapsed time on representative tasks before claiming savings.

## 5. Portal implementation boundaries

Keep `.md` sources and current workflow grouping. Introduce the four top-level navigation areas without another wholesale directory migration. Add onboarding explanations only where missing, linking existing canonical rules.

The current viewer permits only `.ai-rules` Markdown. Architecture requires an explicit read-only allowlist for approved documentation directories; retain realpath/symlink traversal protection and never expose the whole repository.

The architecture overview uses Mermaid features outside the current viewer's subset. Article retrieval must succeed independently of optional diagram rendering. Adopt a renderer supporting required constructs or provide an explicit source fallback; never silently draw an incorrect graph.

All sections need folder navigation, search with breadcrumbs, stable page/anchor URLs, Back/Forward, page contents, and source access. Diagrams need zoom/pan and links to exact behavior instructions. Existing approval/scope requirements remain unchanged.

## 6. Delivery and acceptance

1. Inventory/map canonical sources and audit architecture claims; identify missing onboarding content.
2. Add the four navigation sections and source links without changing rule meaning.
3. Add the developer AI walkthrough and scoped execution summary examples.
4. Extend the read boundary safely, render required Markdown/diagrams, and verify search/history/mobile/keyboard behavior.
5. Compare representative task context loading and completion checks before/after.

Accept when a new member can locate app ownership, the relevant coding standard, and the exact AI workflow; an agent loads no unrelated branch; uncertain shared impact stops dependent edits; navigation contains no broken or competing policy sources. This proposal is documentation architecture, not an executable permission system.

## References

- [Diátaxis](https://diataxis.fr/): tutorials, how-to guides, reference, explanation are distinct reader needs.
- [VS Code AGENTS.md](https://github.com/microsoft/vscode/blob/main/AGENTS.md): short entry directing agents to detailed project guidance.
- [Next.js development instructions](https://github.com/vercel/next.js/blob/canary/AGENTS.md): codebase structure, local documentation, and scoped validation.
- [Next.js project organization](https://nextjs.org/docs/app/getting-started/project-structure): framework folder/file conventions and organization guidance.
- [GitHub custom instructions](https://docs.github.com/en/copilot/concepts/prompting-and-context/custom-instructions): repository/path scoping and client-dependent support.
