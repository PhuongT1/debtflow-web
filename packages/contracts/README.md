# @debtflow/contracts

TypeScript contracts shared by frontend zones. This package contains types only; it must not contain UI, network calls, secrets, or mutable state.

## Run check

From the monorepo root:

```bash
npm run typecheck -w @debtflow/contracts
```

Import example:

```ts
import type { ApiEnvelope, CoreIdentity } from "@debtflow/contracts";
```
