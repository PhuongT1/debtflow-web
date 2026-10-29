# Integration

Prerequisites: authenticated content route, trusted parent origin and a registered view. Use the existing React adapter when available; other frameworks implement the same [SDK lifecycle](protocol.md#host-and-content-api).

## Step 1: Register the content view

Add a view ID and route in the host registry, then implement its renderer in the content application. Several views may share one endpoint.

```ts
const views = {
  'customer-picker': '/customer-app/__embed/overlays',
};
```

The host selects the URL. Caller data supplies only the view ID and JSON input. Configure authentication, proxy/cookies, CSP and the allowed parent origin for the deployment.

Current sources: [registry](../../../packages/platform/registry/src/overlays.ts), [content route](<../../../apps/partner-ops/src/app/(workspace)/overlays/page.tsx>) and [renderer](../../../apps/partner-ops/src/components/platform/overlays/content.tsx).

## Step 2: Use one application client

Create the client once at the application's composition root. Supply the host origin from trusted configuration.

```ts
import { createPlatformClient } from '@packages/platform-sdk';

export const appPlatform = createPlatformClient({
  source: 'customer-app',
  getHostOrigin: () => document.body.dataset.platformOrigin ?? location.origin,
});
```

Components call `appPlatform.openOverlay({ request, signal })`; they do not install native message listeners. [Caller example](examples.md#caller-send-input-and-receive-data).

Partner Ops already provides [partnerPlatform](../../../apps/partner-ops/src/lib/platform/client.ts). Its [AppDialog](../../../apps/partner-ops/src/components/ui/dialog/dialog.tsx) delegates embedded requests and renders local children in standalone mode. Use that boundary for both modes.

## Step 3: Mount the host adapter

The host's owner ref identifies the requesting iframe. `views` is trusted registration from Step 1.

`workspace.types.ts`:

```ts
import type { OverlayHostProps } from '@packages/ui-react';

export type WorkspaceProps = Pick<OverlayHostProps, 'views' | 'closeLabel' | 'loadingLabel'> & {
  remoteEntry: string;
};
```

`workspace.tsx`:

```tsx
import { useRef } from 'react';
import { OverlayHost } from '@packages/ui-react';
import type { WorkspaceProps } from './workspace.types';

export function Workspace({ remoteEntry, ...props }: WorkspaceProps) {
  const owner = useRef<HTMLIFrameElement>(null);
  return (
    <>
      <iframe ref={owner} src={remoteEntry} title="Customer workspace" />
      <OverlayHost owner={owner} {...props} />
    </>
  );
}
```

Translate the labels. The adapter prepares one hidden content runtime, retains its providers/cache between opens and remounts each request's view. It measures before showing, covers the full host viewport and keeps content mounted through exit. Do not recreate the iframe on every click.

## Step 4: Render content and return data

The content route wraps its domain renderer in `OverlaySurface`. Read validated `request.input`, then return a small result through `finish`. [Content example](examples.md#content-validate-input-and-return-data).

| Content responsibility | Required behavior                                                       |
| ---------------------- | ----------------------------------------------------------------------- |
| Initial API data       | Use `deferPresentation`; call `markReady()` after required data renders |
| Save/delete            | Perform the mutation here; return the actual service result ID          |
| Dirty/pending form     | Handle close requests with discard/pending guards                       |
| API error              | Keep the draft and allow retry; do not finish a recoverable error       |
| Completed/cancelled    | Keep the final rendered content during host exit                        |

## Step 5: Handle the result in the caller

On `completed`, validate `result.data` and update the initiating application's selection/cache. On `cancelled`, preserve its state. On `failed`, show the translated application error. Aborting the caller cancels its request; it cannot undo an API mutation already sent.

The content iframe has a separate cache. Partner Ops refreshes the original list through [useRefreshParties](../../../apps/partner-ops/src/features/parties/hooks/use-refresh-parties.ts). Finish with the [verification checklist](verification.md).
