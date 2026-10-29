# Protocol

The browser event is **message**. Overlay names such as `open` and `result` are `event.data.type` values, not DOM event names. Use the SDK; do not add native listeners in features.

## Caller API

```ts
import { openPlatformOverlay } from '@packages/platform-sdk';
```

`openPlatformOverlay(options)` → `Promise<OverlayResult>`. The application client's `openOverlay(options)` uses the same contract with its configured host origin.

| Option       | Type             | Required / default                              |
| ------------ | ---------------- | ----------------------------------------------- |
| `request`    | `OverlayRequest` | Required                                        |
| `hostOrigin` | `string`         | Required by primitive; configured in app client |
| `signal`     | `AbortSignal`    | Optional; abort cancels request                 |

### OverlayRequest

| Property | Type                                  | Meaning / default                               |
| -------- | ------------------------------------- | ----------------------------------------------- |
| `view`   | `string`                              | Required registered view ID                     |
| `title`  | `string`                              | Required accessible, translated title           |
| `size`   | `OverlaySize`: `xs`, `sm`, `md`, `lg` | React host defaults to `md`                     |
| `input`  | `Record<string, unknown>`             | Optional JSON context; validated by domain view |

### OverlayResult

| Property  | Type                               | Meaning                                                    |
| --------- | ---------------------------------- | ---------------------------------------------------------- |
| `status`  | `completed`, `cancelled`, `failed` | Required outcome; only completed triggers success handling |
| `data`    | `Record<string, unknown>`          | Optional JSON result; caller validates it                  |
| `message` | `string`                           | Optional text; validation, not automatic display           |

## Host and content API

Option types and payloads are maintained in [overlay.types.ts](../../../packages/platform/sdk/src/overlays/overlay.types.ts). All functions take named option objects.

### Host bridge

`createOverlayHostBridge(options)`

| Option                   | Type                                           | Responsibility                                                           |
| ------------------------ | ---------------------------------------------- | ------------------------------------------------------------------------ |
| `owner`                  | `WindowPeer`                                   | Requesting iframe window and exact origin                                |
| `views`                  | `Record<string, string>`                       | Trusted view ID → route                                                  |
| `baseUrl`                | `string`                                       | Resolve relative registered routes                                       |
| `getSurfaceWindow`       | `OverlayHostBridgeOptions['getSurfaceWindow']` | Current content iframe window                                            |
| `getLocale`              | `() => AppLocale`                              | Current locale (`en` or `vi`)                                            |
| `onRuntime?`             | `(runtime: OverlayRuntime) => void`            | Mount/rebind hidden iframe using `runtime.url`; keep it between requests |
| `onOpen`                 | `(session: OverlaySession) => void`            | Store request and configure hidden modal                                 |
| `onPresent` / `onResize` | `({ height }) => void`                         | Show measured content / update height                                    |
| `onFinish`               | `(result: OverlayResult) => void`              | Close UI; complete after exit, or immediately if never presented         |

| Returned member             | Call site                                                                |
| --------------------------- | ------------------------------------------------------------------------ |
| `runtime`                   | Current `{ id, url }`; first registered endpoint is prepared on creation |
| `attachSurface({ target })` | After iframe mount; installs validated content listener                  |
| `activate()`                | After entry transition; enables content focus                            |
| `requestClose()`            | Close button, Escape or backdrop; content guard decides                  |
| `complete({ result })`      | After exit; relays result and releases logical request                   |
| `dispose()`                 | Host teardown; cancels request and removes subscriptions                 |

### Content connection

`connectOverlaySurface(options)`

| Option           | Type                                | Responsibility                                                    |
| ---------------- | ----------------------------------- | ----------------------------------------------------------------- |
| `hostOrigin`     | `string`                            | Trusted parent origin                                             |
| `id`             | `string`                            | Runtime ID from URL `?runtime=...`                                |
| `onInit`         | `({ id, request, locale }) => void` | Capture logical request ID, reset view and render validated input |
| `onCloseRequest` | `() => void`                        | Apply dirty/pending guard; finish only if closing is allowed      |
| `onActivate?`    | `() => void`                        | Focus the initial control                                         |

| Method                    | Call site / result                                                           |
| ------------------------- | ---------------------------------------------------------------------------- |
| `present({ id, height })` | After initial data/render/fonts are ready                                    |
| `resize({ id, height })`  | After later content changes                                                  |
| `finish({ id, result })`  | Selection/save/accepted cancel; returns false for stale or finished requests |
| `dispose()`               | Content teardown                                                             |

One runtime serves many requests. Its `ready` ID is the runtime ID; subsequent messages use the logical request ID from `onInit`. Bind async callbacks to that ID. Retain content during exit; do not blank the form on `finish`.

## Events: who sends and listens

All messages use `{ protocol: 'platform-overlay-v1', id, type }` plus the payload below.

| Type            | Sender → receiver       | Payload / meaning                               |
| --------------- | ----------------------- | ----------------------------------------------- |
| `open`          | Caller → host           | `request`; open registered view                 |
| `accepted`      | Host → caller           | Host owns presentation timeout                  |
| `ready`         | Content → host          | Runtime listener ready, not UI ready            |
| `init`          | Host → content          | `request`, `locale`; initialize logical request |
| `presented`     | Content → host          | `height`; reveal measured UI                    |
| `activate`      | Host → content          | Entry finished; enable focus                    |
| `resize`        | Content → host          | New `height`                                    |
| `close-request` | Host → content          | Request guarded dismissal                       |
| `result`        | Content → host → caller | `result`; caller receives it after host exit    |
| `abort`         | Caller → host           | Caller cancelled or unmounted                   |

Adapter primitives are `emitOverlayMessage({ peer, message })` and `listenOverlayMessages({ peer, handler, id? })`. The latter returns an unsubscribe function. `peer` is `{ target: Window, origin: string }`. Prefer the lifecycle APIs above; primitives do not implement modal state.

## Validation and failure behavior

The channel validates exact window, exact origin and protocol/message shape. Request-bound handlers also validate IDs. Never use `'*'` for target origin. The host resolves only registered HTTP(S) routes; domain/API authorization remains required.

| Limit / outcome                      | Behavior                                                        |
| ------------------------------------ | --------------------------------------------------------------- |
| Request ID / view ID / title         | Max 100 / 80 / 300 characters; identifier patterns validated    |
| Request / result data                | JSON-safe, max 16,000 serialized characters each; nesting ≤20   |
| Optional message / reported height   | Max 500 characters / finite 0–50,000; UI clamps viewport height |
| Acceptance / presentation timeout    | 12s caller acceptance; 15s host presentation after acceptance   |
| Presented form                       | No user interaction timeout                                     |
| Another request while busy           | Additional request cancelled; active modal retained             |
| Unknown view or presentation failure | Failed result; no duplicate local dialog                        |
| Abort / host disposal                | Cancellation; does not roll back an API mutation                |

Send IDs and small outcomes. Omit optional undefined values; encode dates as strings. No functions, DOM nodes, credentials, stores, cycles or class instances. The legacy `debtflow:overlay-state` notification is not used to open current overlays.
