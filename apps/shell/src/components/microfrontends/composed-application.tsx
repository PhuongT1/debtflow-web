import { notFound } from 'next/navigation';
import type { MicrofrontendApplication } from '@debtflow/mfe-registry';
import { IframeHost, WebComponentHost } from './remote-host';

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
        appName={application.name}
        src={url.pathname + url.search}
        title={application.name}
      />
    );
  }

  notFound();
}
