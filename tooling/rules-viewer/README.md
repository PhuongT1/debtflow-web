# Engineering Documentation Viewer

Run `npm run docs:dev` (or the existing `npm run rules:viewer`), then open <http://127.0.0.1:4317>. Optional: `npm run docs:dev -- --port 4319`.

- Choose **Getting started**, **Architecture**, **Engineering**, or **AI Guide**. Each section groups links to its canonical Markdown sources. Browse only that section’s source tree. Folders and filenames map directly to the source tree, including singleton folders. README files appear as Overview. Each page shows its source path and offers Copy path; see the [Documentation Map](../../docs/README.md). Markdown remains the canonical source. Top-level sections have icons; the source tree uses text-only expandable branches and highlights only the current page; there is no duplicate content store.
- Search titles, content, and paths using the header or **Cmd/Ctrl+K**. Use arrow keys and Enter to select a result; Escape closes search.
- Breadcrumbs and “On this page” links support navigation. Each page/section has a shareable URL with Back/Forward and reload support. View or copy the original Markdown.
- Diagram pages keep zoom, pan, fit, reset, keyboard access, and clickable nodes. Select a node to open its rule article; Back returns to the diagram.
- Development uses a local-only, read-only server. Only approved Markdown roots/files from `site.config.mjs` are read; other repository files and plans are excluded. Source-code references open in your editor. No external service, CDN, or added package dependency.
- Authoring: [folder structure, page titles, callouts and code blocks](../../docs/engineering/documentation/README.md). Local SVG favicon; no external font or icon requests. Moved source bookmarks resolve through `aliases.mjs` without duplicate search entries.
- Diagram rendering supports the repository’s limited Mermaid subset. Unsupported diagrams show their source and a notice; the article remains readable.

AI agents read the selected Markdown modules directly; viewer assets, human search, and optional diagrams are not required agent context. The agent entry remains [Engineering Rules](../../.ai-rules/README.md); the human landing page is [Getting started](../../docs/getting-started/README.md).

Validate with `node --test tooling/rules-viewer/*.test.mjs`. Browser-check nested navigation, full-text search/keyboard, direct links, anchors, history/reload, mobile menu, diagram zoom/pan, and console/network errors after viewer changes.

## Clean URLs and static builds

`/ai-guide/rule-reference/` maps to `docs/ai-guide/rule-reference/README.md`. `routes.mjs` derives routes from source hierarchy, while each page retains its source path. Old `?doc=` links and moved-source aliases remain readable. Development serves known routes; static builds write a directory `index.html` per route, so deep-link refresh needs no SPA rewrite.

```bash
npm run docs:build
npm run docs:preview
```

Output: `dist/docs/`. Preview: <http://127.0.0.1:4318>. Publish only the generated directory on an HTTP static host supporting directory indexes and JavaScript modules. This is browser-rendered documentation, not server-rendered HTML; JavaScript is required. It needs no framework runtime, API server, database or app dependencies.

For a subdirectory deployment, pass the same `--base /handbook/` to build and preview. Both modes reuse the renderer, routes, search, diagrams and source configuration. Build snapshots approved Markdown into JSON/raw files; source changes require a rebuild. Review approved roots before external publication. The builder replaces only its own marked output and refuses unmarked existing directories or source folders. Use HTTP rather than `file://`.

## Copy to another project

Run `node tooling/rules-kit/export.mjs --output <new-directory> --with-viewer`. The neutral configuration includes reusable rules and the agent entry. Copy/merge deliberately, complete the target project profile, then run the Node scripts directly. Edit `site.config.mjs` for branding and approved roots; do not copy Debtflow's config blindly. Node.js 20+ is sufficient independently of React, Next.js or Angular. Agent instruction loading remains separate tool-specific setup.
