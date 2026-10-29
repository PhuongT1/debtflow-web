# Documentation Structure and Authoring

Use this guide when adding or reorganizing documentation. It is optional context for ordinary code tasks. [Rule maintenance](../../../.ai-rules/core/workflows/rule-maintenance/README.md) governs policy changes.

## Language

Write documentation, rules, page titles and navigation labels in English. Keep original identifiers and UI labels when necessary; quoted user input may retain its original language. Requests themselves can use any supported language.

## Choose the owner

| Question answered                                        | Canonical location                                      | Audience                       |
| -------------------------------------------------------- | ------------------------------------------------------- | ------------------------------ |
| How do I start and run the workspace?                    | `docs/getting-started/`                                 | New team members               |
| Where does code belong; what depends on it?              | `docs/architecture/`                                    | Developers                     |
| How do I find and explain a coding standard?             | `docs/engineering/`                                     | Developers                     |
| How does AI classify, plan, request approval and verify? | `docs/ai-guide/`                                        | Developers reviewing AI work   |
| Which task should the agent select?                      | `.ai-rules/README.md`                                   | Agent entry point              |
| Which task steps must it execute?                        | `.ai-rules/core/workflows/<family>/`                    | Selected workflow only         |
| What permissions and impact checks apply?                | `.ai-rules/core/execution/`                             | Activated decision gates only  |
| How must code be written?                                | `.ai-rules/core/standards/`, `frameworks/`, `concerns/` | Selected implementation topics |
| What is specific to an app or package?                   | Owner's `AGENTS.md` and `.ai-rules/`                    | That owner only                |

> [!IMPORTANT]
> Keep one canonical rule body. Human guides link to it; they must not create a second prompt router or duplicate permission rules. A polished website does not enforce agent behavior by itself.

## Website-to-source mapping

The [Documentation Map](../../README.md) owns the tab/folder lookup. Keep tab names aligned with their source folder and root page. Derive sidebar topics from physical folders and filenames; do not hide singleton folders, omit path segments or invent a second topic hierarchy. `README.md` is displayed as Overview; other labels use the filename with readable capitalization. Match a topic README title to its folder name; use a descriptive matching title for individual files.

Show the exact repository-relative source path on every page. External app/rule groups keep their original owner paths; never copy their bodies into the human guide. Configure roots, branding and groups in `tooling/rules-viewer/site.config.mjs`; `sections.mjs` owns reusable grouping logic. Header links, the section switcher and static build must reuse that configuration. Clean URLs derive from source paths, not manually maintained title slugs.

## Folder map

```text
docs/
  README.md                     # Website-to-source documentation map
  getting-started/               # Setup and first contribution
  architecture/                 # Workspace, apps, packages, integration
  engineering/
    README.md                   # Find the appropriate coding topic
    documentation/              # This authoring and organization guide
    frameworks/nextjs/          # Human explanations and placement examples
  ai-guide/                     # Project context, prompts, execution, result review
.ai-rules/
  README.md                     # Stable selector combining reusable/local rules
  core/                         # Reusable; no project-specific commands or architecture
    README.md                   # Core layer overview
    execution/                  # Context, scope, impact, approval, verification
    workflows/                  # Bug fix, UI, component/create, component/modify, ...
    skills/                       # Task discovery and canonical workflow references
    agents/                       # Optional bounded roles and coordination
    standards/                  # Common conventions, security, applicable MFE boundaries
    frameworks/
      react/                    # Selectable component, structure, forms, hooks and UI topics
      nextjs/                   # Applicable router/rendering principles
      angular/                  # Applicable template/service/lifecycle principles
    concerns/                   # Auth, locale, API and tooling principles
  project/                      # Local facts; replaced with a fresh profile on export
    README.md                   # Actual architecture, libraries, source owners and commands
    frameworks/<framework>/     # Local framework extensions
    concerns/                   # Local integration and tooling contracts
apps/<app>/
  AGENTS.md                     # Local entry point
  .ai-rules/                    # Architecture and app-specific standards
```

`docs/` explains the system and use of the rules. `.ai-rules/` contains canonical agent-facing requirements; Markdown itself does not execute or enforce them. `tooling/rules-viewer/` renders both; it owns presentation, not a copy of the rules.

For cross-project adoption, use [Rule Reuse](../rule-reuse/README.md). Keep generic workflows/framework principles portable and concrete project paths/commands in `.ai-rules/project/`.

## Add a page or module

1. Choose the owner above. Search that owner's index for an existing responsibility.
2. Use kebab-case names. Put related operations under their feature, such as `component/create/` and `component/modify/`.
3. Use a folder when it groups related independently selectable pages or provides a clear home for a framework/feature. Do not add a wrapper folder for every short paragraph.
4. Use `README.md` as a folder's overview/selector. Link only the relevant detailed steps; avoid requiring every page to be read sequentially.
5. Give each rule its activation, scope/read boundary, required action, restrictions and exit evidence. Link common gates instead of repeating them.
6. Use relative Markdown links. A diagram action must link to its file or exact section. Keep `flow.md` beside the workflow it describes.
7. Keep agent context small using the canonical [bounded-reading policy](../../../.ai-rules/core/execution/context.md); human guides explain that policy through links rather than repeat it.
8. Confirm that the viewer tree, search and inbound links resolve to the canonical page. A new top-level documentation family also needs a group in `tooling/rules-viewer/site.config.mjs`.

For workflow directories, declare `Workflow kind` in their README (`entry`, `group` or `reference`). Entries include a plain-text `Select when` and unique positive `Selection priority`. Run `npm run rules:sync` to regenerate the root selector; do not edit its marked table manually or maintain a duplicate workflow list in this guide. The same files supply the website tree and agent selection. `npm run rules:check` checks synchronization and existing document/link/export invariants.

> [!TIP]
> Split when a topic can be selected independently. Optimize the text an agent needs for a task, rather than maximizing the number of tiny files or adding extra index reads.

## Page titles and hierarchy

Use exactly one `# Page title`. Start sections at `##`, followed by `###` for subsections. The viewer renders the first title once and derives the table of contents from section headings.

Do not repeat the category name as an eyebrow, an opening heading and the first section. The context card identifies the current library; the tree identifies parents; the article title identifies the page. Breadcrumbs appear only below the section home.

Folder groups are expandable and text-only. Highlight the current page with a subtle background and no left accent bar. Its ancestor labels may emphasize the path, but must not repeat the selected-page background. Keep icons in the top-level section navigation and context selector. Keep links descriptive, such as “Assess shared-component impact”, rather than “click here”.

## Write task guides as steps

For onboarding or installation, start with prerequisites, then use `## Step 1: ...`, `## Step 2: ...` headings for the required sequence. These remain ordinary Markdown headings with shareable anchors; the viewer adds a numbered marker. State where to act (terminal, editor, AI conversation or browser), the action, and its expected result before the next step. Keep optional alternatives and troubleshooting after the main path.

Link to the maintained vendor installation guide instead of duplicating changing installer commands. Use descriptive Markdown links; article links are always underlined, including without hover. Keep the source path visible and edit the original `.md` file, never a generated website copy.

## Document shared APIs concisely

Follow the reading order demonstrated by [Ant Design Button](https://ant.design/components/button/): purpose and import, when to use, minimal examples, API tables, then focused FAQ. Adapt the pattern to functions and integration APIs; do not copy component-only sections without a purpose.

For cross-window APIs, show participants and message direction, options/types/defaults, returned data, lifecycle/cleanup, errors and security boundaries. Link exact maintained source and types. Distinguish framework-neutral transport from framework-specific UI adapters. Examples must use current signatures, named option objects and the same public import as the source package. Put advanced details on their owning page instead of repeating them in every example.

After a rename or move, update source maps and relative links. The viewer derives pages from the Markdown tree; verify navigation, API tables and code blocks in the browser as well as running document-link checks.

## Use semantic highlights

Supported Markdown callouts are `NOTE`, `TIP`, `IMPORTANT`, `WARNING` and `CAUTION`. Choose by meaning, not decoration. Ordinary explanations stay as paragraphs.

```md
> [!WARNING]
> Ask the developer before dependent edits when impact remains uncertain.
```

| Type        | Use only for                                     |
| ----------- | ------------------------------------------------ |
| `NOTE`      | Supporting context or a constraint               |
| `TIP`       | An actionable technique or shortcut              |
| `IMPORTANT` | A requirement the reader must retain             |
| `WARNING`   | Risk needing care or an approval decision        |
| `CAUTION`   | Destructive or potentially breaking consequences |

Do not add callouts just to introduce color. Keep routine instructions in plain text; code, navigation and warnings use the shared viewer styles.

## Code and examples

Use a language on each code fence, such as `ts`, `json`, `bash` or `graphql`. Code blocks expose their language and a copy button. They scroll horizontally so code indentation remains intact.

```ts
export const DEFAULT_PAGE_SIZE = 20;
```

Use `bash`, `sh`, `shell`, `zsh` or `powershell` only for terminal commands. Commands, flags, quoted strings and comments receive distinct colors; Copy preserves the exact source text. Do not add decorative `$` prompts to runnable examples. Use `text` for AI prompts, output and directory trees so they are never presented as executable commands.

The dependency-free viewer provides lightweight lexical coloring for supported languages, not compiler-level analysis. Unknown languages and folder trees remain plain text. Never rely on color alone to communicate a requirement.

## Validate before finishing

Check relative links and anchors, diagram step links, search results, one H1 per page, keyboard navigation and mobile overflow. When moving an existing page, update inbound links and add a bookmark alias in `tooling/rules-viewer/aliases.mjs`; aliases are not copied documents or search entries.

For viewer changes run `node --test tooling/rules-viewer/*.test.mjs` and inspect the affected UI at desktop and mobile widths. Review the rendered result as well as the Markdown source.

## Design references

These are references for navigation and content presentation, not claims that every project uses Debtflow's rules hierarchy:

- [Claude Code quickstart](https://code.claude.com/docs/en/quickstart): prerequisites, numbered tasks, terminal examples, expected results and next steps.
- [Next.js documentation](https://nextjs.org/docs/app/getting-started): context selection and grouped navigation.
- [Angular documentation](https://angular.dev/overview): separation of introduction, in-depth guides, AI and best practices.
- [Starlight authoring guide](https://starlight.astro.build/guides/authoring-content/): semantic asides and readable code examples.

Client projections and capabilities are maintained with `node tooling/rules-kit/setup.mjs --write` (`--check` for drift). Copy this tool with the rules. It generates repository-scoped skills for Codex, Claude Code and Cursor, Claude role profiles, a Copilot adapter and `.ai-rules/CATALOG.md`. Client paths/formats live in the source `.ai-rules/clients.json` registry. Shared targets may use `.ai-rules/project/tools.json`; each member may override targets in ignored `.ai-rules/tools.local.json`. Generated outputs, catalog and ownership state are ignored; setup manages their gitignore patterns. CI must run setup before checks. Use the registered generic entry for other repository-aware tools, or add a verified native adapter. Canonical skill/role Markdown is the website source; generated client files are not a second documentation library.
