# Rule Maintenance

Optional [diagram guidance](../../execution/diagrams.md).

```mermaid
flowchart TD
    S0["1. decide whether a rule is warranted"]
    S1["2. choose the canonical location"]
    S2["3. write a rule that can be applied and checked"]
    S3["4. connect and validate"]
    S0 --> S1
    S1 --> S2
    S2 --> S3
    click S0 "when-to-add.md"
    click S1 "placement.md"
    click S2 "authoring.md"
    click S3 "verification.md"
```

| Step | Detailed instructions                                           |
| ---- | --------------------------------------------------------------- |
| 1    | [1. decide whether a rule is warranted](when-to-add.md)         |
| 2    | [2. choose the canonical location](placement.md)                |
| 3    | [3. write a rule that can be applied and checked](authoring.md) |
| 4    | [4. connect and validate](verification.md)                      |
