import type { NextConfig } from "next";
import path from "node:path";
import { partnerOpsEnv } from "./src/lib/env";

const coreOrigin = partnerOpsEnv.PLATFORM_INTERNAL_ORIGIN;

const nextConfig: NextConfig = {
  output: "standalone",
  assetPrefix: partnerOpsEnv.PARTNER_OPS_ASSET_PREFIX,
  outputFileTracingRoot: path.join(__dirname, "../.."),
  transpilePackages: ["@debtflow/contracts", "@debtflow/design-tokens", "@debtflow/navigation", "@debtflow/platform-sdk", "@debtflow/react-ui"],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${coreOrigin}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
