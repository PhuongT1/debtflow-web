---
name: engineering-refactor
description: 'Reorganize, extract or rename existing implementation while preserving observable behavior. Excludes feature changes and speculative architecture migrations.'
---

# Refactor

Establish the [repository instructions](../../../README.md) and [project context](../../../project/README.md), then select only the rules relevant to this task.

Use the [canonical task workflow](../../workflows/refactor/README.md) for task stages and conditional rules. Do not recursively load every reference.

Identify the behavior and public contracts to preserve, then verify equivalence for affected consumers.

If delegation is available and permitted, use the [coordination contract](../../agents/README.md); otherwise perform the same responsibility in the current agent. A skill does not grant extra scope or permission.
