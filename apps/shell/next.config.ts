import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import path from 'node:path';
import { shellEnv } from './src/lib/config/environment';
import { loadMfeRewrites } from './src/lib/config/mfe-manifest';

const manifestPath = shellEnv.MFE_MANIFEST_PATH
  ? path.resolve(__dirname, shellEnv.MFE_MANIFEST_PATH)
  : path.join(__dirname, '../../packages/mfe-registry/src/manifest.json');

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '../..'),
  transpilePackages: [
    '@debtflow/contracts',
    '@debtflow/design-tokens',
    '@debtflow/navigation',
    '@debtflow/mfe-registry',
    '@debtflow/platform-sdk',
    '@debtflow/react-ui',
  ],
  experimental: { serverActions: { bodySizeLimit: '2mb' } },
  async rewrites() {
    return {
      beforeFiles: loadMfeRewrites(manifestPath),
      afterFiles: [],
      fallback: [],
    };
  },
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

export default withNextIntl(nextConfig);
