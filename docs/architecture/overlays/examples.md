# Examples

Examples use a registered `customer-picker` view. Replace the sample IDs and labels with your domain and translations. Application-specific options/props belong in the owning `.types.ts` file.

## Caller: send input and receive data

Use the application singleton from [Integration](integration.md#step-2-use-one-application-client). This function works in any framework; retain an AbortController in the owning component and abort it on teardown.

```ts
import { appPlatform } from './client';
import type { OpenOverlayOptions } from '@packages/platform-sdk';

export async function chooseCustomer(signal: OpenOverlayOptions['signal']) {
  const result = await appPlatform.openOverlay({
    request: {
      view: 'customer-picker',
      title: 'Choose a customer',
      size: 'md',
      input: { selectedId: 'customer-17' },
    },
    signal,
  });

  if (result.status !== 'completed') return null;
  if (typeof result.data?.selectedId !== 'string') {
    throw new TypeError('Invalid customer picker result');
  }
  return result.data.selectedId;
}
```

The primitive equivalent is `openPlatformOverlay({ request, hostOrigin, signal })`. Prefer the singleton so every feature uses the same configured host. In standalone mode, use your local picker instead of this cross-window operation.

## Content: validate input and return data

Declare props in `picker-route.types.ts`:

```ts
import type { OverlaySurfaceProps } from '@packages/ui-react';

export type PickerRouteProps = Pick<OverlaySurfaceProps, 'hostOrigin'>;
```

React route wrapper:

```tsx
import { OverlaySurface } from '@packages/ui-react';
import type { PickerRouteProps } from './picker-route.types';
import { CustomerPicker } from './customer-picker';

export function PickerRoute({ hostOrigin }: PickerRouteProps) {
  return (
    <OverlaySurface hostOrigin={hostOrigin}>
      <CustomerPicker />
    </OverlaySurface>
  );
}
```

Content component:

```tsx
import { PlatformDialog, useOverlaySurface } from '@packages/ui-react';

export function CustomerPicker() {
  const surface = useOverlaySurface();
  if (!surface) return null;
  const selectedId = surface.request.input?.selectedId;
  const valid = selectedId === undefined || typeof selectedId === 'string';

  return (
    <PlatformDialog surfaceBody open onClose={() => surface.finish({ status: 'cancelled' })}>
      <h2>{surface.request.title}</h2>
      {valid ? (
        <button
          onClick={() =>
            surface.finish({
              status: 'completed',
              data: { selectedId: 'customer-42' },
            })
          }
        >
          Choose customer 42
        </button>
      ) : (
        <button onClick={() => surface.finish({ status: 'failed' })}>Close invalid request</button>
      )}
    </PlatformDialog>
  );
}
```

The static selection illustrates the return contract; a real picker obtains the ID from its selected record. React's adapter binds `finish` to the current request, so a previous request's callback cannot close a later modal.

## Other frameworks

Angular/Vue content uses `connectOverlaySurface(options)` from its mount lifecycle. The `onInit({ id, request, locale })` callback validates input and renders the view. Capture that request's `id` for every async operation:

```ts
surface.present({ id, height });
surface.resize({ id, height });
surface.finish({ id, result: { status: 'completed', data: { selectedId } } });
```

These are separate lifecycle call sites: present after rendering/fonts, resize on later layout changes, finish after selection/save. Capture `id` when an operation starts; do not read a mutable current ID when an old Promise resolves. Register `surface.dispose()` in framework teardown. See the [options and methods](protocol.md#host-and-content-api); the SDK supplies no Angular/Vue modal renderer.

## Result recipes

| Operation   | Input                   | Completed `data`               | Caller action                |
| ----------- | ----------------------- | ------------------------------ | ---------------------------- |
| Create      | Form defaults           | `{ id }` from service response | Refresh list                 |
| Edit/delete | Validated record ID     | `{ id }`                       | Refresh affected list/detail |
| Select      | `{ selectedId }`        | `{ selectedId }`               | Update local selection       |
| Help        | Validated content/topic | Usually omitted                | Close only                   |
| Cancel      | Any valid input         | No successful result           | Preserve previous state      |
