import { notFound } from 'next/navigation';
import type { MicrofrontendApplication } from '@packages/platform-registry';
import { IframeHost } from './iframe-host';
import { WebComponentHost } from './web-component-host';

export type SearchValues = Record<string, string | string[] | undefined>;

export function ComposedApplication({
  application,
  pathname,
  query,
  remoteOrigin,
}: {
  application: MicrofrontendApplication;
  pathname: string;
  query: SearchValues;
  remoteOrigin: string;
}) {
  const { composition } = application;

  if (composition.integration === 'web-component' && composition.elementName) {
    return (
      <WebComponentHost
        appName={application.name}
        expectedElement={composition.elementName}
        expectedVersion={application.version}
        manifestPath={composition.entryPath}
        remoteOrigin={remoteOrigin}
      />
    );
  }

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
      />
    );
  }

  notFound();
}
