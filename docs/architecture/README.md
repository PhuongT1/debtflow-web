# Architecture

Use this section to understand where a change belongs and which runtime/package owns it. Coding conventions live in [Engineering](../engineering/README.md); agent execution lives in [AI Guide](../ai-guide/README.md).

| Topic                                                          | Detailed page                              |
| -------------------------------------------------------------- | ------------------------------------------ |
| Monorepo folders, apps and framework boundaries                | [Workspace map](workspace.md)              |
| Source placement inside each app                               | [Application ownership](apps.md)           |
| Cross-window data exchange and application clients             | [Messaging](messaging/README.md)           |
| Shared package responsibilities                                | [Package boundaries](packages.md)          |
| Cross-app navigation, composition and session responsibilities | [Integration entry points](integration.md) |

[Parties feature](parties-feature.md) maps the list/detail/form structure, services, query keys, transport and verification to the current source tree.

## Source of truth

These maps were checked against current workspace/package scripts and owner instructions. Exact installed versions come from the lockfile; declared framework ranges come from package manifests. No unverified version numbers are copied into this overview.

The app-owned documents linked below remain canonical for local requirements. When ownership changes, update the relevant owner document and this navigation map together; do not create a competing policy body.

See [Cross-Application Overlays](overlays/README.md) for shared modal ownership, source paths, view registration and standalone/embedded behavior.
