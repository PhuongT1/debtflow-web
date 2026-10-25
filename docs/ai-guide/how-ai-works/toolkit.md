# Toolkit

The toolkit separates policy, task procedures, optional roles and project knowledge. The reusable layer teaches how to investigate and decide; the local layer supplies the current architecture. Native client files are generated projections, while the website renders canonical Markdown directly.

## What we learned from Nimara

The reviewed local Nimara checkout separates `.claude/rules/`, task skills, scoped app/package `CLAUDE.md`, specialist agent profiles and `llm-wiki/` knowledge. Skills describe when to activate and exclude adjacent tasks. Workers have a bounded responsibility, read their source owner's instructions and return evidence to the parent. The parent integrates and checks the result. Its root `AGENTS.md` points to `CLAUDE.md` via a symlink.

Adopt those responsibilities, not Nimara's package layers, Saleor/GraphQL integration, pnpm commands or release policy. The checkout also contains older references across QA profiles and adapters; a large instruction library still needs link, consistency and behavior checks. More agents do not by themselves establish quality.

The comparison below records the adopted mechanisms, rather than treating Nimara's directory names as a required standard:

| Nimara mechanism                                            | Where it is applied here                                           | Deliberate adaptation                                                                 |
| ----------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| Task skills with activation descriptions and specific steps | `core/skills/` links to `core/workflows/`                          | One procedure shared by all clients; no copied workflow bodies                        |
| Scoped app/package instructions and architecture boundaries | `project/README.md`, owner `AGENTS.md`, local extensions           | Discover this project's actual dependencies and conventions                           |
| Specialist workers with exclusions and a return contract    | `core/agents/` and its coordination contract                       | Three reusable responsibilities; native role generation currently targets Claude only |
| Architecture review and pre-ship checks                     | Boundary reviewer, workflow verification stages and owner commands | Verification is separate from permission to commit, push or publish                   |
| Handoff references existing artifacts and excludes secrets  | Prompt-to-result handoff below                                     | Use when handing work over; no mandatory handoff file for every change                |
| Versioned current-state knowledge and decisions             | Project-owned architecture/docs linked from the profile            | Update affected documentation with behavior; no second wiki containing the same facts |
| Skills load detailed references only when needed            | Workflow stages and conditional framework/concern modules          | Keep discovery descriptions short and detailed rules selectable                       |

Nimara-specific GraphQL/codegen, commerce integrations and deployment agents are not installed here. Add a project capability when a real recurring task needs it; increasing the number of agents or skills is not an adoption goal. This comparison is based on the local checkout, not an assurance that its instructions or ours have passed live trials in every AI client.

Compare [Next.js Study](nextjs-study.md) for version-aware docs/runtime tooling and [React Study](react-study.md) for concise command skills, owner boundaries and explicit verification outcomes. These are optional maintainer references, not additional required agent context.

## Responsibilities and source ownership

| Kind               | Canonical source                                            | Purpose                                                              |
| ------------------ | ----------------------------------------------------------- | -------------------------------------------------------------------- |
| Rules              | `core/execution/`, `standards/`, `frameworks/`, `concerns/` | Constraints and conditional implementation principles                |
| Workflow stages    | `core/workflows/`                                           | Existing detailed task procedure; keep one maintained body           |
| Skills             | `core/skills/<name>/SKILL.md`                               | Discovery metadata, task boundary, workflow link and expected output |
| Roles              | `core/agents/`                                              | Delegated responsibility, exclusions and evidence to return          |
| Local facts        | `project/` and app/package owner instructions               | Actual architecture, libraries, source ownership and commands        |
| Local capabilities | `project/skills/`, `project/agents/`                        | Independently named project-specific tasks or roles                  |
| Knowledge          | Project-owned docs/ADRs/specs linked by the profile         | Current behavior and decisions; no mandatory wiki migration          |

The existing rule families remain in their current folders to avoid another mechanical move. They are the policy layer; skills do not copy their bodies. Every canonical Markdown page remains mapped to its actual source, including SKILL.md. Generated client folders are excluded from the website index to avoid duplicate search results.

## From prompt to verified result

1. **Receive the outcome.** Establish the repository, task constraints and instruction access. A task-only prompt is sufficient after the client entry is configured. A generic chat with no repository access still needs context.
2. **Resolve context.** Read the short project profile, relevant owner instructions and necessary documented behavior. Confirm facts against source/configuration if missing or stale.
3. **Select the task.** Use the root selector and applicable skill. Plan-only and read-only constraints take priority. Load only the selected workflow stages and framework topics.
4. **Investigate.** Find comparable code, actual consumers, expected behavior and meaningful verification. Decide reuse, extension or creation from evidence.
5. **Execute within scope.** Work in the main agent by default. Delegate only when available, permitted and beneficial; provide a bounded task and avoid concurrent edits to overlapping files. Follow the [coordination contract](../../../.ai-rules/core/agents/README.md).
6. **Integrate and verify.** The parent checks worker output, compatibility and the final diff; run the relevant project checks and retest affected behavior. A worker's claim or a skipped command is not a pass.
7. **Report or hand off.** State the result, changed contracts, actual evidence and limits. A handoff should reference the relevant source/diff, pending checks and decisions; do not duplicate the whole library or include secrets. Publishing is a separately authorized action.

| Example prompt                          | Route and relevant evidence                                                                 |
| --------------------------------------- | ------------------------------------------------------------------------------------------- |
| “Keep the action buttons on one line.”  | UI skill; comparable layout and browser/viewport evidence                                   |
| “Create a reusable date field.”         | Component-create skill; current field primitives, form integration, consumers and placement |
| “Fix the form losing edits on refresh.” | Bug-fix skill; reproduce state ownership/reset behavior and regression checks               |
| “Review this diff without editing.”     | Read-only evidence and optionally the boundary-reviewer role; no implementation skill       |
| “Plan a new capability first.”          | Planning skill; concrete plan and review boundary, no dependent edits                       |

Developers may request a skill by its installed name; ordinary prompts do not need a skill name or file path. Selection remains a client/model behavior and must be verified in that tool's read/invocation evidence.

## Setup and synchronization

Run `npm run rules:sync` here, or `node tooling/rules-kit/workflows.mjs --write` followed by `node tooling/rules-kit/setup.mjs --write` in an adopted project. The generator scans current core/project capability files and creates the catalog plus native projections. `npm run rules:setup` is the team-facing alias for the same complete synchronization. `npm run rules:check` checks drift and document/export invariants. Documentation build and viewer startup only read source; they do not regenerate selectors, install skills or modify client files. Run synchronization explicitly, then use checks to detect drift.

The source registry `.ai-rules/clients.json` declares client IDs, discovery paths and supported output formats. Team defaults may be overridden by shared `.ai-rules/project/tools.json`; an ignored `.ai-rules/tools.local.json` selects registered clients for one member. For example:

```json
{ "targets": ["codex", "claude", "cursor", "copilot"] }
```

| Client      | Generated integration                                                    | Limit                                                                                 |
| ----------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| Codex       | `.agents/skills/<name>/SKILL.md`; repository AGENTS.md remains the entry | Role profiles are references; this generator does not register native Codex subagents |
| Claude Code | `.claude/skills/`, `.claude/agents/`, `.claude/rules/ai-toolkit.md`      | Client controls discovery, tool availability, permissions and delegation              |
| Cursor      | `.cursor/skills/`, `.cursor/rules/ai-toolkit.mdc`                        | No native Cursor subagent registration here                                           |
| Copilot     | `.github/instructions/ai-toolkit.instructions.md`                        | Instruction adapter, not a native skill or agent installer                            |

These layouts follow the official [Codex skills](https://learn.chatgpt.com/docs/build-skills), [Claude skills](https://code.claude.com/docs/en/skills), [Claude subagents](https://code.claude.com/docs/en/sub-agents) and [Cursor skills](https://cursor.com/docs/skills) documentation. They do not guarantee that a client has reloaded a running session. Confirm discovery once in each client; restart/reload when its UI requires it.

Edit canonical `.ai-rules` files, not generated native projections. The ownership manifest records generated content; modified/unowned files and symlink destinations cause a preflight failure. Removing a capability or disabling a target deletes only unchanged managed outputs, preserving unrelated client configuration. Permissions, hooks, accounts and release settings are not modified. Projections reference this repository's rules and are not standalone uploads for disconnected chat tools.

All local projections, catalog, ownership state and personal client selection are ignored. Setup updates a marked `.gitignore` block from every registered adapter, so adding a compatible client also adds its output paths to ignore without hiding unrelated tool settings. Commit registry/source/ignore changes; do not commit local installations. CI runs setup before checks and docs build. Select `generic` to produce `.ai-rules/generated/INSTRUCTIONS.md` for another repository-aware AI, then connect it in that tool's instruction settings. A generic entry is not native integration; new native role formats require implementation and validation.

## Maintaining capabilities

Keep skill `name` and `description` frontmatter as single-line plain, YAML single-quoted or JSON-quoted values; skill names match their directories. Role profiles use `name`, `description` and `access` (`read-only`, `implementation`, `verification`). Core/project names must be distinct; local architectural choices extend the profile instead of silently shadowing core rules. Add or remove files, regenerate, review the diff and run checks. The catalog and website tree derive from those sources; do not maintain another manual list of skill bodies.

### Add, change or remove a skill

1. Search the existing catalog for the responsibility first. Extend its maintained workflow when the task is already covered.
2. Choose `.ai-rules/core/skills/<name>/SKILL.md` for a portable procedure, or `.ai-rules/project/skills/<name>/SKILL.md` for a local task. Use a unique kebab-case name matching its directory; project skills do not override core names.
3. Give `description` the task trigger and exclusions so nearby skills can be distinguished. The body should link repository instructions, project context and the canonical workflow; state any task-specific boundary and expected result in the workflow instead of duplicating its steps.
4. Use relative Markdown links for detailed references. The generator rebases those links to the canonical files; it does not copy a skill's sibling scripts/assets/reference directories into client folders. Do not assume an unlinked relative filename or `$ARGUMENTS` syntax is portable across clients. A script-based capability needs explicit repository commands and appropriate packaging tests.
5. For a new shared selectable workflow, add its entry metadata and a core skill linking to that primary entry, then update inbound references. `rules:check` checks that core skills select one primary entry and that every shared entry has skill coverage. For removal, remove or replace references to the skill/workflow first, then remove the canonical files. Do not delete only the generated client copy; setup would recreate it.
6. Run `npm run rules:setup`, `npm run rules:check` and `npm run docs:build`. Review source changes and the managed ignore block. Setup removes unchanged owned projections for deleted capabilities; it refuses to discard modified or unowned files.
7. Reload the selected AI client and try one matching prompt and one adjacent task that should not activate the skill. Check actual invocation, source reads, scope and verification evidence before describing the skill as behaviorally validated.

The website automatically indexes canonical SKILL.md files under the corresponding source folder. Check its displayed path and **View Markdown**; generated client copies must not appear as additional search results. See [Client Setup](../project-context/client-setup.md) for a member's first discovery check.

Packaging tests cover additions/removals, source links, projections, conflicts, export and doc mapping. They cannot establish model compliance. Test real adoption with an outcome-based prompt, inspect actual instruction reads, and review placement, style, changed behavior and verification in the target project. Do not report fixture builds as successful React/Next.js/Angular implementation trials.
