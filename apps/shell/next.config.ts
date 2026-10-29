import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import path from 'node:path';
import { shellEnv } from './src/lib/config/environment';
import { loadMfeRewrites } from './src/lib/config/mfe-manifest';

const manifestPath = shellEnv.MFE_MANIFEST_PATH
  ? path.resolve(__dirname, shellEnv.MFE_MANIFEST_PATH)
  : path.join(__dirname, '../../packages/platform/registry/src/manifest.json');

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '../..'),
  transpilePackages: [
    '@packages/platform-contracts',
    '@packages/ui-tokens',
    '@packages/platform-navigation',
    '@packages/platform-registry',
    '@packages/platform-sdk',
    '@packages/ui-react',
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
