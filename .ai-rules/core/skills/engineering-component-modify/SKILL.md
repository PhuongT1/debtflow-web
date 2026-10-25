---
name: engineering-component-modify
description: 'Change an existing component contract, composition or intentional state behavior. Excludes reported defects and appearance-only edits.'
---

# Component Modify

Establish the [repository instructions](../../../README.md) and [project context](../../../project/README.md), then select only the rules relevant to this task.

Use the [canonical task workflow](../../workflows/component/modify/README.md) for task stages and conditional rules. Do not recursively load every reference.

Identify caller contracts and changed states before editing. Preserve supported props, focus, events and styling outside the requested delta.

If delegation is available and permitted, use the [coordination contract](../../agents/README.md); otherwise perform the same responsibility in the current agent. A skill does not grant extra scope or permission.
