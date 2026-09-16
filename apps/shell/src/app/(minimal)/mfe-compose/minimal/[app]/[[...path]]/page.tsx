import { notFound } from 'next/navigation';
import { microfrontendManifest } from '@debtflow/mfe-registry';
import {
  ComposedApplication,
  type SearchValues,
} from '@/components/microfrontends/composed-application';

export default async function MinimalLayoutMicrofrontendPage({
  params,
  searchParams,
}: {
  params: Promise<{ app: string; path?: string[] }>;
  searchParams: Promise<SearchValues>;
}) {
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
