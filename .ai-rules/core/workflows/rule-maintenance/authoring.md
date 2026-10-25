# Authoring

**Activate:** writing or refining a selected rule module.

Write documentation and rule prose in English. Original UI labels, filenames and quoted user input may retain their source language.

For each independently selected module, state **activation**, **scope/exclusions**, **read boundary**, **required actions/restrictions**, and **exit evidence/next trigger**. Use only sections needed for that module. Link existing requirements instead of copying them; add a project example only when it resolves ambiguity.

State MUST vs preference clearly. Cite a relevant source for library behavior; label local conventions as local choices. Do not add absolute mandates based on a single historical implementation. Before changing existing policy apply [scope permissions](../../execution/change-scope.md); report conflicts instead of silently expanding its authority.

Keep process rules free of framework APIs; link to the selector instead. Avoid repeating common rules, attaching a huge checklist to every task, or adding artificial confirmation gates. Do not declare an automatic tool check unless it actually exists.
