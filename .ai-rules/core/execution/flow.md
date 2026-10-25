# Agent Decision Flow

Optional developer overview. Read the selected rules directly during a task; the diagram does not execute or enforce a classifier. Select any step to open its canonical instructions.

```mermaid
flowchart TD
    P["1. Classify the requested outcome"]
    W["2. Select one workflow"]
    I["3. Inspect the owner and relevant source"]
    C["4. Check purpose, usages, scope and verification"]
    G{"Shared or uncertain impact?"}
    D["Assess affected contracts and consumers"]
    A{"Impact understood and authorized?"}
    Q["Ask a concrete decision before dependent edits"]
    E["5. Apply the focused patch and selected standards"]
    V["6. Verify the original case and relevant edges"]
    R{"Checks passed?"}
    F["Report actual evidence or verification limits"]
    O["Read-only: investigate and explain"]
    L["Plan-only: present a plan without edits"]
    P -->|Implementation| W
    P -->|Read-only| O
    P -->|Plan-only| L
    W --> I
    I --> C
    C --> G
    G -->|No| A
    G -->|Yes| D
    D --> A
    A -->|Yes| E
    A -->|No| Q
    Q -->|Approved or narrowed: recheck| C
    Q -->|Declined| F
    E --> V
    V --> R
    R -->|Failure| I
    R -->|Pass or unavailable| F
    click P "../../README.md#1-classify-the-prompt"
    click W "../../README.md#1-classify-the-prompt"
    click I "context.md"
    click C "../standards/common.md#before-an-edit"
    click G "../standards/common.md#before-an-edit"
    click D "shared-code.md"
    click A "approval.md"
    click Q "approval.md"
    click E "implementation-rules.md"
    click V "verify.md"
    click R "verify.md"
    click F "verify.md"
    click O "context.md"
    click L "../workflows/planning/README.md"
```

| Step                    | Detailed behavior                                                                                          |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| Classify and select     | [Prompt selector](../../README.md#1-classify-the-prompt)                                                   |
| Inspect source          | [Bounded context](context.md)                                                                              |
| Check every edit        | [Common local check](../standards/common.md#before-an-edit)                                                |
| Expand only when needed | [Impact](impact.md), [shared consumers](shared-code.md), [scope](change-scope.md), [approval](approval.md) |
| Implement               | [Selected topics](implementation-rules.md) in the chosen workflow                                          |
| Verify and report       | [Acceptance and evidence](verify.md)                                                                       |

When new evidence changes responsibility, [switch rules](switch-rules.md) without treating rule loading as broader permission. Approval does not prove compatibility; unavailable checks remain explicit limits. Failed verification returns to investigation. Plan-only work waits for explicit implementation authorization.
