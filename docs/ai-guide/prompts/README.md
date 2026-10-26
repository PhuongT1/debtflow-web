# Prompts

Describe the result and the location. Whether you need to mention a rule file depends on the context already available to the AI.

| Context                                    | Prompt guidance                                               |
| ------------------------------------------ | ------------------------------------------------------------- |
| Project instructions loaded; no attachment | [Use a short task prompt](without-attachment.md)              |
| Markdown attached                          | [State how the attachment should be used](with-attachment.md) |
| Instructions or repository access missing  | [Provide project context first](../project-context/README.md) |

## Automatic or explicit skills

After the one-time [Client Setup](../project-context/client-setup.md), write a normal outcome-based prompt. The AI selects the applicable workflow and can use matching native skills when discovery is supported. You do not need to choose a skill, attach AGENTS.md or repeat the workflow on every request.

| Your preference                           | What to do                                                                                                      |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Let the AI choose                         | State the result, affected location and any missing acceptance facts                                            |
| Choose a specific workflow                | Select the skill in your client's picker or mention its installed name                                          |
| Add complementary guidance                | Select/name the additional capability and its purpose, such as an accessibility review after a component change |
| Use a client without native skill support | Configure the project entry once; it can follow the same Markdown workflow through repository access            |

An explicit choice does not override a plan-only/read-only request or grant extra permissions. Additional skills should contribute only the relevant guidance; conflicting or incompatible instructions need a concrete resolution. Automatic matching is model behavior, not a guaranteed classifier; inspect the selected approach and actual evidence when it matters.

The canonical files stay independent of the client: shared procedures in `.ai-rules/core/`, local architecture and extensions in `.ai-rules/project/`, and generated projections from the configured client registry. For an additional project capability, follow [Maintaining capabilities](../how-ai-works/toolkit.md#maintaining-capabilities); it does not require another copy of the rules.

## Efficient context and answers

Give missing facts rather than the entire handbook: outcome, route/file, reproduction or acceptance behavior, and constraints. The AI should load the current stage and affected owner, reuse unchanged context/checks, and summarize the result, verification and limits. Broader investigation remains necessary when impact or correctness is uncertain. There is no token-saving mode that skips required checks and no need for a separate prompt template for each client.

## Add only missing facts

Include a screenshot or reproduction steps for a hard-to-reproduce issue. Mention the viewport, language or account type if only that case fails. State product decisions the AI cannot infer from code.

You do not need to prescribe rule filenames, implementation steps or tests once the project instructions are loaded.

## Want a plan first?

Add **“Plan only; do not edit yet.”** After review, say **“Implement this plan.”** Otherwise, an authorized implementation request continues through verification unless a necessary decision is unresolved.

[Prompt examples](examples.md) · [How AI works](../how-ai-works/README.md)
