# Skills

Each child directory contains an Agent Skills `SKILL.md` with a stable name, a discriminating description and the relevant canonical workflow link. Skills are task entrypoints; `workflows/` retains the detailed stages, while execution/framework/standard modules remain conditional rules. There is one maintained task procedure, not one per client.

The repository entry and root selector handle ordinary outcome-based prompts; the developer does not need to choose a skill. Native discovery is a convenience, not a dependency: with repository access, a client can follow the selected canonical workflow directly. An explicit skill request selects that capability but does not override project instructions, scope or permissions. Use a matching skill implicitly when the client supports discovery; exclusions in its description distinguish planning, appearance, behavior defects, component work and refactoring. Never promise universal discovery in an unconfigured chat tool.

Run `node tooling/rules-kit/setup.mjs --write` to generate native projections and the catalog from current core/project skill and role files; `--check` detects drift. Use the generated `.ai-rules/CATALOG.md` catalog to discover installed capabilities. Project skills belong in `.ai-rules/project/skills/<name>/SKILL.md` with distinct names. The generator does not silently replace existing client files or hand-edited generated outputs.

Each core skill links to one primary selectable workflow entry; every shared selectable workflow has at least one core skill. Keep these links current when adding, renaming or removing tasks. Group/reference workflows remain conditional stages rather than independent task entrypoints.
