# Next.js Study

This review uses the local `vercel/next.js` checkout at commit `cbf49db30a655ac17c92c2951885c4256db14b9e`. It is a reference for design choices, not an instruction to migrate Debtflow to canary. Upstream tools and prerequisites can change; recheck the linked source before adopting them.

## Two different skill libraries

| Upstream source                                                                                                                      | Intended audience                                                      | Application here                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Root AGENTS.md](https://github.com/vercel/next.js/blob/cbf49db30a655ac17c92c2951885c4256db14b9e/AGENTS.md) and scoped owner entries | Contributors building the Next.js framework                            | Thin repository entry plus owner instructions and explicit commands; keep Debtflow ownership                                                     |
| [Internal skills](https://github.com/vercel/next.js/tree/cbf49db30a655ac17c92c2951885c4256db14b9e/.agents/skills)                    | Framework maintenance, runtime internals, CI triage, docs and releases | Adopt narrow activation descriptions, actionable procedures and verification; omit framework-maintainer tasks                                    |
| [Public skills](https://github.com/vercel/next.js/tree/cbf49db30a655ac17c92c2951885c4256db14b9e/skills)                              | Applications using supported Next.js versions                          | Evaluate compatibility and task need separately; do not install the entire library                                                               |
| `.claude/skills` symlink to `.agents/skills`                                                                                         | Share one maintained source with Claude                                | Our generator keeps one canonical source and produces client projections without requiring symlinks                                              |
| `skills-lock.json`                                                                                                                   | Record an external skill's source and content hash                     | Any external adoption needs a reviewed source revision and update policy; our local manifest tracks generated ownership, not upstream provenance |

The upstream authoring skill separates short always-loaded guardrails from on-demand procedures and uses a hub with detailed references. Our entry/selector, skills and workflow stages implement the same separation. Some upstream fields and commands are client-specific; our current portable metadata is deliberately smaller. Do not copy Claude execution fields into every client and assume equivalent behavior.

## Evidence before installation

The inspected Debtflow installation resolves Next.js **15.5.23** for Shell and Partner Ops, while their manifests allow `^15.3.4`. This is a review snapshot; check the affected app again after dependency changes. The upstream canary checkout is not documentation for this installed version.

| Candidate                                              | Finding                                                                                             | Decision for this installation                                                                                                    |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Version-matched docs                                   | Upstream documents bundled docs at `next/dist/docs` starting in 16.2; that directory is absent here | Use official Next.js 15 documentation and installed types/source; do not point agents at a missing directory                      |
| Next.js runtime MCP / `next-devtools-mcp`              | Official runtime endpoint support starts in Next.js 16                                              | Optional future integration after a separately scoped upgrade and compatibility check; do not claim it works on this installation |
| Public `next-dev-loop` skill                           | Reviewed source requires Next.js 16.3+, Turbopack and `agent-browser` 0.31.1+                       | Do not install it as a usable default here; adopt the evidence loop with existing browser tools and app commands                  |
| Cache Components / Partial Prefetching adoption skills | Change rendering/caching architecture and have feature/version prerequisites                        | Use only for a separately requested migration; not general team onboarding                                                        |
| Bundle optimizer                                       | Specialized analyzer commands and schema must exist in the installed version                        | Defer until a bundle task establishes compatible tooling and baseline metrics                                                     |
| Browser automation                                     | Real interaction evidence complements compiler/server errors                                        | Reuse available browser tooling; installing another browser plugin is not required for our setup                                  |

Sources: [AI agents guide](https://nextjs.org/docs/app/guides/ai-agents), [MCP guide](https://nextjs.org/docs/app/guides/mcp), [reviewed dev-loop skill](https://github.com/vercel/next.js/blob/cbf49db30a655ac17c92c2951885c4256db14b9e/skills/next-dev-loop/SKILL.md), and [Next.js 15 docs](https://nextjs.org/docs/15/app).

## Adopted working loop

1. Establish the owner, installed version, router, acceptance behavior and available tools. Use the [version-aware evidence policy](../../../.ai-rules/core/execution/context.md#use-evidence-for-the-installed-version).
2. Load the selected skill/workflow and relevant reference topics. Keep project choices in the local profile; do not bulk-load all upstream skills or docs.
3. Reproduce the affected behavior in the correct app and mode. Reuse its running development server; preserve its output and browser session.
4. After an edit, distinguish compilation/type results, server/runtime errors and observed browser behavior. Compatible introspection can narrow the search, but a clean tool response cannot prove the user interaction works.
5. Run relevant owner checks and report actual evidence and limits. A tool mismatch or missing browser is an explicit gap, not a reason to mark the task passed.

This loop extends the existing verification contract without adding another competing workflow. Upstream policies for Vercel membership, release branches, Rust builds and confirmation before every documentation edit are not Debtflow policy.

## Member setup and optional extensions

The required path remains `npm run rules:setup`, then `npm run rules:doctor`, reload the client and perform the plan-only discovery check in [Client Setup](../project-context/client-setup.md). It works from source without downloading external skills or MCP packages.

An MCP server is a tool connection; a skill is task guidance. Neither replaces the project entry or proves compliance. Client skill folders are generated by our toolkit; MCP configuration is client-specific and is not generated by `rules:setup`. Do not promise that one `.mcp.json` configures every client.

Before adding an external skill/plugin, record its purpose, exact source/version, compatible framework/client versions, required tools and verification task. Inspect its instructions and any executable code; reject overlapping procedures or merge useful guidance into its canonical owner deliberately. Keep credentials/session state local. Do not let an external installer overwrite generated client files or introduce a second copy of our rules. Maintainers must choose a reproducible reviewed version and update process before making an external extension part of team setup.

For an approved future Next.js 16 integration, use the official MCP guide and selected client's own configuration procedure, confirm the actual project path/port and discover the tools it exposes, then test one diagnostic and one browser interaction. This review does not install a server, enable telemetry/feedback, change account permissions or upgrade Next.js.
