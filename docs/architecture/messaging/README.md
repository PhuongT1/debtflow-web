# Messaging

Exchange data across application windows through `@packages/platform-sdk`. Create one app client, register handlers at the composition root and call its methods from features.

## When to use

| Boundary                                        | API                                                               |
| ----------------------------------------------- | ----------------------------------------------------------------- |
| Iframe ↔ Shell navigation, locale and readiness | `createPlatformClient` / `createRemoteClient`                     |
| Global modal input/result                       | [Overlays](../overlays/README.md)                                 |
| New validated cross-window protocol             | `createWindowMessenger` inside an owned SDK adapter               |
| Same browser document only                      | `publishPlatformEvent` / `subscribePlatformEvent` (`CustomEvent`) |
| Local component interaction                     | Props/callbacks or the established local state owner              |

## Flow

```text
Caller iframe ⇄ Shell host ⇄ Modal content iframe
               postMessage
```

Both links use the browser's `message` event. Sibling frames communicate through Shell in this implementation; neither needs the other's window reference. `postMessage` also supports popup/window connections when an adapter provides their trusted window and origin.

## Application API

```ts
import { createPlatformClient } from '@packages/platform-sdk';

export const appPlatform = createPlatformClient({
  source: 'customer-app',
  getHostOrigin: () => document.body.dataset.platformOrigin ?? location.origin,
});
```

Supply the host origin from trusted configuration. Mount `listen` once before `announceReady`; register its returned unsubscribe in framework teardown. Partner Ops already does this in its [bridge](../../../apps/partner-ops/src/components/platform/embedded-platform-bridge.tsx).

| App client method                   | Options / result                                                                       |
| ----------------------------------- | -------------------------------------------------------------------------------------- |
| `isEmbedded()`                      | Whether this window has a parent                                                       |
| `navigate({ path })`                | Valid internal path; embedded sends to host, standalone navigates to configured host   |
| `announceReady({ capabilities })`   | String capability names; embedded only                                                 |
| `listen({ onLocale, onRoute })`     | Callbacks receive `{ locale }` / `{ path }`; returns unsubscribe                       |
| `openOverlay({ request, signal? })` | Promise of [overlay result](../overlays/protocol.md#overlayresult); embedded operation |

The host creates `createRemoteClient({ source, getPeer })` once per mounted remote. `getPeer()` returns its current `{ target, origin }` or null.

| Host client method                | Options / result                                                       |
| --------------------------------- | ---------------------------------------------------------------------- |
| `listen({ onReady, onNavigate })` | Callbacks receive `{ capabilities }` / `{ path }`; returns unsubscribe |
| `setLocale({ locale })`           | Send current `en`/`vi` locale                                          |
| `setRoute({ path })`              | Send route to the mounted remote                                       |

## Platform event reference

| `event.data.type`         | Sender → receiver | Payload        |
| ------------------------- | ----------------- | -------------- |
| `debtflow:ready`          | Remote → host     | `capabilities` |
| `debtflow:navigate`       | Remote → host     | `path`         |
| `debtflow:locale-changed` | Host → remote     | `locale`       |
| `debtflow:route-changed`  | Host → remote     | `path`         |

These wire names stay unchanged for compatibility; the npm package name does not rename the protocol. The [message contract](../../../packages/platform/contracts/src/mfe/mfe-message.types.ts) owns `source`, version and validation. Overlay events have their [own protocol](../overlays/protocol.md#events-who-sends-and-listens).

## Custom protocol API

| API                                            | Options / behavior                                                                         |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `createWindowMessenger({ getPeer, validate })` | `validate` is a type guard for the owned shared message contract                           |
| `messenger.post({ message })`                  | Validates and sends to the exact peer/origin; false if no peer, throws for invalid payload |
| `messenger.listen({ handler, matches? })`      | Validates sender/origin/payload, applies optional filter, returns unsubscribe              |

Extend the shared contract/validator and an SDK adapter together. UI features use that adapter, not raw `postMessage` or one native listener per component. All SDK copies in a window share one native dispatcher; it releases the listener after the last subscription. This transports messages, not shared stores or authorization.

## Source map

| Public import            | Source                                                                                  | Owner                                               |
| ------------------------ | --------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `@packages/platform-sdk` | [packages/platform/sdk](../../../packages/platform/sdk/README.md)                       | Framework-neutral integration                       |
| Messaging options        | [messaging.types.ts](../../../packages/platform/sdk/src/messaging/messaging.types.ts)   | Named reusable options/callbacks                    |
| Native dispatch          | [window-messenger.ts](../../../packages/platform/sdk/src/messaging/window-messenger.ts) | Only native cross-window send/listen implementation |
| Application instance     | [Partner Ops client](../../../apps/partner-ops/src/lib/platform/client.ts)              | Project host configuration                          |
| Host integration         | [IframeHost](../../../apps/shell/src/components/microfrontends/iframe-host.tsx)         | Remote lifecycle and host callbacks                 |

For another project, adopt the contracts/SDK and configure its hosts, routes and domains. React UI remains in `@packages/ui-react`; Angular/Vue can use the SDK without importing React.
