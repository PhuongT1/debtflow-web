# Investigate a Non-UI Defect

**Read when:** directly investigating API/data, command/build/type, runtime, or background behavior. UI reporting alone does not require this file.

| Failure            | Minimal evidence                                                                      |
| ------------------ | ------------------------------------------------------------------------------------- |
| API/data           | Relevant request/existing test, inputs, status, safe response details, pertinent logs |
| Build/type/runtime | Smallest failing command and actual error                                             |
| Intermittent/race  | Relevant timing/state; control those inputs to distinguish cause from hypothesis      |

Trace the owning handler/adapter/state path. Support the suspected cause with observed or source evidence; examine shared consumers only when implicated. Use existing tools/test setup; do not add a runner just to reproduce. Avoid unrelated mutations and exposing secrets.

If prerequisites/access prevent reproduction, record the limitation and strongest available evidence. Do not claim confirmed reproduction.

**Exit:** evidence-supported cause or explicit limit. Next: [implementation](../implement.md) after required gates. Add [browser investigation](../ui/investigate.md) only when that surface also needs exercising.
