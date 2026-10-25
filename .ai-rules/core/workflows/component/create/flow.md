# Create Component

Optional [diagram guidance](../../../execution/diagrams.md).

```mermaid
flowchart TD
    S0["Define requested contract"]
    S1["Assess changed consumers and permission"]
    S2["Implement selected responsibility"]
    S3["Verify affected consumers"]
    S4["Owner checks and evidence report"]
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
    click S0 "define.md"
    click S1 "../../../execution/impact.md"
    click S2 "../implement.md"
    click S3 "../verify.md"
    click S4 "../../../execution/verify.md"
```

| Step | Detailed instructions                                                   |
| ---- | ----------------------------------------------------------------------- |
| 1    | [Define requested contract](define.md)                                  |
| 2    | [Assess changed consumers and permission](../../../execution/impact.md) |
| 3    | [Implement selected responsibility](../implement.md)                    |
| 4    | [Verify affected consumers](../verify.md)                               |
| 5    | [Owner checks and evidence report](../../../execution/verify.md)        |
