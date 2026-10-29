import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import path from 'node:path';
import { partnerOpsEnv } from './src/lib/env';

const coreOrigin = partnerOpsEnv.PLATFORM_INTERNAL_ORIGIN;

const nextConfig: NextConfig = {
  output: 'standalone',
  assetPrefix: partnerOpsEnv.PARTNER_OPS_ASSET_PREFIX,
  outputFileTracingRoot: path.join(__dirname, '../..'),
  transpilePackages: [
    '@packages/platform-contracts',
    '@packages/platform-registry',
    '@packages/ui-tokens',
    '@packages/platform-navigation',
    '@packages/platform-sdk',
    '@packages/ui-react',
  ],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${coreOrigin}/api/:path*`,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

export default withNextIntl(nextConfig);
