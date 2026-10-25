# UI Bug Fix

Optional [diagram guidance](../../../execution/diagrams.md).

```mermaid
flowchart TD
    S0["Establish scope and reproduce"]
    S1["Assess purpose, consumers, scope"]
    S2["Apply authorized correction"]
    S3["Repeat original scenario and edges"]
    S4["Run owner checks and report"]
    S0 --> S1
    S2 --> S3
    S3 --> S4
    S1 --> G{"Impact and permission understood?"}
    G -->|Yes| S2
    G -->|No| A["Stop dependent edits; present evidence and ask developer"]
    A --> R{"Developer decision received?"}
    R -->|No| A
    R -->|Approved bounded change| S2
    R -->|Declined| X["Do not perform dependent change"]
    click G "../../../execution/approval.md"
    click A "../../../execution/approval.md"
    click R "../../../execution/approval.md"
    click X "../../../execution/approval.md"
    click S0 "investigate.md"
    click S1 "../../../execution/impact.md"
    click S2 "../implement.md"
    click S3 "verify.md"
    click S4 "../../../execution/verify.md"
```

| Step | Detailed instructions                                            |
| ---- | ---------------------------------------------------------------- |
| 1    | [Establish scope and reproduce](investigate.md)                  |
| 2    | [Assess purpose, consumers, scope](../../../execution/impact.md) |
| 3    | [Apply authorized correction](../implement.md)                   |
| 4    | [Repeat original scenario and edges](verify.md)                  |
| 5    | [Run owner checks and report](../../../execution/verify.md)      |
