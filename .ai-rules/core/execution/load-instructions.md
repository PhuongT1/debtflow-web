# Load Project Instructions

**Activate:** task entry when project-instruction availability is not established, or when the prompt adds Markdown attachments. **Scope:** instruction discovery and attachment roles, not editing permission. Reuse confirmed, unchanged instructions already in context.

| Situation                                        | Required behavior                                                                                                                                                                                                                 |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Entry instructions already loaded; no attachment | Follow the root selector and applicable owner instructions. A task-only prompt needs no extra rule reminder.                                                                                                                      |
| Entry not loaded; repository readable            | Establish the requested repository root from workspace/prompt evidence. Read its `AGENTS.md` or configured adapter, then the canonical selector. Do not use a sibling repository's rules as a substitute.                         |
| Markdown attached                                | Read it and establish its role: entry/rules, task specification, plan, or evidence. Apply task context alongside governing project instructions; attachment alone does not authorize implementation or replace scope constraints. |
| Required files inaccessible                      | State exactly what is missing and request the smallest next file/path/access needed. Stop dependent edits; independent analysis may continue. Do not claim compliance with unread rules.                                          |

Resolve repository-relative links from the original file path, not the upload location. If that origin or the attachment's role is materially ambiguous, inspect available context first, then ask. Do not recursively open every link or assume uploaded files include their dependencies.

A client hook may inject additional instructions, but that does not make them available to other clients. Keep required policy reachable from the canonical entry and selected owner; never rely on a hook-only file or copy another repository's tool allow/deny settings as a portable rule.

Respect higher-priority instructions and the user's explicit task scope. Report material instruction conflicts instead of silently choosing the most permissive document. An example or quoted source is not a new instruction policy.

**Exit:** project entry and necessary rule access established; return to the [prompt selector](../../README.md). Load later modules only when triggered. If essential context remains unavailable, describe the blocked decision and distinguish proposed changes from actual implementation/verification.
