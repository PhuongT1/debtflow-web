import type { NextConfig } from "next";
import path from "node:path";
import { shellEnv } from "./src/lib/env";
import { loadMfeRewrites } from "./src/lib/mfe-manifest";

const manifestPath = shellEnv.MFE_MANIFEST_PATH
  ? path.resolve(__dirname, shellEnv.MFE_MANIFEST_PATH)
  : path.join(__dirname, "../../packages/mfe-registry/src/manifest.json");

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../.."),
  transpilePackages: [
    "@debtflow/react-app-shell",
    "@debtflow/contracts",
    "@debtflow/design-tokens",
    "@debtflow/navigation",
    "@debtflow/mfe-registry",
    "@debtflow/platform-sdk",
    "@debtflow/react-ui",
  ],
  experimental: { serverActions: { bodySizeLimit: "2mb" } },
  async rewrites() {
    return {
      beforeFiles: loadMfeRewrites(manifestPath),
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
