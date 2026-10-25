# Documentation Map

Start here when browsing the repository in an editor. The website displays these same Markdown files; it does not maintain a separate documentation library.

## Tabs and source folders

| Website tab     | Folder in the repository | First page                            |
| --------------- | ------------------------ | ------------------------------------- |
| Getting Started | `docs/getting-started/`  | [Overview](getting-started/README.md) |
| Architecture    | `docs/architecture/`     | [Overview](architecture/README.md)    |
| Engineering     | `docs/engineering/`      | [Overview](engineering/README.md)     |
| AI Guide        | `docs/ai-guide/`         | [Overview](ai-guide/README.md)        |

Each tab has one primary source folder. Sidebar folders preserve that source hierarchy, including folders that currently contain only one page. `README.md` appears as **Overview**; other page labels come from their filenames. Hover over a link to see its title and exact source path.

Every page shows its repository-relative source path beside **View Markdown**, with **Copy path** for finding it in your editor. Clean URLs derive from that same hierarchy: `docs/ai-guide/rule-reference/README.md` becomes `/ai-guide/rule-reference/`; `.ai-rules/core/workflows/ui/verify.md` becomes `/rules/core/workflows/ui/verify/`. There is no title-based slug registry to maintain. Old `?doc=...` bookmarks remain supported and normalize to the clean route.

## Example: AI Guide

```text
docs/ai-guide/
  README.md                       AI Guide / Overview
  project-context/
    README.md                     Project Context / Overview
    client-setup.md               Client Setup / installation and discovery
  prompts/
    README.md                     Prompts / Overview
    examples.md                   Prompts / Examples
    with-attachment.md            Prompts / With Attachment
    without-attachment.md         Prompts / Without Attachment
  how-ai-works/
    README.md                     How AI Works / Overview
  result-review/
    README.md                     Result Review / Overview
  rule-reference/
    README.md                     Rule Reference / Overview
  evaluation/                     Maintainer protocol and measured reports
```

For example, **AI Guide → Project Context → Overview** maps directly to `docs/ai-guide/project-context/README.md`. That file's title is **Project Context**. Find the same file by folder, copied path, website URL or search.

## Rules and owner references

Some sidebar groups reference sources outside a tab's primary folder:

| Source                                                   | Responsibility                                                    |
| -------------------------------------------------------- | ----------------------------------------------------------------- |
| `.ai-rules/core/standards/`, `frameworks/`, `concerns/`  | Canonical engineering requirements                                |
| `.ai-rules/README.md`                                    | Stable agent entry and generated task selection                   |
| `.ai-rules/core/execution/`, `.ai-rules/core/workflows/` | Reusable investigation and task execution                         |
| `.ai-rules/core/skills/`                                 | Shared skill entrypoints; each SKILL.md is an indexed source page |
| `.ai-rules/core/agents/`                                 | Optional role profiles and coordination contract                  |
| `.ai-rules/project/`                                     | Project-local architecture, libraries, commands and extensions    |
| Root/app `AGENTS.md`                                     | Agent entry instructions                                          |
| `apps/<app>/.ai-rules/`                                  | App-owned architecture and local requirements                     |

Reusable framework rules live under `.ai-rules/core/frameworks/<framework>/`; local extensions use `.ai-rules/project/frameworks/<framework>/`. Both trees appear at their real paths, without flattening or copied documentation bodies.

The AI Guide labels these groups **Rule Entry**, **Core Rules (Reusable)**, **Skills**, **Agent Roles** and **Project Rules (Local)**. Engineering exposes **Core Standards**, **Core Frameworks** and **Core Concerns**; each group points to its own physical folder. See [Layers](ai-guide/rule-reference/layers.md) for editing examples. Older rule URLs resolve to the new canonical pages without duplicate search entries.

These are references to their original locations, never copied into `docs/`. The page's visible source path identifies the actual owner. App-owned documents remain close to their code.

## Add or move documentation

Use [Documentation Structure and Authoring](engineering/documentation/README.md). Put related pages under the same feature folder; add its `README.md` as the entry page. Choose explicit kebab-case names that match the sidebar topic, rather than generic names such as `misc.md` or `guide-2.md`.

The viewer derives the tree from source folders. `tooling/rules-viewer/site.config.mjs` owns tab roots, external reference groups and optional ordering; `sections.mjs` applies the shared grouping logic. Neither duplicates page content. After a move, update inbound links and bookmark aliases, then run `npm run rules:check`.

## Reuse in another project

[Rule Reuse](engineering/rule-reuse/README.md) explains the portable layers, export command and one-time project profile setup. Debtflow-specific examples now live under `.ai-rules/project/`; they are not included in the exported kit.

## Run or publish the website

On a fresh checkout, run `npm run rules:setup` once first to create the ignored capability catalog and client files. Repeat it after toolkit changes. The viewer and build do not run AI setup for you.

```bash
npm run docs:dev
npm run docs:build
npm run docs:preview
```

Development reads source Markdown on port 4317. Build writes `dist/docs/`; preview serves that output on port 4318. The built site needs an HTTP static host with directory-index support, no React/Next.js/Angular runtime or Node API. For a hosted subdirectory use `npm run docs:build -- --base /handbook/` and the same `--base` when previewing. Publish only the generated directory and review approved documentation roots first. See [viewer operation](../tooling/rules-viewer/README.md).
