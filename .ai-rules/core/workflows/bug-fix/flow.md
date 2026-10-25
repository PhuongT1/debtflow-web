# Bug-Fix Branches

Optional [diagram guidance](../../execution/diagrams.md).

```mermaid
flowchart TD
    S0["Classify defect and scope"]
    S1["Browser behavior: open UI branch"]
    S2["API or command: open non-UI branch"]
    S3["Correction shared by selected branches"]
    S4["Owner checks and report"]
    S0 --> B{"Affected surface?"}
    B -->|Browser| S1
    B -->|API or command| S2
    S1 --> S3
    S2 --> S3
    click B "README.md"
    S3 --> S4
    click S0 "README.md"
    click S1 "ui/flow.md"
    click S2 "non-ui/flow.md"
    click S3 "implement.md"
    click S4 "../../execution/verify.md"
```

| Step | Detailed instructions                                  |
| ---- | ------------------------------------------------------ |
| 1    | [Classify defect and scope](README.md)                 |
| 2    | [Browser behavior: open UI branch](ui/flow.md)         |
| 3    | [API or command: open non-UI branch](non-ui/flow.md)   |
| 4    | [Correction shared by selected branches](implement.md) |
| 5    | [Owner checks and report](../../execution/verify.md)   |
