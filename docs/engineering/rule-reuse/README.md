# Rule Reuse

Use the same rule library in React, Next.js or Angular projects by replacing only the local project layer. A new developer should establish project context, then work on a task; neither people nor agents need to read the whole library.

## Understand the layers

```text
AGENTS.md                         Thin tool entry
.ai-rules/
  README.md                       Stable task selector; combines core and project
  core/                           Reusable across projects
    README.md                     Layer overview
    execution/                    Context, scope, impact, approval, verification
    workflows/                    Task families and stages
    skills/                       # Task discovery and canonical workflow references
    agents/                       # Optional bounded roles and coordination
    standards/                    Code/security and applicable boundary principles
    frameworks/
      react/                      Components, structure, forms, hooks and UI
      nextjs/                     Router/rendering/configuration principles
      angular/                    Templates/services/lifecycle/build principles
    concerns/                     Auth, i18n, API and tooling principles
  project/                        Established separately for each adopting project
    README.md                     Short facts and local-module selector
    frameworks/<framework>/       Local architecture and framework extensions
    concerns/                     Local integration and tooling contracts
```

The `core/` tree is portable; keep it together with the root selector and synchronization tool. `project/` records concrete paths, commands, aliases, supported modes and local examples. App/package owner instructions stay beside their source.

Do not create a parallel bug-fix workflow for each framework. Select one task workflow, only the affected framework topic, and the matching local extension. A Next.js component may need React plus Next.js boundaries; a plain React task must not load Next.js or Angular merely because their rules exist on disk.

## Adopt in another project

From this repository, export to a new directory:

```bash
node tooling/rules-kit/export.mjs --output /tmp/frontend-rule-kit
```

To include the optional dependency-free documentation viewer, add `--with-viewer`. The export supplies neutral branding and a rules-only source configuration, not this project's app/docs roots. In the new project run `node tooling/rules-viewer/server.mjs` or `node tooling/rules-viewer/build.mjs`. No app dependencies or framework migration are required. Configure `tooling/rules-viewer/site.config.mjs` to include that project's additional documentation; the same setting controls development and static publication.

1. Review the generated kit. Copy its `.ai-rules/` and the runtime tools `tooling/rules-kit/workflows.mjs`, `setup.mjs` and `clients.mjs` to the target project without overwriting existing instructions blindly; merge the short `AGENTS.md` entry if needed. Include `tooling/rules-viewer/` when exporting with the viewer.
2. Fill `.ai-rules/project/README.md` from that project's manifests and source. Record JavaScript/TypeScript mode, actual React/Next.js router/Angular architecture, installed libraries, ownership, aliases and executable checks.
3. Add local topic modules only for real requirements. A small app may need only its profile; a monorepo may link owner-specific instructions. Do not copy Debtflow's `project/` layer.
4. Connect the tool's project entry and try one small task. Review actual rule reads, the patch and verification evidence.

No npm, `@/`, MUI, React Hook Form, App Router, standalone Angular or monorepo is implied by adoption. Preserve the target project's installed architecture; these rules do not authorize migrations.

## Update and maintain

- Reusable behavior belongs in the existing shared topic. Project commands/examples belong in `project/`. Link policy instead of copying its body.
- Load the short project profile once, then exact topic files when triggered. Do not walk every local extension or framework index.
- Update adopted core modules deliberately after reviewing their diff and local compatibility. Keep local facts separate rather than editing reusable modules for each project.
- Keep documentation in English, map sidebar topics to source folders, and maintain one canonical task selector.

### Workflow discovery and synchronization

Each workflow directory's `README.md` declares `Workflow kind`: `entry`, `group` or `reference`. Selectable entries declare `Select when` and a unique positive `Selection priority`. The dependency-free `tooling/rules-kit/workflows.mjs` scans these files and generates only the marked selector table in `.ai-rules/README.md`. Group/reference pages do not create additional primary workflows. No project names or fixed workflow list are embedded in the generator.

After adding/removing/changing workflows, run `npm run rules:sync` here, or `node tooling/rules-kit/workflows.mjs --write` in an adopted project. `--check` fails for stale selection, missing metadata or duplicate priorities. Documentation build and viewer startup read source without regenerating instructions or client files; run sync explicitly after workflow edits. Update inbound links when deleting/moving modules; generation does not rewrite their meaning. Existing link checks detect dangling references here; adopters should include equivalent link validation in their checks.

### Acceptance in a different architecture

Try a bounded real task (for example creating a component) in the adopting project. Verify that the AI inspected a comparable component and its consumers, selected the actual source owner, preserved the installed styling/form approach and JavaScript/TypeScript mode, and used executable checks from that project. For Next.js, confirm the installed router; for Angular, preserve the existing NgModule/standalone model. Do not install libraries or add shared/MFE/i18n infrastructure just to satisfy a rule example. A missing capability should stay absent unless the task requires it.

## Module size and reuse

Split by an independent trigger, not by line count. A field-binding change should load `forms/fields.md`; a reset change should load `forms/lifecycle.md`. If the exact topic is known, skip its selector. Keep a small selector for discovery; do not duplicate policy bodies there.

Common diagram instructions live in `core/execution/diagrams.md`. Local extensions record only concrete deltas and source examples; reusable auth, i18n, contract and tooling policy stays in `core/concerns/`.

## What is verified?

Run `node --test tooling/rules-kit/export.test.mjs` to check that exports exclude Debtflow facts, contain resolvable local links and refuse an existing destination. This verifies packaging and isolation, not AI compliance or successful adoption in an arbitrary application. Each adopting team must validate its profile and actual task behavior.

The static-build tests also export the viewer into isolated React/Next.js/Angular-named fixtures and build it with no installed dependencies. This establishes independence of the documentation tool, not correctness of every host application's integration or agent setup.

Use the optional [evaluation protocol](../../ai-guide/evaluation/README.md) for paired task trials. Keep the universal policy portable; the local measurement utility and raw results do not need to be loaded by agents or copied into every application. Check each tool's actual instruction loading: unconditional rule imports may load every file despite a modular folder structure.

Client projections and capabilities are maintained with `node tooling/rules-kit/setup.mjs --write` (`--check` for drift). Copy this tool with the rules. It generates repository-scoped skills for Codex, Claude Code and Cursor, Claude role profiles, a Copilot adapter and `.ai-rules/CATALOG.md`. Client paths/formats live in the source `.ai-rules/clients.json` registry. Shared targets may use `.ai-rules/project/tools.json`; each member may override targets in ignored `.ai-rules/tools.local.json`. Generated outputs, catalog and ownership state are ignored; setup manages their gitignore patterns. CI must run setup before checks. Use the registered generic entry for other repository-aware tools, or add a verified native adapter. Canonical skill/role Markdown is the website source; generated client files are not a second documentation library.
