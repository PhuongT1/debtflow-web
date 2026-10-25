# Refactor

Optional [diagram guidance](../../execution/diagrams.md).

```mermaid
flowchart TD
    S0["Investigate requested outcome"]
    S1["Assess existing contracts and permission"]
    S2["Implement authorized delta"]
    S3["Verify relevant acceptance"]
    S4["Owner checks and report"]
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
    click G "../../execution/approval.md"
    click A "../../execution/approval.md"
    click R "../../execution/approval.md"
    click X "../../execution/approval.md"
    click S0 "../../execution/context.md"
    click S1 "../../execution/impact.md"
    click S2 "implement.md"
    click S3 "verify.md"
    click S4 "../../execution/verify.md"
```

| Step | Detailed instructions                                                 |
| ---- | --------------------------------------------------------------------- |
| 1    | [Investigate requested outcome](../../execution/context.md)           |
| 2    | [Assess existing contracts and permission](../../execution/impact.md) |
| 3    | [Implement authorized delta](implement.md)                            |
| 4    | [Verify relevant acceptance](verify.md)                               |
| 5    | [Owner checks and report](../../execution/verify.md)                  |
