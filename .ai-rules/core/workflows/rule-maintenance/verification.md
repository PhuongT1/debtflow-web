# Verification

**Activate:** a rule patch is ready for validation.

Add a short trigger row to the owning selector. Update old links when moving/splitting rules; keep one canonical body. Check conflicts with parent/owner instructions, all changed local links, formatting, and documented commands. Existing code exceptions remain follow-up work unless the user also authorizes their migration.

For a workflow entry, edit its `Select when` and `Selection priority` metadata and regenerate the root selector with the exported `tooling/rules-kit/workflows.mjs --write`; check it with `--check`. Directory READMEs declare `Workflow kind` as entry, group or reference. Do not hand-maintain generated selector rows. When deleting a workflow, update inbound references rather than redirecting them automatically to an unrelated task.

**Done when:** a future contributor can select the rule from a task description, apply it without unrelated reading, and identify evidence that it was followed. Report policy changes separately from actual tooling enforcement.

For claimed efficiency/quality improvements, compare representative tasks with the same model, source baseline, tools and acceptance criteria. Record actual instruction reads, full-task usage/time, failures and scope violations. Missing measurements are unknown, not savings. Do not mark compliance from filenames alone. Keep local evaluation commands in the project layer; rule-link/export checks establish document integrity, not agent effectiveness.
