import { notFound } from 'next/navigation';

import { microfrontendManifest } from '@packages/platform-registry';

import { ComposedApplication } from '@/components/microfrontends/composed-application';

import type { MinimalLayoutMicrofrontendPageProps } from './page.types';

export default async function MinimalLayoutMicrofrontendPage({
  params,
  searchParams,
}: MinimalLayoutMicrofrontendPageProps) {
  const [{ app, path = [] }, query] = await Promise.all([params, searchParams]);
  const application = microfrontendManifest.applications.find(
    (candidate) => candidate.name === app && candidate.composition.layout === 'minimal',
  );
  if (!application || process.env[application.enabledEnv] !== 'true') {
    notFound();
  }

  const remoteOrigin = process.env[application.originEnv];
  if (!remoteOrigin) notFound();

  const pathname = [application.composition.publicPath, ...path].join('/').replace(/\/+/g, '/');
  return (
    <ComposedApplication
      application={application}
      pathname={pathname}
      query={query}
      remoteOrigin={remoteOrigin}
    />
  );
}
