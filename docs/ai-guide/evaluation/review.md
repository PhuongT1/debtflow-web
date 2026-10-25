# Review an Evaluation Run

Review against the frozen case criteria, preferably by a developer or a separate reviewer rather than only the implementing agent. Use [result review](../result-review/README.md) for ordinary task acceptance.

- **Correctness:** requested behavior or expected decision boundary is demonstrated by actual command/browser evidence. Check the original case and meaningful regression edge.
- **Scope and safety:** inspect the diff and relevant consumers; no unrelated cleanup, hidden content, suppressed validation/errors or unauthorized contract changes. Correctly requested approval is not a failure for a case designed to require it.
- **UI evidence:** accessibility snapshots establish structure/interaction; screenshots and relevant measurements establish appearance. Match viewport, state and data. Do not infer all consumers passed from one app.
- **Instruction use:** inspect actual file/tool reads, selected workflow and triggered modules. Reading the expected filenames alone does not prove the rules were followed.
- **Cost and latency:** use reported usage for the entire task, including retries/tool output, and a consistent wall-clock boundary. Record developer waiting/intervention in evidence. Missing telemetry is `null`, not zero; file count is not a token estimate.

Mark `verified` only when the case's criteria and scope checks are supported. Use `failed` for a reviewed miss, `blocked` for an unresolved prerequisite, and `unreviewed` while evidence has not been assessed. Preserve failed attempts in the comparison. Do not reclassify a missing check as a pass to improve scores.
