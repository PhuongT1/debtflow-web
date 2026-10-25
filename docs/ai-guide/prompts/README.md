# Prompts

Describe the result and the location. Whether you need to mention a rule file depends on the context already available to the AI.

| Context                                    | Prompt guidance                                               |
| ------------------------------------------ | ------------------------------------------------------------- |
| Project instructions loaded; no attachment | [Use a short task prompt](without-attachment.md)              |
| Markdown attached                          | [State how the attachment should be used](with-attachment.md) |
| Instructions or repository access missing  | [Provide project context first](../project-context/README.md) |

## Add only missing facts

Include a screenshot or reproduction steps for a hard-to-reproduce issue. Mention the viewport, language or account type if only that case fails. State product decisions the AI cannot infer from code.

You do not need to prescribe rule filenames, implementation steps or tests once the project instructions are loaded.

## Want a plan first?

Add **“Plan only; do not edit yet.”** After review, say **“Implement this plan.”** Otherwise, an authorized implementation request continues through verification unless a necessary decision is unresolved.

[Prompt examples](examples.md) · [How AI works](../how-ai-works/README.md)
