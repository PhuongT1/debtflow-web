import type { ReactNode } from 'react';

import type { MicrofrontendApplication } from '@packages/platform-registry';
import type { OverlayHostProps } from '@packages/ui-react';

export type SearchValues = Record<string, string | string[] | undefined>;
export interface ComposedApplicationProps {
  application: MicrofrontendApplication;
  pathname: string;
  query: SearchValues;
  remoteOrigin: string;
}
export type RemoteHostState =
  { status: 'loading' } | { status: 'ready' } | { status: 'error'; message: string };
export interface RemoteLoadingStateProps {
  kind?: 'table' | 'form';
  children?: ReactNode;
}
export interface RemoteErrorStateProps {
  message: string;
  retry: () => void;
}
export interface IframeHostProps {
  appName: string;
  src: string;
  title: string;
  publicPath: string;
  entryPath: string;
  loadingFallback?: ReactNode;
  overlayViews: Record<string, string>;
}
export type EmbeddedOverlayHostProps = Pick<
  Extract<OverlayHostProps, { owner: unknown }>,
  'owner' | 'views'
>;
export interface RemoteRuntimeManifest {
  schemaVersion: 1;
  name: string;
  version: string;
  element: string;
  scripts: string[];
  styles: string[];
}
export interface WebComponentHostProps {
  loadingFallback?: ReactNode;
  appName: string;
  expectedElement: string;
  expectedVersion: string;
  manifestPath: string;
  remoteOrigin: string;
}
