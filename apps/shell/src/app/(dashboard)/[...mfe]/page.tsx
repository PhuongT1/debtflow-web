import { notFound } from 'next/navigation';
import { microfrontendManifest } from '@debtflow/mfe-registry';
import {
  ComposedApplication,
  type SearchValues,
} from '@/components/microfrontends/composed-application';

export default async function MainLayoutMicrofrontendPage({
  params,
  searchParams,
}: {
  params: Promise<{ mfe: string[] }>;
  searchParams: Promise<SearchValues>;
}) {
  const [{ mfe }, query] = await Promise.all([params, searchParams]);
  const pathname = '/' + mfe.join('/');
  const application = microfrontendManifest.applications
    .filter((candidate) => candidate.composition.layout === 'main')
    .sort((left, right) => right.composition.publicPath.length - left.composition.publicPath.length)
    .find(
      (candidate) =>
        pathname === candidate.composition.publicPath ||
        pathname.startsWith(candidate.composition.publicPath + '/'),
    );

  if (!application || process.env[application.enabledEnv] !== 'true') {
    notFound();
  }

  const remoteOrigin = process.env[application.originEnv];
  if (!remoteOrigin) notFound();

  return (
    <ComposedApplication
      application={application}
      pathname={pathname}
      query={query}
      remoteOrigin={remoteOrigin}
    />
  );
}
