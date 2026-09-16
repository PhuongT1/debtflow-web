import manifest from './manifest.json';

export type PlatformLayout = 'main' | 'minimal' | 'none';
export type IntegrationType = 'web-component' | 'iframe' | 'route';

export type MicrofrontendApplication = {
  name: string;
  package: string;
  version: string;
  framework: string;
  enabledEnv: string;
  originEnv: string;
  healthPath: string;
  contracts: { api: number; events: number };
  composition: {
    integration: IntegrationType;
    layout: PlatformLayout;
    publicPath: string;
    proxyPath: string;
    remoteBasePath: string;
    entryPath: string;
    elementName?: string;
  };
  assetRoutes: Array<{ source: string; destination: string }>;
};

export const microfrontendManifest = manifest as {
  schemaVersion: 2;
  applications: MicrofrontendApplication[];
};
