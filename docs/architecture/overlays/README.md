# Overlays

Open a global modal from an embedded application and return data to its caller. The host owns the viewport; the content application owns the form and business operation.

```ts
import { createPlatformClient } from '@packages/platform-sdk';
```

## When to use

| Situation                                    | Use                                 |
| -------------------------------------------- | ----------------------------------- |
| Application on its own domain                | Local dialog and props/callbacks    |
| Global modal requested inside an iframe      | Host dialog with remote content     |
| Tooltip, select menu or discard confirmation | Local UI inside the owning surface  |
| General navigation or locale messages        | [Messaging](../messaging/README.md) |

## Data flow

```text
Caller iframe ── request.input ──> Shell ── init ──> Modal iframe
Caller iframe <── result.data ─── Shell <─ result ── Modal iframe
```

Both iframe connections use `postMessage` through the host. The iframes do not access each other's DOM or stores. A standalone dialog bypasses this bridge.

## Start here

| Need                                                 | Page                            |
| ---------------------------------------------------- | ------------------------------- |
| Register a view and connect caller, host and content | [Integration](integration.md)   |
| Copy a caller or content example                     | [Examples](examples.md)         |
| Look up options, methods, events or failure behavior | [Protocol](protocol.md)         |
| Run checks and browser scenarios                     | [Verification](verification.md) |

## Source map

| Owner                 | Source                                                                                         | Responsibility                        |
| --------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------- |
| Shared wire contract  | [overlay.types.ts](../../../packages/platform/contracts/src/mfe/overlay.types.ts)                       | Payload validation and protocol       |
| Framework-neutral SDK | [platform/sdk/src/overlays](../../../packages/platform/sdk/src/overlays/overlay.types.ts)      | Options, delivery and lifecycle       |
| React/MUI adapter     | [React UI overlays](../../../packages/ui/react/src/components/overlays/overlay.types.ts)       | Modal, backdrop, focus and sizing     |
| Project registration  | [View routes](../../../packages/platform/registry/src/overlays.ts)                                  | Trusted view ID → URL                 |
| Domain content        | [Partner Ops renderer](../../../apps/partner-ops/src/components/platform/overlays/content.tsx) | Input validation, forms and mutations |

React, Angular, Vue and plain JavaScript can use the SDK. Only the React/MUI overlay UI adapter is implemented here; another framework must supply its own renderer. Copying AI rules does not install these runtime packages.
