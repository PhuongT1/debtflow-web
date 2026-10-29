import { notFound } from 'next/navigation';
import {
  getApplicationLoadingLayout,
  getApplicationOverlayViews,
} from '@packages/platform-registry';
import { ListPageSkeleton } from '@packages/ui-react';
import type { ComposedApplicationProps } from './microfrontends.types';
export type { SearchValues } from './microfrontends.types';
import { IframeHost } from './iframe-host';
import { TablePageSkeleton } from '@/components/skeletons/page-skeleton';
import { WebComponentHost } from './web-component-host';

export function ComposedApplication({
  application,
  pathname,
  query,
  remoteOrigin,
}: ComposedApplicationProps) {
  const { composition } = application;
  const loadingLayout = getApplicationLoadingLayout(application.name);

  if (composition.integration === 'web-component' && composition.elementName) {
    return (
      <WebComponentHost
        appName={application.name}
        expectedElement={composition.elementName}
        expectedVersion={application.version}
        loadingFallback={<TablePageSkeleton kind="payments" />}
        manifestPath={composition.entryPath}
        remoteOrigin={remoteOrigin}
      />
    );
  }

  // Mount the registered runtime with shared host integration and remote-owned domain forms.
  if (composition.integration === 'iframe') {
    const suffix = pathname.slice(composition.publicPath.length);
    const remotePath = (composition.entryPath + suffix).replace(/\/+/g, '/');
    const url = new URL(composition.proxyPath + remotePath, 'http://debtflow.local');
    for (const [key, value] of Object.entries(query)) {
      if (Array.isArray(value)) {
        value.forEach((item) => url.searchParams.append(key, item));
      } else if (value !== undefined) {
        url.searchParams.set(key, value);
      }
    }

    return (
      <IframeHost
        key={application.name}
        appName={application.name}
        publicPath={composition.publicPath}
        entryPath={composition.proxyPath + composition.entryPath}
        src={url.pathname + url.search}
        title={application.name}
        overlayViews={getApplicationOverlayViews(application.name, composition.proxyPath)}
        loadingFallback={
          loadingLayout ? <ListPageSkeleton layout={loadingLayout} label="" frame /> : undefined
        }
      />
    );
  }

  notFound();
}
