# Component Operations

Optional [diagram guidance](../../execution/diagrams.md).

```mermaid
flowchart TD
    S0["Select component operation"]
    S1["Create: define new contract"]
    S2["Modify: assess existing contract"]
    S3["Implement authorized component delta"]
    S4["Verify actual consumers"]
    S0 --> B{"Create or modify?"}
    B -->|Create| S1
    B -->|Modify| S2
    S1 --> S3
    S2 --> S3
    click B "README.md"
    S3 --> S4
    click S0 "README.md"
    click S1 "create/README.md"
    click S2 "modify/README.md"
    click S3 "implement.md"
    click S4 "verify.md"
```

| Step | Detailed instructions                                |
| ---- | ---------------------------------------------------- |
| 1    | [Select component operation](README.md)              |
| 2    | [Create: define new contract](create/README.md)      |
| 3    | [Modify: assess existing contract](modify/README.md) |
| 4    | [Implement authorized component delta](implement.md) |
| 5    | [Verify actual consumers](verify.md)                 |
