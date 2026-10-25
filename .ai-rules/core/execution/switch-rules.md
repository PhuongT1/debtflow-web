# Switch Rules on New Evidence

**Activate:** investigation discovers a different task responsibility, owner, affected contract, or required scope. **Scope:** rule activation, not additional modification permission.

| New evidence                                                          | Required switch/addition                                                                   |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| A visual symptom comes from incorrect state/data/request              | Add relevant bug investigation and state/data rules; retain only still-relevant UI checks  |
| A planned style edit actually changes JSX/props/events                | Add exact component implementation topics and [impact](impact.md)                          |
| A local target is reused or changes a global default                  | Add [shared-code restrictions](shared-code.md) before editing                              |
| Auth, URL callback, translation, contract, dependency/config involved | Add only matching [implementation rules](implementation-rules.md)                          |
| Refactor would change observable behavior                             | Reclassify as defect/feature as appropriate; confirm scope before behavior changes         |
| Necessary outcome/contract/consumer migration exceeds authorization   | Apply [scope](change-scope.md) and [approval](approval.md); do not implement the expansion |

Update the working category/owner/scope, record the evidence and newly required rules, and briefly explain any material change to the developer. Read only newly activated modules; retain already-read obligations still applicable. Do not restart completed stages or reverify unchanged areas without cause. If category remains ambiguous and affects implementation, request the missing decision.

**Exit:** correct rule set selected and permission re-evaluated; return to the interrupted workflow stage.
