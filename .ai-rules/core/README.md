# Core Rules

Reusable instructions for discovering a project's conventions and completing an authorized task. Concrete architecture, libraries, paths and executable commands belong in the adopting project's profile, not in this library. This overview is optional navigation; the [root selector](../README.md) remains the single task entry.

| Folder        | Reusable responsibility                                                           |
| ------------- | --------------------------------------------------------------------------------- |
| `execution/`  | Context discovery, scope, consumer impact and verification                        |
| `workflows/`  | Task stages, selected by intent and evidence                                      |
| `standards/`  | Code, security and applicable application boundaries                              |
| `frameworks/` | React, Next.js or Angular principles, selected only when relevant                 |
| `concerns/`   | Auth, locale, API and tooling principles without project defaults                 |
| `skills/`     | Task entrypoints with discovery metadata; reference the canonical workflow stages |
| `agents/`     | Optional role profiles and parent/worker coordination boundaries                  |

Before choosing an implementation, inspect the target project's comparable code, configuration and consumers. Preserve its language, architecture and installed libraries; examples do not authorize installing dependencies or restructuring the project. Local conventions specialize reusable defaults while the common scope and safety boundaries remain applicable.

Keep the root selector, this `core/` tree and the workflow synchronization tool together when adopting elsewhere. Establish a fresh project profile and point it to the appropriate owner instructions. Files remain the source for both agents and the documentation viewer; do not copy rule bodies into the human guides.
