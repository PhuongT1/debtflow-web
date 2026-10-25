# Workflow Families

Start at [Engineering Rules](../../README.md) for automatic intent selection. This directory is a human navigation map, not another required AI read.

The [root selector](../../README.md#1-classify-the-prompt) lists the current selectable workflows. It is generated from the actual workflow entry files; this page does not maintain a second list.

Each workflow directory has a `README.md` declaring `Workflow kind`: `entry` for a selectable task, `group` for an operation-family index, or `reference` for supporting material. Entries also declare `Select when` and a unique positive `Selection priority` (lower numbers match first). Only independently selectable tasks are entries; detailed stages and branch diagrams are not separate primary workflows.

After adding, removing or changing entries, run `node tooling/rules-kit/workflows.mjs --write` from the repository root. Run the same command with `--check` to detect an outdated selector or invalid metadata. The export includes this dependency-free tool. Documentation build and viewer startup read source only; run synchronization explicitly after changes. Deleting a referenced workflow still requires updating inbound links; generation does not invent replacement workflows.

Every workflow links its required actions to detailed rules; each optional `flow.md` links the same canonical files. The project may provide an optional zoom/pan viewer with clickable node details. No external service or runtime dependencies are needed; viewer/diagrams are not mandatory agent input.
