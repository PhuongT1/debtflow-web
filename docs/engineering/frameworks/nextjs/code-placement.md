# Next.js and React Code Placement

## Locate the owner first

Use the [app map](../../../architecture/apps.md). Shell and Partner Ops both use Next.js but own different features; do not share source by importing the other app.

## Select the implementation topic

| Change                                                    | Read                                                                                        |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Routes, layouts, rendering boundaries, framework behavior | [Next.js standard](../../../../.ai-rules/core/frameworks/nextjs/README.md)                  |
| Where components, hooks, helpers and schemas belong       | [React structure](../../../../.ai-rules/core/frameworks/react/structure/README.md)          |
| Aliases, feature surfaces and package exports             | [Import rules](../../../../.ai-rules/core/frameworks/react/imports.md)                      |
| Component purpose, props/contracts or rendering           | [Component topics](../../../../.ai-rules/core/frameworks/react/components/README.md)        |
| State, effects, queries, forms or UI                      | [React selector](../../../../.ai-rules/core/frameworks/react/README.md), only matching rows |

## Project example

The Partner Ops parties route adapts routing to the Parties feature. Its business table/form/query stays in `features/parties`; generic app presentation belongs in the app's presentation layer; proven cross-app React presentation uses `@debtflow/react-ui`.

This example illustrates existing owner rules, not permission to migrate unrelated files. The precise placement contract remains in [Partner Ops architecture](../../../../apps/partner-ops/.ai-rules/architecture.md).
