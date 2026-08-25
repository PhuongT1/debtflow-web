import type { NextConfig } from "next";
import path from "node:path";
import { shellEnv } from "./src/lib/env";

const partnerOpsOrigin = shellEnv.PARTNER_OPS_ORIGIN?.replace(/\/$/, "");
const partnerOpsEnabled = shellEnv.PARTNER_OPS_ENABLED === "true";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../.."),
  transpilePackages: ["@debtflow/react-app-shell", "@debtflow/contracts", "@debtflow/design-tokens", "@debtflow/navigation", "@debtflow/platform-sdk", "@debtflow/react-ui"],
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  async rewrites() {
    if (!partnerOpsEnabled || !partnerOpsOrigin) {
      return { beforeFiles: [], afterFiles: [], fallback: [] };
    }

    return {
      beforeFiles: [
        {
          source: "/parties",
          destination: `${partnerOpsOrigin}/parties`,
        },
        {
          source: "/parties/:path+",
          destination: `${partnerOpsOrigin}/parties/:path+`,
        },
        {
          source: "/partner-ops-static/:path+",
          destination: `${partnerOpsOrigin}/partner-ops-static/:path+`,
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
